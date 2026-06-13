from __future__ import annotations
from pydantic import BaseModel, Field


# ── Ohm's Law ──────────────────────────────────────────────────────────────────

class OhmsRequest(BaseModel):
    voltage: float | None = Field(None, ge=0.001, le=10000)
    current: float | None = Field(None, ge=0.000001, le=1000)
    resistance: float | None = Field(None, ge=0.001, le=10_000_000)
    time: float = Field(1.0, ge=0.001, le=3600, description="Duration for energy calc (s)")

    model_config = {"json_schema_extra": {"example": {"voltage": 12.0, "resistance": 100.0}}}


class OhmsResultResponse(BaseModel):
    voltage: float
    current: float
    resistance: float
    power: float
    energy: float
    v_drop: float
    iv_curve: list[list[float]]


class OhmsResponse(BaseModel):
    experiment_id: str
    parameters: dict
    results: OhmsResultResponse


# ── Series / Parallel ─────────────────────────────────────────────────────────

class SeriesParallelRequest(BaseModel):
    resistances: list[float] = Field(..., min_length=1, max_length=6)
    supply_voltage: float = Field(..., ge=0.001, le=10000)
    topology: str = Field("series", pattern="^(series|parallel|series_parallel)$")


class ResistorInfoResponse(BaseModel):
    id: int
    resistance: float
    voltage_drop: float
    current: float
    power: float


class SeriesParallelResultResponse(BaseModel):
    topology: str
    supply_voltage: float
    equivalent_resistance: float
    total_current: float
    total_power: float
    resistors: list[ResistorInfoResponse]
    voltage_drops: list[dict]
    power_dist: list[dict]


class SeriesParallelResponse(BaseModel):
    experiment_id: str
    parameters: dict
    results: SeriesParallelResultResponse


# ── RC Circuit ────────────────────────────────────────────────────────────────

class RCRequest(BaseModel):
    resistance: float = Field(..., ge=1, le=10_000_000, description="Resistance (Ω)")
    capacitance: float = Field(..., ge=1e-9, le=1.0, description="Capacitance (F)")
    supply_voltage: float = Field(..., ge=0.001, le=10000, description="Supply voltage (V)")
    initial_voltage: float = Field(0.0, ge=0.0, le=10000, description="Initial cap voltage (V)")
    mode: str = Field("charging", pattern="^(charging|discharging)$")


class RCResultResponse(BaseModel):
    resistance: float
    capacitance: float
    supply_voltage: float
    time_constant: float
    mode: str
    voltage_at_tau: list[float]
    time_series: list[list[float]]
    charge_at_5tau: float
    energy_stored: float


class RCResponse(BaseModel):
    experiment_id: str
    parameters: dict
    results: RCResultResponse
