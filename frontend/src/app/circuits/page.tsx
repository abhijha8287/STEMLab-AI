"use client";

import { Zap, GitBranch, Cpu, Activity } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function CircuitsPage() {
  return (
    <ComingSoon
      icon={Zap}
      title="Circuit Laboratory"
      phase="Phase 5"
      description="Build circuits visually with a drag-and-drop editor, then solve them with a full Modified Nodal Analysis (MNA) engine — resistors, capacitors, inductors, voltage and current sources."
      features={[
        { icon: GitBranch, label: "Drag-and-drop circuit builder" },
        { icon: Cpu, label: "MNA solver (KCL / KVL)" },
        { icon: Activity, label: "Time-domain & frequency response" },
        { icon: Zap, label: "Save & replay circuits" },
      ]}
      color="yellow"
    />
  );
}
