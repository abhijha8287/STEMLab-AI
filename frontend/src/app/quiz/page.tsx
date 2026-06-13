"use client";

import { BookOpen, Sparkles, BarChart2, Trophy } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function QuizPage() {
  return (
    <ComingSoon
      icon={BookOpen}
      title="Quiz Generator"
      phase="Phase 7"
      description="Gemini generates custom multiple-choice quizzes on any STEM topic. Scores are tracked, wrong answers are explained, and results feed directly into your knowledge gap analysis."
      features={[
        { icon: Sparkles, label: "AI-generated questions per topic" },
        { icon: BarChart2, label: "Score history and trends" },
        { icon: Trophy, label: "Personal best tracking" },
        { icon: BookOpen, label: "Explanation for every answer" },
      ]}
      color="green"
    />
  );
}
