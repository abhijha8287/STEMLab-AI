"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { OhmsRequest } from "@/types/circuit";

type Solve = "R" | "V" | "I";

interface OhmsControlsProps {
  onRun: (p: OhmsRequest) => void;
  isLoading: boolean;
}

export function OhmsControls({ onRun, isLoading }: OhmsControlsProps) {
  const [solve, setSolve] = useState<Solve>("R");
  const [voltage, setVoltage] = useState(12);
  const [current, setCurrent] = useState(0.12);
  const [resistance, setResistance] = useState(100);
  const [time, setTime] = useState(1);

  const handleRun = () => {
    onRun({
      voltage: solve === "V" ? undefined : voltage,
      current: solve === "I" ? undefined : current,
      resistance: solve === "R" ? undefined : resistance,
      time,
    });
  };

  const handleReset = () => { setVoltage(12); setCurrent(0.12); setResistance(100); setTime(1); };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Controls</h3>

      {/* Solve for */}
      <div>
        <Label className="text-xs mb-2 block">Solve for</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["V", "I", "R"] as Solve[]).map((s) => (
            <button
              key={s}
              onClick={() => setSolve(s)}
              className={cn(
                "rounded-md py-1.5 text-sm font-semibold border transition-colors",
                solve === s
                  ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {s === "V" ? "Voltage" : s === "I" ? "Current" : "Resistance"}
            </button>
          ))}
        </div>
      </div>

      {solve !== "V" && (
        <div className="space-y-1">
          <Label className="flex justify-between text-xs">
            <span>Voltage (V)</span>
            <span className="font-mono text-yellow-400">{voltage} V</span>
          </Label>
          <Slider min={0.01} max={1000} step={0.01} value={[voltage]} onValueChange={([v]) => setVoltage(v)} />
        </div>
      )}

      {solve !== "I" && (
        <div className="space-y-1">
          <Label className="flex justify-between text-xs">
            <span>Current (A)</span>
            <span className="font-mono text-yellow-400">{current.toFixed(4)} A</span>
          </Label>
          <Slider min={0.0001} max={10} step={0.0001} value={[current]} onValueChange={([v]) => setCurrent(v)} />
        </div>
      )}

      {solve !== "R" && (
        <div className="space-y-1">
          <Label className="flex justify-between text-xs">
            <span>Resistance (Ω)</span>
            <span className="font-mono text-yellow-400">{resistance} Ω</span>
          </Label>
          <Slider min={0.01} max={100000} step={0.01} value={[resistance]} onValueChange={([v]) => setResistance(v)} />
        </div>
      )}

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Time (for energy calc)</span>
          <span className="font-mono text-yellow-400">{time} s</span>
        </Label>
        <Slider min={0.001} max={3600} step={0.001} value={[time]} onValueChange={([v]) => setTime(v)} />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleRun} disabled={isLoading}>
          <PlayCircle className="w-4 h-4 mr-2" />
          {isLoading ? "Solving…" : "Solve Circuit"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} disabled={isLoading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
