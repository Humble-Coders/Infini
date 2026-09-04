import type { GalleryCopy, HomeImage } from "@/lib/types";

/*
 * TEMP placeholder photography — see public/images/placeholders/README.md.
 * These are the in-code fallbacks the home page renders until `pages/home`
 * carries its own `gallery.items` / `technology.images`; the seed content in
 * backend/scripts/content.ts mirrors this list so the emulator matches.
 */
export const GALLERY_FALLBACK: GalleryCopy = {
  eyebrow: "What we finish",
  heading: "Turbine rings, gears, implants, dies and cutting edges. Made by our customers, finished by us.",
  items: [
    {
      src: "/images/placeholders/gallery-01-turbine-ring.jpg",
      alt: "Close-up of a mirror-polished bladed turbine ring with airfoil cutouts on a black background",
      label: "Aerospace",
      caption: "Bladed turbine ring, mirror-polished airfoils",
    },
    {
      src: "/images/placeholders/gallery-02-spur-gear.jpg",
      alt: "Mirror-polished spur gear standing on edge on a black background",
      label: "Gears & Transmission",
      caption: "Spur gear, superfinished teeth and bore",
    },
    {
      src: "/images/placeholders/gallery-03-knee-implant.jpg",
      alt: "Mirror-polished femoral knee implant component under low side lighting",
      label: "Medical Implants",
      caption: "Femoral knee implant, mirror finish",
    },
    {
      src: "/images/placeholders/gallery-04-die-halves.jpg",
      alt: "Two machined steel die halves with corrugated cavities, the left cavity mirror-polished and the right still showing machining marks",
      label: "Forge, Stamping & Die",
      caption: "Die halves, cavities polished to mirror",
    },
    {
      src: "/images/placeholders/gallery-05-carbide-drills.jpg",
      alt: "Solid carbide drills and end mills lying on a black reflective surface",
      label: "Cutting Tools",
      caption: "Solid carbide drills and end mills",
    },
    {
      src: "/images/placeholders/gallery-06-additive-ring.jpg",
      alt: "Close-up of an additively manufactured metal ring with mirror-polished struts and grainy as-printed recesses",
      label: "Additive Manufacturing",
      caption: "Additive ring, polished struts, as-printed pockets",
    },
  ],
};

export const PROCESS_IMAGES_FALLBACK: HomeImage[] = [
  {
    src: "/images/placeholders/process-01-bevel-pinion.jpg",
    alt: "Spiral bevel pinion gear with mirror-polished tooth flanks on a white background",
    caption: "Spiral bevel pinion, superfinished flanks",
  },
  {
    src: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    alt: "Two turbocharger turbine wheels side by side: the left as cast with inspection marks, the right mirror-polished after MMP treatment",
    caption: "Turbocharger wheels: as cast vs MMP-finished",
  },
];
