import { Container } from "@/components/ui/container";
import Image from "next/image";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { SurfaceProfile } from "@/components/sections/home/SurfaceProfile";
import { EmphasisHeading } from "@/components/sections/home/EmphasisHeading";
import type { PageHeroCopy } from "@/lib/types";

/**
 * Opening band for the mechanism page, built the way the homepage hero is:
 * copy on the left, a live instrument readout on the right.
 *
 * The readout is the real `SurfaceProfile` trace, not an illustration. On a
 * page whose whole argument is that MMP removes roughness and leaves form
 * alone, watching the scan line do exactly that is the fastest version of the
 * pitch, so it earns its place above the fold rather than decorating it.
 */
export function TechnologyHero({ hero }: { hero: PageHeroCopy }) {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGERY.technology.src}
          alt={HERO_IMAGERY.technology.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>
      <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <Reveal>
            <MonoLabel>{hero.eyebrow}</MonoLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-xl text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.0] font-semibold tracking-[-0.045em] text-balance text-foreground">
              <EmphasisHeading text={hero.heading} />
            </h1>
          </Reveal>
          {hero.body && (
            <Reveal delay={0.16}>
              <p className="max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {hero.body}
              </p>
            </Reveal>
          )}
</div>

        <Reveal delay={0.2} className="lg:col-span-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_28px_90px_-40px_rgba(var(--color-primary-rgb),0.6)] sm:p-7">
            <SurfaceProfile />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
