"use client";

import Link from "next/link";
import { cn } from "@/components/ui/utils";
import { PREVIEW_SCHEMES, type PreviewSchemeSlug } from "@/lib/previewSchemes";

/** Floating widget on /preview/[scheme] only — lets the client flip between color-scheme options on the same page without re-explaining the URL each time. Never shipped to the real site. */
export function ThemeSwitcher({ current }: { current: PreviewSchemeSlug }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-1 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg">
      <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">Color scheme preview</p>
      {PREVIEW_SCHEMES.map((scheme) => (
        <Link
          key={scheme.slug}
          href={`/preview/${scheme.slug}`}
          className={cn(
            "rounded-md px-2 py-1.5 text-sm transition-colors",
            scheme.slug === current
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {scheme.label}
        </Link>
      ))}
    </div>
  );
}
