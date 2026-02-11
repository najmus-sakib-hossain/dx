"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
    {
        q: "What is DX?",
        a: "DX is an all-in-one developer platform that provides eight purpose-built tools — from design token pipelines and code serialization to AI agents and CLI tooling. It's designed to replace fragmented toolchains with a single, cohesive ecosystem.",
    },
    {
        q: "Is DX free to use?",
        a: "DX offers a generous free tier for individual developers and small teams. Our CLI and most tools are free and open-source. Premium features like the AI Agent, priority support, and advanced analytics are available on paid plans.",
    },
    {
        q: "How does the AI Agent work?",
        a: "The DX Agent runs 24/7, monitoring your repositories for issues, optimizing performance, and shipping fixes autonomously. It understands your codebase context and follows your team's coding conventions.",
    },
    {
        q: "Can I use DX with my existing tools?",
        a: "Absolutely. DX integrates with 400+ tools and services. It works alongside your existing CI/CD, editors, design tools, and deployment platforms. You can adopt DX incrementally, one tool at a time.",
    },
    {
        q: "Is DX open source?",
        a: "The DX CLI, core libraries, and many tools are open source under the MIT license. Some premium features and the hosted platform are proprietary. We believe in building in the open and contributing back to the community.",
    },
    {
        q: "What languages and frameworks does DX support?",
        a: "DX is framework-agnostic and supports all major web technologies including React, Vue, Svelte, Angular, Next.js, Nuxt, Astro, and more. Our CLI works with any project structure.",
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="relative px-4 py-24 sm:py-32">
            <div className="mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
                        FAQ
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Common questions
                    </h2>
                </motion.div>

                <div className="space-y-2">
                    {FAQ_ITEMS.map((item, index) => (
                        <motion.div
                            key={item.q}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="rounded-lg border border-border"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenIndex(openIndex === index ? null : index)
                                }
                                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-card/50"
                            >
                                <span className="text-sm font-medium text-foreground sm:text-base">
                                    {item.q}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                                        openIndex === index && "rotate-180"
                                    )}
                                />
                            </button>
                            <div
                                className={cn(
                                    "grid transition-all duration-200",
                                    openIndex === index
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                )}
                            >
                                <div className="overflow-hidden">
                                    <p className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
