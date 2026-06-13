from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class ExperimentBase(BaseModel):
    type: str
    title: str
    description: str | None = None


class ExperimentCreate(ExperimentBase):
    pass


class ExperimentResponse(ExperimentBase):
    model_config = {"from_attributes": True}

    id: UUID
    status: str
    session_id: str | None = None
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None = None
    result_count: int = 0


class ExperimentResultResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    experiment_id: UUID
    parameters: dict
    results: dict
    time_series: dict | None = None
    ai_analysis: str | None = None
    run_duration_ms: int | None = None
    created_at: datetime


class ExperimentDetailResponse(ExperimentResponse):
    results: list[ExperimentResultResponse] = []


class HistoryItem(BaseModel):
    id: str
    item_type: str
    title: str
    experiment_type: str | None = None
    status: str | None = None
    result_count: int = 0
    score: float | None = None
    topic: str | None = None
    created_at: str
    summary: dict | None = None


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
    page: int
    page_size: int
    total: int
    pages: int
