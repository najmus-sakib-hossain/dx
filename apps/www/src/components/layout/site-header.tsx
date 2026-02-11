"use client";

import { cn } from "@/lib/utils";
import { ModeSwitcher } from "@/components/layout/mode-switcher";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DX Tools for the mega-menu — matches the DX tool registry categories.
 */
const TOOLS_NAV = [
  {
    href: "/docs/forge-style",
    title: "Forge Style",
    desc: "Advanced style system and design tokens",
  },
  {
    href: "/docs/serializer",
    title: "Serializer",
    desc: "High-performance data serialization",
  },
  {
    href: "/docs/media",
    title: "Media",
    desc: "Image, video, and asset processing",
  },
  {
    href: "/docs/icon",
    title: "Icon",
    desc: "Unified icon system with 50k+ icons",
  },
  {
    href: "/docs/font",
    title: "Font",
    desc: "Font management and optimization",
  },
  {
    href: "/docs/check",
    title: "Check",
    desc: "Code quality and validation tools",
  },
  {
    href: "/docs/cli",
    title: "CLI",
    desc: "Rust-powered command-line interface",
  },
  {
    href: "/docs/agent",
    title: "Agent",
    desc: "24/7 AI-powered development agent",
  },
];

const RESOURCES_NAV = [
  {
    href: "/docs",
    title: "Documentation",
    desc: "Guides, API references, and tutorials",
  },
  {
    href: "/changelog",
    title: "Changelog",
    desc: "Latest updates and releases",
  },
  {
    href: "https://github.com/essencefromexistence/dx",
    title: "GitHub",
    desc: "Open source repository",
    external: true,
  },
  {
    href: "/about",
    title: "About DX",
    desc: "Our story and mission",
  },
];

interface SiteHeaderProps {
  transparent?: boolean;
}

/**
 * SiteHeader — main navigation bar with mega-menu dropdowns.
 * Adapted from the midday header pattern with DX branding.
 * Features: fixed position, frosted glass, prefetch on hover, animated mobile menu.
 */
export const SiteHeader = ({ transparent = false }: SiteHeaderProps): React.ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const toolsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns on route change
  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setIsToolsOpen(false);
    setIsResourcesOpen(false);
    setIsMobileToolsOpen(false);
    setIsMobileResourcesOpen(false);
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
      if (resourcesTimeoutRef.current)
        clearTimeout(resourcesTimeoutRef.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Dark overlay behind dropdowns */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] z-40 transition-opacity duration-150",
          isToolsOpen || isResourcesOpen
            ? "bg-black/40 opacity-100 visible"
            : "pointer-events-none opacity-0 invisible"
        )}
        aria-hidden="true"
      />

      <nav className="fixed top-0 left-0 right-0 z-50 w-full" role="navigation">
        <div
          className={cn(
            "relative flex items-center justify-between px-4 py-3 xl:px-8 xl:py-4",
            !transparent && "backdrop-blur-md bg-background/80",
            !transparent &&
            (isToolsOpen || isResourcesOpen) &&
            "xl:bg-background"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            onClick={closeAll}
            aria-label="DX — Go to homepage"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                DX
              </span>
            </div>
            <span className="text-base font-semibold text-foreground xl:hidden">
              DX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 xl:flex">
            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (toolsTimeoutRef.current)
                  clearTimeout(toolsTimeoutRef.current);
                setIsToolsOpen(true);
                setIsResourcesOpen(false);
              }}
              onMouseLeave={() => {
                toolsTimeoutRef.current = setTimeout(() => {
                  setIsToolsOpen(false);
                }, 200);
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-expanded={isToolsOpen}
              >
                Tools
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    isToolsOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Invisible bridge */}
              {isToolsOpen && (
                <div
                  className="absolute left-0 right-0 h-4"
                  style={{ top: "100%" }}
                />
              )}

              {/* Tools mega-menu */}
              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="fixed left-0 right-0 z-50 border-b border-t border-border bg-background shadow-lg"
                    style={{ top: "100%" }}
                  >
                    <div className="mx-auto max-w-[1400px] p-8">
                      <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                        {TOOLS_NAV.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex flex-col rounded-lg p-3 transition-colors hover:bg-secondary"
                            onClick={closeAll}
                          >
                            <span className="mb-1 text-sm font-medium text-foreground">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                              {item.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/pricing"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (resourcesTimeoutRef.current)
                  clearTimeout(resourcesTimeoutRef.current);
                setIsResourcesOpen(true);
                setIsToolsOpen(false);
              }}
              onMouseLeave={() => {
                resourcesTimeoutRef.current = setTimeout(() => {
                  setIsResourcesOpen(false);
                }, 200);
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-expanded={isResourcesOpen}
              >
                Resources
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    isResourcesOpen && "rotate-180"
                  )}
                />
              </button>

              {isResourcesOpen && (
                <div
                  className="absolute left-0 right-0 h-4"
                  style={{ top: "100%" }}
                />
              )}

              <AnimatePresence>
                {isResourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="fixed left-0 right-0 z-50 border-b border-t border-border bg-background shadow-lg"
                    style={{ top: "100%" }}
                  >
                    <div className="mx-auto max-w-[1400px] p-8">
                      <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                        {RESOURCES_NAV.map((item) => (
                          <Link
                            key={item.href}
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
                            className="group flex flex-col rounded-lg p-3 transition-colors hover:bg-secondary"
                            onClick={closeAll}
                          >
                            <span className="mb-1 text-sm font-medium text-foreground">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                              {item.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side: theme toggle + auth */}
            <div className="ml-4 flex items-center gap-2 border-l border-border pl-4">
              <ModeSwitcher />
              <Link
                href="/sign-in"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <ModeSwitcher />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex size-10 items-center justify-center rounded-md text-foreground"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="size-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="size-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background pt-20 xl:hidden"
          >
            <div className="flex flex-col gap-4 px-6 pt-8">
              {/* Tools accordion */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="flex items-center justify-between py-2 text-xl font-medium text-foreground"
                >
                  <span>Tools</span>
                  <ChevronDown
                    className={cn(
                      "size-5 transition-transform duration-200",
                      isMobileToolsOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isMobileToolsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col gap-3 overflow-hidden border-t border-border pt-3"
                    >
                      {TOOLS_NAV.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeAll}
                          className="text-base text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/pricing"
                onClick={closeAll}
                className="py-2 text-xl font-medium text-foreground"
              >
                Pricing
              </Link>

              {/* Resources accordion */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    setIsMobileResourcesOpen(!isMobileResourcesOpen)
                  }
                  className="flex items-center justify-between py-2 text-xl font-medium text-foreground"
                >
                  <span>Resources</span>
                  <ChevronDown
                    className={cn(
                      "size-5 transition-transform duration-200",
                      isMobileResourcesOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isMobileResourcesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col gap-3 overflow-hidden border-t border-border pt-3"
                    >
                      {RESOURCES_NAV.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeAll}
                          className="text-base text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile auth */}
              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-6">
                <Link
                  href="/sign-in"
                  onClick={closeAll}
                  className="w-full rounded-lg border border-border py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeAll}
                  className="w-full rounded-lg bg-primary py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
