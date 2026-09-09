import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

export type ThemeSectionTheme = "light" | "dark";

type ThemeSectionProps = {
  children: ReactNode;
  /** Alternating band theme, edge-to-edge background change when stacked. */
  theme?: ThemeSectionTheme;
  className?: string;
  ariaLabel?: string;
};

const THEME_CLASSES: Record<ThemeSectionTheme, string> = {
  dark: "bg-neutral-950 text-white",
  light: "bg-white text-neutral-900",
};

/**
 * Reusable alternating light/dark band (mmptechnology.com-style rhythm).
 * Renders one edge-to-edge `<section>` for the background plus a centered
 * inner container, so stacked bands change colour seamlessly without each
 * component re-implementing padding and containment.
 */
export function ThemeSection({ children, theme = "dark", className, ariaLabel }: ThemeSectionProps) {
  return (
    <section aria-label={ariaLabel} className={cn("py-20 sm:py-24", THEME_CLASSES[theme], className)}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">{children}</div>
    </section>
  );
}
