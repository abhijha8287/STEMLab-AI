"use client";

import { useMutation } from "@tanstack/react-query";
import { circuitApi } from "@/lib/api/circuit";
import type {
  OhmsRequest, OhmsResponse,
  SeriesParallelRequest, SeriesParallelResponse,
  RCRequest, RCResponse,
} from "@/types/circuit";

export function useOhmsLaw() {
  return useMutation<OhmsResponse, Error, OhmsRequest>({
    mutationFn: circuitApi.runOhmsLaw,
  });
}

export function useSeriesParallel() {
  return useMutation<SeriesParallelResponse, Error, SeriesParallelRequest>({
    mutationFn: circuitApi.runSeriesParallel,
  });
}

export function useRCCircuit() {
  return useMutation<RCResponse, Error, RCRequest>({
    mutationFn: circuitApi.runRCCircuit,
  });
}
