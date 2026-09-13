import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Aurora } from "@/components/ui/aurora";
import { BlurText } from "@/components/ui/blur-text";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Spotlight } from "@/components/ui/spotlight";
import type { HeroCopy } from "@/lib/types";
import { InfinityMark } from "./InfinityMark";
import { SurfaceProfile } from "./SurfaceProfile";

const FALLBACK: Required<HeroCopy> = {
  eyebrow: "MMP Technology licensed plant \u00b7 Since 2002 \u00b7 ISO 9001 certified",
  heading: "Super Precision\nSurface Finishing",
  body: "INFINI applies MMP Technology to components its customers manufacture. A controlled, catalytic process that selectively removes roughness frequencies, verified per batch, traceable to your quality file.",
  // The tagline from INFINI's MMP brochure (INF_V2-09/2025).
  ctaNote: "From controlled roughness to mirror-like brilliance.",
};

/** Delay (ms) per hero element so the copy stacks in, top to bottom. */
const STAGGER = [0, 90, 200, 290, 360, 420] as const;

function reveal(step: number) {
  return { animationDelay: `${STAGGER[step]}ms` };
}

export function HomeHero({ copy }: { copy: HeroCopy | null }) {
  const { eyebrow, heading, body, ctaNote } = { ...FALLBACK, ...(copy ?? {}) };

  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Aurora className="opacity-90 [mask-image:radial-gradient(ellipse_75%_65%_at_30%_20%,black_20%,transparent_75%)]" />
        <Spotlight x="70%" />
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -bottom-48 -left-48 size-[42rem] rounded-full bg-[radial-gradient(closest-side,rgba(var(--color-primary-rgb),0.32),transparent)] blur-2xl" />
        <InfinityMark className="absolute -top-[7%] -right-[18%] w-[92%] text-foreground sm:w-[70%] lg:-right-[8%] lg:-top-[4.5%] lg:w-[46%] lg:max-w-[660px]" />
      </div>

      <Container className="relative grid min-h-[calc(100svh-6rem)] items-center gap-14 py-16 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="flex flex-col gap-7 lg:col-span-7">
          <p
            className="hero-reveal font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase"
            style={reveal(0)}
          >
            {eyebrow}
          </p>

          <h1 className="text-[clamp(3.25rem,10vw,8rem)] leading-[0.9] font-semibold tracking-[-0.045em] text-balance text-foreground">
            <BlurText text={heading} accentLast delay={0.45} stagger={0.07} />
          </h1>

          <p
            className="hero-reveal max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
            style={reveal(2)}
          >
            {body}
          </p>

          <div className="hero-reveal flex flex-wrap items-center gap-3 pt-2" style={reveal(3)}>
            <Button asChild size="lg" className="h-12 rounded-xl px-7 text-[15px]">
              <Link href="/contact">
                Send us a part
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border bg-transparent px-7 text-[15px] text-foreground hover:border-foreground/40 hover:bg-foreground/5 hover:text-foreground"
            >
              <Link href="#process">
                How MMP works
                <ArrowDown className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <p className="hero-reveal font-mono text-xs text-muted-foreground" style={reveal(4)}>
            {ctaNote}
          </p>
        </div>

        <div className="hero-reveal lg:col-span-5" style={reveal(5)}>
          <div className="lg:translate-y-20">
            <SurfaceProfile />
          </div>
        </div>
      </Container>
    </section>
  );
}
