"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Atom, FlaskConical, Calculator, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  {
    icon: Atom,
    subject: "Physics",
    color: "from-blue-600 to-indigo-700",
    bg: "bg-blue-950/40",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    topics: ["Kinematics", "Forces", "Energy", "Waves", "Electricity"],
    experiments: 3,
    href: "/physics",
    description: "Explore mechanics, energy, and waves through interactive simulations with real-time 3D visualization.",
  },
  {
    icon: FlaskConical,
    subject: "Chemistry",
    color: "from-emerald-600 to-teal-700",
    bg: "bg-emerald-950/40",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    topics: ["Atoms", "Molecules", "Reactions", "Acids & Bases", "pH Scale"],
    experiments: 0,
    href: "/concept-explorer",
    description: "Understand atomic structure, chemical reactions, and molecular interactions through AI explanations.",
  },
  {
    icon: Calculator,
    subject: "Mathematics",
    color: "from-violet-600 to-purple-700",
    bg: "bg-violet-950/40",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    topics: ["Algebra", "Calculus", "Geometry", "Statistics", "Vectors"],
    experiments: 0,
    href: "/concept-explorer",
    description: "Master core mathematical concepts and see how they connect to real-world physics and chemistry.",
  },
];

export function ScienceCategories() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="px-4 py-20" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Science Subjects</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Explore All STEM Disciplines</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Comprehensive coverage of Physics, Chemistry, and Mathematics with AI explanations
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.subject}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Link href={cat.href}>
                <div className={`group relative rounded-2xl border ${cat.border} ${cat.bg} p-6 h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200`}>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className={`inline-flex items-center justify-center rounded-xl p-3 bg-gradient-to-br ${cat.color} mb-4 shadow-lg`}>
                    <cat.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{cat.subject}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.topics.map((t) => (
                      <span
                        key={t}
                        className={`text-xs px-2 py-0.5 rounded-full border ${cat.badge}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cat.experiments > 0 ? `${cat.experiments} interactive experiments` : "Concept explorer"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
