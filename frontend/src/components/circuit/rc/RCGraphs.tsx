"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend,
} from "recharts";
import type { RCResult } from "@/types/circuit";

export function RCGraphs({ result }: { result: RCResult }) {
  const data = result.time_series.map(([t, vc, ic]) => ({
    t: parseFloat(t.toFixed(5)),
    vc: parseFloat(vc.toFixed(5)),
    ic: parseFloat((ic * 1000).toFixed(5)), // mA
  }));

  const tau = result.time_constant;
  const axisStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 10 };
  const chartClass = "rounded-xl border bg-card p-3";

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Capacitor voltage Vc(t)</p>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={data} margin={{ left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" tick={axisStyle} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
              formatter={(v: number) => [v.toFixed(4) + " V", "Vc"]} labelFormatter={(v) => `t = ${v} s`} />
            <ReferenceLine x={tau} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: "τ", fill: "#fbbf24", fontSize: 11 }} />
            <Line type="monotone" dataKey="vc" stroke="#60a5fa" dot={false} strokeWidth={2.5} name="Vc (V)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={chartClass}>
        <p className="text-xs font-medium text-muted-foreground mb-2">Charging current Ic(t) (mA)</p>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={data} margin={{ left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" tick={axisStyle} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, style: axisStyle }} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
              formatter={(v: number) => [v.toFixed(4) + " mA", "Ic"]} labelFormatter={(v) => `t = ${v} s`} />
            <ReferenceLine x={tau} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: "τ", fill: "#fbbf24", fontSize: 11 }} />
            <Line type="monotone" dataKey="ic" stroke="#f97316" dot={false} strokeWidth={2.5} name="Ic (mA)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
