import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for DX. Free for individuals, with plans for teams and enterprises.",
};

const plans = [
  {
    name: "Community",
    price: "Free",
    description: "For individual developers getting started with DX.",
    features: [
      "CLI tools & Agent daemon",
      "All 7 core tools",
      "Community support",
      "5 integrations",
      "Local-only processing",
    ],
    cta: "Get Started",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For professional developers who want the full DX experience.",
    features: [
      "Everything in Community",
      "Unlimited integrations",
      "Cloud sync & backup",
      "Priority support",
      "Advanced AI agent capabilities",
      "Team collaboration (up to 5)",
      "Custom WASM plugins",
    ],
    cta: "Start Free Trial",
    href: "/sign-up?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "For organizations that need advanced security and dedicated support.",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO & SAML",
      "Dedicated support engineer",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment",
      "Audit logs",
    ],
    cta: "Contact Sales",
    href: "mailto:enterprise@dx.dev",
    highlighted: false,
  },
] as const;

export default function PricingPage() {
  return (
    <div className="container-wrapper py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Upgrade when you need more power.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border border-border bg-card p-8",
              plan.highlighted &&
                "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary"
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                Most Popular
              </span>
            )}

            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">
                {plan.price}
              </span>
              {"period" in plan && (
                <span className="text-muted-foreground">{plan.period}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.description}
            </p>

            <ul className="mt-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-8 w-full"
              variant={plan.highlighted ? "default" : "outline"}
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
