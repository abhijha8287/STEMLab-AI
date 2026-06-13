import apiClient from "./client";
import type {
  ProjectileRequest,
  ProjectileResponse,
  NewtonRequest,
  NewtonResponse,
  PendulumRequest,
  PendulumResponse,
} from "@/types/physics";

export const physicsApi = {
  runProjectileMotion: (data: ProjectileRequest): Promise<ProjectileResponse> =>
    apiClient.post("/physics/projectile-motion", data).then((r) => r.data),

  runNewtonsLaws: (data: NewtonRequest): Promise<NewtonResponse> =>
    apiClient.post("/physics/newtons-laws", data).then((r) => r.data),

  runPendulum: (data: PendulumRequest): Promise<PendulumResponse> =>
    apiClient.post("/physics/pendulum", data).then((r) => r.data),
};
