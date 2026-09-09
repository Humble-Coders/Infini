/*
 * TEMP hero photography, one entry per route.
 *
 * Unsplash IDs are reused from DEMO_HERO_IMAGES in lib/data/industries.ts,
 * where every URL was checked before it was committed. New IDs are never
 * invented here: an unverified Unsplash ID silently 404s and leaves a hero with
 * a black rectangle, which is exactly the failure this file exists to avoid.
 * The rest point at the real component photography already in public/images.
 *
 * Replacing these with INFINI's own photography is a one-line change per route
 * and touches no layout.
 */

const unsplash = (id: string, w = 1920) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export interface HeroImage {
  src: string;
  alt: string;
}

export const HERO_IMAGERY = {
  technology: {
    src: "/images/placeholders/process-01-bevel-pinion.jpg",
    alt: "Spiral bevel pinion with superfinished tooth flanks",
  },
  validation: {
    src: unsplash("photo-1576091160399-112ba8d25d1d"),
    alt: "Measurement and inspection in a controlled laboratory environment",
  },
  deburring: {
    src: unsplash("photo-1504328345606-18bbc8c9d7d1"),
    alt: "Forging and die work on the shop floor",
  },
  mirror: {
    src: "/images/placeholders/gallery-03-knee-implant.jpg",
    alt: "Mirror-polished femoral knee implant component",
  },
  company: {
    src: unsplash("photo-1504328345606-18bbc8c9d7d1"),
    alt: "Production floor at a precision engineering facility",
  },
  industries: {
    src: unsplash("photo-1436491865332-7a61a109cc05"),
    alt: "Aircraft engine nacelle and wing in flight",
  },
  certifications: {
    src: unsplash("photo-1611117775350-ac3950990985"),
    alt: "Additive manufacturing build chamber",
  },
  caseStudies: {
    src: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    alt: "Turbocharger wheels as cast beside MMP-finished examples",
  },
  news: {
    src: unsplash("photo-1537462715879-360eeb61a0ad"),
    alt: "Precision machining centre in operation",
  },
  events: {
    src: unsplash("photo-1581092160607-ee22621dd758"),
    alt: "Engineers reviewing components at a trade exhibition stand",
  },
  benefits: {
    src: "/images/placeholders/gallery-02-spur-gear.jpg",
    alt: "Superfinished spur gear teeth and bore",
  },
  components: {
    src: "/images/placeholders/gallery-01-turbine-ring.jpg",
    alt: "Mirror-polished bladed turbine ring",
  },
} as const satisfies Record<string, HeroImage>;
