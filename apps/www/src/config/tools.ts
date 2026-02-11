import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CheckCircle,
  FileJson,
  Image,
  Palette,
  Terminal,
  Type,
} from "lucide-react";

export interface DXTool {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  color: string;
  docsPath: string;
  status: "stable" | "beta" | "coming-soon";
  category: "styling" | "data" | "media" | "dev-tools" | "cli" | "agent";
}

export const DX_TOOLS: DXTool[] = [
  {
    id: "forge-style",
    name: "Forge Style",
    shortName: "Forge",
    description: "Advanced style system and design token management",
    icon: Palette,
    color: "hsl(262 83% 58%)",
    docsPath: "/docs/forge-style",
    status: "stable",
    category: "styling",
  },
  {
    id: "serializer",
    name: "Serializer",
    shortName: "Serializer",
    description: "Type-safe data serialization and validation",
    icon: FileJson,
    color: "hsl(215 20% 65%)", // Muted blue-ish
    docsPath: "/docs/serializer",
    status: "beta",
    category: "data",
  },
  {
    id: "media",
    name: "DX Media",
    shortName: "Media",
    description: "Optimized image and video processing pipeline",
    icon: Image,
    color: "hsl(142 71% 45%)",
    docsPath: "/docs/media",
    status: "stable",
    category: "media",
  },
  {
    id: "font",
    name: "DX Font",
    shortName: "Font",
    description: "Zero-layout shift font loading system",
    icon: Type,
    color: "hsl(30 80% 55%)",
    docsPath: "/docs/font",
    status: "stable",
    category: "styling",
  },
  {
    id: "check",
    name: "DX Check",
    shortName: "Check",
    description: "Comprehensive health and performance monitoring",
    icon: CheckCircle,
    color: "hsl(10 80% 55%)",
    docsPath: "/docs/check",
    status: "coming-soon",
    category: "dev-tools",
  },
  {
    id: "cli",
    name: "DX CLI",
    shortName: "CLI",
    description: "The unified command line interface for DX",
    icon: Terminal,
    color: "hsl(0 0% 98%)",
    docsPath: "/docs/cli",
    status: "stable",
    category: "cli",
  },
  {
    id: "agent",
    name: "DX Agent",
    shortName: "Agent",
    description: "AI-powered coding assistant and automator",
    icon: Bot,
    color: "hsl(280 80% 60%)",
    docsPath: "/docs/agent",
    status: "beta",
    category: "agent",
  },
];
