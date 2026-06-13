import apiClient from "./client";
import type { DashboardStats } from "@/types/api";

export interface ExperimentUsage {
  period: string;
  by_type: Record<string, number>;
  by_day: { date: string; count: number }[];
}

export interface QuizPerformanceData {
  score_trend: { date: string; score: number; topic: string }[];
  by_topic: Record<string, { average: number; attempts: number }>;
}

export interface ProgressData {
  concepts_mastered: string[];
  concepts_in_progress: string[];
  concepts_not_started: string[];
  mastery_by_subject: { physics: number; chemistry: number; mathematics: number };
  progress_over_time: { date: string; count: number }[];
}

export const analyticsApi = {
  getDashboard: () =>
    apiClient.get<DashboardStats>("/analytics/dashboard").then((r) => r.data),

  getExperimentUsage: (period = "30d") =>
    apiClient.get<ExperimentUsage>("/analytics/experiments", { params: { period } }).then((r) => r.data),

  getQuizPerformance: (period = "30d") =>
    apiClient.get<QuizPerformanceData>("/analytics/quiz-performance", { params: { period } }).then((r) => r.data),

  getProgress: () =>
    apiClient.get<ProgressData>("/analytics/progress").then((r) => r.data),
};
