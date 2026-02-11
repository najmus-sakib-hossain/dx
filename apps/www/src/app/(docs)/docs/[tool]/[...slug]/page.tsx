import { DX_TOOLS } from "@/config/tools";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { notFound } from "next/navigation";

interface DocSlugPageProps {
  params: Promise<{ tool: string; slug: string[] }>;
}

/** Static params for all tool + slug combinations */
export function generateStaticParams() {
  const slugs = ["installation", "configuration", "usage", "api", "examples"];
  return DX_TOOLS.flatMap((tool) =>
    slugs.map((slug) => ({ tool: tool.id, slug: [slug] }))
  );
}

/** Resolve the slug segments to a title */
function slugToTitle(slugParts: string[]): string {
  return slugParts
    .at(-1)!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function DocSlugPage({ params }: DocSlugPageProps) {
  const { tool: toolSlug, slug } = await params;
  const tool = DX_TOOLS.find((t) => t.id === toolSlug);

  if (!tool) {
    notFound();
  }

  const title = slugToTitle(slug);

  const breadcrumbs = [
    { title: tool.name, href: tool.docsPath },
    ...slug.map((s, i) => ({
      title: s
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `${tool.docsPath}/${slug.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <article className="max-w-3xl">
      <DocsBreadcrumb items={breadcrumbs} />

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          {tool.name} — {title.toLowerCase()} documentation.
        </p>
      </div>

      {/* Placeholder content — will be replaced by MDX content loader */}
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <p>
          Documentation for <strong>{title}</strong> in {tool.name} is being
          written. Check back soon or contribute on{" "}
          <a
            href="https://github.com/nicepkg/dx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>

      {/* Prev/Next navigation */}
      <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
        <a
          href={tool.docsPath}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {tool.name} Overview
        </a>
      </nav>
    </article>
  );
}
