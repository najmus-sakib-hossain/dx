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
  useMotionValue,
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
}

export function DockItem({ mouseX, title, icon: Icon, href }: DockItemProps) {
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <motion.div
              ref={ref}
              style={{ width }}
              className="aspect-square w-10 rounded-full bg-neutral-400/20 dark:bg-neutral-800/80 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg hover:bg-neutral-300 dark:hover:bg-neutral-700/80 transition-colors"
            >
              <Icon className="size-5 text-neutral-800 dark:text-neutral-200" />
            </motion.div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
