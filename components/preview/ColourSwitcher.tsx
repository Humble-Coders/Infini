import Link from "next/link";
import { cn } from "@/components/ui/utils";
import type { SiteTheme } from "@/components/layout/SiteShell";

const OPTIONS: { theme: SiteTheme; label: string; href: string }[] = [
  { theme: "red", label: "Red", href: "/" },
  { theme: "mmp-blue", label: "Blue", href: "/blue" },
];

/**
 * TEMP — client colour review. A fixed pill that flips the home page between
 * the brand-red build (/) and the MMP-blue variant (/blue). Remove this
 * component, the /blue route and the `[data-theme="mmp-blue"]` block in
 * app/globals.css once the client has chosen.
 */
export function ColourSwitcher({ current }: { current: SiteTheme }) {
  return (
    <nav
      aria-label="Colour variant"
      className="fixed right-4 bottom-4 z-[100] flex items-center gap-1 rounded-full border border-border bg-popover/90 p-1 text-popover-foreground shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur-md"
    >
      <span className="hidden px-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase sm:inline">
        Colour
      </span>
      {OPTIONS.map((option) => {
        const active = option.theme === current;
        return (
          <Link
            key={option.theme}
            href={option.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-9 min-w-[3.5rem] items-center justify-center gap-2 rounded-full px-3 text-xs font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-foreground/10"
            )}
          >
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", option.theme === "red" ? "bg-swatch-red" : "bg-swatch-blue")}
            />
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
