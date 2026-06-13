"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { NewtonResult } from "@/types/physics";

interface NewtonCanvasProps {
  result: NewtonResult | null;
  isAnimating?: boolean;
  force: number;
  mass: number;
  friction: number;
}

export function NewtonCanvas({ result, isAnimating = false, force, mass, friction }: NewtonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const drawIdle = () => {
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0f172a"); bg.addColorStop(1, "#1e293b");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(148,163,184,0.4)";
      ctx.font = "14px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Set parameters and click Apply Force", W / 2, H / 2);
      ctx.textAlign = "left";
    };

    if (!result) { drawIdle(); return; }

    const groundY = H - 80;
    const blockW = 64, blockH = 48;
    const maxDisp = Math.max(result.displacement, 0.1);
    const maxX = W - 120 - blockW;

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0f172a"); bg.addColorStop(1, "#1e293b");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.fillStyle = "#374151"; ctx.fillRect(60, groundY, W - 120, 20);
      ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 1;
      for (let gx = 60; gx < W - 120; gx += 20) {
        ctx.beginPath(); ctx.moveTo(gx, groundY); ctx.lineTo(gx + 10, groundY + 20); ctx.stroke();
      }

      // Block position
      const progress = Math.min(t, 1);
      const dispNorm = Math.min(result.displacement / maxDisp, 1);
      const blockX = 60 + dispNorm * maxX * progress;
      const blockY = groundY - blockH;

      // Force arrow
      if (force > result.net_force * 0.01) {
        const arrowLen = 40 + Math.min(force / 20, 80);
        ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(blockX - 10, blockY + blockH / 2);
        ctx.lineTo(blockX - 10 - arrowLen, blockY + blockH / 2);
        ctx.stroke();
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.moveTo(blockX - 8, blockY + blockH / 2);
        ctx.lineTo(blockX - 18, blockY + blockH / 2 - 6);
        ctx.lineTo(blockX - 18, blockY + blockH / 2 + 6);
        ctx.fill();
        ctx.fillStyle = "#22c55e"; ctx.font = "11px monospace";
        ctx.fillText(`F=${force}N`, blockX - 10 - arrowLen - 50, blockY + blockH / 2 + 4);
      }

      // Friction arrow (backward)
      if (friction > 0 && result.acceleration > 0) {
        const frictionN = friction * mass * 9.81;
        const frictionLen = 20 + Math.min(frictionN / 10, 50);
        ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(blockX + blockW + 5, blockY + blockH / 2);
        ctx.lineTo(blockX + blockW + 5 + frictionLen, blockY + blockH / 2);
        ctx.stroke();
        ctx.fillStyle = "#ef4444"; ctx.font = "10px monospace";
        ctx.fillText(`f=${frictionN.toFixed(1)}N`, blockX + blockW + 10, blockY + blockH / 2 - 6);
      }

      // Block body
      const blockGrad = ctx.createLinearGradient(blockX, blockY, blockX, blockY + blockH);
      blockGrad.addColorStop(0, "#60a5fa"); blockGrad.addColorStop(1, "#1d4ed8");
      ctx.fillStyle = blockGrad;
      ctx.beginPath();
      ctx.roundRect(blockX, blockY, blockW, blockH, 4);
      ctx.fill();
      ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 1.5;
      ctx.stroke();

      // Block label
      ctx.fillStyle = "#fff"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${mass}kg`, blockX + blockW / 2, blockY + blockH / 2 + 5);
      ctx.textAlign = "left";

      // Velocity readout
      const curV = result.final_velocity * progress;
      ctx.fillStyle = "rgba(148,163,184,0.9)"; ctx.font = "12px monospace";
      ctx.fillText(`v = ${curV.toFixed(2)} m/s`, 70, 30);
      ctx.fillText(`a = ${result.acceleration.toFixed(2)} m/s²`, 70, 50);
    };

    if (!isAnimating) { drawFrame(1); return; }

    const start = performance.now();
    const dur = 2000;
    const animate = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      drawFrame(t);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [result, isAnimating, force, mass, friction]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl overflow-hidden border border-border"
    >
      <canvas ref={canvasRef} width={640} height={260} className="w-full h-auto" style={{ display: "block" }} />
    </motion.div>
  );
}
