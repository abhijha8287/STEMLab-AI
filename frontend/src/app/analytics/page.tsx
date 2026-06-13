"use client";

import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function AnalyticsPage() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Analytics"
      phase="Phase 9"
      description="Deep-dive charts of your learning journey — experiment frequency, quiz score trends over time, subject balance, and session activity heatmaps powered by your session data."
      features={[
        { icon: TrendingUp, label: "Score & experiment trends" },
        { icon: PieChart, label: "Subject distribution charts" },
        { icon: Activity, label: "Session activity timeline" },
        { icon: BarChart3, label: "Recharts-powered dashboards" },
      ]}
      color="indigo"
    />
  );
}
