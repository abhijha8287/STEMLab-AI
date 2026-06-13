"""
Series / Parallel resistor network solver.

Supports up to 6 resistors in a pure series, pure parallel,
or series-of-parallel-groups (two groups) topology.

Topology options
----------------
"series"   - all resistors in one series chain
"parallel" - all resistors in one parallel bank
"series_parallel" - first half in parallel, second half in parallel,
                    then the two groups in series
"""
from __future__ import annotations
from dataclasses import dataclass, field
import math


@dataclass
class ResistorInfo:
    id: int
    resistance: float
    voltage_drop: float
    current: float
    power: float


@dataclass
class SeriesParallelResult:
    topology: str
    supply_voltage: float
    equivalent_resistance: float
    total_current: float
    total_power: float
    resistors: list[ResistorInfo] = field(default_factory=list)
    # Charts
    voltage_drops: list[dict] = field(default_factory=list)   # [{name, value}]
    power_dist: list[dict] = field(default_factory=list)       # [{name, value}]


def simulate(
    resistances: list[float],
    supply_voltage: float,
    topology: str = "series",
) -> SeriesParallelResult:
    n = len(resistances)
    if n < 1:
        raise ValueError("Need at least one resistor.")
    if topology not in ("series", "parallel", "series_parallel"):
        raise ValueError("topology must be 'series', 'parallel', or 'series_parallel'.")

    if topology == "series":
        r_eq = sum(resistances)
        i_total = supply_voltage / r_eq
        resistors = []
        for idx, r in enumerate(resistances):
            v = i_total * r
            resistors.append(ResistorInfo(
                id=idx + 1,
                resistance=round(r, 4),
                voltage_drop=round(v, 4),
                current=round(i_total, 6),
                power=round(v * i_total, 6),
            ))

    elif topology == "parallel":
        r_eq = 1.0 / sum(1.0 / r for r in resistances)
        i_total = supply_voltage / r_eq
        resistors = []
        for idx, r in enumerate(resistances):
            i_branch = supply_voltage / r
            resistors.append(ResistorInfo(
                id=idx + 1,
                resistance=round(r, 4),
                voltage_drop=round(supply_voltage, 4),
                current=round(i_branch, 6),
                power=round(supply_voltage * i_branch, 6),
            ))

    else:  # series_parallel: split into two equal groups
        mid = max(1, n // 2)
        group1 = resistances[:mid]
        group2 = resistances[mid:]
        r_p1 = 1.0 / sum(1.0 / r for r in group1)
        r_p2 = (1.0 / sum(1.0 / r for r in group2)) if group2 else 0.0
        r_eq = r_p1 + r_p2
        i_total = supply_voltage / r_eq

        v1 = i_total * r_p1
        v2 = i_total * r_p2

        resistors = []
        for idx, r in enumerate(group1):
            i_b = v1 / r
            resistors.append(ResistorInfo(
                id=idx + 1,
                resistance=round(r, 4),
                voltage_drop=round(v1, 4),
                current=round(i_b, 6),
                power=round(v1 * i_b, 6),
            ))
        for idx, r in enumerate(group2):
            i_b = v2 / r
            resistors.append(ResistorInfo(
                id=mid + idx + 1,
                resistance=round(r, 4),
                voltage_drop=round(v2, 4),
                current=round(i_b, 6),
                power=round(v2 * i_b, 6),
            ))

    total_power = supply_voltage * i_total

    return SeriesParallelResult(
        topology=topology,
        supply_voltage=round(supply_voltage, 4),
        equivalent_resistance=round(r_eq, 4),
        total_current=round(i_total, 6),
        total_power=round(total_power, 6),
        resistors=resistors,
        voltage_drops=[{"name": f"R{r.id}", "value": r.voltage_drop} for r in resistors],
        power_dist=[{"name": f"R{r.id}", "value": round(r.power, 4)} for r in resistors],
    )
