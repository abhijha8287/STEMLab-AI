"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { TrajectoryPoint } from "@/types/physics";

interface ProjectileGraphsProps {
  trajectory: TrajectoryPoint[];
  velocityXSeries: [number, number][];
  velocityYSeries: [number, number][];
}

export function ProjectileGraphs({ trajectory, velocityXSeries, velocityYSeries }: ProjectileGraphsProps) {
  if (trajectory.length === 0) return null;

  const trajectoryData = trajectory.map((p) => ({ x: parseFloat(p.x.toFixed(1)), y: parseFloat(p.y.toFixed(1)) }));
  const velocityData = velocityXSeries.map((vx, i) => ({
    t: parseFloat(vx[0].toFixed(2)),
    vx: parseFloat(vx[1].toFixed(2)),
    vy: parseFloat((velocityYSeries[i]?.[1] ?? 0).toFixed(2)),
  }));

  const chartClass = "rounded-xl border bg-card p-3";
  const axisStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Trajectory (y vs x)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trajectoryData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" tick={axisStyle} label={{ value: "x (m)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis dataKey="y" tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} labelFormatter={(v) => `x = ${v} m`} />
            <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={2} name="Height (m)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Velocity components (m/s)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={velocityData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" tick={axisStyle} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} labelFormatter={(v) => `t = ${v} s`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="vx" stroke="#22c55e" dot={false} strokeWidth={2} name="vx (m/s)" />
            <Line type="monotone" dataKey="vy" stroke="#ef4444" dot={false} strokeWidth={2} name="vy (m/s)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
