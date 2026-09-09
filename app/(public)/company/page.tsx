import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { NetworkMap } from "@/components/sections/shared/NetworkMap";
import { TrustSection } from "@/components/sections/home/TrustSection";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { getPage, getSection } from "@/lib/data/pages";
import { getActiveCertifications } from "@/lib/data/certifications";
import { CertificationsBlock } from "@/components/certifications/CertificationsBlock";
import { ogTitle, pageTitle } from "@/lib/seo";


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
interface FactsCopy {
  items: { label: string; value: string }[];
}
interface TextBlockCopy {
  heading: string;
  body: string;
}

const FALLBACK: Metadata = {
  title: "About INFINI: Precision Surface Finishing",
  description:
    "INFINI Precision Pvt. Ltd. applies MMP surface-finishing technology from its treatment facility in Parwanoo, Himachal Pradesh, serving precision manufacturers across seven industries.",
};

/*
 * The MMP network as published by mmptechnology.com: BinC in France and
 * Switzerland, MicroTek in the United States, and the licensed plants in
 * Germany, India, Japan and China. INFINI's own plant is the highlighted row.
 */
const NETWORK_SITES = [
  { name: "St Priest", company: "BinC Industries, France", lat: 45.7, lon: 4.94 },
  { name: "Commugny", company: "BinC Industries, Switzerland", lat: 46.3, lon: 6.16 },
  { name: "Cincinnati", company: "MicroTek Finishing, United States", lat: 39.1032, lon: -84.512 },
  { name: "Stuttgart", company: "First Surface, Germany", lat: 48.7758, lon: 9.1829 },
  { name: "Parwanoo", company: "INFINI Precision Pvt. Ltd., India", lat: 30.8372, lon: 76.9618, primary: true },
  { name: "Tokyo", company: "INFINI Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Shanghai", company: "Bridge Fine Works, China", lat: 31.2304, lon: 121.4737 },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("company");
  if (!page) return FALLBACK;
  return {
    title: pageTitle(page.seo.title),
    description: page.seo.description,
    openGraph: { title: ogTitle(page.seo.title), description: page.seo.description, type: "website" },
  };
}

export default async function CompanyPage() {
  const [page, certifications] = await Promise.all([getPage("company"), getActiveCertifications()]);

  const hero = getSection<HeroCopy>(page, "hero");
  const facts = getSection<FactsCopy>(page, "facts");
  const processSummary = getSection<TextBlockCopy>(page, "process");
  const quality = getSection<TextBlockCopy>(page, "quality");

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={hero?.eyebrow ?? "Company"}
        heading={hero?.heading ?? "A specialist surface-finishing partner, not a manufacturer."}
        body={hero?.body}
        stats={[
          { label: "Facility", value: "Parwanoo" },
          { label: "Certifications", value: String(certifications.length) },
        ]}
        image={HERO_IMAGERY.company.src}
        imageAlt={HERO_IMAGERY.company.alt}
        badges={[{ label: "Parwanoo, Himachal Pradesh" }, { label: "MMP licensed plant" }, { label: "Seven-site network" }]}
      />
      

      {facts && (
        <section data-surface="light" className="bg-background border-b border-border/60 py-16 sm:py-20">
          <Container>
            <dl className="flex flex-wrap divide-x divide-border border-y border-border">
              {facts.items.map((fact) => (
                <div key={fact.label} className="flex min-w-[10rem] flex-1 flex-col gap-2 px-6 py-8 sm:px-8">
                  <dt className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">{fact.label}</dt>
                  <dd className="text-2xl font-light tracking-[-0.01em] text-foreground sm:text-3xl">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      <TrustSection tone="surface" />

      {processSummary && (
        <section data-surface="light" className="bg-background border-b border-border py-16 sm:py-24">
          <Container className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex shrink-0 items-start gap-4 sm:w-56">
              <span className="font-mono text-sm text-accent tabular-nums">01</span>
              <h2 className="text-2xl leading-[1.1] font-light text-foreground sm:text-3xl">{processSummary.heading}</h2>
            </div>
            <p className="max-w-2xl border-l border-accent/40 pl-6 text-lg leading-relaxed font-light text-foreground sm:pl-8 sm:text-xl">
              {processSummary.body}
            </p>
          </Container>
        </section>
      )}

      {quality && (
        <section data-surface="light" className="bg-background border-b border-border/60 py-16 sm:py-24">
          <Container className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex shrink-0 items-start gap-4 sm:w-56">
              <span className="font-mono text-sm text-accent/70 tabular-nums">02</span>
              <h2 className="text-2xl leading-[1.1] font-light text-foreground sm:text-3xl">{quality.heading}</h2>
            </div>
            <p className="max-w-2xl border-l border-accent/40 pl-6 text-lg leading-relaxed font-light text-foreground/85 sm:pl-8 sm:text-xl">
              {quality.body}
            </p>
          </Container>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container>
            <CertificationsBlock certifications={certifications} />
          </Container>
        </section>
      )}
      <NetworkMap
        eyebrow="The network"
        heading="One process. Seven plants. Four continents."
        body="MMP was industrialised in France in 2002 and licensed outward from there. INFINI runs the Indian plant, to the same process and the same standards as every other site on this map."
        stats={[
          { value: "7", label: "Plants worldwide", detail: "France, Switzerland, Germany, the United States, India, Japan and China." },
          { value: "2002", label: "Process industrialised", detail: "MMP was first run in production at St Priest, then licensed outward." },
        ]}
        sites={NETWORK_SITES}
      />

    </main>
  );
}
