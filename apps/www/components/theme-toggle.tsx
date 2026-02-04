"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { TooltipWrapper } from "./tooltip-wrapper";

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button className={cn("cursor-pointer", className)} {...props}>
        <Sun />
      </Button>
    );
  }

  return (
    <TooltipWrapper label="Toggle theme" asChild>
      <Button className={cn("cursor-pointer", className)} {...props} onClick={handleThemeToggle}>
        {theme === "light" ? <Sun /> : <Moon />}
      </Button>
    </TooltipWrapper>
  );
}
