"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type MotionValue,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export interface DockItemProps {
  mouseX: MotionValue<number>;
  title: string;
  icon: LucideIcon;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * DockItem — Individual item in the macOS-style dock bar.
 * Scales based on mouse proximity for the magnification effect.
 */
export function DockItem({ mouseX, title, icon: Icon, href, onClick }: DockItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const content = (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "aspect-square w-10 rounded-full flex items-center justify-center",
        "bg-neutral-200/60 dark:bg-neutral-800/80",
        "border border-white/10 dark:border-white/[0.06]",
        "backdrop-blur-md shadow-lg",
        "hover:bg-neutral-300/80 dark:hover:bg-neutral-700/80",
        "transition-colors cursor-pointer"
      )}
    >
      <Icon className="size-[45%] text-neutral-700 dark:text-neutral-200" />
    </motion.div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {onClick ? (
            <button type="button" onClick={onClick} aria-label={title}>
              {content}
            </button>
          ) : (
            <Link href={href} aria-label={title}>
              {content}
            </Link>
          )}
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          <p className="text-xs font-medium">{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
