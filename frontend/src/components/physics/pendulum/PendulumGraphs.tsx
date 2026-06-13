"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { PendulumResult } from "@/types/physics";

interface PendulumGraphsProps {
  result: PendulumResult;
}

export function PendulumGraphs({ result }: PendulumGraphsProps) {
  const angleData = result.angle_series.map((p, i) => ({
    t: parseFloat(p[0].toFixed(2)),
    angle: parseFloat(p[1].toFixed(3)),
    omega: parseFloat((result.angular_velocity_series[i]?.[1] ?? 0).toFixed(3)),
  }));

  const energyData = result.energy_series.map((p) => ({
    t: parseFloat(p[0].toFixed(2)),
    ke: parseFloat(p[1].toFixed(4)),
  }));

  const axisStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };
  const chartClass = "rounded-xl border bg-card p-3";

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Angle over time (degrees)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={angleData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" tick={axisStyle} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="angle" stroke="#3b82f6" dot={false} strokeWidth={2} name="θ (°)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Kinetic Energy over time (J)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={energyData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" tick={axisStyle} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="ke" stroke="#f59e0b" dot={false} strokeWidth={2} name="KE (J)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
