"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { NewtonControls } from "@/components/physics/newton/NewtonControls";
import { NewtonCanvas } from "@/components/physics/newton/NewtonCanvas";
import { NewtonGraphs } from "@/components/physics/newton/NewtonGraphs";
import { ResultsSummary } from "@/components/physics/ResultsSummary";
import { useNewtonsLaws } from "@/hooks/usePhysics";
import type { NewtonResponse, NewtonRequest } from "@/types/physics";

export default function NewtonsLawsPage() {
  const mutation = useNewtonsLaws();
  const [result, setResult] = useState<NewtonResponse | null>(null);
  const [animate, setAnimate] = useState(false);
  const [lastParams, setLastParams] = useState<NewtonRequest>({ force: 50, mass: 10, friction_coefficient: 0.2, duration: 5 });

  const handleRun = (params: NewtonRequest) => {
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
        { label: "Net Force", value: result.results.net_force, unit: "N", highlight: true },
        { label: "Acceleration", value: result.results.acceleration, unit: "m/s²" },
        { label: "Final Velocity", value: result.results.final_velocity, unit: "m/s" },
        { label: "Displacement", value: result.results.displacement, unit: "m" },
        { label: "Experiment ID", value: result.experiment_id.slice(0, 8) + "…" },
        { label: "Duration", value: lastParams.duration ?? 5, unit: "s" },
      ]
    : [];

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Newton's Second Law</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            F_net = F_applied − μmg | a = F_net / m
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <NewtonControls onRun={handleRun} isLoading={mutation.isPending} />
          <div className="space-y-4">
            <NewtonCanvas
              result={result?.results ?? null}
              isAnimating={animate}
              force={lastParams.force}
              mass={lastParams.mass}
              friction={lastParams.friction_coefficient}
            />
            {result && (
              <>
                <ResultsSummary metrics={metrics} />
                <NewtonGraphs result={result.results} />
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
