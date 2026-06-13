"""
Pendulum simulator using RK4 integration.

ODE: θ'' = -(g/L) * sin(θ)
State vector: [θ, ω] where ω = θ'

For small angles (< 15°) the exact SHM solution is also computed:
  θ(t) = θ₀ * cos(ω₀ * t)  where  ω₀ = sqrt(g/L)
"""
import math
from dataclasses import dataclass, field


@dataclass
class PendulumResult:
    period: float
    frequency: float
    angular_frequency: float
    max_velocity: float
    max_kinetic_energy: float
    angle_series: list[list[float]] = field(default_factory=list)
    angular_velocity_series: list[list[float]] = field(default_factory=list)
    energy_series: list[list[float]] = field(default_factory=list)


def _rk4_step(theta: float, omega: float, dt: float, g: float, L: float) -> tuple[float, float]:
    def derivatives(th: float, om: float) -> tuple[float, float]:
        return om, -(g / L) * math.sin(th)

    k1_th, k1_om = derivatives(theta, omega)
    k2_th, k2_om = derivatives(theta + 0.5 * dt * k1_th, omega + 0.5 * dt * k1_om)
    k3_th, k3_om = derivatives(theta + 0.5 * dt * k2_th, omega + 0.5 * dt * k2_om)
    k4_th, k4_om = derivatives(theta + dt * k3_th, omega + dt * k3_om)

    new_theta = theta + (dt / 6.0) * (k1_th + 2 * k2_th + 2 * k3_th + k4_th)
    new_omega = omega + (dt / 6.0) * (k1_om + 2 * k2_om + 2 * k3_om + k4_om)
    return new_theta, new_omega


def simulate(
    length: float,
    mass: float,
    initial_angle: float,
    gravity: float,
    duration: float = 10.0,
    dt: float = 0.02,
    max_points: int = 500,
) -> PendulumResult:
    """
    Simulate pendulum motion.

    Parameters
    ----------
    length        : string length (m)
    mass          : bob mass (kg)
    initial_angle : starting angle from vertical (degrees)
    gravity       : gravitational acceleration (m/s²)
    duration      : simulation duration (s)
    """
    theta0 = math.radians(initial_angle)
    omega0 = 0.0  # starts from rest

    # Analytical period for small angles
    omega_natural = math.sqrt(gravity / length)
    period_small = 2 * math.pi / omega_natural

    # Correction for large angles using series expansion
    # T ≈ T₀ * (1 + (1/16)*θ₀² + (11/3072)*θ₀⁴)
    angle_correction = 1 + (theta0**2) / 16 + (11 * theta0**4) / 3072
    period = round(period_small * angle_correction, 4)
    frequency = round(1.0 / period, 4)
    angular_frequency = round(2 * math.pi / period, 4)

    # Max velocity (at bottom): v_max = sqrt(2*g*L*(1 - cos(theta0)))
    max_velocity = math.sqrt(2 * gravity * length * (1 - math.cos(theta0)))

    # Max KE = 0.5 * m * v_max²
    max_ke = 0.5 * mass * max_velocity**2

    # RK4 integration
    theta, omega = theta0, omega0
    t = 0.0
    step = 0
    sample_every = max(1, int(duration / (max_points * dt)))

    angle_series: list[list[float]] = [[0.0, round(math.degrees(theta0), 4)]]
    omega_series: list[list[float]] = [[0.0, round(omega0, 4)]]
    energy_series: list[list[float]] = [[0.0, round(max_ke, 4)]]  # starts at max PE = max KE

    while t < duration:
        theta, omega = _rk4_step(theta, omega, dt, gravity, length)
        t = round(t + dt, 6)
        step += 1

        if step % sample_every == 0 and len(angle_series) < max_points:
            angle_deg = math.degrees(theta)
            # Kinetic energy at this point
            ke = 0.5 * mass * (omega * length) ** 2
            angle_series.append([round(t, 3), round(angle_deg, 4)])
            omega_series.append([round(t, 3), round(omega, 4)])
            energy_series.append([round(t, 3), round(ke, 4)])

    return PendulumResult(
        period=period,
        frequency=frequency,
        angular_frequency=angular_frequency,
        max_velocity=round(max_velocity, 4),
        max_kinetic_energy=round(max_ke, 4),
        angle_series=angle_series,
        angular_velocity_series=omega_series,
        energy_series=energy_series,
    )
