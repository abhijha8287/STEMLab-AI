"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { TrajectoryPoint } from "@/types/physics";

interface ProjectileCanvasProps {
  trajectory: TrajectoryPoint[];
  isAnimating?: boolean;
}

export function ProjectileCanvas({ trajectory, isAnimating = false }: ProjectileCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || trajectory.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const pad = 40;

    const maxX = Math.max(...trajectory.map((p) => p.x), 1);
    const maxY = Math.max(...trajectory.map((p) => p.y), 1);

    const toCanvas = (x: number, y: number): [number, number] => [
      pad + (x / maxX) * (W - 2 * pad),
      H - pad - (y / maxY) * (H - 2 * pad),
    ];

    const drawFrame = (drawUpTo: number) => {
      ctx.clearRect(0, 0, W, H);

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(1, "#1e293b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(148,163,184,0.1)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const gx = pad + (i / 5) * (W - 2 * pad);
        const gy = pad + (i / 5) * (H - 2 * pad);
        ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, H - pad); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(W - pad, gy); ctx.stroke();
      }

      // Ground
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      const [gx0] = toCanvas(0, 0);
      const [gx1] = toCanvas(maxX, 0);
      ctx.beginPath(); ctx.moveTo(gx0, H - pad); ctx.lineTo(gx1, H - pad); ctx.stroke();

      // Axes labels
      ctx.fillStyle = "rgba(148,163,184,0.7)";
      ctx.font = "11px monospace";
      ctx.fillText("0", pad - 12, H - pad + 14);
      ctx.fillText(`${maxX.toFixed(0)}m`, W - pad - 24, H - pad + 14);
      ctx.fillText(`${maxY.toFixed(0)}m`, pad - 36, pad + 6);

      // Trajectory path
      const slice = Math.floor(trajectory.length * Math.min(drawUpTo, 1));
      if (slice < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 8;
      const [sx, sy] = toCanvas(trajectory[0].x, trajectory[0].y);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < slice; i++) {
        const [cx, cy] = toCanvas(trajectory[i].x, trajectory[i].y);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Projectile ball
      const [bx, by] = toCanvas(trajectory[slice - 1].x, trajectory[slice - 1].y);
      const ballGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 8);
      ballGrad.addColorStop(0, "#93c5fd");
      ballGrad.addColorStop(1, "#1d4ed8");
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(bx, by, 8, 0, Math.PI * 2);
      ctx.fill();

      // Launch point marker
      const [lx, ly] = toCanvas(0, 0);
      ctx.fillStyle = "#22c55e";
      ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();
    };

    if (!isAnimating || trajectory.length === 0) {
      drawFrame(1);
      return;
    }

    progressRef.current = 0;
    const duration = 2000; // ms
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      progressRef.current = t;
      drawFrame(t);
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [trajectory, isAnimating]);

  // Draw idle state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || trajectory.length > 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(1, "#1e293b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Set parameters and click Launch", W / 2, H / 2);
    ctx.textAlign = "left";
  }, [trajectory.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl overflow-hidden border border-border"
    >
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="w-full h-auto"
        style={{ display: "block" }}
      />
    </motion.div>
  );
}
