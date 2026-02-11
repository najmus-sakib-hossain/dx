"use client";

import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import * as React from "react";

interface ClickSparkProps {
  children: React.ReactNode;
  className?: string;
  sparkColor?: string;
  sparkCount?: number;
}

/**
 * ClickSpark — Creates a burst of spark particles on click.
 * Inspired by react-bits ClickSpark animation.
 */
export const ClickSpark = ({
  children,
  className,
  sparkColor = "hsl(262 83% 58%)",
  sparkCount = 8,
}: ClickSparkProps): React.ReactElement => {
  const [sparks, setSparks] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        id: Date.now() + i,
        x,
        y,
      }));

      setSparks((prev) => [...prev, ...newSparks]);
      setTimeout(() => {
        setSparks((prev) =>
          prev.filter((s) => !newSparks.some((ns) => ns.id === s.id))
        );
      }, 600);
    },
    [sparkCount]
  );

  return (
    <div className={cn("relative", className)} onClick={handleClick}>
      {children}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ x: spark.x, y: spark.y, scale: 1, opacity: 1 }}
          animate={{
            x: spark.x + (Math.random() - 0.5) * 80,
            y: spark.y + (Math.random() - 0.5) * 80,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pointer-events-none absolute size-1.5 rounded-full"
          style={{ backgroundColor: sparkColor }}
        />
      ))}
    </div>
  );
};
