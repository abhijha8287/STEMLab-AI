from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.experiment import Experiment
from app.models.report import Report
from app.models.quiz import QuizAttempt
from app.models.analytics import AnalyticsEvent
from app.models.concept import KnowledgeGap


PHYSICS_TYPES = {"projectile_motion", "newtons_laws", "pendulum"}


class AnalyticsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_stats(self, session_id: str) -> dict:
        # --- experiments by type ---
        exp_rows = (
            await self.db.execute(
                select(Experiment.type, func.count(Experiment.id).label("cnt"))
                .where(Experiment.session_id == session_id, Experiment.status == "completed")
                .group_by(Experiment.type)
            )
        ).all()
        by_type: dict[str, int] = {r.type: r.cnt for r in exp_rows}
        total_exp = sum(by_type.values())
        physics_exp = sum(by_type.get(t, 0) for t in PHYSICS_TYPES)
        circuit_exp = by_type.get("circuit", 0)

        # --- reports ---
        report_count = (
            await self.db.scalar(
                select(func.count(Report.id)).where(Report.session_id == session_id)
            )
        ) or 0

        # --- quiz performance ---
        quiz_row = (
            await self.db.execute(
                select(
                    func.count(QuizAttempt.id).label("cnt"),
                    func.coalesce(func.avg(QuizAttempt.score), 0).label("avg_score"),
                    func.coalesce(func.max(QuizAttempt.score), 0).label("max_score"),
                    func.coalesce(func.min(QuizAttempt.score), 100).label("min_score"),
                ).where(
                    QuizAttempt.session_id == session_id,
                    QuizAttempt.completed.is_(True),
                )
            )
        ).one()

        # --- knowledge gaps ---
        gap_rows = (
            await self.db.execute(
                select(
                    func.count(KnowledgeGap.id).label("total"),
                    func.sum(
                        func.cast(KnowledgeGap.resolved.is_(True), type_=func.count(KnowledgeGap.id).type)
                    ).label("resolved"),
                ).where(KnowledgeGap.session_id == session_id)
            )
        ).one()

        # --- concepts explored (unique concept slugs from knowledge gaps + quiz topic tags) ---
        concepts_explored = (
            await self.db.scalar(
                select(func.count(func.distinct(KnowledgeGap.concept_slug))).where(
                    KnowledgeGap.session_id == session_id
                )
            )
        ) or 0

        return {
            "totals": {
                "experiments_run": total_exp,
                "physics_experiments": physics_exp,
                "circuit_experiments": circuit_exp,
                "reports_generated": report_count,
                "quizzes_taken": quiz_row.cnt or 0,
            },
            "quiz_performance": {
                "average_score": round(float(quiz_row.avg_score or 0), 1),
                "best_score": round(float(quiz_row.max_score or 0), 1),
                "worst_score": round(float(quiz_row.min_score or 0) if quiz_row.cnt else 0, 1),
                "total_attempts": quiz_row.cnt or 0,
            },
            "learning_progress": {
                "concepts_explored": concepts_explored,
                "knowledge_gaps_detected": gap_rows.total or 0,
                "knowledge_gaps_resolved": gap_rows.resolved or 0,
            },
        }

    async def get_recent_activity(self, session_id: str, limit: int = 10) -> list[dict]:
        rows = (
            await self.db.execute(
                select(AnalyticsEvent)
                .where(AnalyticsEvent.session_id == session_id)
                .order_by(AnalyticsEvent.created_at.desc())
                .limit(limit)
            )
        ).scalars().all()

        return [
            {
                "type": row.event_type,
                "description": self._describe(row),
                "entity_id": str(row.entity_id) if row.entity_id else None,
                "entity_type": row.entity_type,
                "timestamp": row.created_at.isoformat(),
            }
            for row in rows
        ]

    async def get_experiment_usage(self, session_id: str, days: int = 30) -> dict:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)

        type_rows = (
            await self.db.execute(
                select(Experiment.type, func.count(Experiment.id).label("cnt"))
                .where(Experiment.session_id == session_id, Experiment.created_at >= cutoff)
                .group_by(Experiment.type)
            )
        ).all()

        day_rows = (
            await self.db.execute(
                text(
                    """
                    SELECT DATE(created_at AT TIME ZONE 'UTC') AS day, COUNT(*) AS cnt
                    FROM experiments
                    WHERE session_id = :sid AND created_at >= :cutoff
                    GROUP BY day ORDER BY day
                    """
                ),
                {"sid": session_id, "cutoff": cutoff},
            )
        ).all()

        return {
            "period": f"{days}d",
            "by_type": {r.type: r.cnt for r in type_rows},
            "by_day": [{"date": str(r.day), "count": r.cnt} for r in day_rows],
        }

    async def get_quiz_performance(self, session_id: str, days: int = 30) -> dict:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        from app.models.quiz import Quiz

        rows = (
            await self.db.execute(
                select(
                    func.date(QuizAttempt.completed_at).label("day"),
                    QuizAttempt.score,
                    Quiz.topic,
                )
                .join(Quiz, Quiz.id == QuizAttempt.quiz_id)
                .where(
                    QuizAttempt.session_id == session_id,
                    QuizAttempt.completed.is_(True),
                    QuizAttempt.completed_at >= cutoff,
                )
                .order_by(QuizAttempt.completed_at)
            )
        ).all()

        topic_agg: dict[str, dict] = {}
        for r in rows:
            if r.topic not in topic_agg:
                topic_agg[r.topic] = {"scores": [], "attempts": 0}
            topic_agg[r.topic]["scores"].append(float(r.score))
            topic_agg[r.topic]["attempts"] += 1

        return {
            "score_trend": [
                {"date": str(r.day), "score": float(r.score), "topic": r.topic} for r in rows
            ],
            "by_topic": {
                topic: {
                    "average": round(sum(d["scores"]) / len(d["scores"]), 1),
                    "attempts": d["attempts"],
                }
                for topic, d in topic_agg.items()
            },
        }

    def _describe(self, event: AnalyticsEvent) -> str:
        props = event.properties or {}
        templates = {
            "experiment_started": "Started a new {experiment_type} experiment",
            "experiment_completed": "Completed {experiment_type} experiment",
            "experiment_run": "Ran {experiment_type} simulation",
            "quiz_started": "Started a quiz on {topic}",
            "quiz_completed": "Completed quiz — score {score:.0f}%",
            "report_generated": "Generated a lab report",
            "pdf_exported": "Exported PDF report",
            "ai_query": "Asked AI Instructor a question",
            "concept_viewed": "Explored {concept} concept",
        }
        tmpl = templates.get(event.event_type, event.event_type.replace("_", " ").title())
        try:
            return tmpl.format(**props)
        except (KeyError, ValueError):
            return tmpl
