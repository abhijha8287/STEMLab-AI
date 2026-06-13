export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail {
  id: string;
  title: string | null;
  messages: ChatMessage[];
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  experiment_context?: string;
}

export type StreamEvent =
  | { type: "meta"; conversation_id: string }
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };
