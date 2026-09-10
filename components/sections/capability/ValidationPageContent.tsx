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
 *
 * Stage detail follows the "steps to mass production" in INFINI's MMP brochure:
 * a few test pieces under several conditions, then more pieces (scrap is fine)
 * with a production fixture, then full tank loads under fixed conditions.
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
        "A few test pieces are treated under several sets of MMP conditions, to show whether MMP is effective on your component and which conditions reach your objective. Geometry, material and target roughness are assessed first.",
      requires: "A few sample parts, the drawing, and the roughness target you need to hit.",
    },
    {
      step: "02",
      title: "Industrial validation",
      description:
        "More parts, all of them if possible, so the result holds across the variation real production carries. A production fixture is designed for your part, and the conditions are tuned until the result is right.",
      requires: "A representative batch (rejected or scrap parts are fine at this stage), and your incoming inspection data if you have it.",
    },
    {
      step: "03",
      title: "Serial production",
      description:
        "Full tank loads, run under the conditions fixed in industrial validation, which is what makes the result repeat batch after batch. Every batch is measured against the agreed specification, and the record ships with the parts.",
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
          { label: "Form", value: "Preserved" },
          { label: "Record", value: "Issued per batch" },
        ]}
      />

      <ContentBlocks blocks={blocks} surface="dark" />
      <PageTail industries={industries} related={RELATED} surface="light" />
    </main>
  );
}
