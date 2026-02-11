import { DX_TOOLS } from "@/config/tools";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import Link from "next/link";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | DX",
  description: "Explore the complete DX documentation — guides, API references, and tutorials for all DX tools.",
};

export default function DocsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center md:py-24">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              DX Documentation
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Everything you need to get started with DX tools. Guides, API references, examples, and more.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DX_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.docsPath}
                className={cn(
                  "group relative flex flex-col rounded-xl border border-border bg-card/50 p-6",
                  "transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <tool.icon className="size-5" style={{ color: tool.color }} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{tool.name}</h2>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        tool.status === "stable" && "text-accent",
                        tool.status === "beta" && "text-yellow-500",
                        tool.status === "coming-soon" && "text-muted-foreground"
                      )}
                    >
                      {tool.status}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                <span className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View docs →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
