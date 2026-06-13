"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Atom, Zap, Brain, FlaskConical, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FLOATING = [
  { Icon: Atom,         x: "8%",  y: "20%", delay: 0,    size: 32, opacity: 0.15 },
  { Icon: Zap,          x: "88%", y: "15%", delay: 0.4,  size: 28, opacity: 0.12 },
  { Icon: Brain,        x: "80%", y: "72%", delay: 0.8,  size: 36, opacity: 0.14 },
  { Icon: FlaskConical, x: "5%",  y: "75%", delay: 1.2,  size: 30, opacity: 0.11 },
  { Icon: Activity,     x: "50%", y: "8%",  delay: 0.6,  size: 26, opacity: 0.10 },
  { Icon: Target,       x: "92%", y: "45%", delay: 1.0,  size: 24, opacity: 0.12 },
];

const STAT_ITEMS = [
  { value: "3",  label: "Physics Experiments" },
  { value: "5+", label: "Circuit Components" },
  { value: "46", label: "STEM Concepts" },
  { value: "∞",  label: "AI Conversations" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating icons */}
      {FLOATING.map(({ Icon, x, y, delay, size, opacity }) => (
        <motion.div
          key={`${x}-${y}`}
          className="absolute text-white pointer-events-none"
          style={{ left: x, top: y, opacity }}
          animate={{ y: [0, -16, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5 + delay, repeat: Infinity, repeatType: "loop", delay, ease: "easeInOut" }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6"
      >
        <motion.div variants={item}>
          <Badge className="border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20">
            Powered by Gemini AI · No login required
          </Badge>
        </motion.div>

        <motion.h1 variants={item} className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
          Your AI-Powered<br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            STEM Virtual Lab
          </span>
        </motion.h1>

        <motion.p variants={item} className="max-w-2xl text-lg text-slate-300 leading-relaxed">
          Perform physics experiments, build circuits, and get instant AI guidance — all in your browser.
          No equipment, no login, no limits.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40" asChild>
            <Link href="/physics">
              Start Physics Lab <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white" asChild>
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
          <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/circuits">Build Circuits</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl">
          {STAT_ITEMS.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-slate-500 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-slate-400" />
        </div>
      </motion.div>
    </section>
  );
}
