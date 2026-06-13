"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { RCControls } from "@/components/circuit/rc/RCControls";
import { RCCanvas } from "@/components/circuit/rc/RCCanvas";
import { RCGraphs } from "@/components/circuit/rc/RCGraphs";
import { ResultsSummary } from "@/components/physics/ResultsSummary";
import { useRCCircuit } from "@/hooks/useCircuit";
import type { RCResponse } from "@/types/circuit";

export default function RCCircuitPage() {
  const mutation = useRCCircuit();
  const [result, setResult] = useState<RCResponse | null>(null);
  const [animate, setAnimate] = useState(false);

  const handleRun = (params: Parameters<typeof mutation.mutate>[0]) => {
    setAnimate(false);
    mutation.mutate(params, {
      onSuccess: (data) => { setResult(data); setAnimate(true); },
    });
  };

  const metrics = result ? [
    { label: "Time Constant (τ)", value: result.results.time_constant < 0.001 ? result.results.time_constant * 1000 : result.results.time_constant, unit: result.results.time_constant < 0.001 ? "ms" : "s", highlight: true },
    { label: "Mode", value: result.results.mode },
    { label: "Supply Voltage", value: result.results.supply_voltage, unit: "V" },
    { label: "Vc at 1τ (63.2%)", value: result.results.voltage_at_tau[0], unit: "V" },
    { label: "Energy stored (5τ)", value: result.results.energy_stored * 1000, unit: "mJ" },
    { label: "Charge at 5τ", value: result.results.charge_at_5tau * 1e6, unit: "µC" },
  ] : [];

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">RC Circuit</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Vc(t) = V·(1 − e<sup>−t/τ</sup>) | τ = RC
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <RCControls onRun={handleRun} isLoading={mutation.isPending} />
          <div className="space-y-4">
            <RCCanvas result={result?.results ?? null} isAnimating={animate} />
            {result && (
              <>
                <ResultsSummary metrics={metrics} />
                <RCGraphs result={result.results} />
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
