"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { RCResult } from "@/types/circuit";

interface RCCanvasProps {
  result: RCResult | null;
  isAnimating?: boolean;
}

export function RCCanvas({ result, isAnimating = false }: RCCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const drawBg = () => {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0f172a"); bg.addColorStop(1, "#1e293b");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    };

    if (!result) {
      drawBg();
      ctx.fillStyle = "rgba(148,163,184,0.4)"; ctx.font = "14px sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Set parameters and click Start Charging/Discharging", W / 2, H / 2);
      ctx.textAlign = "left"; return;
    }

    const cy = H / 2;
    const padL = 70, padR = 70;
    const top = cy - 90, bot = cy + 50;
    const wireW = W - padL - padR;

    // Positions for components along top wire
    const switchX = padL + wireW * 0.15;
    const resistorX = padL + wireW * 0.35;
    const resistorW = wireW * 0.25;
    const capX = padL + wireW * 0.72;
    const capGap = 14;

    const drawFrame = (progress: number) => {
      drawBg();

      const chargeRatio = Math.min(progress, 1);
      const isCharging = result.mode === "charging";
      const finalV = isCharging ? result.supply_voltage : 0;
      const startV = isCharging ? 0 : (result.voltage_at_tau[0] / (1 - Math.exp(-1)));
      const curV = isCharging
        ? result.supply_voltage * (1 - Math.exp(-chargeRatio * 5))
        : startV * Math.exp(-chargeRatio * 5);
      const fillRatio = curV / result.supply_voltage;

      // Wires
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(padL, top); ctx.lineTo(W - padR, top); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(padL, bot); ctx.lineTo(W - padR, bot); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(padL, top); ctx.lineTo(padL, bot); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - padR, top); ctx.lineTo(W - padR, bot); ctx.stroke();

      // Battery
      const bmy = (top + bot) / 2;
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
      [[padL - 14, padL + 14, bmy - 20], [padL - 14, padL + 14, bmy - 8]].forEach(([x1, x2, y]) => {
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      });
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(padL - 8, bmy + 8); ctx.lineTo(padL + 8, bmy + 8); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(padL - 14, bmy + 22); ctx.lineTo(padL + 14, bmy + 22); ctx.stroke();
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
      ctx.fillText(`${result.supply_voltage}V`, padL, bmy + 40); ctx.textAlign = "left";

      // Switch (open/closed based on animation state)
      ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(switchX, top, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(switchX, top);
      ctx.lineTo(switchX + 20, progress > 0 ? top : top - 15); ctx.stroke();
      ctx.fillStyle = "#22c55e"; ctx.font = "10px monospace";
      ctx.fillText(progress > 0 ? "SW: ON" : "SW: OFF", switchX - 15, top - 18);

      // Resistor
      ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2.5; ctx.shadowColor = "#f97316"; ctx.shadowBlur = 4;
      ctx.beginPath(); ctx.moveTo(resistorX, top);
      const segs = 8;
      for (let i = 0; i <= segs; i++) {
        ctx.lineTo(resistorX + (i / segs) * resistorW, top + (i % 2 === 0 ? -10 : 10));
      }
      ctx.lineTo(resistorX + resistorW, top); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = "#f97316"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText(`R=${result.resistance >= 1000 ? (result.resistance / 1000).toFixed(1) + "kΩ" : result.resistance + "Ω"}`, resistorX + resistorW / 2, top - 16);
      ctx.textAlign = "left";

      // Capacitor
      const capH = 30;
      // Fill based on charge
      if (fillRatio > 0) {
        const fillH = Math.min(fillRatio, 1) * capH;
        const grad = ctx.createLinearGradient(0, bot - fillH, 0, bot);
        grad.addColorStop(0, isCharging ? "rgba(59,130,246,0.8)" : "rgba(59,130,246,0.1)");
        grad.addColorStop(1, isCharging ? "rgba(37,99,235,0.4)" : "rgba(59,130,246,0.6)");
        ctx.fillStyle = grad;
        ctx.fillRect(capX - 18, top + capH + capGap - fillH, 36, fillH);
      }
      ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(capX - 20, top + capH); ctx.lineTo(capX + 20, top + capH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(capX - 20, top + capH + capGap); ctx.lineTo(capX + 20, top + capH + capGap); ctx.stroke();
      // Capacitor wires
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(capX, top); ctx.lineTo(capX, top + capH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(capX, top + capH + capGap); ctx.lineTo(capX, bot); ctx.stroke();
      ctx.fillStyle = "#60a5fa"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText(`C=${result.capacitance < 1e-6 ? (result.capacitance * 1e9).toFixed(0) + "nF" : (result.capacitance * 1e6).toFixed(0) + "µF"}`, capX, top - 8);
      ctx.textAlign = "left";

      // Voltage readout
      ctx.fillStyle = "rgba(15,23,42,0.8)"; ctx.roundRect(W - padR - 140, 8, 132, 58, 8); ctx.fill();
      ctx.fillStyle = "#fbbf24"; ctx.font = "11px monospace";
      ctx.fillText(`Vc = ${curV.toFixed(3)} V`, W - padR - 130, 26);
      ctx.fillStyle = "#60a5fa";
      ctx.fillText(`τ = ${result.time_constant < 0.01 ? (result.time_constant * 1000).toFixed(2) + " ms" : result.time_constant.toFixed(4) + " s"}`, W - padR - 130, 44);
      ctx.fillStyle = "#22c55e";
      ctx.fillText(`${(Math.min(fillRatio, 1) * 100).toFixed(0)}% charged`, W - padR - 130, 62);
    };

    cancelAnimationFrame(rafRef.current);
    if (!isAnimating) { drawFrame(1); return; }

    const start = performance.now();
    const dur = 3000;
    const animate = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      drawFrame(t);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [result, isAnimating]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl overflow-hidden border border-border">
      <canvas ref={canvasRef} width={640} height={280} className="w-full h-auto" style={{ display: "block" }} />
    </motion.div>
  );
}
