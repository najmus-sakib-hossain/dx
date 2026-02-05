import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Modern Stack 2026",
  description:
    "Next.js 16 with React Query, Framer Motion, Drizzle ORM, Zustand, Better Auth, PGlite, Spline, and shadcn/ui",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Drizzle ORM", "Better Auth"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Next.js Modern Stack 2026",
    description:
      "Next.js 16 with React Query, Framer Motion, Drizzle ORM, Zustand, Better Auth, PGlite, Spline, and shadcn/ui",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Modern Stack 2026",
    description:
      "Next.js 16 with React Query, Framer Motion, Drizzle ORM, Zustand, Better Auth, PGlite, Spline, and shadcn/ui",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
