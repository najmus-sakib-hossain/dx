import { DX_TOOLS } from "@/config/tools";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { Steps, Step } from "@/components/docs/steps";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export function generateStaticParams() {
  return DX_TOOLS.map((tool) => ({ tool: tool.id }));
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolSlug } = await params;
  const tool = DX_TOOLS.find((t) => t.id === toolSlug);

  if (!tool) {
    notFound();
  }

  return (
    <article className="max-w-3xl">
      <DocsBreadcrumb items={[{ title: tool.name, href: tool.docsPath }]} />

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${tool.color}15` }}
          >
            <tool.icon className="size-6" style={{ color: tool.color }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
            <span
              className={cn(
                "text-sm font-medium",
                tool.status === "stable" && "text-accent",
                tool.status === "beta" && "text-yellow-500",
                tool.status === "coming-soon" && "text-muted-foreground"
              )}
            >
              {tool.status}
            </span>
          </div>
        </div>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </div>

      <Callout type="info" title="Getting Started">
        <p>
          This page covers the basics of {tool.name}. For detailed guides and
          API reference, use the sidebar navigation.
        </p>
      </Callout>

      <section className="mt-8">
        <h2 id="installation" className="text-2xl font-semibold tracking-tight">
          Installation
        </h2>
        <p className="mt-2 text-muted-foreground">
          Install {tool.name} via the DX CLI:
        </p>
        <CodeBlock language="bash" filename="Terminal">
          {`dx install ${tool.id}`}
        </CodeBlock>

        <p className="mt-4 text-muted-foreground">
          Or add it to your project using npx:
        </p>
        <CodeBlock language="bash" filename="Terminal">
          {`npx dx add ${tool.id}`}
        </CodeBlock>
      </section>

      <section className="mt-8">
        <h2 id="quick-start" className="text-2xl font-semibold tracking-tight">
          Quick Start
        </h2>
        <Steps>
          <Step title="Initialize your project" step={1}>
            <p>
              Run the DX init command to set up {tool.name} in your project:
            </p>
            <CodeBlock language="bash">
              {`dx init --tool ${tool.id}`}
            </CodeBlock>
          </Step>
          <Step title="Configure settings" step={2}>
            <p>
              Customize {tool.name} by editing the generated configuration file:
            </p>
            <CodeBlock language="typescript" filename={`dx.config.ts`}>
              {`import { defineConfig } from "dx/${tool.id}";

export default defineConfig({
  // Your ${tool.name} configuration
  enabled: true,
  output: "./dist",
});`}
            </CodeBlock>
          </Step>
          <Step title="Run your first command" step={3}>
            <p>Execute {tool.name} and see the results:</p>
            <CodeBlock language="bash">
              {`dx ${tool.id} run`}
            </CodeBlock>
          </Step>
        </Steps>
      </section>

      <Callout type="tip" title="Pro Tip">
        <p>
          Combine {tool.name} with other DX tools for a complete development
          workflow. Check out our{" "}
          <Link href="/docs" className="text-primary hover:underline">
            integration guides
          </Link>{" "}
          for more details.
        </p>
      </Callout>

      {/* Prev/Next Navigation */}
      <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
        <Link
          href="/docs"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← All Docs
        </Link>
        <Link
          href={`${tool.docsPath}/installation`}
          className="text-sm text-primary hover:underline"
        >
          Installation →
        </Link>
      </nav>
    </article>
  );
}
