"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

interface ModeSwitcherProps {
    className?: string;
}

/**
 * ModeSwitcher — toggles between light and dark mode.
 * Click to toggle, right-click for system option.
 * Adapted from themux mode-switcher pattern.
 */
export const ModeSwitcher = ({ className }: ModeSwitcherProps): React.ReactElement => {
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, [resolvedTheme, setTheme]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn("relative", className)}
            aria-label="Toggle theme"
        >
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};
