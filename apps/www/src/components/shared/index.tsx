"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ── Container ───────────────────────────────────────────────
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max-width preset */
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeMap: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "xl", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeMap[size], className)}
      {...props}
    />
  )
);
Container.displayName = "Container";

// ── Section ─────────────────────────────────────────────────
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical padding size */
  padding?: "sm" | "md" | "lg";
}

const paddingMap: Record<string, string> = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-24 sm:py-32",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ padding = "md", className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("relative", paddingMap[padding], className)}
      {...props}
    />
  )
);
Section.displayName = "Section";

// ── Prose ───────────────────────────────────────────────────
export const Prose = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "prose prose-neutral dark:prose-invert max-w-none",
      "prose-headings:font-semibold prose-headings:tracking-tight",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm",
      className
    )}
    {...props}
  />
));
Prose.displayName = "Prose";

// ── Divider ─────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn("border-t border-border", className)}
      aria-hidden="true"
    />
  );
}

// ── VisuallyHidden ──────────────────────────────────────────
export function VisuallyHidden({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
      {children}
    </span>
  );
}

// ── Skeleton variants ───────────────────────────────────────
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-border bg-muted/40 p-6",
        className
      )}
    >
      <div className="mb-4 h-4 w-2/3 rounded bg-muted" />
      <div className="mb-2 h-3 w-full rounded bg-muted" />
      <div className="h-3 w-4/5 rounded bg-muted" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded bg-muted"
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
