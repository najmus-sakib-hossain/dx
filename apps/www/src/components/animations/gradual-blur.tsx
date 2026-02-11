"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

interface GradualBlurProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * GradualBlur — Fade-in animation with a gradual blur-to-clear effect.
 * Content starts blurred and transparent, then sharpens into view.
 * Inspired by react-bits GradualBlur animation.
 */
export const GradualBlur = ({
  children,
  className,
  delay = 0,
  duration = 0.8,
}: GradualBlurProps): React.ReactElement => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};
