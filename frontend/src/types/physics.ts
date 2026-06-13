// ── Projectile Motion ─────────────────────────────────────────────────────────

export interface ProjectileRequest {
  initial_velocity: number;
  launch_angle: number;
  gravity?: number;
  air_resistance?: number;
}

export interface TrajectoryPoint {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface ProjectileResult {
  flight_time: number;
  max_height: number;
  range: number;
  time_to_peak: number;
  impact_velocity: number;
  trajectory: TrajectoryPoint[];
  velocity_x_series: [number, number][];
  velocity_y_series: [number, number][];
}

export interface ProjectileResponse {
  experiment_id: string;
  parameters: Required<ProjectileRequest>;
  results: ProjectileResult;
}

// ── Newton's Laws ─────────────────────────────────────────────────────────────

export interface NewtonRequest {
  force: number;
  mass: number;
  friction_coefficient: number;
  duration?: number;
}

export interface NewtonResult {
  net_force: number;
  acceleration: number;
  final_velocity: number;
  displacement: number;
  velocity_series: [number, number][];
  acceleration_series: [number, number][];
  position_series: [number, number][];
}

export interface NewtonResponse {
  experiment_id: string;
  parameters: Required<NewtonRequest>;
  results: NewtonResult;
}

// ── Pendulum ──────────────────────────────────────────────────────────────────

export interface PendulumRequest {
  length: number;
  mass: number;
  initial_angle: number;
  gravity?: number;
}

export interface PendulumResult {
  period: number;
  frequency: number;
  angular_frequency: number;
  max_velocity: number;
  max_kinetic_energy: number;
  angle_series: [number, number][];
  angular_velocity_series: [number, number][];
  energy_series: [number, number][];
}

export interface PendulumResponse {
  experiment_id: string;
  parameters: Required<PendulumRequest>;
  results: PendulumResult;
}
