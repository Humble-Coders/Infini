import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

/**
 * Section label in the technical voice: `[03] / GEOGRAPHY`.
 *
 * The bracketed index is the detail that makes it read as a document reference
 * rather than as decoration, and it gives a long page a spine a reader can
 * count down. Set in the accent so it carries on both the dark and the light
 * ground without needing a rule in front of it.
 *
 * The separator is a slash, not a dash, per the house copy rule.
 */
export function Eyebrow({
  children,
  index,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  /** Section number. Rendered zero-padded in brackets. */
  index?: number;
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.2em] text-accent uppercase",
        className
      )}
    >
      {index !== undefined && <span className="tabular-nums">[{String(index).padStart(2, "0")}]</span>}
      {index !== undefined && <span aria-hidden="true">/</span>}
      {children}
    </Tag>
  );
}
