"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { OhmsControls } from "@/components/circuit/ohms/OhmsControls";
import { OhmsCanvas } from "@/components/circuit/ohms/OhmsCanvas";
import { OhmsGraphs } from "@/components/circuit/ohms/OhmsGraphs";
import { ResultsSummary } from "@/components/physics/ResultsSummary";
import { useOhmsLaw } from "@/hooks/useCircuit";
import type { OhmsResponse } from "@/types/circuit";

export default function OhmsLawPage() {
  const mutation = useOhmsLaw();
  const [result, setResult] = useState<OhmsResponse | null>(null);

  const handleRun = (params: Parameters<typeof mutation.mutate>[0]) => {
    mutation.mutate(params, { onSuccess: setResult });
  };

  const metrics = result ? [
    { label: "Voltage", value: result.results.voltage, unit: "V", highlight: true },
    { label: "Current", value: result.results.current < 0.001 ? result.results.current * 1000 : result.results.current, unit: result.results.current < 0.001 ? "mA" : "A" },
    { label: "Resistance", value: result.results.resistance >= 1000 ? result.results.resistance / 1000 : result.results.resistance, unit: result.results.resistance >= 1000 ? "kΩ" : "Ω" },
    { label: "Power", value: result.results.power, unit: "W" },
    { label: "Energy", value: result.results.energy, unit: "J" },
    { label: "Experiment ID", value: result.experiment_id.slice(0, 8) + "…" },
  ] : [];

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Ohm's Law</h1>
          <p className="text-muted-foreground text-sm mt-0.5">V = IR — solve for any unknown given two knowns</p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <OhmsControls onRun={handleRun} isLoading={mutation.isPending} />
          <div className="space-y-4">
            <OhmsCanvas result={result?.results ?? null} />
            {result && (
              <>
                <ResultsSummary metrics={metrics} />
                <OhmsGraphs result={result.results} />
              </>
            )}
            {mutation.isError && (
              <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                {mutation.error?.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
