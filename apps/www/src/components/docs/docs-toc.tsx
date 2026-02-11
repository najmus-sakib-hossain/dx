"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface TocItem {
  title: string;
  url: string;
  depth: number;
}

interface DocsTableOfContentsProps {
  toc: TocItem[];
  className?: string;
}

/**
 * DocsTableOfContents — Auto-generated table of contents from headings.
 * Highlights the currently active section using intersection observer.
 * Inspired by shadcn/ui v4 docs-toc component.
 */
export const DocsTableOfContents = ({
  toc,
  className,
}: DocsTableOfContentsProps): React.ReactElement | null => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const itemIds = React.useMemo(
    () => toc.map((item) => item.url.replace("#", "")),
    [toc]
  );

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    for (const id of itemIds) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, [itemIds]);

  if (!toc.length) return null;

  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <p className="text-muted-foreground text-xs font-medium">On This Page</p>
      {toc.map((item) => (
        <a
          key={item.url}
          href={item.url}
          className={cn(
            "text-muted-foreground hover:text-foreground text-[0.8rem] no-underline transition-colors",
            item.url === `#${activeId}` && "text-foreground font-medium",
            item.depth === 3 && "pl-4",
            item.depth === 4 && "pl-6"
          )}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
};
