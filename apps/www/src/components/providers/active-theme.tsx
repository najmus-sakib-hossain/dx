"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

const DEFAULT_THEME = "default";

interface ActiveThemeContextType {
    activeTheme: string;
    setActiveTheme: (theme: string) => void;
}

const ActiveThemeContext = createContext<ActiveThemeContextType | undefined>(
    undefined
);

interface ActiveThemeProviderProps {
    children: ReactNode;
    initialTheme?: string;
}

/**
 * ActiveThemeProvider — manages the active color theme via body class.
 * Supports theme switching between DX presets (e.g., theme-default, theme-ocean).
 * Adapted from shadcn/ui v4 active-theme system.
 *
 * @param children - React children to wrap.
 * @param initialTheme - Optional initial theme name (defaults to "default").
 */
export const ActiveThemeProvider = ({
    children,
    initialTheme,
}: ActiveThemeProviderProps): React.ReactElement => {
    const [activeTheme, setActiveTheme] = useState<string>(
        () => initialTheme || DEFAULT_THEME
    );

    useEffect(() => {
        Array.from(document.body.classList)
            .filter((className) => className.startsWith("theme-"))
            .forEach((className) => {
                document.body.classList.remove(className);
            });
        document.body.classList.add(`theme-${activeTheme}`);
    }, [activeTheme]);

    return (
        <ActiveThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
            {children}
        </ActiveThemeContext.Provider>
    );
};

/**
 * useActiveTheme — hook to access and change the active color theme.
 * Must be used within an ActiveThemeProvider.
 */
export const useActiveTheme = (): ActiveThemeContextType => {
    const context = useContext(ActiveThemeContext);
    if (context === undefined) {
        throw new Error(
            "useActiveTheme must be used within an ActiveThemeProvider"
        );
    }
    return context;
};
