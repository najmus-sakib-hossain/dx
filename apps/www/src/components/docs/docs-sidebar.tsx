"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface DocsSidebarItem {
  title: string;
  href: string;
  items?: DocsSidebarItem[];
}

interface DocsSidebarProps {
  items: DocsSidebarItem[];
  className?: string;
}

/**
 * DocsSidebar — Tool-specific documentation sidebar with nested navigation.
 * Inspired by shadcn/ui v4 docs-sidebar component.
 */
export const DocsSidebar = ({
  items,
  className,
}: DocsSidebarProps): React.ReactElement => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-20 z-30 hidden h-[calc(100svh-5rem)] w-56 shrink-0 overflow-y-auto lg:flex",
        className
      )}
    >
      <div className="w-full pr-4">
        <div className="from-background via-background/80 to-background/50 absolute top-0 z-10 h-8 w-full bg-gradient-to-b" />
        <nav className="space-y-6 pt-6">
          {items.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              {section.items && (
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
        <div className="from-background via-background/80 to-background/50 sticky bottom-0 z-10 h-12 bg-gradient-to-t" />
      </div>
    </aside>
  );
};
