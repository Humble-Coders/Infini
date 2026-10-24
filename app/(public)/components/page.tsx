import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { Ticker } from "@/components/sections/home/Ticker";
import { ComponentGallery } from "@/components/sections/home/ComponentGallery";
import { getPublishedComponentTypes } from "@/lib/data/componentTypes";
import { getPage, getSection } from "@/lib/data/pages";
import type { GalleryCopy } from "@/lib/types";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const COPY = {
  eyebrow: "Components we treat",
  heading: "Find the part you are holding.",
  body: "Every page states the part's own engineering problem first, then what MMP changes, then the envelope, so you can tell in a few seconds whether we will take your component.",
};

export const metadata: Metadata = {
  title: pageTitle("Components We Treat"),
  description: COPY.body,
  openGraph: { title: ogTitle("Components We Treat"), description: COPY.body, type: "website" },
};

export default async function ComponentTypesIndexPage() {
  const [types, homePage] = await Promise.all([getPublishedComponentTypes(), getPage("home")]);
  const materials = [...new Set(types.flatMap((type) => type.materials))];

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={COPY.eyebrow}
        heading={COPY.heading}
        body={COPY.body}
        stats={[
          { label: "Component types", value: String(types.length) },
          { label: "Alloy families", value: `${materials.length}+` },
        ]}
        image={HERO_IMAGERY.components.src}
        imageAlt={HERO_IMAGERY.components.alt}
      />

      {materials.length > 0 && <Ticker items={materials} />}

      <ComponentGallery copy={getSection<GalleryCopy>(homePage, "gallery")} />

      <section data-surface="light" className="bg-background py-24 sm:py-32">
        <Container className="flex flex-col gap-10">
          <MonoLabel as="h2">By part type</MonoLabel>
          {types.length === 0 ? (
            <p className="max-w-2xl border border-dashed border-border px-6 py-10 text-base leading-relaxed text-muted-foreground sm:px-10">
              These pages are being published shortly. Send us the component in the meantime and we will tell you what
              MMP can reach on it.
            </p>
          ) : (
            <ul className="flex flex-col border-t border-border">
              {types.map((type, index) => (
                <li key={type.id}>
                  <Reveal delay={index * 0.05}>
                    <Link
                      href={`/components/${type.slug}`}
                      className="group grid gap-3 border-b border-border py-7 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:grid-cols-12 lg:items-baseline lg:gap-8"
                    >
                      <span className="flex items-baseline gap-4 lg:col-span-4">
                        <span className="font-mono text-[11px] text-accent tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[clamp(1.15rem,2vw,1.5rem)] leading-snug font-semibold tracking-[-0.02em] text-foreground">
                          {type.name}
                        </span>
                      </span>
                      <span className="text-sm leading-relaxed text-muted-foreground lg:col-span-6">
                        {type.summary}
                      </span>
                      <span className="flex justify-start lg:col-span-1 lg:col-start-12 lg:justify-end">
                        <ArrowUpRight
                          className="size-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </main>
  );
}
