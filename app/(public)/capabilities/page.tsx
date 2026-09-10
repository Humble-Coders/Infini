import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { ProcessStrip } from "@/components/sections/shared/ProcessStrip";
import { DetailRows } from "@/components/sections/shared/DetailRows";
import { MarqueeBand } from "@/components/sections/shared/MarqueeBand";
import { PartSuitability } from "@/components/sections/capability/PartSuitability";
import { PassageGuidelines } from "@/components/sections/capability/PassageGuidelines";
import { TrustSection } from "@/components/sections/home/TrustSection";
import { CertificationsBlock } from "@/components/certifications/CertificationsBlock";
import { getPage, getSection } from "@/lib/data/pages";
import { getActiveCertifications } from "@/lib/data/certifications";
import { getSettings } from "@/lib/data/settings";
import { ogTitle, pageTitle } from "@/lib/seo";
import type { PassageGuidelinesCopy, SuitabilityCopy } from "@/lib/types";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

interface HeroCopy {
  eyebrow: string;
  heading: string;
  body: string;
}
interface ItemsCopy {
  items: { title: string; description: string }[];
}
interface TextBlockCopy {
  heading: string;
  body: string;
}

const FALLBACK: Metadata = {
  title: "Capabilities: MMP Surface Finishing Process",
  description:
    "INFINI's treatment capabilities: MMP surface finishing from controlled roughness to mirror-like brilliance, with measured, traceable batch validation.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("capabilities");
  if (!page) return FALLBACK;
  return {
    title: pageTitle(page.seo.title),
    description: page.seo.description,
    openGraph: { title: ogTitle(page.seo.title), description: page.seo.description, type: "website" },
  };
}

/*
 * TEMP topical photography, reusing the verified Unsplash IDs already in the
 * repo for the industry heroes (DEMO_HERO_IMAGES in lib/data/industries.ts).
 * IDs are reused rather than invented so every URL is one that has been
 * checked; real INFINI photography drops in without touching the layout.
 */
const HERO_IMAGE = "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1920&auto=format&fit=crop";
const ROWS_IMAGE = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=640&auto=format&fit=crop";

/** How an engagement runs, with the timings that let a reader plan around it. */
const STAGES = [
  {
    timing: "Day 1",
    step: "01",
    title: "Assessment",
    points: ["Drawing, alloy and target roughness", "Geometry checked against the passage guidelines", "Incoming surface measured"],
  },
  {
    timing: "Within 5 days",
    step: "02",
    title: "Technical validation",
    points: ["A few test pieces, several conditions", "Parameters calibrated to your target", "Measured before and after returned"],
  },
  {
    timing: "2 to 3 weeks",
    step: "03",
    title: "Industrial validation",
    points: ["Production fixture designed for your part", "Full production batch", "Process window frozen"],
  },
  {
    timing: "Ongoing",
    step: "04",
    title: "Serial production",
    points: ["Every batch measured", "Certificate of conformity issued", "Lot traceability retained"],
  },
];

const CAPABILITY_ROWS = [
  {
    label: "Roughness control",
    detail: "From as-machined down to 0.02 µm Ra, targeted to your specification rather than to a fixed recipe.",
    href: "/mirror-like-finish",
  },
  {
    label: "Form integrity",
    detail: "Minimal, controlled material removal. Form and profile are preserved, and edges take a controlled micro-radius.",
    href: "/technology",
  },
  {
    label: "Geometry access",
    detail: "Complex external shapes, plus straight or gently curved internal passages from 2 mm. See the passage guidelines.",
    href: "#passage-guidelines",
  },
  {
    label: "Substrate range",
    detail: "Any material: steels, stainless, titanium, nickel superalloys, carbide, aluminium and coated parts.",
  },
  {
    label: "Incoming condition",
    detail: "Machined, ground, cast, forged, EDM or additive, including recast-layer removal.",
    href: "/deburring-polishing",
  },
  {
    label: "Verification",
    detail: "Ra and Rz measured per batch, Rpk on request, against the spec agreed at validation.",
    href: "/validation",
  },
];

export default async function CapabilitiesPage() {
  const [page, certifications, settings] = await Promise.all([
    getPage("capabilities"),
    getActiveCertifications(),
    getSettings(),
  ]);

  const hero = getSection<HeroCopy>(page, "hero");
  const capacity = getSection<TextBlockCopy>(page, "capacity");
  const processCapabilities = getSection<ItemsCopy>(page, "processCapabilities");
  const suitability = getSection<SuitabilityCopy>(page, "suitability");
  const passageGuidelines = getSection<PassageGuidelinesCopy>(page, "passageGuidelines");
  const legacyLinks = settings?.nav.find((item) => item.href === "/capabilities")?.children ?? [];

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={hero?.eyebrow ?? "Capabilities"}
        heading={hero?.heading ?? "From controlled roughness to mirror-like brilliance."}
        body={hero?.body}
        image={HERO_IMAGE}
        imageAlt="Carbide cutting tools on a precision machining centre"
        badges={[{ label: "ISO 9001:2015" }, { label: "Measured per batch" }, { label: "Form preserved" }]}
        spec={{
          title: "Achievable finish",
          body: "0.1 down to 0.02 µm Ra, confirmed on your own components during validation before anything runs in series.",
        }}
      />

      <ProcessStrip
        eyebrow="Process"
        heading="How your part gets treated"
        body="Four stages from first drawing to a released process, each with a measured exit condition."
        stages={STAGES}
        surface="light"
      />

      <DetailRows
        eyebrow="Capabilities"
        heading="Every surface, every tolerance"
        body="Confirmed against your drawing before it is quoted, and checked again before it ships."
        rows={CAPABILITY_ROWS}
        image={ROWS_IMAGE}
        imageAlt="Superfinished spur gear"
        imageLabel="Gears"
        action={{ label: "See the process", href: "/technology" }}
        surface="dark"
      />

      {/* Where the process stops, then the passage rules the capability rows link to. */}
      <PartSuitability copy={suitability ?? undefined} surface="dark" />
      <PassageGuidelines copy={passageGuidelines ?? undefined} surface="light" />

      {(capacity || processCapabilities) && (
        <section data-surface="light" className="bg-background py-20 sm:py-28">
          <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-5 lg:col-span-5">
              <Eyebrow>Capacity</Eyebrow>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {capacity?.heading ?? "Capacity and lead times"}
              </h2>
            </div>
            <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
              {capacity?.body && (
                <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                  {capacity.body}
                </p>
              )}
              {processCapabilities && (
                <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
                  {processCapabilities.items.map((item) => (
                    <li key={item.title} className="flex flex-col gap-2 bg-background p-5">
                      <h3 className="text-sm font-semibold tracking-[-0.01em] text-foreground">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Container>
        </section>
      )}

      {legacyLinks.length > 0 && (
        <DetailRows
          eyebrow="Go deeper"
          heading="The finishes in detail"
          rows={legacyLinks.map((link) => ({
            label: link.label,
            detail: "How this finish is reached, what it changes, and where it applies.",
            href: link.href,
          }))}
          surface="dark"
        />
      )}

      <MarqueeBand text={["Send us a part", "We read the surface", "We treat the peaks", "We prove the number"]} />

      {certifications.length > 0 && (
        <section data-surface="light" className="bg-background py-20 sm:py-24">
          <Container>
            <CertificationsBlock certifications={certifications} heading="Standards behind the work" />
          </Container>
        </section>
      )}

      <TrustSection />
    </main>
  );
}
