import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics";

export function useDashboard() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: analyticsApi.getDashboard,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useExperimentUsage(period = "30d") {
  return useQuery({
    queryKey: ["analytics", "experiments", period],
    queryFn: () => analyticsApi.getExperimentUsage(period),
    staleTime: 60_000,
  });
}

export function useQuizPerformance(period = "30d") {
  return useQuery({
    queryKey: ["analytics", "quiz-performance", period],
    queryFn: () => analyticsApi.getQuizPerformance(period),
    staleTime: 60_000,
  });
}

export function useProgress() {
  return useQuery({
    queryKey: ["analytics", "progress"],
    queryFn: analyticsApi.getProgress,
    staleTime: 60_000,
  });
}
