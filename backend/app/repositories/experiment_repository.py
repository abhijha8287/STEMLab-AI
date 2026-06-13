from uuid import UUID
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.experiment import Experiment, ExperimentResult
from app.repositories.base import BaseRepository


class ExperimentRepository(BaseRepository[Experiment]):
    def __init__(self, db: AsyncSession):
        super().__init__(Experiment, db)

    async def get_by_session(
        self, session_id: str, page: int = 1, page_size: int = 20,
        type_filter: str | None = None, status_filter: str | None = None,
    ) -> tuple[list[Experiment], int]:
        q = select(Experiment).where(Experiment.session_id == session_id)
        if type_filter:
            q = q.where(Experiment.type == type_filter)
        if status_filter:
            q = q.where(Experiment.status == status_filter)

        total = await self.db.scalar(
            select(func.count()).select_from(q.subquery())
        ) or 0

        rows = (
            await self.db.execute(
                q.order_by(desc(Experiment.created_at))
                .offset((page - 1) * page_size)
                .limit(page_size)
            )
        ).scalars().all()

        return list(rows), total

    async def get_with_results(self, experiment_id: UUID) -> Experiment | None:
        result = await self.db.execute(
            select(Experiment)
            .where(Experiment.id == experiment_id)
            .options(selectinload(Experiment.results))
        )
        return result.scalar_one_or_none()

    async def get_result(self, result_id: UUID) -> ExperimentResult | None:
        return await self.db.get(ExperimentResult, result_id)

    async def create_experiment(self, type: str, title: str, session_id: str) -> Experiment:
        exp = Experiment(type=type, title=title, session_id=session_id, status="in_progress")
        return await self.create(exp)

    async def update_status(self, experiment: Experiment, status: str) -> Experiment:
        from datetime import datetime, timezone
        experiment.status = status
        if status == "completed":
            experiment.completed_at = datetime.now(timezone.utc)
        await self.db.flush()
        await self.db.refresh(experiment)
        return experiment

    async def get_result_count_by_session(self, session_id: str) -> dict[str, int]:
        rows = (
            await self.db.execute(
                select(Experiment.type, func.count(ExperimentResult.id).label("cnt"))
                .join(ExperimentResult, ExperimentResult.experiment_id == Experiment.id)
                .where(Experiment.session_id == session_id)
                .group_by(Experiment.type)
            )
        ).all()
        return {r.type: r.cnt for r in rows}
