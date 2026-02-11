"use client";

import { DX_TOOLS } from "@/config/tools";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";
import { useDockStore } from "@/stores/dock-store";
import { motion, useMotionValue } from "framer-motion";
import { LayoutDashboard, MessageCircle } from "lucide-react";
import * as React from "react";
import { DockItem } from "./dock-item";

/**
 * DockBar — macOS-style application dock fixed to the bottom of the viewport.
 * Lists all DX tools with animated hover magnification.
 * Includes Chat and Dashboard quick-access items.
 */
export function DockBar() {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const isVisible = useDockStore((s) => s.isVisible);
  const toggleChat = useChatStore((s) => s.toggleChat);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={cn(
          "mx-auto flex h-16 items-end gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 pb-3 backdrop-blur-xl",
          "dark:border-white/[0.08] dark:bg-black/30",
          "shadow-lg shadow-black/5 dark:shadow-black/20"
        )}
        role="toolbar"
        aria-label="DX Tools Dock"
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

        {/* Separator */}
        <div className="mx-1 h-8 w-px bg-white/10 dark:bg-white/[0.06]" />

        {/* Dashboard */}
        <DockItem
          mouseX={mouseX}
          title="Dashboard"
          icon={LayoutDashboard}
          href="/dashboard"
        />

        {/* Chat */}
        <DockItem
          mouseX={mouseX}
          title="Chat"
          icon={MessageCircle}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleChat();
          }}
        />
      </motion.div>
    </div>
  );
}
