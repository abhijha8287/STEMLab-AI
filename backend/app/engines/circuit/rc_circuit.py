"""
RC circuit simulator — charging and discharging.

Charging:   V_c(t) = V_s * (1 - exp(-t / τ))
Discharging: V_c(t) = V_0 * exp(-t / τ)

where τ = R * C  (time constant)

All analytical, no numerical integration needed.
"""
from __future__ import annotations
import math
from dataclasses import dataclass, field


@dataclass
class RCResult:
    resistance: float      # Ω
    capacitance: float     # F
    supply_voltage: float  # V
    time_constant: float   # τ = RC  (s)
    mode: str              # "charging" | "discharging"
    # At 1τ, 2τ, 3τ, 4τ, 5τ
    voltage_at_tau: list[float]
    # Time to reach 63.2%, 86.5%, 95.0%, 98.2%, 99.3% of final
    time_series: list[list[float]]   # [[t, Vc, Ic], ...]
    charge_at_5tau: float            # charge in capacitor at 5τ  (C)
    energy_stored: float             # ½CV²  at 5τ  (J)


def simulate(
    resistance: float,
    capacitance: float,
    supply_voltage: float,
    initial_voltage: float = 0.0,
    mode: str = "charging",
    points: int = 200,
) -> RCResult:
    tau = resistance * capacitance
    if tau <= 0:
        raise ValueError("τ = R*C must be positive.")

    # Simulate over 5 time constants
    t_end = 5 * tau
    dt = t_end / (points - 1)

    time_series: list[list[float]] = []
    for i in range(points):
        t = i * dt
        if mode == "charging":
            vc = supply_voltage * (1 - math.exp(-t / tau))
            ic = ((supply_voltage - vc) / resistance)
        else:  # discharging
            vc = initial_voltage * math.exp(-t / tau)
            ic = -(vc / resistance)
        time_series.append([round(t, 6), round(vc, 6), round(ic, 8)])

    # Voltage at 1τ … 5τ
    voltage_at_tau = []
    for k in range(1, 6):
        t_k = k * tau
        if mode == "charging":
            v_k = supply_voltage * (1 - math.exp(-k))
        else:
            v_k = initial_voltage * math.exp(-k)
        voltage_at_tau.append(round(v_k, 6))

    final_v = supply_voltage if mode == "charging" else 0.0
    vc_5tau = voltage_at_tau[4]
    charge = capacitance * vc_5tau
    energy = 0.5 * capacitance * vc_5tau ** 2

    return RCResult(
        resistance=round(resistance, 6),
        capacitance=round(capacitance, 9),
        supply_voltage=round(supply_voltage, 4),
        time_constant=round(tau, 6),
        mode=mode,
        voltage_at_tau=voltage_at_tau,
        time_series=time_series,
        charge_at_5tau=round(charge, 9),
        energy_stored=round(energy, 9),
    )
