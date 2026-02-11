"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface GridDistortionProps {
  className?: string;
  gridSize?: number;
  lineColor?: string;
}

/**
 * GridDistortion — Animated grid background with subtle distortion effect.
 * Creates a tech-forward aesthetic with perspective lines.
 * Inspired by react-bits GridDistortion background.
 */
export const GridDistortion = ({
  className,
  gridSize = 64,
  lineColor,
}: GridDistortionProps): React.ReactElement => {
  return (
    <div
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[3%]"
        style={{
          backgroundImage: `
            linear-gradient(${lineColor ?? "var(--foreground)"} 1px, transparent 1px),
            linear-gradient(90deg, ${lineColor ?? "var(--foreground)"} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, var(--background) 70%)",
        }}
      />
    </div>
  );
};
