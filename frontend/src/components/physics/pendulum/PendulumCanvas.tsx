"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { PendulumResult } from "@/types/physics";

interface PendulumCanvasProps {
  result: PendulumResult | null;
  length: number;
  isAnimating?: boolean;
}

export function PendulumCanvas({ result, length, isAnimating = false }: PendulumCanvasProps) {
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
      const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0f172a"); bg.addColorStop(1, "#1e293b");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(148,163,184,0.4)"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Set parameters and click Release Pendulum", W / 2, H / 2); ctx.textAlign = "left";
    };

    if (!result) { drawIdle(); return; }

    const pivotX = W / 2, pivotY = 60;
    const stringLen = Math.min((H - 100) * (length / 10), H - 140);

    const drawFrame = (angleData: number[], frameIdx: number) => {
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0f172a"); bg.addColorStop(1, "#1e293b");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Ceiling mount
      ctx.fillStyle = "#374151"; ctx.fillRect(pivotX - 30, 40, 60, 20);
      ctx.fillStyle = "#6b7280"; ctx.beginPath(); ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2); ctx.fill();

      // Trail
      const trailLen = Math.min(frameIdx, 30);
      for (let i = Math.max(0, frameIdx - trailLen); i < frameIdx; i++) {
        const a = (angleData[i] * Math.PI) / 180;
        const bx = pivotX + stringLen * Math.sin(a);
        const by = pivotY + stringLen * Math.cos(a);
        const alpha = (i - (frameIdx - trailLen)) / trailLen;
        ctx.fillStyle = `rgba(59,130,246,${alpha * 0.4})`;
        ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
      }

      // Current angle
      const angle = (angleData[Math.min(frameIdx, angleData.length - 1)] * Math.PI) / 180;
      const bobX = pivotX + stringLen * Math.sin(angle);
      const bobY = pivotY + stringLen * Math.cos(angle);

      // String
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bobX, bobY); ctx.stroke();

      // Bob
      const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, 18);
      bobGrad.addColorStop(0, "#93c5fd"); bobGrad.addColorStop(1, "#1d4ed8");
      ctx.fillStyle = bobGrad;
      ctx.beginPath(); ctx.arc(bobX, bobY, 18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 1.5; ctx.stroke();

      // Angle indicator
      ctx.strokeStyle = "rgba(251,191,36,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(pivotX, pivotY + stringLen + 30); ctx.stroke();
      ctx.setLineDash([]);

      // Info overlay
      ctx.fillStyle = "rgba(148,163,184,0.9)"; ctx.font = "12px monospace";
      ctx.fillText(`T = ${result.period.toFixed(3)} s`, 16, 30);
      ctx.fillText(`f = ${result.frequency.toFixed(3)} Hz`, 16, 50);
      ctx.fillText(`θ = ${angleData[Math.min(frameIdx, angleData.length - 1)].toFixed(1)}°`, 16, 70);
    };

    const angles = result.angle_series.map((p) => p[1]);

    if (!isAnimating) {
      drawFrame(angles, Math.floor(angles.length / 4));
      return;
    }

    let idx = 0;
    const speed = 2;
    const animate = () => {
      drawFrame(angles, idx);
      idx = (idx + speed) % angles.length;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [result, length, isAnimating]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl overflow-hidden border border-border"
    >
      <canvas ref={canvasRef} width={640} height={360} className="w-full h-auto" style={{ display: "block" }} />
    </motion.div>
  );
}
