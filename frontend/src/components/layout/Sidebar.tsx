"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Atom, Zap, Bot, Map, Brain, BookOpen, BarChart3, History, FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/stores/uiStore";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/physics", label: "Physics Lab", icon: Atom, group: "Laboratories" },
  { href: "/circuits", label: "Circuit Lab", icon: Zap, group: "Laboratories" },
  { href: "/ai-instructor", label: "AI Instructor", icon: Bot, group: "AI Tools" },
  { href: "/concept-explorer", label: "Concept Explorer", icon: Map, group: "AI Tools" },
  { href: "/knowledge-gaps", label: "Knowledge Gaps", icon: Brain, group: "AI Tools" },
  { href: "/quiz", label: "Quiz Generator", icon: BookOpen, group: "Learning" },
  { href: "/reports", label: "Lab Reports", icon: FlaskConical, group: "Learning" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, group: "Insights" },
  { href: "/history", label: "History", icon: History, group: "Insights" },
];

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const pathname = usePathname();

  if (!sidebarOpen) return null;

  const groups = ["Laboratories", "AI Tools", "Learning", "Insights"];

  return (
    <aside className="w-56 shrink-0 border-r bg-background/60 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
      <nav className="flex flex-col gap-0.5 p-3">
        {/* Dashboard */}
        {NAV_ITEMS.filter((i) => !i.group).map((item) => (
          <SidebarLink key={item.href} item={item} active={pathname === item.href} />
        ))}

        {groups.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group);
          if (!items.length) return null;
          return (
            <div key={group}>
              <Separator className="my-2" />
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group}</p>
              {items.map((item) => (
                <SidebarLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SidebarLink({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}
