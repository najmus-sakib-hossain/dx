"use client";

import { cn } from "@/lib/utils";
import { PixelCard } from "@/components/animations/pixel-card";
import { motion } from "framer-motion";
import {
    Code2,
    Cpu,
    FileCode2,
    ImageIcon,
    Palette,
    Shield,
    Terminal,
    Type,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
    {
        icon: Palette,
        title: "Forge Style",
        desc: "Advanced CSS token pipeline for design systems. Generate, validate, and transform design tokens at scale.",
        href: "/docs/forge-style",
        color: "text-purple-400",
    },
    {
        icon: Code2,
        title: "Serializer",
        desc: "High-performance data serialization with automatic format detection and streaming support.",
        href: "/docs/serializer",
        color: "text-blue-400",
    },
    {
        icon: ImageIcon,
        title: "Media",
        desc: "Smart image, video, and asset processing. Batch optimization with format conversion.",
        href: "/docs/media",
        color: "text-pink-400",
    },
    {
        icon: FileCode2,
        title: "Icon",
        desc: "Unified icon system with 50k+ icons from every major library. Tree-shaking built in.",
        href: "/docs/icon",
        color: "text-orange-400",
    },
    {
        icon: Type,
        title: "Font",
        desc: "Font subsetting, optimization, and variable font support. Self-host any Google Font.",
        href: "/docs/font",
        color: "text-teal-400",
    },
    {
        icon: Shield,
        title: "Check",
        desc: "Code scanning, validation, and best-practice enforcement across your entire stack.",
        href: "/docs/check",
        color: "text-green-400",
    },
    {
        icon: Terminal,
        title: "CLI",
        desc: "Rust-powered command-line interface. Lightning-fast project scaffolding and toolchain management.",
        href: "/docs/cli",
        color: "text-yellow-400",
    },
    {
        icon: Cpu,
        title: "Agent",
        desc: "24/7 AI-powered development agent that monitors, fixes, and optimizes your projects autonomously.",
        href: "/docs/agent",
        color: "text-cyan-400",
    },
] as const;

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

/**
 * FeaturesSection — grid of 8 DX tools with icons, descriptions, and hover effects.
 * Staggered entrance animations via framer-motion viewport detection.
 */
export function FeaturesSection() {
    return (
        <section className="relative px-4 py-24 sm:py-32">
            <div className="mx-auto max-w-[1400px]">
                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
                        Developer Tools
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                        Everything you need. Nothing you don&apos;t.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Eight purpose-built tools that cover your entire workflow — from
                        design tokens to production deployment.
                    </p>
                </motion.div>

                {/* Features grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {FEATURES.map((feature) => (
                        <motion.div key={feature.title} variants={itemVariants as any}>
                          <PixelCard className="h-full">
                            <Link
                                href={feature.href}
                                className="group relative flex h-full flex-col rounded-xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                            >
                                <feature.icon
                                    className={cn("mb-4 size-8", feature.color)}
                                    strokeWidth={1.5}
                                />
                                <h3 className="mb-2 text-lg font-semibold text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {feature.desc}
                                </p>
                                <div className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                    Learn more →
                                </div>
                            </Link>
                          </PixelCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
