"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Steps — Numbered step-by-step guide component for documentation.
 */
export const Steps = ({
  children,
  className,
}: StepsProps): React.ReactElement => {
  return (
    <div
      className={cn(
        "relative my-6 space-y-4 border-l-2 border-border pl-8",
        className
      )}
    >
      {children}
    </div>
  );
};

interface StepProps {
  title: string;
  children: React.ReactNode;
  step?: number;
}

export const Step = ({
  title,
  children,
  step,
}: StepProps): React.ReactElement => {
  return (
    <div className="relative">
      {step !== undefined && (
        <div className="absolute -left-[2.65rem] flex size-6 items-center justify-center rounded-full border-2 border-border bg-background text-xs font-bold text-muted-foreground">
          {step}
        </div>
      )}
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <div className="text-sm text-muted-foreground [&>p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
};
