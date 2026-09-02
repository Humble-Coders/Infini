import type { ReactNode } from "react";

/** Small colored tick + label used above every section heading — a consistent, flat brand touch. */
export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-accent uppercase">
      <span aria-hidden="true" className="h-px w-6 bg-accent" />
      {children}
    </span>
  );
}
