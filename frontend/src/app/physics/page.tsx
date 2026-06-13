"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Weight, Activity } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const experiments = [
  {
    href: "/physics/projectile-motion",
    icon: Rocket,
    title: "Projectile Motion",
    description: "Launch a projectile at any angle and speed. Visualize the parabolic trajectory with optional air resistance.",
    tags: ["Kinematics", "Euler Integration", "Drag"],
    color: "from-blue-500/20 to-indigo-500/10",
    border: "hover:border-blue-500/50",
    iconColor: "text-blue-400",
  },
  {
    href: "/physics/newtons-laws",
    icon: Weight,
    title: "Newton's Second Law",
    description: "Apply force to a block on a surface with adjustable friction. Observe F = ma in action.",
    tags: ["Dynamics", "Friction", "F=ma"],
    color: "from-green-500/20 to-emerald-500/10",
    border: "hover:border-green-500/50",
    iconColor: "text-green-400",
  },
  {
    href: "/physics/pendulum",
    icon: Activity,
    title: "Simple Pendulum",
    description: "Simulate pendulum motion using RK4 integration. Explore period, frequency, and energy transfer.",
    tags: ["SHM", "RK4 Solver", "Energy"],
    color: "from-amber-500/20 to-orange-500/10",
    border: "hover:border-amber-500/50",
    iconColor: "text-amber-400",
  },
];

export default function PhysicsPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Physics Laboratory</h1>
          <p className="text-muted-foreground mt-1.5 text-base">
            Run physics simulations backed by real numerical solvers. Results are saved to your session.
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
                <div
                  className={`h-full rounded-xl border bg-gradient-to-br ${exp.color} ${exp.border} p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
                >
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
