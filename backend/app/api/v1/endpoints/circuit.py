from fastapi import APIRouter, Request, HTTPException
from dataclasses import asdict

from app.core.dependencies import DBSession
from app.engines.circuit import ohms_law, series_parallel, rc_circuit
from app.schemas.circuit import (
    OhmsRequest, OhmsResponse, OhmsResultResponse,
    SeriesParallelRequest, SeriesParallelResponse, SeriesParallelResultResponse,
    RCRequest, RCResponse, RCResultResponse,
)
from app.services.experiment_service import ExperimentService

router = APIRouter(prefix="/circuit", tags=["circuit"])


@router.post("/ohms-law", response_model=OhmsResponse)
async def run_ohms_law(body: OhmsRequest, request: Request, db: DBSession) -> OhmsResponse:
    provided = sum(v is not None for v in [body.voltage, body.current, body.resistance])
    if provided != 2:
        raise HTTPException(status_code=422, detail="Exactly two of voltage, current, resistance must be provided.")

    sim = ohms_law.simulate(
        voltage=body.voltage,
        current=body.current,
        resistance=body.resistance,
        time=body.time,
    )
    result_dict = asdict(sim)
    iv_curve = result_dict.pop("iv_curve")

    svc = ExperimentService(db)
    exp_id = await svc.create_physics_result(
        session_id=request.state.session_id,
        experiment_type="ohms_law",
        title=f"Ohm's Law V={sim.voltage}V R={sim.resistance}Ω",
        parameters=body.model_dump(),
        results=result_dict,
        time_series={"iv_curve": iv_curve},
    )
    return OhmsResponse(
        experiment_id=exp_id,
        parameters=body.model_dump(),
        results=OhmsResultResponse(**result_dict, iv_curve=iv_curve),
    )


@router.post("/series-parallel", response_model=SeriesParallelResponse)
async def run_series_parallel(body: SeriesParallelRequest, request: Request, db: DBSession) -> SeriesParallelResponse:
    sim = series_parallel.simulate(
        resistances=body.resistances,
        supply_voltage=body.supply_voltage,
        topology=body.topology,
    )
    result_dict = asdict(sim)

    svc = ExperimentService(db)
    exp_id = await svc.create_physics_result(
        session_id=request.state.session_id,
        experiment_type="series_parallel",
        title=f"{body.topology.replace('_',' ').title()} — {len(body.resistances)} resistors @ {body.supply_voltage}V",
        parameters=body.model_dump(),
        results={k: v for k, v in result_dict.items() if k not in ("voltage_drops", "power_dist", "resistors")},
        time_series={"resistors": result_dict["resistors"], "voltage_drops": result_dict["voltage_drops"], "power_dist": result_dict["power_dist"]},
    )
    return SeriesParallelResponse(
        experiment_id=exp_id,
        parameters=body.model_dump(),
        results=SeriesParallelResultResponse(**result_dict),
    )


@router.post("/rc-circuit", response_model=RCResponse)
async def run_rc_circuit(body: RCRequest, request: Request, db: DBSession) -> RCResponse:
    if body.mode == "discharging" and body.initial_voltage <= 0:
        raise HTTPException(status_code=422, detail="Discharging mode requires initial_voltage > 0.")

    sim = rc_circuit.simulate(
        resistance=body.resistance,
        capacitance=body.capacitance,
        supply_voltage=body.supply_voltage,
        initial_voltage=body.initial_voltage,
        mode=body.mode,
    )
    result_dict = asdict(sim)
    time_series = result_dict.pop("time_series")

    svc = ExperimentService(db)
    exp_id = await svc.create_physics_result(
        session_id=request.state.session_id,
        experiment_type="rc_circuit",
        title=f"RC {body.mode.title()} R={body.resistance}Ω C={body.capacitance}F",
        parameters=body.model_dump(),
        results=result_dict,
        time_series={"time_series": time_series},
    )
    return RCResponse(
        experiment_id=exp_id,
        parameters=body.model_dump(),
        results=RCResultResponse(**result_dict, time_series=time_series),
    )
