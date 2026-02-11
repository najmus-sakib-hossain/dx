export const siteConfig = {
  name: "DX",
  fullName: "DX — Enhanced Development Experience",
  description:
    "The all-in-one developer platform with 24/7 AI-powered CLI agents, 400+ integrations, and a rich ecosystem of developer tools built with Rust.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://dx.dev",
  ogImage: "/og/default.png",
  links: {
    github: "https://github.com/dx-dev",
    twitter: "https://x.com/dx_dev",
    discord: "https://discord.gg/dx-dev",
    docs: "/docs",
  },
  creator: "DX Core Team",
  keywords: [
    "DX",
    "developer tools",
    "CLI",
    "AI agent",
    "Rust",
    "Next.js",
    "design tokens",
    "serializer",
    "development experience",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
