"use client";

import { FlaskConical, Atom, Zap, FileText, BookOpen, Trophy, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ExperimentUsageChart } from "@/components/dashboard/ExperimentUsageChart";
import { LoadingScreen } from "@/components/shared/LoadingSpinner";
import { useDashboard, useExperimentUsage, useProgress } from "@/hooks/useAnalytics";

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboard();
  const { data: usage } = useExperimentUsage();
  const { data: progress } = useProgress();

  if (isLoading) return (
    <AppShell>
      <LoadingScreen />
    </AppShell>
  );

  const totals = stats?.totals ?? { experiments_run: 0, physics_experiments: 0, circuit_experiments: 0, reports_generated: 0, quizzes_taken: 0 };
  const quizPerf = stats?.quiz_performance ?? { average_score: 0, best_score: 0, worst_score: 0, total_attempts: 0 };
  const learning = stats?.learning_progress ?? { concepts_explored: 0, knowledge_gaps_detected: 0, knowledge_gaps_resolved: 0 };
  const activity = stats?.recent_activity ?? [];

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5">Your learning overview and activity</p>
          {error && (
            <p className="mt-2 text-sm text-destructive">
              Could not load data — is the backend running? (docker compose up)
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatsCard label="Experiments Run"    value={totals.experiments_run}      icon={FlaskConical} color="text-blue-500"   description="All time" />
          <StatsCard label="Physics Exp."       value={totals.physics_experiments}  icon={Atom}         color="text-indigo-500" description="3 types" />
          <StatsCard label="Circuit Exp."       value={totals.circuit_experiments}  icon={Zap}          color="text-yellow-500" description="MNA solver" />
          <StatsCard label="Reports Generated"  value={totals.reports_generated}    icon={FileText}     color="text-orange-500" description="PDF export" />
          <StatsCard label="Quizzes Taken"      value={totals.quizzes_taken}        icon={BookOpen}     color="text-green-500"  description="AI generated" />
        </div>

        {/* Quiz performance + chart */}
        <div className="grid md:grid-cols-2 gap-4">
          <ExperimentUsageChart data={usage} />

          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              label="Avg Quiz Score"
              value={quizPerf.average_score}
              icon={Trophy}
              color="text-yellow-500"
              format="percent"
              description={`${quizPerf.total_attempts} attempt${quizPerf.total_attempts !== 1 ? "s" : ""}`}
            />
            <StatsCard
              label="Best Score"
              value={quizPerf.best_score}
              icon={TrendingUp}
              color="text-green-500"
              format="percent"
              description="Personal best"
            />
            <StatsCard
              label="Concepts Explored"
              value={learning.concepts_explored}
              icon={Atom}
              color="text-purple-500"
              description="of 46 total"
            />
            <StatsCard
              label="Knowledge Gaps"
              value={learning.knowledge_gaps_detected}
              icon={BookOpen}
              color="text-red-400"
              description={`${learning.knowledge_gaps_resolved} resolved`}
            />
          </div>
        </div>

        {/* Progress + Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <ProgressOverview data={progress} conceptsExplored={learning.concepts_explored} />
          </div>
          <div className="md:col-span-1">
            <QuickActions />
          </div>
          <div className="md:col-span-1">
            <RecentActivity items={activity} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
