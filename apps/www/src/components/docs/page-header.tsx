import { cn } from "@/lib/utils";

interface PageHeaderProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * PageHeader — Centered page header section for docs and marketing pages.
 * Inspired by shadcn/ui v4 page-header component.
 */
export function PageHeader({ className, children }: PageHeaderProps) {
  return (
    <section className={cn("border-b border-border", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20">
          {children}
        </div>
      </div>
    </section>
  );
}

export function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-primary max-w-3xl text-3xl font-semibold tracking-tight text-balance lg:text-5xl",
        className
      )}
      {...props}
    />
  );
}

export function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-foreground max-w-4xl text-base text-balance sm:text-lg",
        className
      )}
      {...props}
    />
  );
}

export function PageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 pt-2",
        className
      )}
      {...props}
    />
  );
}
