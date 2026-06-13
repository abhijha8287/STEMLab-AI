import apiClient from "./client";

export interface HistoryItem {
  id: string;
  item_type: "experiment" | "quiz";
  title: string;
  experiment_type?: string;
  status?: string;
  result_count?: number;
  score?: number;
  topic?: string;
  created_at: string;
  summary?: Record<string, unknown>;
}

export interface HistoryResponse {
  items: HistoryItem[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export const historyApi = {
  getHistory: (page = 1, page_size = 20, item_type?: string) =>
    apiClient
      .get<HistoryResponse>("/history", { params: { page, page_size, item_type } })
      .then((r) => r.data),
};
