"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

/**
 * CTASection — final call-to-action before the footer.
 * Gradient background with centered headline, subtitle, and primary CTA.
 */
export function CTASection() {
    return (
        <section className="relative overflow-hidden px-4 py-24 sm:py-32">
            {/* Gradient background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
                <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <div className="mx-auto max-w-3xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                        <Zap className="size-3.5" />
                        Start building today
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                        Ready to supercharge your workflow?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                        Join thousands of developers who've upgraded their development
                        experience. Free to start, no credit card required.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Button
                            size="lg"
                            className="h-12 rounded-full bg-primary px-8 text-base text-primary-foreground shadow-lg shadow-primary/20"
                            asChild
                        >
                            <Link href="/dashboard">
                                Get Started Free <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-full px-8 text-base"
                            asChild
                        >
                            <Link href="/docs">View Documentation</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
