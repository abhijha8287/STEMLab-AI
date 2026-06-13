// ── Ohm's Law ──────────────────────────────────────────────────────────────────

export interface OhmsRequest {
  voltage?: number;
  current?: number;
  resistance?: number;
  time?: number;
}

export interface OhmsResult {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
  energy: number;
  v_drop: number;
  iv_curve: [number, number][];
}

export interface OhmsResponse {
  experiment_id: string;
  parameters: Record<string, number | null>;
  results: OhmsResult;
}

// ── Series / Parallel ─────────────────────────────────────────────────────────

export type Topology = "series" | "parallel" | "series_parallel";

export interface SeriesParallelRequest {
  resistances: number[];
  supply_voltage: number;
  topology: Topology;
}

export interface ResistorInfo {
  id: number;
  resistance: number;
  voltage_drop: number;
  current: number;
  power: number;
}

export interface SeriesParallelResult {
  topology: Topology;
  supply_voltage: number;
  equivalent_resistance: number;
  total_current: number;
  total_power: number;
  resistors: ResistorInfo[];
  voltage_drops: { name: string; value: number }[];
  power_dist: { name: string; value: number }[];
}

export interface SeriesParallelResponse {
  experiment_id: string;
  parameters: Record<string, unknown>;
  results: SeriesParallelResult;
}

// ── RC Circuit ────────────────────────────────────────────────────────────────

export type RCMode = "charging" | "discharging";

export interface RCRequest {
  resistance: number;
  capacitance: number;
  supply_voltage: number;
  initial_voltage?: number;
  mode: RCMode;
}

export interface RCResult {
  resistance: number;
  capacitance: number;
  supply_voltage: number;
  time_constant: number;
  mode: RCMode;
  voltage_at_tau: number[];
  time_series: [number, number, number][];  // [t, Vc, Ic]
  charge_at_5tau: number;
  energy_stored: number;
}

export interface RCResponse {
  experiment_id: string;
  parameters: Record<string, unknown>;
  results: RCResult;
}
