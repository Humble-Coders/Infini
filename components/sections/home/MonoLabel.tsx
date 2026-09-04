import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

/**
 * Section eyebrow in the technical/mono voice: a short red rule + uppercase
 * label. `as` lets it carry heading semantics where the eyebrow is the
 * section's real title.
 */
export function MonoLabel({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.22em] text-accent uppercase",
        className
      )}
    >
      <span aria-hidden="true" className="h-px w-8 shrink-0 bg-current" />
      {children}
    </Tag>
  );
}
