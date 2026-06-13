"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Atom, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="px-4 py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-border" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
          Ready to Start<br />
          <span className="gradient-text">Learning STEM?</span>
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          No registration. No fees. Open your browser and start experimenting right now.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button size="lg" className="text-base h-12 px-6" asChild>
            <Link href="/physics">
              <Atom className="mr-2 h-5 w-5" /> Open Physics Lab
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base h-12 px-6" asChild>
            <Link href="/circuits">
              <Zap className="mr-2 h-5 w-5" /> Open Circuit Lab
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base h-12 px-6" asChild>
            <Link href="/ai-instructor">
              <Bot className="mr-2 h-5 w-5" /> Chat with AI
            </Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          Or start with the{" "}
          <Link href="/dashboard" className="text-primary hover:underline">
            Dashboard →
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}
