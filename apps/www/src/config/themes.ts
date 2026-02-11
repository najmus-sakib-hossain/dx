/**
 * DX Theme Configuration
 * Defines all available themes for the DX website.
 * Inspired by themux and tweakcn theme systems.
 */

export interface ThemeConfig {
  id: string;
  name: string;
  label: string;
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export const DX_THEMES: ThemeConfig[] = [
  {
    id: "default",
    name: "DX Default",
    label: "Default",
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "0 0% 3.9%",
        "--primary": "262 83% 58%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "215 20% 95%",
        "--secondary-foreground": "215 20% 15%",
        "--accent": "142 71% 45%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "0 0% 96%",
        "--muted-foreground": "0 0% 45%",
        "--card": "0 0% 100%",
        "--card-foreground": "0 0% 3.9%",
        "--border": "0 0% 90%",
        "--input": "0 0% 90%",
        "--ring": "262 83% 58%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",
      },
      dark: {
        "--background": "0 0% 3.9%",
        "--foreground": "0 0% 98%",
        "--primary": "262 83% 58%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "215 20% 15%",
        "--secondary-foreground": "0 0% 98%",
        "--accent": "142 71% 45%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "0 0% 15%",
        "--muted-foreground": "0 0% 64%",
        "--card": "0 0% 6%",
        "--card-foreground": "0 0% 98%",
        "--border": "0 0% 14.9%",
        "--input": "0 0% 14.9%",
        "--ring": "262 83% 58%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",
      },
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    label: "Midnight",
    cssVars: {
      light: {
        "--background": "222 47% 97%",
        "--foreground": "222 47% 6%",
        "--primary": "222 47% 35%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "222 20% 92%",
        "--secondary-foreground": "222 20% 12%",
        "--accent": "200 80% 45%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "220 15% 94%",
        "--muted-foreground": "220 8% 46%",
        "--card": "0 0% 100%",
        "--card-foreground": "222 47% 6%",
        "--border": "220 13% 88%",
        "--input": "220 13% 88%",
        "--ring": "222 47% 35%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",
      },
      dark: {
        "--background": "222 47% 4%",
        "--foreground": "210 40% 98%",
        "--primary": "217 91% 60%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "217 33% 12%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "200 80% 45%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "217 33% 12%",
        "--muted-foreground": "215 20% 55%",
        "--card": "222 47% 6%",
        "--card-foreground": "210 40% 98%",
        "--border": "217 33% 14%",
        "--input": "217 33% 14%",
        "--ring": "217 91% 60%",
        "--destructive": "0 62% 55%",
        "--destructive-foreground": "0 0% 100%",
      },
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    label: "Emerald",
    cssVars: {
      light: {
        "--background": "150 20% 98%",
        "--foreground": "150 20% 6%",
        "--primary": "160 84% 39%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "150 15% 93%",
        "--secondary-foreground": "150 20% 12%",
        "--accent": "160 84% 39%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "150 10% 94%",
        "--muted-foreground": "150 8% 46%",
        "--card": "0 0% 100%",
        "--card-foreground": "150 20% 6%",
        "--border": "150 10% 88%",
        "--input": "150 10% 88%",
        "--ring": "160 84% 39%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",
      },
      dark: {
        "--background": "150 20% 4%",
        "--foreground": "150 10% 98%",
        "--primary": "160 84% 39%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "160 20% 12%",
        "--secondary-foreground": "150 10% 98%",
        "--accent": "160 84% 39%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "160 15% 12%",
        "--muted-foreground": "150 10% 55%",
        "--card": "150 20% 6%",
        "--card-foreground": "150 10% 98%",
        "--border": "160 15% 14%",
        "--input": "160 15% 14%",
        "--ring": "160 84% 39%",
        "--destructive": "0 62% 55%",
        "--destructive-foreground": "0 0% 100%",
      },
    },
  },
  {
    id: "rose",
    name: "Rose",
    label: "Rose",
    cssVars: {
      light: {
        "--background": "350 20% 98%",
        "--foreground": "350 20% 6%",
        "--primary": "346 77% 50%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "350 15% 93%",
        "--secondary-foreground": "350 20% 12%",
        "--accent": "346 77% 50%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "350 10% 94%",
        "--muted-foreground": "350 8% 46%",
        "--card": "0 0% 100%",
        "--card-foreground": "350 20% 6%",
        "--border": "350 10% 88%",
        "--input": "350 10% 88%",
        "--ring": "346 77% 50%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",
      },
      dark: {
        "--background": "350 20% 4%",
        "--foreground": "350 10% 98%",
        "--primary": "346 77% 50%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "346 20% 12%",
        "--secondary-foreground": "350 10% 98%",
        "--accent": "346 77% 50%",
        "--accent-foreground": "0 0% 100%",
        "--muted": "346 15% 12%",
        "--muted-foreground": "350 10% 55%",
        "--card": "350 20% 6%",
        "--card-foreground": "350 10% 98%",
        "--border": "346 15% 14%",
        "--input": "346 15% 14%",
        "--ring": "346 77% 50%",
        "--destructive": "0 62% 55%",
        "--destructive-foreground": "0 0% 100%",
      },
    },
  },
] as const;

/**
 * Get a theme config by its ID.
 */
export function getThemeById(id: string): ThemeConfig | undefined {
  return DX_THEMES.find((theme) => theme.id === id);
}

/**
 * Convert a theme's CSS vars to a style object for runtime application.
 */
export function themeToStyleVars(
  theme: ThemeConfig,
  mode: "light" | "dark"
): Record<string, string> {
  return theme.cssVars[mode];
}
