import {
  BookOpen,
  CreditCard,
  Home,
  Info,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  external?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

export const MARKETING_NAV: NavItem[] = [
  {
    title: "Tools",
    href: "/docs",
    icon: Home,
    description: "Explore the DX tool ecosystem",
  },
  {
    title: "Docs",
    href: "/docs",
    icon: BookOpen,
    description: "Documentation and guides",
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: CreditCard,
    description: "Plans and pricing",
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
    description: "About DX",
  },
] as const;

export const DASHBOARD_NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agent",
    href: "/dashboard/agent",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { title: "Features", href: "/docs" },
    { title: "Pricing", href: "/pricing" },
    { title: "CLI", href: "/docs/cli" },
    { title: "Agent", href: "/docs/agent" },
    { title: "Changelog", href: "/changelog" },
  ],
  tools: [
    { title: "Forge Style", href: "/docs/forge-style" },
    { title: "Serializer", href: "/docs/serializer" },
    { title: "Media", href: "/docs/media" },
    { title: "Icon", href: "/docs/icon" },
    { title: "Font", href: "/docs/font" },
    { title: "Check", href: "/docs/check" },
  ],
  resources: [
    { title: "Documentation", href: "/docs" },
    { title: "Blog", href: "/blog" },
    { title: "Community", href: "https://discord.gg/dx-dev", external: true },
    { title: "GitHub", href: "https://github.com/dx-dev", external: true },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
  ],
} as const;
