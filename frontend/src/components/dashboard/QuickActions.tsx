import Link from "next/link";
import { Atom, Zap, Bot, BookOpen, Map, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  { href: "/physics",          icon: Atom,     label: "Physics Lab",     variant: "default"  as const, color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { href: "/circuits",         icon: Zap,      label: "Circuit Lab",     variant: "outline"  as const },
  { href: "/ai-instructor",    icon: Bot,      label: "Ask AI",          variant: "outline"  as const },
  { href: "/quiz",             icon: BookOpen, label: "Take Quiz",       variant: "outline"  as const },
  { href: "/concept-explorer", icon: Map,      label: "Explore Concepts",variant: "outline"  as const },
  { href: "/analytics",        icon: BarChart3,label: "View Analytics",  variant: "outline"  as const },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => (
          <Button
            key={action.href}
            variant={action.variant}
            size="sm"
            className={`justify-start gap-2 h-9 ${action.color ?? ""}`}
            asChild
          >
            <Link href={action.href}>
              <action.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs truncate">{action.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
