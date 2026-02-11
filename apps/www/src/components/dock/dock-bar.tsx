"use client";

import { DX_TOOLS } from "@/config/tools";
import { cn } from "@/lib/utils";
import { motion, useMotionValue } from "framer-motion";
import * as React from "react";
import { DockItem } from "./dock-item";

export function DockBar() {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={cn(
          "nav-dock mx-auto flex h-16 items-end gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 pb-3 backdrop-blur-md dark:bg-black/20",
        )}
      >
        {DX_TOOLS.map((tool) => (
          <DockItem
            key={tool.id}
            mouseX={mouseX}
            title={tool.name}
            icon={tool.icon}
            href={tool.docsPath}
          />
        ))}
      </motion.div>
    </div>
  );
}
