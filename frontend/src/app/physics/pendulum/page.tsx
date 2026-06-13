"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PendulumControls } from "@/components/physics/pendulum/PendulumControls";
import { PendulumCanvas } from "@/components/physics/pendulum/PendulumCanvas";
import { PendulumGraphs } from "@/components/physics/pendulum/PendulumGraphs";
import { ResultsSummary } from "@/components/physics/ResultsSummary";
import { usePendulum } from "@/hooks/usePhysics";
import type { PendulumResponse, PendulumRequest } from "@/types/physics";

export default function PendulumPage() {
  const mutation = usePendulum();
  const [result, setResult] = useState<PendulumResponse | null>(null);
  const [animate, setAnimate] = useState(false);
  const [lastParams, setLastParams] = useState<PendulumRequest>({ length: 1.0, mass: 0.5, initial_angle: 30 });

  const handleRun = (params: PendulumRequest) => {
    setLastParams(params);
    setAnimate(false);
    mutation.mutate(params, {
      onSuccess: (data) => {
        setResult(data);
        setAnimate(true);
      },
    });
  };

  const metrics = result
    ? [
        { label: "Period", value: result.results.period, unit: "s", highlight: true },
        { label: "Frequency", value: result.results.frequency, unit: "Hz" },
        { label: "Angular Frequency", value: result.results.angular_frequency, unit: "rad/s" },
        { label: "Max Velocity", value: result.results.max_velocity, unit: "m/s" },
        { label: "Max KE", value: result.results.max_kinetic_energy, unit: "J" },
        { label: "Experiment ID", value: result.experiment_id.slice(0, 8) + "…" },
      ]
    : [];

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Simple Pendulum</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            θ'' = −(g/L) sin(θ) — solved with RK4 integration
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <PendulumControls onRun={handleRun} isLoading={mutation.isPending} />
          <div className="space-y-4">
            <PendulumCanvas
              result={result?.results ?? null}
              length={lastParams.length}
              isAnimating={animate}
            />
            {result && (
              <>
                <ResultsSummary metrics={metrics} />
                <PendulumGraphs result={result.results} />
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
