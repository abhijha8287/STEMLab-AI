from fastapi import APIRouter, Request
from dataclasses import asdict

from app.core.dependencies import DBSession
from app.engines.physics import projectile_motion, newtons_laws, pendulum
from app.schemas.physics import (
    ProjectileRequest, ProjectileResponse, ProjectileResultResponse,
    NewtonRequest, NewtonResponse, NewtonResultResponse,
    PendulumRequest, PendulumResponse, PendulumResultResponse,
)
from app.services.experiment_service import ExperimentService

router = APIRouter(prefix="/physics", tags=["physics"])


@router.post("/projectile-motion", response_model=ProjectileResponse)
async def run_projectile_motion(
    body: ProjectileRequest,
    request: Request,
    db: DBSession,
) -> ProjectileResponse:
    session_id: str = request.state.session_id

    sim = projectile_motion.simulate(
        initial_velocity=body.initial_velocity,
        launch_angle=body.launch_angle,
        gravity=body.gravity,
        air_resistance=body.air_resistance,
    )

    result_dict = asdict(sim)
    time_series = {
        "trajectory": result_dict.pop("trajectory"),
        "velocity_x": result_dict.pop("velocity_x_series"),
        "velocity_y": result_dict.pop("velocity_y_series"),
    }

    svc = ExperimentService(db)
    exp_id = await svc.create_physics_result(
        session_id=session_id,
        experiment_type="projectile_motion",
        title=f"Projectile v₀={body.initial_velocity} m/s, θ={body.launch_angle}°",
        parameters=body.model_dump(),
        results=result_dict,
        time_series=time_series,
    )

    return ProjectileResponse(
        experiment_id=exp_id,
        parameters=body,
        results=ProjectileResultResponse(
            **result_dict,
            trajectory=time_series["trajectory"],
            velocity_x_series=time_series["velocity_x"],
            velocity_y_series=time_series["velocity_y"],
        ),
    )


@router.post("/newtons-laws", response_model=NewtonResponse)
async def run_newtons_laws(
    body: NewtonRequest,
    request: Request,
    db: DBSession,
) -> NewtonResponse:
    session_id: str = request.state.session_id

    sim = newtons_laws.simulate(
        force=body.force,
        mass=body.mass,
        friction_coefficient=body.friction_coefficient,
        duration=body.duration,
    )

    result_dict = asdict(sim)
    time_series = {
        "velocity": result_dict.pop("velocity_series"),
        "acceleration": result_dict.pop("acceleration_series"),
        "position": result_dict.pop("position_series"),
    }

    svc = ExperimentService(db)
    exp_id = await svc.create_physics_result(
        session_id=session_id,
        experiment_type="newtons_laws",
        title=f"Newton F={body.force} N, m={body.mass} kg, μ={body.friction_coefficient}",
        parameters=body.model_dump(),
        results=result_dict,
        time_series=time_series,
    )

    return NewtonResponse(
        experiment_id=exp_id,
        parameters=body,
        results=NewtonResultResponse(
            **result_dict,
            velocity_series=time_series["velocity"],
            acceleration_series=time_series["acceleration"],
            position_series=time_series["position"],
        ),
    )


@router.post("/pendulum", response_model=PendulumResponse)
async def run_pendulum(
    body: PendulumRequest,
    request: Request,
    db: DBSession,
) -> PendulumResponse:
    session_id: str = request.state.session_id

    sim = pendulum.simulate(
        length=body.length,
        mass=body.mass,
        initial_angle=body.initial_angle,
        gravity=body.gravity,
    )

    result_dict = asdict(sim)
    time_series = {
        "angle": result_dict.pop("angle_series"),
        "angular_velocity": result_dict.pop("angular_velocity_series"),
        "energy": result_dict.pop("energy_series"),
    }

    svc = ExperimentService(db)
    exp_id = await svc.create_physics_result(
        session_id=session_id,
        experiment_type="pendulum",
        title=f"Pendulum L={body.length} m, θ₀={body.initial_angle}°",
        parameters=body.model_dump(),
        results=result_dict,
        time_series=time_series,
    )

    return PendulumResponse(
        experiment_id=exp_id,
        parameters=body,
        results=PendulumResultResponse(
            **result_dict,
            angle_series=time_series["angle"],
            angular_velocity_series=time_series["angular_velocity"],
            energy_series=time_series["energy"],
        ),
    )
