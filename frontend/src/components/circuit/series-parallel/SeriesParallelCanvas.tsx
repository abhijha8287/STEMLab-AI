"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SeriesParallelResult } from "@/types/circuit";

interface SeriesParallelCanvasProps {
  result: SeriesParallelResult | null;
}

const RESISTOR_COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a78bfa", "#f43f5e", "#fbbf24"];

function drawResistor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, label: string, color: string) {
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  ctx.shadowColor = color; ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  const segs = 8;
  for (let i = 0; i <= segs; i++) {
    const px = x + (i / segs) * w;
    const py = y + (i % 2 === 0 ? -10 : 10);
    ctx.lineTo(px, py);
  }
  ctx.lineTo(x + w, y); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = color; ctx.font = "10px monospace"; ctx.textAlign = "center";
  ctx.fillText(label, x + w / 2, y - 16);
  ctx.textAlign = "left";
}

export function SeriesParallelCanvas({ result }: SeriesParallelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0f172a"); bg.addColorStop(1, "#1e293b");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    if (!result) {
      ctx.fillStyle = "rgba(148,163,184,0.4)"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Set resistors and click Solve Network", W / 2, H / 2); ctx.textAlign = "left";
      return;
    }

    const n = result.resistors.length;
    const top = H / 2 - 80, bot = H / 2 + 40;
    const padL = 80, padR = 80;
    const wireW = W - padL - padR;

    ctx.strokeStyle = "#475569"; ctx.lineWidth = 2.5;
    // Top and bottom horizontal wires
    ctx.beginPath(); ctx.moveTo(padL, top); ctx.lineTo(W - padR, top); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, bot); ctx.lineTo(W - padR, bot); ctx.stroke();
    // Left wire
    ctx.beginPath(); ctx.moveTo(padL, top); ctx.lineTo(padL, bot); ctx.stroke();
    // Right wire
    ctx.beginPath(); ctx.moveTo(W - padR, top); ctx.lineTo(W - padR, bot); ctx.stroke();

    // Battery
    const bmy = (top + bot) / 2;
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padL - 14, bmy - 20); ctx.lineTo(padL + 14, bmy - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL - 14, bmy - 8); ctx.lineTo(padL + 14, bmy - 8); ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(padL - 8, bmy + 8); ctx.lineTo(padL + 8, bmy + 8); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padL - 14, bmy + 20); ctx.lineTo(padL + 14, bmy + 20); ctx.stroke();
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
    ctx.fillText(`${result.supply_voltage}V`, padL, bmy + 40);
    ctx.textAlign = "left";

    if (result.topology === "series") {
      const segW = wireW / n;
      result.resistors.forEach((r, i) => {
        const rx = padL + i * segW + segW * 0.1;
        const rw = segW * 0.8;
        drawResistor(ctx, rx, top, rw,
          `R${r.id}=${r.resistance >= 1000 ? (r.resistance / 1000).toFixed(1) + "k" : r.resistance}Ω\n${r.voltage_drop.toFixed(1)}V`,
          RESISTOR_COLORS[i % RESISTOR_COLORS.length]);
      });
    } else if (result.topology === "parallel") {
      const spacing = (bot - top) / (n + 1);
      result.resistors.forEach((r, i) => {
        const ry = top + spacing * (i + 1);
        const rw = wireW * 0.6;
        const rx = padL + (wireW - rw) / 2;
        ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(padL, ry); ctx.lineTo(rx, ry); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + rw, ry); ctx.lineTo(W - padR, ry); ctx.stroke();
        drawResistor(ctx, rx, ry, rw,
          `R${r.id}=${r.resistance >= 1000 ? (r.resistance / 1000).toFixed(1) + "k" : r.resistance}Ω  I=${r.current.toFixed(3)}A`,
          RESISTOR_COLORS[i % RESISTOR_COLORS.length]);
      });
    } else {
      // Mixed: two groups stacked
      const mid = Math.max(1, Math.floor(n / 2));
      const g1 = result.resistors.slice(0, mid);
      const g2 = result.resistors.slice(mid);
      const groupW = wireW / 2 - 20;

      // Group 1 (left half)
      if (g1.length > 0) {
        const g1x = padL + 10, g1w = groupW;
        const g1spacing = (bot - top) / (g1.length + 1);
        g1.forEach((r, i) => {
          const ry = top + g1spacing * (i + 1);
          ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(g1x, ry); ctx.lineTo(g1x + 10, ry); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(g1x + g1w - 10, ry); ctx.lineTo(g1x + g1w, ry); ctx.stroke();
          drawResistor(ctx, g1x + 10, ry, g1w - 20, `R${r.id}=${r.resistance}Ω`, RESISTOR_COLORS[i % RESISTOR_COLORS.length]);
        });
      }
      // Group 2 (right half)
      if (g2.length > 0) {
        const g2x = padL + wireW / 2 + 10, g2w = groupW;
        const g2spacing = (bot - top) / (g2.length + 1);
        g2.forEach((r, i) => {
          const ry = top + g2spacing * (i + 1);
          ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(g2x, ry); ctx.lineTo(g2x + 10, ry); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(g2x + g2w - 10, ry); ctx.lineTo(g2x + g2w, ry); ctx.stroke();
          drawResistor(ctx, g2x + 10, ry, g2w - 20, `R${r.id}=${r.resistance}Ω`, RESISTOR_COLORS[(mid + i) % RESISTOR_COLORS.length]);
        });
      }
    }

    // Summary overlay
    ctx.fillStyle = "rgba(15,23,42,0.7)";
    ctx.roundRect(W - padR - 140, 10, 130, 66, 8); ctx.fill();
    ctx.fillStyle = "#fbbf24"; ctx.font = "11px monospace";
    ctx.fillText(`R_eq = ${result.equivalent_resistance >= 1000 ? (result.equivalent_resistance / 1000).toFixed(2) + "kΩ" : result.equivalent_resistance.toFixed(2) + "Ω"}`, W - padR - 130, 30);
    ctx.fillStyle = "#a78bfa";
    ctx.fillText(`I_tot = ${result.total_current.toFixed(4)} A`, W - padR - 130, 48);
    ctx.fillStyle = "#f97316";
    ctx.fillText(`P_tot = ${result.total_power.toFixed(3)} W`, W - padR - 130, 66);

  }, [result]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl overflow-hidden border border-border">
      <canvas ref={canvasRef} width={680} height={280} className="w-full h-auto" style={{ display: "block" }} />
    </motion.div>
  );
}
