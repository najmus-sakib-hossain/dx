import { cn } from "@/lib/utils";
import Link from "next/link";

const FOOTER_LINKS = {
  tools: {
    title: "Tools",
    items: [
      { href: "/docs/forge-style", label: "Forge Style" },
      { href: "/docs/serializer", label: "Serializer" },
      { href: "/docs/media", label: "Media" },
      { href: "/docs/icon", label: "Icon" },
      { href: "/docs/font", label: "Font" },
      { href: "/docs/check", label: "Check" },
      { href: "/docs/cli", label: "CLI" },
      { href: "/docs/agent", label: "Agent" },
    ],
  },
  product: {
    title: "Product",
    items: [
      { href: "/pricing", label: "Pricing" },
      { href: "/docs", label: "Documentation" },
      { href: "/changelog", label: "Changelog" },
      { href: "/about", label: "About" },
    ],
  },
  resources: {
    title: "Resources",
    items: [
      { href: "/docs", label: "Getting Started" },
      {
        href: "https://github.com/essencefromexistence/dx",
        label: "GitHub",
        external: true,
      },
      { href: "/docs/cli", label: "CLI Reference" },
      { href: "/docs/agent", label: "Agent Docs" },
    ],
  },
  company: {
    title: "Company",
    items: [
      { href: "/about", label: "About DX" },
      { href: "/changelog", label: "Updates" },
      {
        href: "https://x.com/dx",
        label: "X / Twitter",
        external: true,
      },
      {
        href: "https://github.com/essencefromexistence/dx",
        label: "GitHub",
        external: true,
      },
    ],
  },
  legal: {
    title: "Legal",
    items: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
} as const;

/**
 * SiteFooter — rich multi-column footer adapted from midday's design pattern.
 * Features: 5-column link grid, tagline, system status indicator, large brand wordmark.
 */
export const SiteFooter = (): React.ReactElement => {
  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Top divider */}
      <div className="h-px w-full border-t border-border" />

      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 sm:pb-64">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left: Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
            {Object.values(FOOTER_LINKS).map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="mb-4 text-sm font-medium text-foreground">
                  {section.title}
                </h3>
                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      target={
                        "external" in item && item.external
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        "external" in item && item.external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Tagline + status */}
          <div className="flex flex-col items-start gap-6 lg:items-end lg:gap-10">
            <p className="text-left text-base text-foreground sm:text-xl lg:text-right">
              Enhanced Development Experience.
              <br />
              <span className="text-muted-foreground">
                Build faster. Ship better.
              </span>
            </p>

            {/* System status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                System status:
              </span>
              <span className="text-sm text-foreground">Operational</span>
              <div className="relative flex items-center justify-center">
                <div className="relative z-10 size-2 rounded-full bg-green-500" />
                <div className="absolute size-2 animate-ping rounded-full bg-green-500/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16">
          <div className="h-px w-full border-t border-border" />
        </div>

        {/* Bottom: Copyright */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DX. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Large wordmark background */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%] select-none overflow-hidden">
        <span
          className={cn(
            "block text-[200px] font-bold leading-none sm:text-[400px]",
            "text-muted/30"
          )}
          aria-hidden="true"
        >
          DX
        </span>
      </div>
    </footer>
  );
};
