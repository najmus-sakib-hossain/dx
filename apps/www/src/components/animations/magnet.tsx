"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as React from "react";

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

/**
 * Magnet — A component that makes its children follow the mouse cursor
 * with a magnetic pull effect within a configurable radius.
 * Inspired by react-bits Magnet animation.
 */
export const Magnet = ({
  children,
  className,
  strength = 0.3,
  radius = 200,
}: MagnetProps): React.ReactElement => {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < radius) {
        x.set(distanceX * strength);
        y.set(distanceY * strength);
      }
    },
    [strength, radius, x, y]
  );

  const handleMouseLeave = React.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};
