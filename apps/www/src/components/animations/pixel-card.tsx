"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import * as React from "react";

interface PixelCardProps {
  children?: React.ReactNode;
  className?: string;
  gap?: number;
  speed?: number;
  colors?: string[];
  variant?: "default" | "blue" | "purple" | "green";
}

/**
 * PixelCard — A card component with animated pixel shimmer effect on hover.
 * Inspired by react-bits PixelCard component.
 */
export const PixelCard = ({
  children,
  className,
  gap = 5,
  speed = 50,
  colors,
  variant = "purple",
}: PixelCardProps): React.ReactElement => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const VARIANT_COLORS: Record<string, string[]> = {
    default: ["#f59e0b", "#ef4444", "#8b5cf6"],
    blue: ["#3b82f6", "#06b6d4", "#6366f1"],
    purple: ["#8b5cf6", "#a855f7", "#6366f1"],
    green: ["#10b981", "#34d399", "#059669"],
  };

  const palette = colors ?? VARIANT_COLORS[variant] ?? VARIANT_COLORS.purple;

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const background = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${palette[0]}22, transparent 80%)`;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/30",
        className
      )}
      style={{ background }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
