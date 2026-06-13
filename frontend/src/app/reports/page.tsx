"use client";

import { FlaskConical, FileText, Download, Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon
      icon={FlaskConical}
      title="Lab Reports"
      phase="Phase 8"
      description="Generate professional PDF lab reports from any experiment using Gemini AI. Reports include objective, methodology, results analysis, and conclusions — all formatted and ready to download."
      features={[
        { icon: Sparkles, label: "AI-written report sections" },
        { icon: FileText, label: "WeasyPrint PDF generation" },
        { icon: Download, label: "Download & share reports" },
        { icon: FlaskConical, label: "Linked to experiment results" },
      ]}
      color="orange"
    />
  );
}
