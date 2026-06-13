"use client";

import { Brain, Target, TrendingUp, CheckCircle } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function KnowledgeGapsPage() {
  return (
    <ComingSoon
      icon={Brain}
      title="Knowledge Gaps"
      phase="Phase 7"
      description="AI-detected gaps in your understanding, surfaced from quiz results and experiment patterns. Get targeted recommendations for which concepts to revisit and in what order."
      features={[
        { icon: Target, label: "AI-detected weak concepts" },
        { icon: TrendingUp, label: "Gap resolution tracking" },
        { icon: CheckCircle, label: "Recommended learning paths" },
        { icon: Brain, label: "Linked to quiz & experiment data" },
      ]}
      color="red"
    />
  );
}
