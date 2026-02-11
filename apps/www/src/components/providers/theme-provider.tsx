"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider — wraps next-themes provider with DX defaults.
 * Dark mode first, class-based theme switching, system detection enabled.
 */
export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>): React.ReactElement => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
