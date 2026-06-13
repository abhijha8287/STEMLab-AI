"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { SeriesParallelResult } from "@/types/circuit";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a78bfa", "#f43f5e", "#fbbf24"];

export function SeriesParallelGraphs({ result }: { result: SeriesParallelResult }) {
  const axisStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };
  const chartClass = "rounded-xl border bg-card p-3";

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Voltage drops (V)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={result.voltage_drops} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [v.toFixed(4) + " V", "Voltage"]} />
            <Bar dataKey="value" radius={4}>
              {result.voltage_drops.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Power dissipation (W)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={result.power_dist} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [v.toFixed(4) + " W", "Power"]} />
            <Bar dataKey="value" radius={4}>
              {result.power_dist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
