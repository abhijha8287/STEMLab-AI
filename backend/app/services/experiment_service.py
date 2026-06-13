"""
Experiment service — creates Experiment + ExperimentResult rows,
logs an analytics event, returns the stored IDs.
"""
from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.experiment import Experiment, ExperimentResult
from app.models.analytics import AnalyticsEvent


class ExperimentService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create_physics_result(
        self,
        session_id: str,
        experiment_type: str,
        title: str,
        parameters: dict[str, Any],
        results: dict[str, Any],
        time_series: dict[str, Any] | None = None,
    ) -> str:
        """
        Persist experiment + result, fire analytics event.
        Returns the experiment UUID as a string.
        """
        exp = Experiment(
            session_id=session_id,
            type=experiment_type,
            title=title,
            status="completed",
        )
        self._db.add(exp)
        await self._db.flush()  # populate exp.id

        result = ExperimentResult(
            experiment_id=exp.id,
            parameters=parameters,
            results=results,
            time_series=time_series or {},
        )
        self._db.add(result)

        event = AnalyticsEvent(
            session_id=session_id,
            event_type="experiment_run",
            entity_type="experiment",
            entity_id=exp.id,
            properties={"type": experiment_type, "title": title},
        )
        self._db.add(event)

        await self._db.commit()
        return str(exp.id)
