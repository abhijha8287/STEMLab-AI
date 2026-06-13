import { create } from "zustand";
import type { ChatMessage, Conversation } from "@/types/ai";

interface AIStore {
  messages: ChatMessage[];
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;

  setMessages: (msgs: ChatMessage[]) => void;
  appendMessage: (msg: ChatMessage) => void;
  updateLastAssistant: (text: string, done?: boolean) => void;
  setConversations: (convs: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setStreaming: (v: boolean) => void;
  clearChat: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
  messages: [],
  conversations: [],
  activeConversationId: null,
  isStreaming: false,

  setMessages: (messages) => set({ messages }),
  appendMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateLastAssistant: (text, done = false) =>
    set((s) => {
      const msgs = [...s.messages];
      const last = msgs[msgs.length - 1];
      if (last?.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content: last.content + text, isStreaming: !done };
      }
      return { messages: msgs };
    }),
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearChat: () => set({ messages: [], activeConversationId: null }),
}));
