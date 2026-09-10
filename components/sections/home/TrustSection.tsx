import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { ThemeSection } from "@/components/sections/shared/ThemeSection";
import { cn } from "@/components/ui/utils";
import { EmphasisHeading } from "./EmphasisHeading";

type TrustLogo = {
  name: string;
  file: string;
};

/**
 * TrustSection, the dark credibility break between the light bands. Two
 * counter-moving marquee rows split the full customer-logo set (~20 each),
 * so the band reads tall and alive. Logos are the real files from
 * `public/logos`, rendered with `next/image`, unified with the premium
 * dark-theme treatment. Each track duplicates its row and animates exactly
 * ±50% for a seamless loop (see `marquee` / `marquee-reverse` in
 * globals.css); under prefers-reduced-motion a static wrapped grid shows
 * instead (no JS).
 */
const ROW_A: TrustLogo[] = [
  { name: "Axis", file: "axis-logo.png" },
  { name: "Cummins", file: "255px-Cummins_logo.svg.png" },
  { name: "GKN", file: "2560px-GKN.svg-1600x339.png" },
  { name: "Honeywell", file: "2560px-Honeywell_logo.svg-1600x283.png" },
  { name: "Boeing", file: "Boeing_full_logo.svg-1600x372.png" },
  { name: "GE Aerospace", file: "GE-Aerospace-Logo-1600x376.png" },
  { name: "Siemens", file: "Siemens-logo.svg-1600x381.png" },
  { name: "Blue Origin", file: "blue-origin.png" },
  { name: "A3TS", file: "a3ts_logo.png" },
  { name: "MAN", file: "man.png" },
  { name: "HP", file: "2048px-HP_logo_2012.svg-1600x1600.png" },
  { name: "Baker Hughes", file: "Baker_Hughes_logo.svg-1600x274.png" },
  { name: "Bentley", file: "bentley-logo-1700x950-1-1600x894.png" },
  { name: "Carbilly", file: "Carbilly-1600x508.png" },
  { name: "CSI", file: "CSI-Logo_Gray_Landscape-1024x439-1.png" },
  { name: "Aerospace Cluster", file: "csm_Bloc_signature_Aerospace_Cluster_ARA_b4c2a2c976.png" },
  { name: "DEVCOM ARL", file: "DEVCOM_ARL_LOGO.png" },
  { name: "Endress", file: "EndressLogo-1170x555-1-e1685535320955.png" },
  { name: "EOS", file: "EOS_GmbH_Logo_till_October_2022.png" },
  { name: "HAM", file: "HAMblue-01-1600x1600.png" },
];

const ROW_B: TrustLogo[] = [
  { name: "Hutchinson", file: "Hutchinson_Unternehmen_logo.svg.png" },
  { name: "Kimber", file: "Kimber-Logo-Native-300x162-1.png" },
  { name: "Lockheed Martin", file: "Lockheed_Martin_logo.svg-1600x264.png" },
  { name: "Dassault Aviation", file: "Logo_Dassault_Aviation_2020.svg-1600x446.png" },
  { name: "Pole Europeen de la Ceramique", file: "LOGO_POLE_EUROPEEN_DE_LA_CERAMIQUE-1024x450-1.png" },
  { name: "Mercedes Benz", file: "mercedes-logo-world-car-mercedes-benz-class-cdi-1.png" },
  { name: "Procter Gamble", file: "Procter__Gamble_2013_logo-1600x1600.png" },
  { name: "Rolls Royce", file: "Rolls-Royce-Logo-1600x905.png" },
  { name: "Rosswag", file: "Rosswag-Logo.png" },
  { name: "Safran", file: "Safran-logo-1600x900.png" },
  { name: "Sikorsky Aircraft", file: "Sikorsky_Aircraft_Logo-1600x593.png" },
  { name: "SLB", file: "SLB_Logo_2022.svg.png" },
  { name: "Stellantis", file: "Stellantis.svg-1600x339.png" },
  { name: "United Launch Alliance", file: "United-Launch-Alliance-Logo-1600x900.png" },
  { name: "Velo", file: "Velo-logo-web.png" },
  { name: "Aerojet Rocketdyne", file: "Aerojet_Rocketdyne_Logo-1600x409.png" },
  { name: "B Big", file: "B_BIG-38f9cdbd.png" },
  { name: "Endress", file: "EndressLogo-1170x555-1-e1685535320955 (1).png" },
  { name: "Sikorsky Aircraft", file: "Sikorsky_Aircraft_Logo-1600x593 (1).png" },
  { name: "SLB", file: "SLB_Logo_2022.svg (1).png" },
];

const LOGO_IMG_CLASSES =
  "h-10 w-auto max-w-[190px] object-contain transition-transform duration-300 hover:scale-105 cursor-pointer sm:h-12";

/** Filenames contain spaces and parentheses, encode so static serving resolves them. */
function logoSrc(file: string) {
  return `/logos/${encodeURIComponent(file)}`;
}

function LogoRow({ logos, reverse = false }: { logos: TrustLogo[]; reverse?: boolean }) {
  const track = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <ul
        aria-hidden="true"
        className={cn(
          "flex w-max items-center gap-14 pr-14 hover:[animation-play-state:paused] motion-reduce:hidden sm:gap-20 sm:pr-20",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        {track.map((logo, index) => (
          <li key={`${logo.file}-${index}`} className="flex shrink-0 items-center justify-center">
            <Image
              src={logoSrc(logo.file)}
              alt={`${logo.name} logo`}
              width={220}
              height={90}
              sizes="170px"
              loading="lazy"
              data-mono="off"
              className={LOGO_IMG_CLASSES}
            />
          </li>
        ))}
      </ul>

      {/* Static fallback when reduced motion is preferred (no JS). */}
      <ul aria-hidden="true" className="hidden flex-wrap items-center justify-center gap-x-12 gap-y-6 motion-reduce:flex">
        {logos.map((logo) => (
          <li key={logo.file} className="flex shrink-0 items-center justify-center">
            <Image
              src={logoSrc(logo.file)}
              alt={`${logo.name} logo`}
              width={220}
              height={90}
              sizes="170px"
              loading="lazy"
              data-mono="off"
              className={LOGO_IMG_CLASSES}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * `tone` decides which white the band paints.
 *
 * The home page runs it on pure white, which is what the surrounding bands
 * there expect. Inside a page built from the `data-surface` token bands it has
 * to take the token cream instead, or two nearly-identical whites meet and the
 * join reads as an unintended seam rather than as one continuous movement.
 */
export function TrustSection({
  tone = "white",
  className,
}: {
  tone?: "white" | "surface";
  /** Spacing overrides for the band, e.g. the home page's deeper run-out below the logos. */
  className?: string;
}) {
  const all = [...ROW_A, ...ROW_B];

  // neutral-500 clears AA on the pure white of the home band (4.74:1) but not on
  // the warmer token cream (4.24:1), so the muted text takes the surface's own
  // token when the band is running on tokens.
  const muted = tone === "surface" ? "text-muted-foreground" : "text-neutral-500";

  const body = (
    <div className="relative flex flex-col items-center gap-8 py-4 sm:gap-10 sm:py-6">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <p className={cn("font-mono text-[11px] tracking-[0.24em] uppercase", muted)}>
            Trusted worldwide
          </p>
          <h2 className="font-sans text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance">
            <EmphasisHeading text="They Trust Us" />
          </h2>
          <p className={cn("max-w-md font-sans text-sm leading-relaxed sm:text-base", muted)}>
            Delivering precision to global industry leaders.
          </p>
        </Reveal>

        <div className="flex w-full flex-col gap-8 sm:gap-10">
          <LogoRow logos={ROW_A} />
          <LogoRow logos={ROW_B} reverse />
        </div>

      <p className="sr-only">Trusted by {all.map((logo) => logo.name).join(", ")}.</p>
    </div>
  );

  if (tone === "surface") {
    return (
      <section
        data-surface="light"
        aria-label="Trusted by industry leaders"
        className={cn("relative overflow-hidden bg-background text-foreground pt-10 pb-20 sm:pt-12 sm:pb-24", className)}
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">{body}</div>
      </section>
    );
  }

  return (
    <ThemeSection
      theme="light"
      ariaLabel="Trusted by industry leaders"
      className={cn("relative overflow-hidden pt-10 sm:pt-12", className)}
    >
      {body}
    </ThemeSection>
  );
}
