"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop?: () => void;
  disabled?: boolean;
}

const SUGGESTED = [
  "Explain projectile motion with an example",
  "What is the time constant in an RC circuit?",
  "Why does a heavier pendulum not swing faster?",
  "How does friction affect Newton's second law?",
];

export function ChatInput({ onSend, isStreaming, onStop, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className="space-y-2">
      {/* Suggestions — only show when no messages yet */}
      {!disabled && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => { setText(s); textareaRef.current?.focus(); }}
              className="px-2.5 py-1 rounded-full text-xs border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => { setText(e.target.value); handleInput(); }}
          onKeyDown={handleKey}
          placeholder="Ask anything about STEM… (Enter to send, Shift+Enter for newline)"
          disabled={isStreaming}
          className={cn(
            "flex-1 resize-none rounded-xl border bg-muted/40 px-4 py-3 text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
            "min-h-[48px] max-h-[160px] transition-all",
            isStreaming && "opacity-60 cursor-not-allowed"
          )}
        />
        {isStreaming ? (
          <Button variant="destructive" size="icon" className="shrink-0 h-12 w-12 rounded-xl" onClick={onStop}>
            <Square className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            className="shrink-0 h-12 w-12 rounded-xl"
            onClick={send}
            disabled={!text.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground text-right">Powered by Gemini 2.5 Flash</p>
    </div>
  );
}
