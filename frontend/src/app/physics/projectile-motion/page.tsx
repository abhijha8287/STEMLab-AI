"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectileControls } from "@/components/physics/projectile/ProjectileControls";
import { ProjectileCanvas } from "@/components/physics/projectile/ProjectileCanvas";
import { ProjectileGraphs } from "@/components/physics/projectile/ProjectileGraphs";
import { ResultsSummary } from "@/components/physics/ResultsSummary";
import { useProjectileMotion } from "@/hooks/usePhysics";
import type { ProjectileResponse, TrajectoryPoint } from "@/types/physics";

export default function ProjectileMotionPage() {
  const mutation = useProjectileMotion();
  const [result, setResult] = useState<ProjectileResponse | null>(null);
  const [animate, setAnimate] = useState(false);

  const handleRun = (params: Parameters<typeof mutation.mutate>[0]) => {
    setAnimate(false);
    mutation.mutate(params, {
      onSuccess: (data) => {
        setResult(data);
        setAnimate(true);
      },
    });
  };

  const trajectory: TrajectoryPoint[] = result?.results.trajectory ?? [];
  const vx = result?.results.velocity_x_series ?? [];
  const vy = result?.results.velocity_y_series ?? [];

  const metrics = result
    ? [
        { label: "Range", value: result.results.range, unit: "m", highlight: true },
        { label: "Max Height", value: result.results.max_height, unit: "m" },
        { label: "Flight Time", value: result.results.flight_time, unit: "s" },
        { label: "Time to Peak", value: result.results.time_to_peak, unit: "s" },
        { label: "Impact Velocity", value: result.results.impact_velocity, unit: "m/s" },
        { label: "Experiment ID", value: result.experiment_id.slice(0, 8) + "…" },
      ]
    : [];

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Projectile Motion</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Euler integration with linear drag — F_drag = −k·v
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <ProjectileControls onRun={handleRun} isLoading={mutation.isPending} />
          <div className="space-y-4">
            <ProjectileCanvas trajectory={trajectory} isAnimating={animate} />
            {result && (
              <>
                <ResultsSummary metrics={metrics} />
                <ProjectileGraphs trajectory={trajectory} velocityXSeries={vx} velocityYSeries={vy} />
              </>
            )}
            {mutation.isError && (
              <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                Simulation failed: {mutation.error?.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
