import apiClient from "./client";
import type { Conversation, ConversationDetail, StreamEvent } from "@/types/ai";
import { API_URL } from "@/lib/constants";

const SESSION_KEY = "stemlab_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export const aiApi = {
  listConversations: (): Promise<Conversation[]> =>
    apiClient.get("/ai/conversations").then((r) => r.data),

  getConversation: (id: string): Promise<ConversationDetail> =>
    apiClient.get(`/ai/conversations/${id}`).then((r) => r.data),

  deleteConversation: (id: string): Promise<void> =>
    apiClient.delete(`/ai/conversations/${id}`).then(() => undefined),

  /** Returns an async generator of StreamEvent parsed from the SSE stream. */
  async *streamChat(
    message: string,
    conversationId?: string,
    experimentContext?: string,
  ): AsyncGenerator<StreamEvent> {
    const response = await fetch(`${API_URL}/api/v1/ai/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": getSessionId(),
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId ?? null,
        experiment_context: experimentContext ?? null,
      }),
    });

    if (!response.ok || !response.body) {
      yield { type: "error", message: `HTTP ${response.status}` };
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;
        try {
          yield JSON.parse(raw) as StreamEvent;
        } catch {
          // malformed chunk — skip
        }
      }
    }
  },
};
