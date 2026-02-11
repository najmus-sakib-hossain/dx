import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about DX — the enhanced development experience platform built with Rust for unmatched speed, security, and extensibility.",
};

const values = [
  {
    title: "Performance First",
    description:
      "Built in Rust for 10-80x faster execution than Node.js alternatives. Zero garbage collection, memory-safe, compiled to native code.",
  },
  {
    title: "Token Efficiency",
    description:
      "Our DX Serializer achieves 70%+ token savings over JSON through a 3-format system: Human → LLM → Machine.",
  },
  {
    title: "Infinite Extensibility",
    description:
      "WASM runtime supports plugins in any language. Compile Python, Node.js, or Go to WASM and integrate seamlessly.",
  },
  {
    title: "Security by Default",
    description:
      "Rust's ownership model provides compile-time memory safety guarantees. No runtime errors, no data races, no undefined behavior.",
  },
  {
    title: "Open Source",
    description:
      "DX is built in the open. Every tool, integration, and plugin is available on GitHub for the community to use and improve.",
  },
  {
    title: "Developer Joy",
    description:
      "Every feature is designed to reduce friction and amplify productivity. From the CLI to the desktop app, DX just works.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="container-wrapper py-20">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          The Enhanced Development Experience
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          DX is an advanced Rust-based AI agent platform designed for AGI-like
          functionality. It connects to your apps, controls your tools, and
          provides a secure, fast, and efficient platform for automation and
          integration.
        </p>
      </section>

      {/* Values grid */}
      <section className="mx-auto mt-20 max-w-5xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          What drives us
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto mt-20 max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Architecture</h2>
        <p className="mt-4 text-muted-foreground">
          DX operates a dual-daemon system: an <strong>Agent Daemon</strong>{" "}
          running 24/7 as your personal assistant, and a{" "}
          <strong>Project Daemon</strong> activated per workspace as your coding
          companion. Both communicate through the DX Serializer's ultra-fast
          binary format (~48ns serialization with RKYV).
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Ready to transform your workflow?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join thousands of developers who have already enhanced their
          development experience.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs">Read the Docs</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
