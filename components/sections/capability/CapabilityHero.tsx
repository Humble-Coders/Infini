import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import type { HeroImage } from "@/lib/constants/heroImagery";
import type { PageHeroCopy } from "@/lib/types";

/**
 * Opening band for a capability page.
 *
 * Now a thin wrapper over PhotoHero. The gradient-only version this replaces
 * opened every capability page on a large empty rectangle, which is most of why
 * they read as documents rather than as a site.
 */
export function CapabilityHero({
  hero,
  image,
  badges = [],
  spec,
}: {
  hero: PageHeroCopy;
  image: HeroImage;
  badges?: { label: string }[];
  spec?: { title: string; body: string };
}) {
  return (
    <PhotoHero
      eyebrow={hero.eyebrow}
      heading={hero.heading}
      body={hero.body}
      image={image.src}
      imageAlt={image.alt}
      badges={badges}
      spec={spec}
    />
  );
}
