"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface DocsBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * DocsBreadcrumb — Breadcrumb navigation for documentation pages.
 * Shows: Home > Docs > {Tool} > {Page}
 * Inspired by shadcn/ui v4 docs-breadcrumb component.
 */
export const DocsBreadcrumb = ({
  items,
  className,
}: DocsBreadcrumbProps): React.ReactElement | null => {
  if (items.length === 0) return null;

  return (
    <nav className={cn("flex items-center text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <ChevronRight className="size-3.5 text-muted-foreground" />
        </li>
        <li>
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </li>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            <li>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </li>
            <li>
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {item.title}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};
