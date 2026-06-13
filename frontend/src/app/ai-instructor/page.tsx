"use client";

import { Bot, MessageSquare, Sparkles, BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function AIInstructorPage() {
  return (
    <ComingSoon
      icon={Bot}
      title="AI STEM Instructor"
      phase="Phase 6"
      description="Chat with a Gemini-powered AI tutor that streams real-time explanations, answers experiment-specific questions, and adapts to your learning progress — all in context of your session."
      features={[
        { icon: MessageSquare, label: "Streaming Gemini responses" },
        { icon: Sparkles, label: "Experiment-aware context" },
        { icon: BookOpen, label: "Step-by-step concept breakdowns" },
        { icon: Bot, label: "Conversation history per session" },
      ]}
      color="blue"
    />
  );
}
