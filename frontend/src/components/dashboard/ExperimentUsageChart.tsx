"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperimentUsage } from "@/lib/api/analytics";

const LABELS: Record<string, string> = {
  projectile_motion: "Projectile",
  newtons_laws: "Newton's",
  pendulum: "Pendulum",
  circuit: "Circuit",
};
const COLORS: Record<string, string> = {
  projectile_motion: "#3b82f6",
  newtons_laws: "#8b5cf6",
  pendulum: "#10b981",
  circuit: "#f59e0b",
};

interface Props {
  data: ExperimentUsage | undefined;
}

export function ExperimentUsageChart({ data }: Props) {
  const ALL_TYPES = ["projectile_motion", "newtons_laws", "pendulum", "circuit"];
  const chartData = ALL_TYPES.map((type) => ({
    name: LABELS[type],
    type,
    count: data?.by_type[type] ?? 0,
  }));

  const hasData = chartData.some((d) => d.count > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Experiments by Type</CardTitle>
        <p className="text-xs text-muted-foreground">All time</p>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">
            Run experiments to see usage statistics
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.type} fill={COLORS[entry.type]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
