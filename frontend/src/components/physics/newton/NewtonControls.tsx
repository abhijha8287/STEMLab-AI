"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle, RotateCcw } from "lucide-react";
import type { NewtonRequest } from "@/types/physics";

interface NewtonControlsProps {
  onRun: (params: NewtonRequest) => void;
  isLoading: boolean;
}

export function NewtonControls({ onRun, isLoading }: NewtonControlsProps) {
  const [force, setForce] = useState(50);
  const [mass, setMass] = useState(10);
  const [friction, setFriction] = useState(0.2);
  const [duration, setDuration] = useState(5);

  const handleRun = () => onRun({ force, mass, friction_coefficient: friction, duration });
  const handleReset = () => { setForce(50); setMass(10); setFriction(0.2); setDuration(5); };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Controls</h3>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Applied Force</span>
          <span className="font-mono text-primary">{force} N</span>
        </Label>
        <Slider min={0.1} max={1000} step={0.1} value={[force]} onValueChange={([v]) => setForce(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Mass</span>
          <span className="font-mono text-primary">{mass} kg</span>
        </Label>
        <Slider min={0.1} max={500} step={0.1} value={[mass]} onValueChange={([v]) => setMass(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Friction Coefficient (μ)</span>
          <span className="font-mono text-primary">{friction.toFixed(2)}</span>
        </Label>
        <Slider min={0} max={1} step={0.01} value={[friction]} onValueChange={([v]) => setFriction(v)} />
        <p className="text-[10px] text-muted-foreground">Ice≈0.03 | Rubber≈0.8</p>
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Duration</span>
          <span className="font-mono text-primary">{duration} s</span>
        </Label>
        <Slider min={1} max={30} step={1} value={[duration]} onValueChange={([v]) => setDuration(v)} />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleRun} disabled={isLoading}>
          <PlayCircle className="w-4 h-4 mr-2" />
          {isLoading ? "Simulating…" : "Apply Force"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} disabled={isLoading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
