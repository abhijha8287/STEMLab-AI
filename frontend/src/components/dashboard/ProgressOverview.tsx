"use client";

import { motion } from "framer-motion";
import { Atom, FlaskConical, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProgressData } from "@/lib/api/analytics";

const SUBJECTS = [
  { key: "physics"     as const, label: "Physics",     icon: Atom,         color: "text-blue-500",   progressColor: "[&>div]:bg-blue-500" },
  { key: "chemistry"   as const, label: "Chemistry",   icon: FlaskConical, color: "text-green-500",  progressColor: "[&>div]:bg-green-500" },
  { key: "mathematics" as const, label: "Mathematics", icon: Calculator,   color: "text-purple-500", progressColor: "[&>div]:bg-purple-500" },
];

interface ProgressOverviewProps {
  data: ProgressData | undefined;
  conceptsExplored: number;
}

export function ProgressOverview({ data, conceptsExplored }: ProgressOverviewProps) {
  const mastery = data?.mastery_by_subject ?? { physics: 0, chemistry: 0, mathematics: 0 };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Learning Progress</CardTitle>
        <p className="text-xs text-muted-foreground">{conceptsExplored} / 46 concepts explored</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {SUBJECTS.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-sm font-medium">{s.label}</span>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {mastery[s.key].toFixed(0)}%
              </span>
            </div>
            <Progress value={mastery[s.key]} className={`h-1.5 ${s.progressColor}`} />
          </motion.div>
        ))}

        {conceptsExplored === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Explore concepts and take quizzes to track progress
          </p>
        )}
      </CardContent>
    </Card>
  );
}
