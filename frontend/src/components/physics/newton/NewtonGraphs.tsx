"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { NewtonResult } from "@/types/physics";

interface NewtonGraphsProps {
  result: NewtonResult;
}

export function NewtonGraphs({ result }: NewtonGraphsProps) {
  const motionData = result.velocity_series.map((v, i) => ({
    t: parseFloat(v[0].toFixed(2)),
    velocity: parseFloat(v[1].toFixed(3)),
    position: parseFloat((result.position_series[i]?.[1] ?? 0).toFixed(3)),
  }));

  const axisStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };
  const chartClass = "rounded-xl border bg-card p-3";

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Velocity over time (m/s)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={motionData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" tick={axisStyle} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="velocity" stroke="#22c55e" dot={false} strokeWidth={2} name="v (m/s)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Position over time (m)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={motionData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" tick={axisStyle} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="position" stroke="#a78bfa" dot={false} strokeWidth={2} name="x (m)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
