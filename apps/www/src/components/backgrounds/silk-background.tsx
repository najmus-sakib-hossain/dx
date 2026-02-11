"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface SilkBackgroundProps {
  className?: string;
  speed?: number;
  scale?: number;
  color?: string;
}

/**
 * SilkBackground — Animated silk-like flowing gradient background.
 * Uses CSS animations for smooth, performant rendering.
 * Inspired by react-bits Silk background.
 */
export const SilkBackground = ({
  className,
  speed = 5,
  scale = 1,
  color = "hsl(262 83% 58%)",
}: SilkBackgroundProps): React.ReactElement => {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden opacity-30",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 animate-silk-flow"
        style={
          {
            background: `
              radial-gradient(ellipse at 20% 50%, ${color}22 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, ${color}18 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, ${color}15 0%, transparent 50%)
            `,
            transform: `scale(${scale})`,
            "--silk-speed": `${speed}s`,
          } as React.CSSProperties
        }
      />
      <style jsx>{`
        @keyframes silk-flow {
          0%,
          100% {
            transform: scale(${scale}) translate(0%, 0%) rotate(0deg);
          }
          25% {
            transform: scale(${scale * 1.05}) translate(2%, -1%) rotate(1deg);
          }
          50% {
            transform: scale(${scale}) translate(-1%, 2%) rotate(-1deg);
          }
          75% {
            transform: scale(${scale * 1.02}) translate(1%, 1%) rotate(0.5deg);
          }
        }
        .animate-silk-flow {
          animation: silk-flow var(--silk-speed, 5s) ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
