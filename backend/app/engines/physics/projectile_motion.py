"""
Projectile motion simulator.

Uses Euler integration with configurable time step.
Air resistance modelled as linear drag: F_drag = -k * v (component-wise).
"""
import math
from dataclasses import dataclass, field


@dataclass
class ProjectileResult:
    flight_time: float
    max_height: float
    range: float
    time_to_peak: float
    impact_velocity: float
    trajectory: list[dict] = field(default_factory=list)
    velocity_x_series: list[list[float]] = field(default_factory=list)
    velocity_y_series: list[list[float]] = field(default_factory=list)


def simulate(
    initial_velocity: float,
    launch_angle: float,
    gravity: float,
    air_resistance: float,
    dt: float = 0.02,
    max_points: int = 300,
) -> ProjectileResult:
    """
    Simulate projectile motion.

    Parameters
    ----------
    initial_velocity : m/s
    launch_angle     : degrees (0-89)
    gravity          : m/s²
    air_resistance   : dimensionless 0-1, scaled to drag coefficient
    dt               : integration time step (seconds)
    max_points       : max trajectory points to store
    """
    angle_rad = math.radians(launch_angle)
    vx = initial_velocity * math.cos(angle_rad)
    vy = initial_velocity * math.sin(angle_rad)
    x, y = 0.0, 0.0
    t = 0.0
    k = air_resistance * 0.08  # scale 0-1 → drag coefficient

    trajectory: list[dict] = [{"t": 0.0, "x": 0.0, "y": 0.0, "vx": round(vx, 4), "vy": round(vy, 4)}]
    vx_series: list[list[float]] = [[0.0, round(vx, 4)]]
    vy_series: list[list[float]] = [[0.0, round(vy, 4)]]

    max_height = 0.0
    max_height_t = 0.0
    step = 0
    # Estimate total flight time (vacuum): t_flight = 2*v0*sin(θ)/g
    est_flight = max(0.5, 2 * initial_velocity * math.sin(angle_rad) / gravity)
    est_steps = int(est_flight / dt)
    sample_every = max(1, est_steps // max_points)

    while True:
        # Drag force opposes velocity direction
        ax = -k * vx
        ay = -gravity - k * vy

        vx += ax * dt
        vy += ay * dt
        x += vx * dt
        y += vy * dt
        t = round(t + dt, 6)
        step += 1

        if y > max_height:
            max_height = y
            max_height_t = t

        if step % sample_every == 0 and len(trajectory) < max_points:
            trajectory.append({"t": round(t, 3), "x": round(x, 3), "y": max(0.0, round(y, 3)), "vx": round(vx, 4), "vy": round(vy, 4)})
            vx_series.append([round(t, 3), round(vx, 4)])
            vy_series.append([round(t, 3), round(vy, 4)])

        if y < 0.0 or t > 500:
            break

    impact_v = math.sqrt(vx**2 + vy**2)

    # Add final landing point
    trajectory.append({"t": round(t, 3), "x": round(x, 3), "y": 0.0, "vx": round(vx, 4), "vy": round(vy, 4)})

    return ProjectileResult(
        flight_time=round(t, 3),
        max_height=round(max_height, 3),
        range=round(x, 3),
        time_to_peak=round(max_height_t, 3),
        impact_velocity=round(impact_v, 3),
        trajectory=trajectory,
        velocity_x_series=vx_series,
        velocity_y_series=vy_series,
    )
