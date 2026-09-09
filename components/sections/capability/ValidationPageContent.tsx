import { CapabilityHero } from "./CapabilityHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { ContentBlocks } from "./ContentBlocks";
import { EvidenceImage } from "./EvidenceImage";
import { PageTail } from "./PageTail";
import { SpecTable } from "./SpecTable";
import { StageBeam } from "./StageBeam";
import { StatTriplet } from "./StatTriplet";
import { Ticker } from "@/components/sections/home/Ticker";
import type {
  ContentBlock,
  IndustryDoc,
  PageHeroCopy,
  SpecTableCopy,
  StageSequenceCopy,
  StatTripletCopy,
  WithId,
} from "@/lib/types";

/*
 * /validation answers the question that actually blocks a first order: what
 * happens if I send you my parts and it goes wrong.
 *
 * Its centrepiece is the scroll-traced protocol, a shape used on no other page.
 * The three-stage sequence is the strongest commercial asset in the MMP family
 * and the parent site leaves it buried in a paragraph, so here it gets the beam,
 * a full band, and a statement of what INFINI needs from the customer at each
 * stage, which no competitor publishes at all.
 */

const STANDARDS = [
  "ISO 9001:2015",
  "ISO 13485:2016",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "Certificate of conformity",
  "Lot traceability",
  "Batch roughness record",
  "Incoming dimensional check",
];

const FALLBACK_STAGES: StageSequenceCopy = {
  eyebrow: "How a part is qualified",
  heading: "Three stages, before anything runs in series.",
  body: "No treatment goes into production on assumption. Each stage has an exit condition, and you see the measured result before the next one starts.",
  stages: [
    {
      step: "01",
      title: "Technical validation",
      description:
        "A small batch is treated to show what MMP can reach on your component. Geometry, alloy and target roughness are assessed first, then parameters are calibrated to your objective rather than to a standard recipe.",
      requires: "One or two sample parts, the drawing, and the roughness target you need to hit.",
    },
    {
      step: "02",
      title: "Industrial validation",
      description:
        "A full-scale run proves the treatment holds across the variation real production carries: batch-to-batch differences in the incoming surface, fixture effects and handling.",
      requires: "A representative production batch, and your incoming inspection data if you have it.",
    },
    {
      step: "03",
      title: "Serial production",
      description:
        "Parameters are frozen and the process is released to series. Every batch is measured against the agreed specification, and the record ships with the parts.",
      requires: "Your release specification and the reporting format your quality system expects.",
    },
  ],
};

const FALLBACK_SPEC: SpecTableCopy = {
  heading: "What gets measured, and what you receive",
  intro:
    "Verification is not a final glance at the parts. Every batch carries a record against the specification agreed at validation.",
  caption: "Reported per batch",
  rows: [
    { parameter: "Roughness average", unit: "µm Ra", value: "Measured, per batch" },
    { parameter: "Mean roughness depth", unit: "µm Rz", value: "Measured, per batch" },
    { parameter: "Reduced peak height", unit: "µm Rpk", value: "On request", note: "Where bearing ratio matters" },
    { parameter: "Dimensional check", unit: "", value: "Against incoming drawing" },
    { parameter: "Batch traceability", unit: "", value: "Lot number and treatment record" },
    { parameter: "Certificate of conformity", unit: "", value: "Issued with every shipment" },
  ],
};

const FALLBACK_STATS: StatTripletCopy = {
  heading: "Verified before it ships.",
  figures: [
    { value: "100", unit: "%", label: "Batches measured", detail: "No batch leaves without a roughness record." },
    { value: "3", label: "Validation stages", detail: "Technical, industrial, then series release." },
    { value: "ISO 9001", label: "Quality system", detail: "Process controls audited and certified." },
  ],
};

const RELATED = [
  {
    label: "The MMP process",
    href: "/technology",
    description: "The mechanism behind the treatment, and why form survives it.",
  },
  {
    label: "Mirror-like finish",
    href: "/mirror-like-finish",
    description: "The finish grades validation is most often asked to confirm.",
  },
  {
    label: "Certifications",
    href: "/certifications",
    description: "The standards INFINI holds, with scope and validity.",
  },
];

export function ValidationPageContent({
  hero,
  blocks,
  industries,
  stages = FALLBACK_STAGES,
  spec = FALLBACK_SPEC,
  stats = FALLBACK_STATS,
}: {
  hero: PageHeroCopy;
  blocks: ContentBlock[];
  industries: WithId<IndustryDoc>[];
  stages?: StageSequenceCopy;
  spec?: SpecTableCopy;
  stats?: StatTripletCopy;
}) {
  return (
    <main className="min-h-screen bg-background">
      {/* Dark opening: hero, the standards this page is really about, the numbers. */}
      <CapabilityHero
        hero={hero}
        image={HERO_IMAGERY.validation}
        badges={[{ label: "ISO 9001:2015" }, { label: "Measured per batch" }, { label: "Certificate of conformity" }]}
        spec={{ title: "Reported per batch", body: "Ra and Rz measured against the specification agreed at validation, with lot traceability and a certificate of conformity." }}
      />
      <Ticker items={STANDARDS} />
      <StatTriplet copy={stats} />

      {/* Light run: the protocol on the beam, then the measurement record. */}
      <StageBeam copy={stages} surface="light" />
      <SpecTable copy={spec} surface="light" />

      {/* Dark: the proof, photographed. */}
      <EvidenceImage
        label="What validation looks like"
        heading="A spiral bevel pinion, flanks superfinished."
        body="Validation happens on real components, not coupons. The trial batch comes back with a measured baseline, the treated result, and the parameters that produced it."
        src="/images/placeholders/process-01-bevel-pinion.jpg"
        alt="Spiral bevel pinion with superfinished tooth flanks"
        readings={[
          { label: "Component", value: "Spiral bevel pinion" },
          { label: "Treatment", value: "MMP superfinish" },
          { label: "Form change", value: "None measurable" },
          { label: "Record", value: "Issued per batch" },
        ]}
      />

      <ContentBlocks blocks={blocks} surface="dark" />
      <PageTail industries={industries} related={RELATED} surface="light" />
    </main>
  );
}
