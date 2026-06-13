"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Bot, User, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEMO_MESSAGES = [
  { role: "user",      text: "Why does a heavier ball fall at the same rate as a lighter one?" },
  { role: "assistant", text: "Great question! This is one of Galileo's most famous discoveries. Gravity accelerates all objects equally — 9.81 m/s² near Earth's surface — regardless of mass.\n\nHere's why: F = mg (gravitational force increases with mass), but a = F/m (acceleration divides by mass). The mass cancels out! Both balls hit the ground at the same time." },
  { role: "user",      text: "What about air resistance?" },
  { role: "assistant", text: "Air resistance does make a difference in real life! A feather falls slower than a steel ball because drag force depends on cross-sectional area, not just mass.\n\nIn our projectile simulation, you can set the drag coefficient to see exactly how air resistance changes the trajectory and range." },
];

function useTypewriter(text: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    let i = 0;
    setDisplayed("");
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return displayed;
}

function AssistantBubble({ text, active }: { text: string; active: boolean }) {
  const displayed = useTypewriter(text, active);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-line">
      {displayed}
      {active && displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5 align-middle" />
      )}
    </p>
  );
}

export function AIInstructorPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    async function playConversation() {
      for (let i = 0; i < DEMO_MESSAGES.length; i++) {
        if (cancelled) return;
        const msg = DEMO_MESSAGES[i];
        if (msg.role === "assistant") setTyping(true);
        await new Promise((r) => setTimeout(r, msg.role === "user" ? 600 : 300));
        if (cancelled) return;
        setVisibleCount(i + 1);
        const delay = msg.role === "assistant" ? msg.text.length * 18 + 500 : 800;
        await new Promise((r) => setTimeout(r, delay));
        if (msg.role === "assistant") setTyping(false);
      }
    }

    playConversation();
    return () => { cancelled = true; };
  }, [inView]);

  return (
    <section className="px-4 py-20 bg-muted/20" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" /> AI Powered
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Meet Your AI STEM Instructor</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Powered by Gemini AI. Ask anything about STEM concepts, get explanations of your experiment results, or request suggestions for what to try next.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Chat preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="rounded-2xl border bg-card shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b bg-muted/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI STEM Instructor</p>
                <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-4 min-h-[280px]">
              {DEMO_MESSAGES.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white ${msg.role === "user" ? "bg-blue-500" : "bg-primary"}`}>
                    {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.role === "user" ? "bg-blue-500 text-white rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                    {msg.role === "assistant" && i === visibleCount - 1 ? (
                      <AssistantBubble text={msg.text} active={true} />
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {typing && visibleCount < DEMO_MESSAGES.length && DEMO_MESSAGES[visibleCount]?.role === "assistant" && (
                <div className="flex gap-2.5">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="space-y-5"
          >
            {[
              { title: "Concept Explanations",   desc: "Ask any STEM question and get clear, accurate explanations at your level." },
              { title: "Experiment Analysis",     desc: "After running an experiment, ask AI to explain your results, identify patterns, and suggest improvements." },
              { title: "Streaming Responses",     desc: "Responses stream in real time — no waiting. Like a real conversation." },
              { title: "Persistent History",      desc: "All your conversations are saved. Come back and continue any discussion." },
              { title: "Context-Aware",           desc: "The AI knows what experiment you just ran and can reference your actual data." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}

            <Button className="mt-4" asChild>
              <Link href="/ai-instructor">
                Start chatting with AI <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
