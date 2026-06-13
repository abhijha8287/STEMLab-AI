"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils/cn";
import { APP_NAME } from "@/lib/constants";

export function Navbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background/95 backdrop-blur px-4 gap-3">
      {!isHome && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <Link href="/" className="flex items-center gap-2 font-semibold">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <FlaskConical className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className={cn("text-sm", isHome && "text-base font-bold")}>{APP_NAME}</span>
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Button variant="default" size="sm" asChild>
          <Link href="/dashboard">Open Lab</Link>
        </Button>
      </div>
    </header>
  );
}
