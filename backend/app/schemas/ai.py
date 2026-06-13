from __future__ import annotations
import uuid
from pydantic import BaseModel, Field


class MessageIn(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str | None = None
    experiment_context: str | None = None  # optional summary passed from frontend


class ConversationResponse(BaseModel):
    id: str
    title: str | None
    message_count: int
    created_at: str
    updated_at: str


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str


class ConversationDetailResponse(BaseModel):
    id: str
    title: str | None
    messages: list[MessageResponse]
