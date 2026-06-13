"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { OhmsResult } from "@/types/circuit";

interface OhmsCanvasProps {
  result: OhmsResult | null;
}

export function OhmsCanvas({ result }: OhmsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dotRef = useRef(0);

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
      ctx.textAlign = "center";
      ctx.fillText("Set two known values and click Solve Circuit", W / 2, H / 2);
      ctx.textAlign = "left";
      return;
    }

    // Circuit layout: battery left, wire top, resistor top-right, wire right, wire bottom back
    const cx = W / 2, cy = H / 2;
    const bx = 80, tw = W - 160; // battery x, track width
    const top = cy - 80, bot = cy + 80;

    const drawCircuit = (dotPos: number) => {
      drawBg();

      // Wires
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 3;
      // top wire
      ctx.beginPath(); ctx.moveTo(bx, top); ctx.lineTo(bx + tw, top); ctx.stroke();
      // bottom wire
      ctx.beginPath(); ctx.moveTo(bx, bot); ctx.lineTo(bx + tw, bot); ctx.stroke();
      // left wire (battery connections)
      ctx.beginPath(); ctx.moveTo(bx, top); ctx.lineTo(bx, bot); ctx.stroke();
      // right wire
      ctx.beginPath(); ctx.moveTo(bx + tw, top); ctx.lineTo(bx + tw, bot); ctx.stroke();

      // Battery (left side, vertical)
      const mid = (top + bot) / 2;
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
      // + plate (long thin)
      ctx.beginPath(); ctx.moveTo(bx - 14, mid - 22); ctx.lineTo(bx + 14, mid - 22); ctx.stroke();
      // + plate (long thin)
      ctx.beginPath(); ctx.moveTo(bx - 14, mid - 8); ctx.lineTo(bx + 14, mid - 8); ctx.stroke();
      ctx.lineWidth = 4;
      // - plate (short thick)
      ctx.beginPath(); ctx.moveTo(bx - 8, mid + 8); ctx.lineTo(bx + 8, mid + 8); ctx.stroke();
      ctx.lineWidth = 1.5;
      // - plate (thin)
      ctx.beginPath(); ctx.moveTo(bx - 14, mid + 22); ctx.lineTo(bx + 14, mid + 22); ctx.stroke();
      // + and - labels
      ctx.fillStyle = "#22c55e"; ctx.font = "bold 14px monospace";
      ctx.fillText("+", bx - 22, mid - 12);
      ctx.fillStyle = "#ef4444";
      ctx.fillText("−", bx - 22, mid + 26);

      // Battery voltage label
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${result.voltage.toFixed(2)} V`, bx, mid + 48);
      ctx.textAlign = "left";

      // Resistor (top wire, zigzag)
      const rx = cx - 50, rw = 100, ry = top;
      ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2.5;
      ctx.shadowColor = "#f97316"; ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      const segs = 8;
      for (let i = 0; i <= segs; i++) {
        const px = rx + (i / segs) * rw;
        const py = ry + (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(px, py);
      }
      ctx.lineTo(rx + rw, ry);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Resistor label
      ctx.fillStyle = "#f97316"; ctx.font = "12px monospace"; ctx.textAlign = "center";
      ctx.fillText(`R = ${result.resistance >= 1000 ? (result.resistance / 1000).toFixed(2) + " kΩ" : result.resistance.toFixed(2) + " Ω"}`, cx, top - 22);
      ctx.textAlign = "left";

      // Current label on right wire
      ctx.fillStyle = "#a78bfa"; ctx.font = "12px monospace"; ctx.textAlign = "center";
      ctx.fillText(`I = ${result.current < 0.001 ? (result.current * 1000).toFixed(2) + " mA" : result.current.toFixed(4) + " A"}`, bx + tw + 36, cy);
      ctx.textAlign = "left";

      // Flowing current dots
      const numDots = 6;
      for (let d = 0; d < numDots; d++) {
        const frac = ((dotPos / 300 + d / numDots) % 1);
        // Route: top-left → top-right → right-down → bottom-right → bottom-left → left-up
        const perimeter = 2 * (tw + (bot - top));
        const pos = frac * perimeter;
        let dx = 0, dy = 0;
        const seg1 = tw, seg2 = seg1 + (bot - top), seg3 = seg2 + tw, seg4 = seg3 + (bot - top);
        if (pos < seg1) { dx = bx + pos; dy = top; }
        else if (pos < seg2) { dx = bx + tw; dy = top + (pos - seg1); }
        else if (pos < seg3) { dx = bx + tw - (pos - seg2); dy = bot; }
        else { dx = bx; dy = bot - (pos - seg3); }
        ctx.fillStyle = "#facc15";
        ctx.beginPath(); ctx.arc(dx, dy, 4, 0, Math.PI * 2); ctx.fill();
      }
    };

    cancelAnimationFrame(rafRef.current);
    const animate = () => {
      dotRef.current = (dotRef.current + 1) % 300;
      drawCircuit(dotRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [result]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl overflow-hidden border border-border">
      <canvas ref={canvasRef} width={640} height={300} className="w-full h-auto" style={{ display: "block" }} />
    </motion.div>
  );
}
