import { ChatPanel } from "@/components/chat/chat-panel";
import { DockBar } from "@/components/dock/dock-bar";
import { ActiveThemeProvider } from "@/components/providers/active-theme";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DX — Enhanced Development Experience",
    template: "%s | DX",
  },
  description:
    "The all-in-one developer platform with 24/7 AI-powered CLI agents, 400+ integrations, and a rich ecosystem of developer tools.",
  openGraph: {
    title: "DX — Enhanced Development Experience",
    description:
      "The all-in-one developer platform with 24/7 AI-powered CLI agents, 400+ integrations, and a rich ecosystem of developer tools.",
    siteName: "DX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "DX — Enhanced Development Experience",
    description:
      "The all-in-one developer platform with 24/7 AI-powered CLI agents, 400+ integrations, and a rich ecosystem of developer tools.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ActiveThemeProvider>
            {children}
            <ChatPanel />
            <DockBar />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
