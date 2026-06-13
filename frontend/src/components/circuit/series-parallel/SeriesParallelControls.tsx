"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle, RotateCcw, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SeriesParallelRequest, Topology } from "@/types/circuit";

interface SeriesParallelControlsProps {
  onRun: (p: SeriesParallelRequest) => void;
  isLoading: boolean;
}

const TOPOLOGY_LABELS: Record<Topology, string> = {
  series: "Series",
  parallel: "Parallel",
  series_parallel: "Mixed",
};

export function SeriesParallelControls({ onRun, isLoading }: SeriesParallelControlsProps) {
  const [topology, setTopology] = useState<Topology>("series");
  const [voltage, setVoltage] = useState(12);
  const [resistors, setResistors] = useState([100, 200, 300]);

  const addResistor = () => {
    if (resistors.length < 6) setResistors([...resistors, 100]);
  };
  const removeResistor = () => {
    if (resistors.length > 1) setResistors(resistors.slice(0, -1));
  };
  const updateR = (i: number, v: number) => {
    const next = [...resistors]; next[i] = v; setResistors(next);
  };

  const handleRun = () => onRun({ resistances: resistors, supply_voltage: voltage, topology });
  const handleReset = () => { setVoltage(12); setResistors([100, 200, 300]); setTopology("series"); };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Controls</h3>

      {/* Topology */}
      <div>
        <Label className="text-xs mb-2 block">Topology</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(TOPOLOGY_LABELS) as Topology[]).map((t) => (
            <button
              key={t}
              onClick={() => setTopology(t)}
              className={cn(
                "rounded-md py-1.5 text-xs font-semibold border transition-colors",
                topology === t
                  ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {TOPOLOGY_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Supply voltage */}
      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Supply Voltage</span>
          <span className="font-mono text-yellow-400">{voltage} V</span>
        </Label>
        <Slider min={0.1} max={1000} step={0.1} value={[voltage]} onValueChange={([v]) => setVoltage(v)} />
      </div>

      {/* Resistors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Resistors ({resistors.length})</Label>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-6 w-6" onClick={removeResistor} disabled={resistors.length <= 1}>
              <Minus className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6" onClick={addResistor} disabled={resistors.length >= 6}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {resistors.map((r, i) => (
          <div key={i} className="space-y-1">
            <Label className="flex justify-between text-xs">
              <span>R{i + 1}</span>
              <span className="font-mono text-yellow-400">{r >= 1000 ? (r / 1000).toFixed(1) + " kΩ" : r + " Ω"}</span>
            </Label>
            <Slider min={1} max={100000} step={1} value={[r]} onValueChange={([v]) => updateR(i, v)} />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleRun} disabled={isLoading}>
          <PlayCircle className="w-4 h-4 mr-2" />
          {isLoading ? "Solving…" : "Solve Network"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} disabled={isLoading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
