"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, GitBranch, Activity } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const experiments = [
  {
    href: "/circuits/ohms-law",
    icon: Zap,
    title: "Ohm's Law",
    description: "Solve for voltage, current, or resistance given two knowns. Visualise the live I-V characteristic and power dissipation.",
    tags: ["V = IR", "Power", "I-V Curve"],
    color: "from-yellow-500/20 to-amber-500/10",
    border: "hover:border-yellow-500/50",
    iconColor: "text-yellow-400",
  },
  {
    href: "/circuits/series-parallel",
    icon: GitBranch,
    title: "Series & Parallel",
    description: "Build up to 6-resistor networks in series, parallel, or mixed topology. See voltage drops, branch currents, and power splits.",
    tags: ["KVL", "KCL", "Equivalent R"],
    color: "from-blue-500/20 to-indigo-500/10",
    border: "hover:border-blue-500/50",
    iconColor: "text-blue-400",
  },
  {
    href: "/circuits/rc-circuit",
    icon: Activity,
    title: "RC Circuit",
    description: "Watch a capacitor charge and discharge through a resistor. Explore the time constant τ = RC, exponential curves, and stored energy.",
    tags: ["τ = RC", "Charging", "Discharging"],
    color: "from-purple-500/20 to-violet-500/10",
    border: "hover:border-purple-500/50",
    iconColor: "text-purple-400",
  },
];

export default function CircuitsPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Circuit Laboratory</h1>
          <p className="text-muted-foreground mt-1.5 text-base">
            Solve real circuits with analytical engines. Every experiment is saved to your session.
          </p>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {experiments.map((exp, i) => (
            <motion.div
              key={exp.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={exp.href} className="block h-full">
                <div className={`h-full rounded-xl border bg-gradient-to-br ${exp.color} ${exp.border} p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-background/50 mb-4 ${exp.iconColor}`}>
                    <exp.icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold text-base">{exp.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{exp.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-background/60 text-muted-foreground border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
