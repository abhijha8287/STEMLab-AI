"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  description?: string;
  format?: "number" | "percent" | "decimal";
}

function AnimatedCount({ value, format = "number" }: { value: number; format?: string }) {
  const motionValue = useMotionValue(0);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctrl = animate(motionValue, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (!displayRef.current) return;
        if (format === "percent") {
          displayRef.current.textContent = v.toFixed(1) + "%";
        } else if (format === "decimal") {
          displayRef.current.textContent = v.toFixed(1);
        } else {
          displayRef.current.textContent = Math.round(v).toString();
        }
      },
    });
    return ctrl.stop;
  }, [value, format, motionValue]);

  const initial =
    format === "percent" ? "0.0%" : format === "decimal" ? "0.0" : "0";

  return <span ref={displayRef}>{initial}</span>;
}

export function StatsCard({ label, value, icon: Icon, color = "text-primary", description, format = "number" }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {label}
              </p>
              <p className={cn("text-2xl font-bold mt-1 tabular-nums", color)}>
                <AnimatedCount value={value} format={format} />
              </p>
              {description && (
                <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
              )}
            </div>
            <div className={cn("rounded-lg p-2 bg-current/10 group-hover:bg-current/15 transition-colors shrink-0", color)}>
              <Icon className={cn("h-5 w-5", color)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
