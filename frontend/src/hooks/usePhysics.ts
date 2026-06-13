"use client";

import { useMutation } from "@tanstack/react-query";
import { physicsApi } from "@/lib/api/physics";
import type {
  ProjectileRequest,
  ProjectileResponse,
  NewtonRequest,
  NewtonResponse,
  PendulumRequest,
  PendulumResponse,
} from "@/types/physics";

export function useProjectileMotion() {
  return useMutation<ProjectileResponse, Error, ProjectileRequest>({
    mutationFn: physicsApi.runProjectileMotion,
  });
}

export function useNewtonsLaws() {
  return useMutation<NewtonResponse, Error, NewtonRequest>({
    mutationFn: physicsApi.runNewtonsLaws,
  });
}

export function usePendulum() {
  return useMutation<PendulumResponse, Error, PendulumRequest>({
    mutationFn: physicsApi.runPendulum,
  });
}
