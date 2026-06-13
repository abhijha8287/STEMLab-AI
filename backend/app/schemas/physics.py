from pydantic import BaseModel, Field


# ── Projectile Motion ──────────────────────────────────────────────────────────

class ProjectileRequest(BaseModel):
    initial_velocity: float = Field(..., ge=1, le=200, description="Launch speed (m/s)")
    launch_angle: float = Field(..., ge=1, le=89, description="Launch angle (degrees)")
    gravity: float = Field(9.81, ge=1.0, le=25.0, description="Gravitational acceleration (m/s²)")
    air_resistance: float = Field(0.0, ge=0.0, le=1.0, description="Air resistance coefficient (0–1)")


class ProjectileResultResponse(BaseModel):
    flight_time: float
    max_height: float
    range: float
    time_to_peak: float
    impact_velocity: float
    trajectory: list[dict]
    velocity_x_series: list[list[float]]
    velocity_y_series: list[list[float]]


class ProjectileResponse(BaseModel):
    experiment_id: str
    parameters: ProjectileRequest
    results: ProjectileResultResponse


# ── Newton's Laws ──────────────────────────────────────────────────────────────

class NewtonRequest(BaseModel):
    force: float = Field(..., ge=0.1, le=1000, description="Applied force (N)")
    mass: float = Field(..., ge=0.1, le=500, description="Object mass (kg)")
    friction_coefficient: float = Field(..., ge=0.0, le=1.0, description="Kinetic friction coefficient")
    duration: float = Field(5.0, ge=1.0, le=30.0, description="Simulation duration (s)")


class NewtonResultResponse(BaseModel):
    net_force: float
    acceleration: float
    final_velocity: float
    displacement: float
    velocity_series: list[list[float]]
    acceleration_series: list[list[float]]
    position_series: list[list[float]]


class NewtonResponse(BaseModel):
    experiment_id: str
    parameters: NewtonRequest
    results: NewtonResultResponse


# ── Pendulum ───────────────────────────────────────────────────────────────────

class PendulumRequest(BaseModel):
    length: float = Field(..., ge=0.1, le=10.0, description="Pendulum string length (m)")
    mass: float = Field(..., ge=0.01, le=10.0, description="Bob mass (kg)")
    initial_angle: float = Field(..., ge=1.0, le=89.0, description="Initial angle from vertical (degrees)")
    gravity: float = Field(9.81, ge=1.0, le=25.0, description="Gravitational acceleration (m/s²)")


class PendulumResultResponse(BaseModel):
    period: float
    frequency: float
    angular_frequency: float
    max_velocity: float
    max_kinetic_energy: float
    angle_series: list[list[float]]
    angular_velocity_series: list[list[float]]
    energy_series: list[list[float]]


class PendulumResponse(BaseModel):
    experiment_id: str
    parameters: PendulumRequest
    results: PendulumResultResponse
