"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle, RotateCcw } from "lucide-react";
import type { PendulumRequest } from "@/types/physics";

interface PendulumControlsProps {
  onRun: (params: PendulumRequest) => void;
  isLoading: boolean;
}

export function PendulumControls({ onRun, isLoading }: PendulumControlsProps) {
  const [length, setLength] = useState(1.0);
  const [mass, setMass] = useState(0.5);
  const [angle, setAngle] = useState(30);
  const [gravity, setGravity] = useState(9.81);

  const handleRun = () => onRun({ length, mass, initial_angle: angle, gravity });
  const handleReset = () => { setLength(1.0); setMass(0.5); setAngle(30); setGravity(9.81); };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Controls</h3>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>String Length</span>
          <span className="font-mono text-primary">{length.toFixed(2)} m</span>
        </Label>
        <Slider min={0.1} max={10} step={0.1} value={[length]} onValueChange={([v]) => setLength(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Bob Mass</span>
          <span className="font-mono text-primary">{mass.toFixed(2)} kg</span>
        </Label>
        <Slider min={0.01} max={10} step={0.01} value={[mass]} onValueChange={([v]) => setMass(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Initial Angle</span>
          <span className="font-mono text-primary">{angle}°</span>
        </Label>
        <Slider min={1} max={89} step={1} value={[angle]} onValueChange={([v]) => setAngle(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Gravity</span>
          <span className="font-mono text-primary">{gravity.toFixed(2)} m/s²</span>
        </Label>
        <Slider min={1} max={25} step={0.01} value={[gravity]} onValueChange={([v]) => setGravity(v)} />
        <p className="text-[10px] text-muted-foreground">Earth=9.81 | Moon=1.62 | Mars=3.72</p>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleRun} disabled={isLoading}>
          <PlayCircle className="w-4 h-4 mr-2" />
          {isLoading ? "Simulating…" : "Release Pendulum"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} disabled={isLoading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
