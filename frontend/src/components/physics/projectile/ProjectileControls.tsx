"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle, RotateCcw } from "lucide-react";
import type { ProjectileRequest } from "@/types/physics";

interface ProjectileControlsProps {
  onRun: (params: ProjectileRequest) => void;
  isLoading: boolean;
}

export function ProjectileControls({ onRun, isLoading }: ProjectileControlsProps) {
  const [velocity, setVelocity] = useState(30);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.81);
  const [drag, setDrag] = useState(0);

  const handleRun = () => {
    onRun({
      initial_velocity: velocity,
      launch_angle: angle,
      gravity,
      air_resistance: drag,
    });
  };

  const handleReset = () => {
    setVelocity(30);
    setAngle(45);
    setGravity(9.81);
    setDrag(0);
  };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Controls</h3>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Initial Velocity</span>
          <span className="font-mono text-primary">{velocity} m/s</span>
        </Label>
        <Slider min={1} max={200} step={1} value={[velocity]} onValueChange={([v]) => setVelocity(v)} />
      </div>

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Launch Angle</span>
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

      <div className="space-y-1">
        <Label className="flex justify-between text-xs">
          <span>Air Resistance</span>
          <span className="font-mono text-primary">{drag.toFixed(2)}</span>
        </Label>
        <Slider min={0} max={1} step={0.01} value={[drag]} onValueChange={([v]) => setDrag(v)} />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleRun} disabled={isLoading}>
          <PlayCircle className="w-4 h-4 mr-2" />
          {isLoading ? "Simulating…" : "Launch"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} disabled={isLoading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
