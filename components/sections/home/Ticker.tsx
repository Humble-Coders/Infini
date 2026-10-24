/**
 * A slow, single-line marquee of the industries INFINI serves, separated by the
 * brand's infinity glyph. The track renders the list twice and animates exactly
 * -50% so the loop is seamless; under prefers-reduced-motion the static wrapped
 * list shows instead (no JS). Content comes from the same Firestore industries
 * that drive the index further down the page.
 */
export function Ticker({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const track = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-border bg-background py-4">
      <ul
        aria-hidden="true"
        className="flex w-max animate-marquee [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] hover:[animation-play-state:paused] motion-reduce:hidden"
      >
        {track.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-center gap-8 pr-8 font-mono text-[12px] tracking-[0.22em] whitespace-nowrap text-muted-foreground uppercase"
          >
            <span aria-hidden="true" className="text-base leading-none text-accent">
              ∞
            </span>
            {item}
          </li>
        ))}
      </ul>

      <ul aria-hidden="true" className="hidden flex-wrap justify-center gap-x-8 gap-y-2 px-6 motion-reduce:flex">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 font-mono text-[12px] tracking-[0.22em] text-muted-foreground uppercase"
          >
            <span className="text-base leading-none text-accent">∞</span>
            {item}
          </li>
        ))}
      </ul>

      <p className="sr-only">Industries INFINI serves: {items.join(", ")}.</p>
    </div>
  );
}
