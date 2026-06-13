import apiClient from "./client";
import type {
  OhmsRequest, OhmsResponse,
  SeriesParallelRequest, SeriesParallelResponse,
  RCRequest, RCResponse,
} from "@/types/circuit";

export const circuitApi = {
  runOhmsLaw: (data: OhmsRequest): Promise<OhmsResponse> =>
    apiClient.post("/circuit/ohms-law", data).then((r) => r.data),

  runSeriesParallel: (data: SeriesParallelRequest): Promise<SeriesParallelResponse> =>
    apiClient.post("/circuit/series-parallel", data).then((r) => r.data),

  runRCCircuit: (data: RCRequest): Promise<RCResponse> =>
    apiClient.post("/circuit/rc-circuit", data).then((r) => r.data),
};
