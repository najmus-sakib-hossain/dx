import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Stay up to date with the latest DX releases and improvements.",
};

const changelog = [
  {
    version: "0.5.0",
    date: "2025-01-15",
    tag: "latest",
    changes: [
      {
        type: "feature" as const,
        description: "Introduced DX Agent daemon with 24/7 background operation",
      },
      {
        type: "feature" as const,
        description: "Added WASM runtime for cross-language plugin support",
      },
      {
        type: "improvement" as const,
        description: "DX Serializer now achieves 73% token savings in LLM format",
      },
      {
        type: "fix" as const,
        description: "Fixed memory leak in long-running agent sessions",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2024-12-01",
    changes: [
      {
        type: "feature" as const,
        description: "Launched Forge Style — AI-powered CSS-in-Rust theming engine",
      },
      {
        type: "feature" as const,
        description: "Added 200+ new integrations (total now 400+)",
      },
      {
        type: "improvement" as const,
        description: "CLI startup time reduced by 60%",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2024-10-15",
    changes: [
      {
        type: "feature" as const,
        description: "Desktop app preview with system tray support",
      },
      {
        type: "feature" as const,
        description: "DX Check — automated code health scoring",
      },
      {
        type: "improvement" as const,
        description: "Improved error messages across all CLI tools",
      },
      {
        type: "fix" as const,
        description: "Resolved icon rendering issues on Windows",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2024-08-01",
    changes: [
      {
        type: "feature" as const,
        description: "DX Serializer with 3-format system (Human → LLM → Machine)",
      },
      {
        type: "feature" as const,
        description: "DX Media for optimized asset pipeline",
      },
      {
        type: "feature" as const,
        description: "DX Font with variable font optimization",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2024-06-01",
    changes: [
      {
        type: "feature" as const,
        description: "Initial release of DX CLI",
      },
      {
        type: "feature" as const,
        description: "Core Icon tool for SVG management",
      },
    ],
  },
] as const;

const typeStyles: Record<string, { label: string; className: string }> = {
  feature: { label: "New", className: "bg-accent/15 text-accent" },
  improvement: { label: "Improved", className: "bg-blue-500/15 text-blue-500" },
  fix: { label: "Fixed", className: "bg-orange-500/15 text-orange-500" },
};

export default function ChangelogPage() {
  return (
    <div className="container-wrapper py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Changelog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          All notable changes to DX are documented here.
        </p>

        <div className="mt-12 space-y-12">
          {changelog.map((release) => (
            <article
              key={release.version}
              className="relative border-l-2 border-border pl-8"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-0 size-4 rounded-full border-2 border-border bg-background" />

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">v{release.version}</h2>
                {"tag" in release && (
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {release.tag}
                  </span>
                )}
              </div>
              <time className="mt-1 block text-sm text-muted-foreground">
                {new Date(release.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              <ul className="mt-4 space-y-2">
                {release.changes.map((change, idx) => {
                  const style = typeStyles[change.type];
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-medium",
                          style?.className
                        )}
                      >
                        {style?.label}
                      </span>
                      <span className="text-sm">{change.description}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
