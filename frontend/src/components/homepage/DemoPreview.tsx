"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";

// Animated trajectory path — simplified projectile arc
function TrajectoryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctrl = animate(0, 1, {
      duration: 2.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1,
      onUpdate: setProgress,
    });
    return () => ctrl.stop();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(99,102,241,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Ground
    ctx.strokeStyle = "rgba(99,102,241,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(20, H - 20); ctx.lineTo(W - 20, H - 20); ctx.stroke();

    // Parabola parameters
    const x0 = 30, y0 = H - 20;
    const totalX = W - 60;
    const peakY = H - 20 - (H - 60);
    const midX = x0 + totalX / 2;

    // Draw full ghost path
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(99,102,241,0.2)";
    ctx.lineWidth = 2;
    for (let t = 0; t <= 1; t += 0.01) {
      const px = x0 + t * totalX;
      const py = y0 + 4 * (peakY - y0) * (t - 0.5) ** 2 - (peakY - y0);
      t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw animated solid path
    const grad = ctx.createLinearGradient(x0, 0, x0 + totalX, 0);
    grad.addColorStop(0, "#6366f1");
    grad.addColorStop(1, "#8b5cf6");
    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    for (let t = 0; t <= progress; t += 0.005) {
      const px = x0 + t * totalX;
      const py = y0 + 4 * (peakY - y0) * (t - 0.5) ** 2 - (peakY - y0);
      t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Ball at current position
    if (progress > 0) {
      const t = progress;
      const bx = x0 + t * totalX;
      const by = y0 + 4 * (peakY - y0) * (t - 0.5) ** 2 - (peakY - y0);
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#6366f1";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx, by, 10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99,102,241,0.2)";
      ctx.fill();
    }

    // Launch point
    ctx.beginPath();
    ctx.arc(x0, y0, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#10b981";
    ctx.fill();

    // Angle arc
    ctx.beginPath();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.arc(x0, y0, 24, -Math.PI / 4, 0);
    ctx.stroke();
    ctx.fillStyle = "#10b981";
    ctx.font = "11px monospace";
    ctx.fillText("45°", x0 + 28, y0 - 6);
  }, [progress]);

  return <canvas ref={canvasRef} width={460} height={220} className="w-full max-w-lg" />;
}

const METRICS = [
  { label: "Range",       value: "63.7 m" },
  { label: "Max Height",  value: "15.9 m" },
  { label: "Flight Time", value: "3.61 s" },
];

export function DemoPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="px-4 py-20 bg-muted/20" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Live Simulation Preview</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Watch Physics in Action</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Real-time simulations with accurate equations. Adjust parameters and see results instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Canvas preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="rounded-2xl border bg-card p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">projectile_motion.sim</span>
            </div>
            <TrajectoryCanvas />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {METRICS.map((m) => (
                <div key={m.label} className="rounded-lg bg-muted/60 px-2 py-1.5 text-center">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-sm font-bold font-mono text-primary">{m.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h3 className="text-xl font-bold mb-2">Projectile Motion Simulator</h3>
              <p className="text-muted-foreground">
                Watch a ball follow a perfect parabolic arc. Adjust initial velocity, launch angle,
                gravity, and air resistance — the simulation updates in real time using Euler integration.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Initial Velocity", value: "25 m/s",  color: "bg-blue-500" },
                { label: "Launch Angle",     value: "45°",     color: "bg-indigo-500" },
                { label: "Gravity",          value: "9.81 m/s²", color: "bg-purple-500" },
              ].map((param) => (
                <div key={param.label} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${param.color}`} />
                  <span className="text-sm text-muted-foreground w-32">{param.label}</span>
                  <code className="text-sm font-mono text-foreground">{param.value}</code>
                </div>
              ))}
            </div>

            <Button className="w-fit" asChild>
              <Link href="/physics/projectile-motion">
                <Play className="mr-2 h-4 w-4" /> Try it yourself <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
