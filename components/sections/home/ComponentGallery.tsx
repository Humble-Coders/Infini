import Image from "next/image";
import Link from "next/link";
import { BlurText } from "@/components/ui/blur-text";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";
import type { GalleryCopy } from "@/lib/types";
import { MonoLabel } from "./MonoLabel";
import { GALLERY_FALLBACK } from "./galleryPlaceholders";

/**
 * Tile spans for a 12-column editorial grid, cycling every six tiles:
 * one large near-square lead, two 4:3 tiles stacked beside it, then a row
 * of three. Tablets get a two-column grid; phones get a swipeable strip
 * (see MOBILE_TILE), where a 4:3 card has room for its label and caption.
 */
const MOBILE_TILE = "w-[78vw] max-w-[22rem] shrink-0 snap-start aspect-[4/3] sm:w-auto sm:max-w-none sm:shrink sm:snap-align-none";
const TILE_LAYOUT = [
  "sm:col-span-2 sm:aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto",
  "sm:aspect-[4/5] lg:col-span-5 lg:aspect-[4/3]",
  "sm:aspect-[4/5] lg:col-span-5 lg:aspect-[4/3]",
  "sm:aspect-[4/5] lg:col-span-4 lg:aspect-[4/3]",
  "sm:aspect-[4/5] lg:col-span-4 lg:aspect-[4/3]",
  "sm:col-span-2 sm:aspect-[16/9] lg:col-span-4 lg:aspect-[4/3]",
] as const;

const TILE_SIZES = [
  "(min-width: 1024px) 58vw, (min-width: 640px) 100vw, 78vw",
  "(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 78vw",
  "(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 78vw",
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw",
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw",
  "(min-width: 1024px) 33vw, (min-width: 640px) 100vw, 78vw",
] as const;

/**
 * Industry page each tile links to, matched by its label. Used as the fallback
 * when a tile has no explicit `href`, so the "click to jump to the relevant
 * section" works whether the tile comes from the CMS or the in-code fallback.
 */
const INDUSTRY_HREF_BY_LABEL: Record<string, string> = {
  Aerospace: "/industries/aerospace",
  "Gears & Transmission": "/industries/gears-transmission",
  "Medical Implants": "/industries/medical-implants",
  "Forge, Stamping & Die": "/industries/forge-stamping-die",
  "Cutting Tools": "/industries/cutting-tools",
  "Additive Manufacturing": "/industries/additive-manufacturing",
  "Plastic Injection Molds": "/industries/plastic-injection-molds",
  "Powder Metallurgy": "/industries/powder-metallurgy",
};

/**
 * "What we finish", the components INFINI treats, photographed, directly
 * under the hero so a first-time visitor sees real parts within one scroll.
 * Content comes from `pages/home`'s `gallery` section; until that is
 * authored, the fallback set of placeholder photographs renders instead.
 */
export function ComponentGallery({ copy }: { copy: GalleryCopy | null }) {
  const { eyebrow, heading, items } = { ...GALLERY_FALLBACK, ...(copy ?? {}) };
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="gallery-heading" className="bg-background py-14 sm:py-20 lg:py-24">
      <Container className="flex flex-col gap-8 sm:gap-10 max-w-6xl">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="flex flex-col gap-4">
            <MonoLabel>{eyebrow}</MonoLabel>
            <h2
              id="gallery-heading"
              className="max-w-2xl text-[clamp(1.5rem,2.8vw,2.375rem)] leading-[1.12] font-medium tracking-[-0.03em] text-balance text-foreground"
            >
              <BlurText text={heading} />
            </h2>
          </div>
          <p className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {items.length} components<span className="sm:hidden"> · swipe</span>
          </p>
        </Reveal>

        <ul className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 scroll-pl-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-12 [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => {
            const href = item.href ?? INDUSTRY_HREF_BY_LABEL[item.label];
            const figure = (
              <figure className="group relative h-full w-full overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={TILE_SIZES[index % TILE_SIZES.length]}
                  priority={index === 0}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">{item.label}</span>
                    <span className="text-sm leading-snug font-medium text-foreground sm:text-base">{item.caption}</span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            );

            return (
              <li key={`${item.src}-${index}`} className={cn("min-h-0", MOBILE_TILE, TILE_LAYOUT[index % TILE_LAYOUT.length])}>
                {href ? (
                  <Link
                    href={href}
                    aria-label={`${item.label}: ${item.caption}`}
                    className="block h-full w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {figure}
                  </Link>
                ) : (
                  figure
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
