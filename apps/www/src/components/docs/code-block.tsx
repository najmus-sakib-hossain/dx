"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import * as React from "react";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

/**
 * CodeBlock — Syntax-highlighted code block with copy button and optional line numbers.
 * Inspired by shadcn/ui v4 code-block component.
 */
export const CodeBlock = ({
  children,
  language = "typescript",
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps): React.ReactElement => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  const lines = children.split("\n");

  return (
    <div className={cn("group relative my-6 rounded-lg border border-border", className)}>
      {filename && (
        <div className="flex items-center border-b border-border px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {filename}
          </span>
          <span className="ml-auto font-mono text-xs text-muted-foreground/50">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-md border border-border bg-card/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
          aria-label="Copy code"
          type="button"
        >
          {copied ? (
            <Check className="size-3.5 text-accent" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </button>
        <pre className="overflow-x-auto p-4">
          <code className="block font-mono text-sm leading-relaxed">
            {lines.map((line, index) => (
              <span key={`line-${index}-${line.slice(0, 10)}`} className="block">
                {showLineNumbers && (
                  <span className="mr-6 inline-block w-8 select-none text-right text-muted-foreground/40">
                    {index + 1}
                  </span>
                )}
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
