"use client";

import { useCallback, useState } from "react";
import { Check, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { THEMES, type ThemeConfig } from "@/config/themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const [activeThemeId, setActiveThemeId] = useState<string>("default");
  const [open, setOpen] = useState(false);

  const applyTheme = useCallback((theme: ThemeConfig) => {
    setActiveThemeId(theme.id);

    // Apply CSS custom properties to :root
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const vars = isDark ? theme.cssVars.dark : theme.cssVars.light;

    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(`--${key}`, value);
    }

    setOpen(false);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-9", className)}
          aria-label="Select theme"
        >
          <Palette className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-3">
        <div className="mb-2">
          <p className="text-sm font-medium">Theme</p>
          <p className="text-xs text-muted-foreground">
            Choose a color theme for the interface.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence>
            {THEMES.map((theme) => (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => applyTheme(theme)}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50",
                  activeThemeId === theme.id &&
                    "border-primary bg-primary/5"
                )}
              >
                {/* Color preview dots */}
                <div className="flex gap-1">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: `oklch(${theme.cssVars.dark.primary})` }}
                  />
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: `oklch(${theme.cssVars.dark.accent})` }}
                  />
                </div>
                <span className="text-sm font-medium">{theme.label}</span>
                {activeThemeId === theme.id && (
                  <Check className="absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-primary" />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
}
