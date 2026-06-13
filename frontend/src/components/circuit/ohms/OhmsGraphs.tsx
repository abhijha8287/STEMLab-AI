"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { OhmsResult } from "@/types/circuit";

export function OhmsGraphs({ result }: { result: OhmsResult }) {
  const data = result.iv_curve.map(([v, i]) => ({
    v: parseFloat(v.toFixed(3)),
    i: parseFloat(i.toFixed(6)),
  }));

  const axisStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };

  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-xs font-medium text-muted-foreground mb-2">I–V Characteristic (constant R = {result.resistance.toFixed(2)} Ω)</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="v" tick={axisStyle} label={{ value: "Voltage (V)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
          <YAxis tick={axisStyle} label={{ value: "Current (A)", angle: -90, position: "insideLeft", style: axisStyle }} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
            formatter={(v: number) => [v.toFixed(6) + " A", "Current"]}
            labelFormatter={(v) => `V = ${v} V`}
          />
          <Line type="monotone" dataKey="i" stroke="#fbbf24" dot={false} strokeWidth={2.5} name="I (A)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
