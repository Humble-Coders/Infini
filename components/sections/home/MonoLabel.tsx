import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

/**
 * Section eyebrow in the technical/mono voice: an uppercase mono label.
 *
 * The short red rule that used to sit in front of the text is gone. Repeated
 * on every banner across the site it read as a stray dash rather than as a
 * rule, which is exactly the thing the house copy rule bans in the words.
 * `as` lets it carry heading semantics where the eyebrow is the section's real
 * title.
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
        "font-mono text-[11px] font-medium tracking-[0.22em] text-accent uppercase",
        className
      )}
    >
      {children}
    </Tag>
  );
}
