import { ArrowRight } from "lucide-react";

/**
 * Oversized repeating wordmark band.
 *
 * Two jobs. It punctuates a long page with something that is neither a heading
 * nor a card, which is what stops a scroll reading as one shape repeated. And
 * at this size the type itself is the graphic, so it carries a band without any
 * photography, which matters on a site that is short of it.
 *
 * Pass several phrases and the band cycles them. One phrase repeated across the
 * whole width just reads as a rendering glitch; a short sequence reads as a
 * statement, and each phrase can carry a different fact about the page it
 * punctuates.
 *
 * The track renders the sequence twice and animates exactly -50%, so the loop is
 * seamless; under reduced motion the static row shows instead.
 */
export function MarqueeBand({ text, repeat = 2 }: { text: string | string[]; repeat?: number }) {
  const phrases = Array.isArray(text) ? text : [text];
  // One pass through every phrase, `repeat` times over, then duplicated so the
  // -50% translation lands exactly on the start of the second copy.
  const sequence = Array.from({ length: repeat }, () => phrases).flat();
  const items = [...sequence, ...sequence];

  return (
    <section aria-hidden="true" className="overflow-hidden border-y border-border bg-background py-10 sm:py-14">
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((phrase, i) => (
          <span key={`${phrase}-${i}`} className="flex items-center gap-8 pr-8">
            <span className="text-[clamp(2.5rem,7vw,5.5rem)] leading-none font-semibold tracking-[-0.05em] whitespace-nowrap text-foreground">
              {phrase}
            </span>
            <ArrowRight className="size-[clamp(1.5rem,4vw,3rem)] shrink-0 text-accent" strokeWidth={1.5} />
          </span>
        ))}
      </div>
    </section>
  );
}
