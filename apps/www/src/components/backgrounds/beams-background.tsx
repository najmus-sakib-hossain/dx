"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface BeamsBackgroundProps {
  className?: string;
  beamCount?: number;
  baseColor?: string;
}

/**
 * BeamsBackground — Animated light beam rays emanating from a focal point.
 * Creates a dramatic, ethereal lighting effect.
 * Inspired by react-bits Beams background.
 */
export const BeamsBackground = ({
  className,
  beamCount = 8,
  baseColor = "hsl(262 83% 58%)",
}: BeamsBackgroundProps): React.ReactElement => {
  const beams = React.useMemo(
    () =>
      Array.from({ length: beamCount }, (_, i) => ({
        id: `beam-${i}`,
        rotation: (360 / beamCount) * i,
        delay: i * 0.3,
        width: 1 + Math.random() * 2,
        opacity: 0.05 + Math.random() * 0.1,
      })),
    [beamCount]
  );

  return (
    <div
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        {beams.map((beam) => (
          <div
            key={beam.id}
            className="absolute origin-top animate-pulse"
            style={{
              width: `${beam.width}px`,
              height: "120vh",
              background: `linear-gradient(180deg, ${baseColor} 0%, transparent 80%)`,
              transform: `rotate(${beam.rotation}deg)`,
              opacity: beam.opacity,
              animationDelay: `${beam.delay}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>
      <div
        className="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ backgroundColor: `${baseColor}10` }}
      />
    </div>
  );
};
