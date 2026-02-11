import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
} from "lucide-react";

interface CalloutProps {
  children: React.ReactNode;
  type?: "info" | "warning" | "danger" | "tip";
  title?: string;
  className?: string;
}

const CALLOUT_CONFIG = {
  info: {
    icon: Info,
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/5",
    iconColor: "text-yellow-500",
  },
  danger: {
    icon: AlertCircle,
    borderColor: "border-destructive/30",
    bgColor: "bg-destructive/5",
    iconColor: "text-destructive",
  },
  tip: {
    icon: Lightbulb,
    borderColor: "border-accent/30",
    bgColor: "bg-accent/5",
    iconColor: "text-accent",
  },
} as const;

/**
 * Callout — Documentation callout block for info, warning, danger, and tip messages.
 * Inspired by shadcn/ui v4 callout component.
 */
export function Callout({
  children,
  type = "info",
  title,
  className,
}: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border p-4",
        config.borderColor,
        config.bgColor,
        className
      )}
      role="alert"
    >
      <IconComponent className={cn("mt-0.5 size-5 shrink-0", config.iconColor)} />
      <div className="flex-1">
        {title && (
          <p className="mb-1 text-sm font-semibold text-foreground">{title}</p>
        )}
        <div className="text-sm text-muted-foreground [&>p]:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
