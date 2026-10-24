import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/components/ui/utils";
import { Reveal } from "@/components/ui/reveal";

export interface HeroBadge {
  label: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroSpec {
  title: string;
  body: string;
}

/**
 * Full-bleed photographic hero.
 *
 * The gradient-only heroes this replaces gave every inner page a large empty
 * rectangle to open on, which is most of why they read as documents rather
 * than as a site. A photograph of the work, a scrim, and one floating spec card
 * fills that space with something true about the subject instead.
 *
 * The scrim is two gradients rather than one flat overlay: a vertical wash so
 * the headline always has ground under it, and a horizontal one so the right
 * side stays legible behind the card.
 *
 * Height is capped at the viewport minus the header, so the hero never pushes
 * the first content band off the first screen.
 */
export function PhotoHero({
  eyebrow,
  heading,
  body,
  image,
  imageAlt,
  badges = [],
  spec,
  stats = [],
  priority = true,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  image: string;
  imageAlt: string;
  badges?: HeroBadge[];
  spec?: HeroSpec;
  /** Hairline value rail in the right column. Used when there is no spec card. */
  stats?: HeroStat[];
  priority?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image src={image} alt={imageAlt} fill priority={priority} sizes="100vw" className="object-cover" />
        {/* Two light scrims, not one heavy one. The copy sits bottom-left, so the
            vertical wash darkens only the lower third and the horizontal wash
            only the left edge; the photograph stays visible everywhere else. */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      </div>

      <Container className="relative z-10 flex min-h-[26rem] flex-col justify-end gap-8 py-14 sm:min-h-[30rem] sm:py-16 lg:min-h-[min(34rem,calc(100svh-5rem))]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="max-w-2xl text-[clamp(2.25rem,5.4vw,4.25rem)] leading-[1.0] font-semibold tracking-[-0.045em] text-balance text-foreground">
                {heading}
              </h1>
            </Reveal>
            {body && (
              <Reveal delay={0.16}>
                <p className="max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                  {body}
                </p>
              </Reveal>
            )}
          </div>

          {!spec && stats.length > 0 && (
            <Reveal delay={0.22} className="lg:col-span-4 lg:col-start-9">
              {/* Backed rather than bare: the rail sits over whatever the photograph
                  happens to put in the top right, which on a bright frame leaves
                  white-on-white values. The panel makes legibility independent of
                  the crop. */}
              <dl className="flex flex-col border border-border bg-background/85 px-5 py-1 backdrop-blur-md">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "flex items-baseline justify-between gap-6 py-3.5",
                      i < stats.length - 1 && "border-b border-border"
                    )}
                  >
                    <dt className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                      {stat.label}
                    </dt>
                    <dd className="text-2xl leading-none font-semibold tracking-[-0.03em] tabular-nums text-foreground">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {spec && (
            <Reveal delay={0.22} className="lg:col-span-4 lg:col-start-9">
              <div className="flex flex-col gap-2 border border-border bg-background/85 p-5 backdrop-blur-md">
                <span className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">{spec.title}</span>
                <p className="text-sm leading-relaxed text-foreground">{spec.body}</p>
              </div>
            </Reveal>
          )}
        </div>

        {badges.length > 0 && (
          <Reveal delay={0.3}>
            <ul className="flex flex-wrap gap-2 border-t border-border pt-6">
              {badges.map((badge) => (
                <li
                  key={badge.label}
                  className="rounded-full border border-border bg-background/75 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm"
                >
                  {badge.label}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
