"""
AI Instructor endpoints.

POST /ai/chat/stream  — SSE: streams Gemini response, saves messages to DB
GET  /ai/conversations — list this session's conversations
GET  /ai/conversations/{id} — get full conversation with messages
DELETE /ai/conversations/{id} — delete conversation
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select, desc, update

from app.core.dependencies import DBSession
from app.core.database import get_session_factory
from app.engines.ai.gemini_client import stream_response
from app.models.ai_conversation import AIConversation, AIMessage
from app.models.experiment import Experiment
from app.schemas.ai import ChatRequest, ConversationResponse, ConversationDetailResponse, MessageResponse

router = APIRouter(prefix="/ai", tags=["ai-instructor"])


# ── helpers ───────────────────────────────────────────────────────────────────

def _session_id(request: Request) -> str:
    return getattr(request.state, "session_id", "anonymous")


async def _get_or_create_conversation(
    db: DBSession,
    session_id: str,
    conversation_id: str | None,
    first_message: str,
) -> AIConversation:
    if conversation_id:
        conv = (
            await db.execute(
                select(AIConversation).where(
                    AIConversation.id == uuid.UUID(conversation_id),
                    AIConversation.session_id == session_id,
                )
            )
        ).scalar_one_or_none()
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found.")
        return conv

    # Auto-title from first 60 chars of first message
    title = first_message[:60].strip() + ("…" if len(first_message) > 60 else "")
    conv = AIConversation(session_id=session_id, title=title, message_count=0)
    db.add(conv)
    await db.flush()
    return conv


async def _build_experiment_context(db: DBSession, session_id: str) -> str:
    """Fetch the 3 most recent experiments for this session to give Gemini context."""
    rows = (
        await db.execute(
            select(Experiment)
            .where(Experiment.session_id == session_id)
            .order_by(desc(Experiment.created_at))
            .limit(3)
        )
    ).scalars().all()

    if not rows:
        return ""

    lines = ["Recent experiments run by this student:"]
    for exp in rows:
        lines.append(f"- {exp.title} (type: {exp.type}, status: {exp.status})")
    return "\n".join(lines)


# ── streaming endpoint ────────────────────────────────────────────────────────

@router.post("/chat/stream")
async def chat_stream(
    body: ChatRequest,
    request: Request,
    db: DBSession,
) -> StreamingResponse:
    session_id = _session_id(request)

    conv = await _get_or_create_conversation(db, session_id, body.conversation_id, body.message)

    # Load existing messages for context window (last 20)
    existing = (
        await db.execute(
            select(AIMessage)
            .where(AIMessage.conversation_id == conv.id)
            .order_by(AIMessage.created_at)
            .limit(20)
        )
    ).scalars().all()

    history = [{"role": m.role if m.role == "user" else "model", "content": m.content} for m in existing]
    history.append({"role": "user", "content": body.message})

    # Persist user message immediately
    user_msg = AIMessage(
        conversation_id=conv.id,
        role="user",
        content=body.message,
    )
    db.add(user_msg)

    # Experiment context (from DB or passed explicitly)
    exp_context = body.experiment_context or await _build_experiment_context(db, session_id)

    await db.commit()

    conv_id_str = str(conv.id)

    async def event_generator():
        full_response: list[str] = []

        # Send conversation_id first so the frontend can track it
        yield f"data: {json.dumps({'type': 'meta', 'conversation_id': conv_id_str})}\n\n"

        try:
            async for chunk in stream_response(history, exp_context):
                full_response.append(chunk)
                yield f"data: {json.dumps({'type': 'chunk', 'text': chunk})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
            return

        # Save assistant message after stream completes
        assistant_text = "".join(full_response)
        async with get_session_factory()() as save_db:
            asst_msg = AIMessage(
                conversation_id=uuid.UUID(conv_id_str),
                role="assistant",
                content=assistant_text,
            )
            save_db.add(asst_msg)
            await save_db.execute(
                update(AIConversation)
                .where(AIConversation.id == uuid.UUID(conv_id_str))
                .values(message_count=AIConversation.message_count + 2)
            )
            await save_db.commit()

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ── conversation management ───────────────────────────────────────────────────

@router.get("/conversations", response_model=list[ConversationResponse])
async def list_conversations(request: Request, db: DBSession) -> list[ConversationResponse]:
    session_id = _session_id(request)
    rows = (
        await db.execute(
            select(AIConversation)
            .where(AIConversation.session_id == session_id)
            .order_by(desc(AIConversation.updated_at))
            .limit(30)
        )
    ).scalars().all()

    return [
        ConversationResponse(
            id=str(r.id),
            title=r.title,
            message_count=r.message_count,
            created_at=r.created_at.isoformat(),
            updated_at=r.updated_at.isoformat(),
        )
        for r in rows
    ]


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(conversation_id: str, request: Request, db: DBSession) -> ConversationDetailResponse:
    session_id = _session_id(request)
    conv = (
        await db.execute(
            select(AIConversation).where(
                AIConversation.id == uuid.UUID(conversation_id),
                AIConversation.session_id == session_id,
            )
        )
    ).scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    messages = (
        await db.execute(
            select(AIMessage)
            .where(AIMessage.conversation_id == conv.id)
            .order_by(AIMessage.created_at)
        )
    ).scalars().all()

    return ConversationDetailResponse(
        id=str(conv.id),
        title=conv.title,
        messages=[
            MessageResponse(id=str(m.id), role=m.role, content=m.content, created_at=m.created_at.isoformat())
            for m in messages
        ],
    )


@router.delete("/conversations/{conversation_id}", status_code=204)
async def delete_conversation(conversation_id: str, request: Request, db: DBSession) -> None:
    session_id = _session_id(request)
    conv = (
        await db.execute(
            select(AIConversation).where(
                AIConversation.id == uuid.UUID(conversation_id),
                AIConversation.session_id == session_id,
            )
        )
    ).scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    await db.delete(conv)
    await db.commit()
