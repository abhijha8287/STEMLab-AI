"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

interface ResultsSummaryProps {
  title?: string;
  metrics: Metric[];
  className?: string;
}

export function ResultsSummary({ title = "Results", metrics, className }: ResultsSummaryProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "rounded-lg p-2.5 bg-muted/50",
              m.highlight && "bg-primary/10 border border-primary/20"
            )}
          >
            <p className="text-xs text-muted-foreground leading-tight">{m.label}</p>
            <p className={cn("text-lg font-bold mt-0.5", m.highlight && "text-primary")}>
              {typeof m.value === "number" ? m.value.toFixed(3) : m.value}
              {m.unit && <span className="text-xs font-normal text-muted-foreground ml-1">{m.unit}</span>}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
