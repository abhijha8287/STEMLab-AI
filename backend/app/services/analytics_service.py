from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.analytics_repository import AnalyticsRepository
from app.schemas.analytics import (
    DashboardResponse, TotalsData, QuizPerformanceData, LearningProgressData,
    ActivityItem, ExperimentUsageResponse, QuizPerformanceResponse, ProgressResponse,
    SubjectMastery,
)


class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.repo = AnalyticsRepository(db)

    async def get_dashboard(self, session_id: str) -> DashboardResponse:
        stats = await self.repo.get_dashboard_stats(session_id)
        activity_raw = await self.repo.get_recent_activity(session_id)

        return DashboardResponse(
            totals=TotalsData(**stats["totals"]),
            quiz_performance=QuizPerformanceData(**stats["quiz_performance"]),
            learning_progress=LearningProgressData(**stats["learning_progress"]),
            recent_activity=[ActivityItem(**a) for a in activity_raw],
        )

    async def get_experiment_usage(self, session_id: str, days: int = 30) -> ExperimentUsageResponse:
        data = await self.repo.get_experiment_usage(session_id, days)
        from app.schemas.analytics import DailyCount
        return ExperimentUsageResponse(
            period=data["period"],
            by_type=data["by_type"],
            by_day=[DailyCount(**d) for d in data["by_day"]],
        )

    async def get_quiz_performance(self, session_id: str, days: int = 30) -> QuizPerformanceResponse:
        data = await self.repo.get_quiz_performance(session_id, days)
        from app.schemas.analytics import ScoreTrendItem, TopicPerformance
        return QuizPerformanceResponse(
            score_trend=[ScoreTrendItem(**s) for s in data["score_trend"]],
            by_topic={k: TopicPerformance(**v) for k, v in data["by_topic"].items()},
        )

    async def get_progress(self, session_id: str) -> ProgressResponse:
        return ProgressResponse(
            concepts_mastered=[],
            concepts_in_progress=[],
            concepts_not_started=[],
            mastery_by_subject=SubjectMastery(physics=0.0, chemistry=0.0, mathematics=0.0),
            progress_over_time=[],
        )
