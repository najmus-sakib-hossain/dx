"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { useState } from "react";
import { MainMenu } from "./main-menu";

/**
 * Sidebar — Collapsible left sidebar for the dashboard layout.
 * Expands on hover to show menu labels, collapses to icons only.
 */
export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen flex-shrink-0 flex-col justify-between fixed top-0 pb-4 items-center hidden md:flex z-50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "bg-background border-r border-border",
        isExpanded ? "w-[240px]" : "w-[70px]",
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-[70px] flex items-center justify-center bg-background border-b border-border transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isExpanded ? "w-full" : "w-[69px]",
        )}
      >
        <Link href="/" className="absolute left-[22px] transition-none">
          <Icons.LogoSmall />
        </Link>
      </div>

      <div className="flex flex-col w-full pt-[70px] flex-1 border-b border-border mb-3">
        <MainMenu isExpanded={isExpanded} />
      </div>

      {/* User menu at bottom */}
      <div className="px-3 w-full">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors",
            isExpanded ? "justify-start" : "justify-center",
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
            DX
          </div>
          {isExpanded && (
            <span className="text-sm text-muted-foreground truncate">
              DX User
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
