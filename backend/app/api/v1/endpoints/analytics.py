from fastapi import APIRouter, Request, Query
from app.core.dependencies import DBSession
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import (
    DashboardResponse, ExperimentUsageResponse,
    QuizPerformanceResponse, ProgressResponse,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _session(request: Request) -> str:
    return getattr(request.state, "session_id", "anonymous")


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(request: Request, db: DBSession) -> DashboardResponse:
    svc = AnalyticsService(db)
    return await svc.get_dashboard(_session(request))


@router.get("/experiments", response_model=ExperimentUsageResponse)
async def get_experiment_usage(
    request: Request,
    db: DBSession,
    period: str = Query("30d", pattern=r"^\d+d$"),
) -> ExperimentUsageResponse:
    days = int(period.rstrip("d"))
    svc = AnalyticsService(db)
    return await svc.get_experiment_usage(_session(request), days)


@router.get("/quiz-performance", response_model=QuizPerformanceResponse)
async def get_quiz_performance(
    request: Request,
    db: DBSession,
    period: str = Query("30d", pattern=r"^\d+d$"),
) -> QuizPerformanceResponse:
    days = int(period.rstrip("d"))
    svc = AnalyticsService(db)
    return await svc.get_quiz_performance(_session(request), days)


@router.get("/progress", response_model=ProgressResponse)
async def get_progress(request: Request, db: DBSession) -> ProgressResponse:
    svc = AnalyticsService(db)
    return await svc.get_progress(_session(request))
