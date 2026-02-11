"use client";

import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/effects";
import { SilkBackground } from "@/components/backgrounds/silk-background";
import { GradualBlur } from "@/components/animations/gradual-blur";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * HeroSection — enhanced landing page hero with Spotlight effect,
 * animated gradient mesh background, staggered entrance animations.
 * DX brand copy with purple-to-green gradient headline.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-32 text-center">
      {/* Silk flowing background */}
      <SilkBackground className="absolute inset-0 -z-20 opacity-30" />

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[128px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="oklch(0.588 0.243 264.376 / 0.3)"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[3%]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Announcement badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-md"
      >
        <Sparkles className="size-3.5 text-accent" />
        <span>DX Agent v2.0 — 24/7 AI Code Agent is live</span>
        <ArrowRight className="size-3 text-muted-foreground" />
      </motion.div>

      {/* Headline */}
      <GradualBlur delay={0.15} duration={0.8}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            Enhanced
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Development Experience
          </span>
        </motion.h1>
      </GradualBlur>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
      >
        The all-in-one platform for modern developers. AI-powered tools,
        400+ integrations, and a rich ecosystem built for speed.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Button
          size="lg"
          className="h-12 rounded-full bg-primary px-8 text-base text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          asChild
        >
          <Link href="/dashboard">
            Get Started Free <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-12 rounded-full border-border bg-card/50 px-8 text-base backdrop-blur-md hover:bg-card"
          asChild
        >
          <Link href="/docs/cli">
            <Terminal className="mr-2 size-4" />
            Install CLI
          </Link>
        </Button>
      </motion.div>

      {/* Terminal preview hint */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20 w-full max-w-3xl"
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="size-3 rounded-full bg-destructive/70" />
            <div className="size-3 rounded-full bg-yellow-500/70" />
            <div className="size-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">
              terminal — dx
            </span>
          </div>
          <div className="px-6 py-5 font-mono text-sm">
            <p className="text-muted-foreground">
              <span className="text-accent">$</span> npx dx init
            </p>
            <p className="mt-2 text-muted-foreground/80">
              ✓ Initializing DX workspace...
            </p>
            <p className="text-muted-foreground/80">
              ✓ 400+ integrations available
            </p>
            <p className="text-muted-foreground/80">
              ✓ AI Agent connected
            </p>
            <p className="mt-2 text-accent">
              Ready. Welcome to DX. 🚀
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
