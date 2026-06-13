"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "@/lib/utils/date";
import { aiApi } from "@/lib/api/ai";
import { useAIStore } from "@/stores/aiStore";

export function ConversationSidebar() {
  const { conversations, activeConversationId, setConversations, setActiveConversation, setMessages, clearChat } = useAIStore();

  useEffect(() => {
    aiApi.listConversations().then(setConversations).catch(() => {});
  }, []);

  const loadConversation = async (id: string) => {
    try {
      const detail = await aiApi.getConversation(id);
      setMessages(
        detail.messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: m.createdAt,
        }))
      );
      setActiveConversation(id);
    } catch {}
  };

  const deleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await aiApi.deleteConversation(id).catch(() => {});
    if (activeConversationId === id) clearChat();
    setConversations(conversations.filter((c) => c.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Chats</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearChat} title="New chat">
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <AnimatePresence>
          {conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8 px-2">
              No conversations yet. Ask a question to start.
            </p>
          ) : (
            conversations.map((conv) => (
              <motion.button
                key={conv.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                onClick={() => loadConversation(conv.id)}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2.5 transition-colors group flex items-start gap-2",
                  activeConversationId === conv.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60 text-muted-foreground"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{conv.title ?? "Untitled"}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">
                    {conv.message_count} msgs · {formatDistanceToNow(new Date(conv.updated_at))}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteConversation(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
