"use client";

import { type LucideIcon, Construction } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils/cn";

interface Feature {
  icon: LucideIcon;
  label: string;
}

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  phase: string;
  description: string;
  features: Feature[];
  color: "yellow" | "blue" | "purple" | "red" | "green" | "orange" | "indigo" | "slate";
}

const colorMap: Record<ComingSoonProps["color"], { bg: string; border: string; text: string; badge: string }> = {
  yellow:  { bg: "from-yellow-500/10 to-amber-500/5",   border: "border-yellow-500/20",  text: "text-yellow-400",  badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  blue:    { bg: "from-blue-500/10 to-indigo-500/5",    border: "border-blue-500/20",    text: "text-blue-400",    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  purple:  { bg: "from-purple-500/10 to-violet-500/5",  border: "border-purple-500/20",  text: "text-purple-400",  badge: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  red:     { bg: "from-red-500/10 to-rose-500/5",       border: "border-red-500/20",     text: "text-red-400",     badge: "bg-red-500/10 text-red-400 border-red-500/30" },
  green:   { bg: "from-green-500/10 to-emerald-500/5",  border: "border-green-500/20",   text: "text-green-400",   badge: "bg-green-500/10 text-green-400 border-green-500/30" },
  orange:  { bg: "from-orange-500/10 to-red-500/5",     border: "border-orange-500/20",  text: "text-orange-400",  badge: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  indigo:  { bg: "from-indigo-500/10 to-blue-500/5",    border: "border-indigo-500/20",  text: "text-indigo-400",  badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
  slate:   { bg: "from-slate-500/10 to-gray-500/5",     border: "border-slate-500/20",   text: "text-slate-400",   badge: "bg-slate-500/10 text-slate-400 border-slate-500/30" },
};

export function ComingSoon({ icon: Icon, title, phase, description, features, color }: ComingSoonProps) {
  const c = colorMap[color];

  return (
    <AppShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* Card */}
          <div className={cn("rounded-2xl border bg-gradient-to-br p-8", c.bg, c.border)}>
            {/* Phase badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", c.badge)}>
                {phase}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border">
                Coming Soon
              </span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center bg-background/60 border", c.border, c.text)}>
                <Icon className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8">{description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="flex items-center gap-2.5 rounded-lg border bg-background/40 px-3 py-2.5"
                >
                  <f.icon className={cn("w-4 h-4 shrink-0", c.text)} />
                  <span className="text-xs text-muted-foreground leading-snug">{f.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Under construction notice */}
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/50 border px-3 py-2.5">
              <Construction className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                This feature is being built. Physics Lab is ready now — try it from the sidebar.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
