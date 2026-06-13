import math
from fastapi import APIRouter, Request, Query
from sqlalchemy import select, func, desc, union_all, literal, cast
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy import String

from app.core.dependencies import DBSession
from app.models.experiment import Experiment
from app.models.quiz import QuizAttempt, Quiz
from app.schemas.experiment import HistoryResponse, HistoryItem

router = APIRouter(prefix="/history", tags=["history"])


def _session(request: Request) -> str:
    return getattr(request.state, "session_id", "anonymous")


@router.get("", response_model=HistoryResponse)
async def get_history(
    request: Request,
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    item_type: str | None = Query(None, pattern="^(experiment|quiz)$"),
) -> HistoryResponse:
    session_id = _session(request)
    items: list[HistoryItem] = []

    # Fetch experiments
    if item_type in (None, "experiment"):
        exp_rows = (
            await db.execute(
                select(Experiment)
                .where(Experiment.session_id == session_id)
                .order_by(desc(Experiment.created_at))
            )
        ).scalars().all()

        for exp in exp_rows:
            items.append(
                HistoryItem(
                    id=str(exp.id),
                    item_type="experiment",
                    title=exp.title,
                    experiment_type=exp.type,
                    status=exp.status,
                    result_count=0,
                    created_at=exp.created_at.isoformat(),
                    summary=None,
                )
            )

    # Fetch quiz attempts
    if item_type in (None, "quiz"):
        quiz_rows = (
            await db.execute(
                select(QuizAttempt, Quiz.title, Quiz.topic)
                .join(Quiz, Quiz.id == QuizAttempt.quiz_id)
                .where(QuizAttempt.session_id == session_id, QuizAttempt.completed.is_(True))
                .order_by(desc(QuizAttempt.completed_at))
            )
        ).all()

        for attempt, quiz_title, quiz_topic in quiz_rows:
            items.append(
                HistoryItem(
                    id=str(attempt.id),
                    item_type="quiz",
                    title=quiz_title,
                    topic=quiz_topic,
                    score=float(attempt.score),
                    created_at=(attempt.completed_at or attempt.created_at).isoformat(),
                    summary={"correct": attempt.correct_count, "total": attempt.total_questions},
                )
            )

    # Sort combined list by created_at descending
    items.sort(key=lambda x: x.created_at, reverse=True)

    total = len(items)
    start = (page - 1) * page_size
    page_items = items[start : start + page_size]

    return HistoryResponse(
        items=page_items,
        page=page,
        page_size=page_size,
        total=total,
        pages=math.ceil(total / page_size) if page_size else 0,
    )
