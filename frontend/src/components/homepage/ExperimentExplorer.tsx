"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Target, Waves, Zap, Hand, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EXPERIMENTS = [
  {
    href: "/physics/projectile-motion",
    icon: Target,
    title: "Projectile Motion",
    subject: "Physics",
    difficulty: "Intermediate",
    description: "Launch projectiles and analyze parabolic trajectories. Control velocity, angle, gravity, and drag.",
    controls: ["Initial Velocity", "Launch Angle", "Gravity", "Air Resistance"],
    outputs: ["Flight Time", "Max Height", "Horizontal Range"],
    color: "border-blue-500/20 hover:border-blue-500/40",
    iconBg: "bg-blue-500/10 text-blue-500",
    badge: "Physics",
  },
  {
    href: "/physics/newtons-laws",
    icon: Hand,
    title: "Newton's Laws",
    subject: "Physics",
    difficulty: "Beginner",
    description: "Apply forces to masses and observe acceleration, friction effects, and velocity profiles.",
    controls: ["Applied Force", "Object Mass", "Friction Coefficient"],
    outputs: ["Net Force", "Acceleration", "Final Velocity"],
    color: "border-indigo-500/20 hover:border-indigo-500/40",
    iconBg: "bg-indigo-500/10 text-indigo-500",
    badge: "Physics",
  },
  {
    href: "/physics/pendulum",
    icon: Waves,
    title: "Pendulum Simulation",
    subject: "Physics",
    difficulty: "Intermediate",
    description: "Swing a pendulum and measure period, frequency, and energy exchange using RK4 ODE solving.",
    controls: ["String Length", "Bob Mass", "Initial Angle", "Gravity"],
    outputs: ["Period", "Frequency", "Max Velocity"],
    color: "border-purple-500/20 hover:border-purple-500/40",
    iconBg: "bg-purple-500/10 text-purple-500",
    badge: "Physics",
  },
  {
    href: "/circuits",
    icon: Zap,
    title: "Circuit Builder",
    subject: "Physics",
    difficulty: "Intermediate",
    description: "Drag and drop components to build circuits. Simulate current flow using Modified Nodal Analysis.",
    controls: ["Battery", "Resistors", "LEDs", "Switches", "Capacitors"],
    outputs: ["Total Voltage", "Total Current", "Power Dissipation"],
    color: "border-yellow-500/20 hover:border-yellow-500/40",
    iconBg: "bg-yellow-500/10 text-yellow-500",
    badge: "Circuits",
  },
];

export function ExperimentExplorer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="px-4 py-20" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Interactive Experiments</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">4 Fully Interactive Experiments</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Each experiment uses real physics engines — not demos. Results are stored, can be compared, and generate AI-powered lab reports.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.href}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={exp.href}>
                <div className={`group rounded-2xl border p-5 h-full cursor-pointer transition-all duration-200 hover:shadow-md bg-card ${exp.color}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`rounded-lg p-2 ${exp.iconBg}`}>
                      <exp.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{exp.title}</h3>
                        <Badge variant="secondary" className="text-xs">{exp.badge}</Badge>
                        <Badge variant="outline" className="text-xs">{exp.difficulty}</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-medium text-muted-foreground mb-1.5">Controls</p>
                      <ul className="space-y-1">
                        {exp.controls.map((c) => (
                          <li key={c} className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-primary/60" />{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-1.5">Outputs</p>
                      <ul className="space-y-1">
                        {exp.outputs.map((o) => (
                          <li key={o} className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-green-500/60" />{o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-xs text-primary font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open experiment <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/physics">View All Experiments <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
