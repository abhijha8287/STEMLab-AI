"""
Ohm's Law engine.

Given any two of voltage (V), current (I), resistance (R),
computes the third plus power (P) and energy dissipated over time.
"""
from dataclasses import dataclass


@dataclass
class OhmsResult:
    voltage: float        # V
    current: float        # A
    resistance: float     # Ω
    power: float          # W  = V*I
    energy: float         # J  = P * time
    v_drop: float         # same as voltage for single resistor
    # Sweep: vary V from 0 → voltage, show I response
    iv_curve: list[list[float]]   # [[V, I], ...]


def simulate(
    voltage: float | None,
    current: float | None,
    resistance: float | None,
    time: float = 1.0,
    points: int = 50,
) -> OhmsResult:
    """
    Exactly two of (voltage, current, resistance) must be provided.
    """
    provided = sum(x is not None for x in (voltage, current, resistance))
    if provided != 2:
        raise ValueError("Exactly two of voltage, current, resistance must be provided.")

    if voltage is None:
        voltage = current * resistance          # type: ignore[operator]
    elif current is None:
        current = voltage / resistance          # type: ignore[operator]
    else:
        resistance = voltage / current          # type: ignore[operator]

    power = voltage * current
    energy = power * time

    # I-V sweep: V from 0 → voltage (linear, constant R)
    iv_curve = [
        [round(v_i, 4), round(v_i / resistance, 6)]
        for v_i in [voltage * i / (points - 1) for i in range(points)]
    ]

    return OhmsResult(
        voltage=round(voltage, 6),
        current=round(current, 6),
        resistance=round(resistance, 6),
        power=round(power, 6),
        energy=round(energy, 6),
        v_drop=round(voltage, 6),
        iv_curve=iv_curve,
    )
