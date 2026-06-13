"""
Newton's second law simulator.

Models a block on a horizontal surface under an applied force with kinetic friction.
F_net = F_applied - μ * m * g   (only while object moves or force overcomes static friction)
a = F_net / m
"""
import math
from dataclasses import dataclass, field


@dataclass
class NewtonResult:
    net_force: float
    acceleration: float
    final_velocity: float
    displacement: float
    velocity_series: list[list[float]] = field(default_factory=list)
    acceleration_series: list[list[float]] = field(default_factory=list)
    position_series: list[list[float]] = field(default_factory=list)


def simulate(
    force: float,
    mass: float,
    friction_coefficient: float,
    duration: float = 5.0,
    gravity: float = 9.81,
    dt: float = 0.05,
    max_points: int = 200,
) -> NewtonResult:
    """
    Simulate Newton's second law.

    Parameters
    ----------
    force                : applied force (N)
    mass                 : object mass (kg)
    friction_coefficient : kinetic friction coefficient (0-1)
    duration             : simulation duration (s)
    gravity              : gravitational acceleration (m/s²)
    """
    friction_force = friction_coefficient * mass * gravity
    net_force = force - friction_force

    # Object stays still if applied force can't overcome static friction
    if net_force <= 0:
        net_force = 0.0

    acceleration = net_force / mass if mass > 0 else 0.0

    velocity = 0.0
    position = 0.0
    t = 0.0

    sample_every = max(1, int(duration / (max_points * dt)))
    step = 0

    velocity_series: list[list[float]] = [[0.0, 0.0]]
    acceleration_series: list[list[float]] = [[0.0, round(acceleration, 4)]]
    position_series: list[list[float]] = [[0.0, 0.0]]

    while t < duration:
        velocity += acceleration * dt
        position += velocity * dt
        t = round(t + dt, 6)
        step += 1

        if step % sample_every == 0 and len(velocity_series) < max_points:
            velocity_series.append([round(t, 3), round(velocity, 4)])
            acceleration_series.append([round(t, 3), round(acceleration, 4)])
            position_series.append([round(t, 3), round(position, 4)])

    # Ensure last point is included
    velocity_series.append([round(duration, 3), round(velocity, 4)])
    position_series.append([round(duration, 3), round(position, 4)])

    return NewtonResult(
        net_force=round(net_force, 4),
        acceleration=round(acceleration, 4),
        final_velocity=round(velocity, 4),
        displacement=round(position, 4),
        velocity_series=velocity_series,
        acceleration_series=acceleration_series,
        position_series=position_series,
    )
