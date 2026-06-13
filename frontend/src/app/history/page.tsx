"use client";

import { History, FlaskConical, BookOpen, Clock } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function HistoryPage() {
  return (
    <ComingSoon
      icon={History}
      title="History"
      phase="Phase 9"
      description="A complete timeline of everything you've done — experiments run, quizzes taken, reports generated — all filterable and paginated. Your full session history in one place."
      features={[
        { icon: FlaskConical, label: "All experiments with parameters" },
        { icon: BookOpen, label: "Quiz attempts and scores" },
        { icon: Clock, label: "Timeline sorted by date" },
        { icon: History, label: "Filter by type and subject" },
      ]}
      color="slate"
    />
  );
}
