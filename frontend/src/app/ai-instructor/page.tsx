"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatMessage } from "@/components/ai-instructor/ChatMessage";
import { ChatInput } from "@/components/ai-instructor/ChatInput";
import { ConversationSidebar } from "@/components/ai-instructor/ConversationSidebar";
import { aiApi } from "@/lib/api/ai";
import { useAIStore } from "@/stores/aiStore";
import { aiApi as _api } from "@/lib/api/ai";

let abortController: AbortController | null = null;

export default function AIInstructorPage() {
  const {
    messages,
    isStreaming,
    activeConversationId,
    setStreaming,
    appendMessage,
    updateLastAssistant,
    setActiveConversation,
    setConversations,
    conversations,
  } = useAIStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Refresh conversation list after each completed stream
  const refreshConversations = useCallback(() => {
    aiApi.listConversations().then(setConversations).catch(() => {});
  }, [setConversations]);

  const handleSend = async (text: string) => {
    if (isStreaming) return;

    // Append user bubble immediately
    appendMessage({ id: Date.now().toString(), role: "user", content: text });
    // Append empty assistant bubble (streaming)
    appendMessage({ id: (Date.now() + 1).toString(), role: "assistant", content: "", isStreaming: true });
    setStreaming(true);

    abortController = new AbortController();

    try {
      let newConvId: string | undefined;
      for await (const event of aiApi.streamChat(text, activeConversationId ?? undefined)) {
        if (event.type === "meta") {
          newConvId = event.conversation_id;
          if (!activeConversationId) setActiveConversation(event.conversation_id);
        } else if (event.type === "chunk") {
          updateLastAssistant(event.text);
        } else if (event.type === "done") {
          updateLastAssistant("", true);
          refreshConversations();
          break;
        } else if (event.type === "error") {
          updateLastAssistant(`\n\n_Error: ${event.message}_`, true);
          break;
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        updateLastAssistant("\n\n_Connection interrupted._", true);
      }
    } finally {
      setStreaming(false);
    }
  };

  const handleStop = () => {
    abortController?.abort();
    updateLastAssistant("", true);
    setStreaming(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Conversation history sidebar */}
        <div className="w-56 shrink-0 border-r bg-background/50 hidden lg:block">
          <ConversationSidebar />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b bg-background/60">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">STEMLab AI Instructor</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini 2.5 Flash · STEM expert
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <AnimatePresence>
              {isEmpty ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold">Ask me anything about STEM</h2>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                    I can explain experiments, walk through equations, interpret your results, or just answer curiosity questions.
                  </p>
                </motion.div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-background/60 px-4 py-3">
            <ChatInput
              onSend={handleSend}
              isStreaming={isStreaming}
              onStop={handleStop}
              disabled={!isEmpty}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
