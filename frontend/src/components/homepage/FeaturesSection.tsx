"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Atom, Zap, Bot, Brain, BookOpen, FlaskConical, BarChart3, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  { icon: Atom,         title: "Physics Laboratory",    description: "Simulate projectile motion, Newton's laws, and pendulum dynamics with real-time 3D visualizations and accurate physics engines.", href: "/physics",          badge: "3 Experiments",      color: "bg-blue-500/10 text-blue-500" },
  { icon: Zap,          title: "Circuit Laboratory",    description: "Build drag-and-drop circuits, simulate current flow with Modified Nodal Analysis, and calculate V, I, R, and power.",           href: "/circuits",         badge: "Drag & Drop",        color: "bg-yellow-500/10 text-yellow-500" },
  { icon: Bot,          title: "AI STEM Instructor",    description: "Chat with a Gemini-powered AI tutor that explains concepts, analyzes your results, and suggests experiments in real time.",     href: "/ai-instructor",    badge: "Streaming AI",       color: "bg-purple-500/10 text-purple-500" },
  { icon: Brain,        title: "Knowledge Gap Detector",description: "AI analyzes your experiments and quiz history to find weak areas, missing prerequisites, and builds a personalized roadmap.", href: "/knowledge-gaps",   badge: "Smart Analysis",     color: "bg-red-500/10 text-red-500" },
  { icon: BookOpen,     title: "Quiz Generator",        description: "Generate AI-powered quizzes on any STEM topic with MCQ, numerical, and conceptual questions at 3 difficulty levels.",          href: "/quiz",             badge: "Gemini Generated",   color: "bg-green-500/10 text-green-500" },
  { icon: FlaskConical, title: "Lab Report Generator",  description: "Automatically generate complete lab reports from your experiment results with AI-written sections and PDF export.",            href: "/reports",          badge: "PDF Export",         color: "bg-orange-500/10 text-orange-500" },
  { icon: BarChart3,    title: "Progress Analytics",    description: "Track your learning with charts for experiment usage, quiz score trends, topic mastery, and knowledge growth over time.",       href: "/analytics",        badge: "Real-time Data",     color: "bg-indigo-500/10 text-indigo-500" },
  { icon: Target,       title: "Concept Explorer",      description: "Visual knowledge graph of 46 STEM concepts with AI explanations, prerequisite chains, and relationship visualization.",        href: "/concept-explorer", badge: "46 Concepts",        color: "bg-pink-500/10 text-pink-500" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="px-4 py-20 bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Complete STEM Platform</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Everything You Need to Learn STEM</h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            A full virtual laboratory with AI-powered tools — no installation, no fees
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((f) => (
            <motion.div key={f.href} variants={cardVariant}>
              <Link href={f.href}>
                <Card className="h-full cursor-pointer group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`rounded-lg p-2 ${f.color}`}>
                        <f.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">{f.badge}</Badge>
                    </div>
                    <CardTitle className="text-sm leading-snug group-hover:text-primary transition-colors">
                      {f.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs leading-relaxed">{f.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
