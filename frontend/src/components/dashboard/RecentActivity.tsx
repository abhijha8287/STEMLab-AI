"use client";

import { motion } from "framer-motion";
import { FlaskConical, BookOpen, FileText, Bot, Lightbulb, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "@/lib/utils/date";
import type { ActivityItem } from "@/types/api";

const EVENT_ICONS: Record<string, { icon: typeof Clock; color: string }> = {
  experiment_started:   { icon: FlaskConical, color: "text-blue-500" },
  experiment_completed: { icon: FlaskConical, color: "text-green-500" },
  experiment_run:       { icon: FlaskConical, color: "text-blue-400" },
  quiz_started:         { icon: BookOpen,     color: "text-yellow-500" },
  quiz_completed:       { icon: BookOpen,     color: "text-green-500" },
  report_generated:     { icon: FileText,     color: "text-orange-500" },
  pdf_exported:         { icon: FileText,     color: "text-purple-500" },
  ai_query:             { icon: Bot,          color: "text-indigo-500" },
  concept_viewed:       { icon: Lightbulb,    color: "text-pink-500" },
};

function ActivityRow({ item, index }: { item: ActivityItem; index: number }) {
  const meta = EVENT_ICONS[item.type] ?? { icon: Clock, color: "text-muted-foreground" };
  const { icon: Icon, color } = meta;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-start gap-3 py-2.5 border-b last:border-0"
    >
      <div className={`mt-0.5 rounded-full p-1.5 bg-current/10 shrink-0 ${color}`}>
        <Icon className={`h-3.5 w-3.5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{item.description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDistanceToNow(item.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" /> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No activity yet. Start an experiment to see your history here.
          </div>
        ) : (
          <div>
            {items.map((item, i) => (
              <ActivityRow key={`${item.timestamp}-${i}`} item={item} index={i} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
