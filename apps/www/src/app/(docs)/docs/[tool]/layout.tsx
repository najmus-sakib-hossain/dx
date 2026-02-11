import { DX_TOOLS } from "@/config/tools";
import { notFound } from "next/navigation";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

import type { Metadata } from "next";

interface ToolLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool: toolSlug } = await params;
  const tool = DX_TOOLS.find((t) => t.id === toolSlug);
  if (!tool) return { title: "Not Found | DX" };

  return {
    title: `${tool.name} Documentation | DX`,
    description: tool.description,
  };
}

export function generateStaticParams() {
  return DX_TOOLS.map((tool) => ({ tool: tool.id }));
}

/**
 * Build a sidebar navigation tree for a specific tool's docs.
 */
function getToolSidebarItems(toolId: string) {
  const tool = DX_TOOLS.find((t) => t.id === toolId);
  if (!tool) return [];

  return [
    {
      title: "Getting Started",
      href: `/docs/${toolId}`,
      items: [
        { title: "Introduction", href: `/docs/${toolId}` },
        { title: "Installation", href: `/docs/${toolId}/installation` },
        { title: "Quick Start", href: `/docs/${toolId}/quick-start` },
      ],
    },
    {
      title: "Guides",
      href: `/docs/${toolId}/guides`,
      items: [
        { title: "Configuration", href: `/docs/${toolId}/configuration` },
        { title: "Usage", href: `/docs/${toolId}/usage` },
        { title: "Examples", href: `/docs/${toolId}/examples` },
      ],
    },
    {
      title: "API Reference",
      href: `/docs/${toolId}/api`,
      items: [
        { title: "API Overview", href: `/docs/${toolId}/api` },
        { title: "CLI Commands", href: `/docs/${toolId}/cli-commands` },
      ],
    },
  ];
}

export default async function ToolLayout({ children, params }: ToolLayoutProps) {
  const { tool: toolSlug } = await params;
  const tool = DX_TOOLS.find((t) => t.id === toolSlug);

  if (!tool) {
    notFound();
  }

  const sidebarItems = getToolSidebarItems(toolSlug);

  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl px-6">
        <DocsSidebar items={sidebarItems} />
        <main className="flex-1 py-8 lg:pl-8">
          {children}
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
