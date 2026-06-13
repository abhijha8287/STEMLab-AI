"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { RCRequest, RCMode } from "@/types/circuit";

interface RCControlsProps {
  onRun: (p: RCRequest) => void;
  isLoading: boolean;
}

export function RCControls({ onRun, isLoading }: RCControlsProps) {
  const [resistance, setResistance] = useState(1000);
  const [capacitance, setCapacitance] = useState(100e-6); // 100 µF
  const [voltage, setVoltage] = useState(12);
  const [initialV, setInitialV] = useState(0);
  const [mode, setMode] = useState<RCMode>("charging");

  const tau = resistance * capacitance;

  const handleRun = () => onRun({
    resistance,
    capacitance,
    supply_voltage: voltage,
    initial_voltage: initialV,
    mode,
  });
  const handleReset = () => { setResistance(1000); setCapacitance(100e-6); setVoltage(12); setInitialV(0); setMode("charging"); };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Controls</h3>

      {/* Mode */}
      <div>
        <Label className="text-xs mb-2 block">Mode</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {(["charging", "discharging"] as RCMode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={cn("rounded-md py-1.5 text-xs font-semibold border transition-colors capitalize",
                mode === m ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" : "border-border text-muted-foreground hover:bg-accent")}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Resistance</span>
          <span className="font-mono text-yellow-400">{resistance >= 1000 ? (resistance / 1000).toFixed(1) + " kΩ" : resistance + " Ω"}</span>
        </Label>
        <Slider min={1} max={1000000} step={1} value={[resistance]} onValueChange={([v]) => setResistance(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Capacitance</span>
          <span className="font-mono text-yellow-400">
            {capacitance < 1e-6 ? (capacitance * 1e9).toFixed(0) + " nF" :
             capacitance < 1e-3 ? (capacitance * 1e6).toFixed(0) + " µF" :
             (capacitance * 1000).toFixed(0) + " mF"}
          </span>
        </Label>
        <Slider min={1e-9} max={1e-2} step={1e-9} value={[capacitance]} onValueChange={([v]) => setCapacitance(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Supply Voltage</span>
          <span className="font-mono text-yellow-400">{voltage} V</span>
        </Label>
        <Slider min={0.01} max={1000} step={0.01} value={[voltage]} onValueChange={([v]) => setVoltage(v)} />
      </div>

      {mode === "discharging" && (
        <div className="space-y-1">
          <Label className="flex justify-between text-xs">
            <span>Initial Capacitor Voltage</span>
            <span className="font-mono text-yellow-400">{initialV} V</span>
          </Label>
          <Slider min={0.01} max={1000} step={0.01} value={[initialV]} onValueChange={([v]) => setInitialV(v)} />
        </div>
      )}

      <div className="rounded-lg bg-muted/40 border px-3 py-2 text-xs text-muted-foreground font-mono">
        τ = RC = {tau < 0.001 ? (tau * 1000).toFixed(2) + " ms" : tau.toFixed(4) + " s"}
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleRun} disabled={isLoading || (mode === "discharging" && initialV <= 0)}>
          <PlayCircle className="w-4 h-4 mr-2" />
          {isLoading ? "Simulating…" : mode === "charging" ? "Start Charging" : "Start Discharging"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} disabled={isLoading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
