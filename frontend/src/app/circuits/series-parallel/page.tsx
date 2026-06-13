"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { SeriesParallelControls } from "@/components/circuit/series-parallel/SeriesParallelControls";
import { SeriesParallelCanvas } from "@/components/circuit/series-parallel/SeriesParallelCanvas";
import { SeriesParallelGraphs } from "@/components/circuit/series-parallel/SeriesParallelGraphs";
import { ResultsSummary } from "@/components/physics/ResultsSummary";
import { useSeriesParallel } from "@/hooks/useCircuit";
import type { SeriesParallelResponse } from "@/types/circuit";

export default function SeriesParallelPage() {
  const mutation = useSeriesParallel();
  const [result, setResult] = useState<SeriesParallelResponse | null>(null);

  const handleRun = (params: Parameters<typeof mutation.mutate>[0]) => {
    mutation.mutate(params, { onSuccess: setResult });
  };

  const metrics = result ? [
    { label: "Topology", value: result.results.topology.replace("_", " "), highlight: true },
    { label: "Equivalent R", value: result.results.equivalent_resistance >= 1000 ? result.results.equivalent_resistance / 1000 : result.results.equivalent_resistance, unit: result.results.equivalent_resistance >= 1000 ? "kΩ" : "Ω" },
    { label: "Total Current", value: result.results.total_current, unit: "A" },
    { label: "Total Power", value: result.results.total_power, unit: "W" },
    { label: "Resistors", value: result.results.resistors.length },
    { label: "Supply Voltage", value: result.results.supply_voltage, unit: "V" },
  ] : [];

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Series & Parallel Networks</h1>
          <p className="text-muted-foreground text-sm mt-0.5">KVL + KCL — voltage drops, branch currents, equivalent resistance</p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <SeriesParallelControls onRun={handleRun} isLoading={mutation.isPending} />
          <div className="space-y-4">
            <SeriesParallelCanvas result={result?.results ?? null} />
            {result && (
              <>
                <ResultsSummary metrics={metrics} />
                <SeriesParallelGraphs result={result.results} />
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
