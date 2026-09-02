import { cn } from "@/components/ui/utils";

/**
 * One infinite-scrolling row. The animated track renders the company list
 * twice back-to-back and animates exactly -50% so the loop is seamless; a
 * second, static, non-duplicated list stands in under
 * `prefers-reduced-motion` (toggled with `motion-reduce:`/`hidden`, no JS).
 * Sibling-dim-on-hover is pure CSS (`:has()`, see globals.css `.trust-row`).
 */
export function MarqueeRow({ companies, direction }: { companies: readonly string[]; direction: "ltr" | "rtl" }) {
  const track = [...companies, ...companies];

  return (
    <div
      className={cn(
        "trust-row group/row relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      )}
    >
      <ul
        aria-hidden="true"
        className={cn(
          "flex w-max motion-reduce:hidden",
          direction === "ltr" ? "animate-marquee-ltr" : "animate-marquee-rtl",
          "group-hover/row:[animation-play-state:paused]"
        )}
      >
        {track.map((name, index) => (
          <MarqueeItem key={`${name}-${index}`} name={name} />
        ))}
      </ul>

      {/* Reduced-motion fallback: same companies, no duplication, no animation. */}
      <ul aria-hidden="true" className="hidden flex-wrap justify-center motion-reduce:flex">
        {companies.map((name) => (
          <MarqueeItem key={name} name={name} />
        ))}
      </ul>
    </div>
  );
}

function MarqueeItem({ name }: { name: string }) {
  return (
    <li className="trust-item group/item flex shrink-0 items-center gap-3 border-l border-border/50 px-6 py-4 transition-opacity duration-300 first:border-l-0 sm:px-10 sm:py-5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border text-xs font-semibold text-muted-foreground transition-colors duration-300 group-hover/item:border-accent group-hover/item:text-foreground sm:size-9 sm:text-sm">
        {name.charAt(0)}
      </span>
      <span className="whitespace-nowrap text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase transition-colors duration-300 group-hover/item:text-foreground sm:text-sm">
        {name}
      </span>
    </li>
  );
}
