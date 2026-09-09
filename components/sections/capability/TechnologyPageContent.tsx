import { ComparisonTable } from "./ComparisonTable";
import { ContentBlocks } from "./ContentBlocks";
import { MechanismStatement } from "./MechanismStatement";
import { PageTail } from "./PageTail";
import { RoughnessDecomposition } from "./RoughnessDecomposition";
import { SpecTable } from "./SpecTable";
import { StatTriplet } from "./StatTriplet";
import { TechnologyHero } from "./TechnologyHero";
import { ComponentGallery } from "@/components/sections/home/ComponentGallery";
import { ProcessSection } from "@/components/sections/home/ProcessSection";
import { Ticker } from "@/components/sections/home/Ticker";
import { TrustSection } from "@/components/sections/home/TrustSection";
import type {
  ComparisonCopy,
  ContentBlock,
  GalleryCopy,
  IndustryDoc,
  PageHeroCopy,
  SpecTableCopy,
  StatTripletCopy,
  TechnologyCopy,
  WithId,
} from "@/lib/types";

/*
 * /technology is the mechanism page: the route whose job is to make an engineer
 * believe the process does what it claims.
 *
 * Composition follows the homepage's rhythm rather than a strict alternation.
 * The homepage moves in runs (four dark bands, then two light, then two dark,
 * then five light) with section heights from 51px to 4000px and photography
 * carrying the weight. Stripes of one colour per section read as a template;
 * runs of two or three, punctuated by a thin marquee and broken by a rail, read
 * as a designed page.
 *
 * Four of the bands below are the homepage's own components, given this page's
 * content. Reusing them is deliberate: it is what makes an inner page feel like
 * the same site rather than a documentation subsite.
 */

/** Roughness vocabulary for the marquee. Terms an engineer will recognise. */
const PARAMETERS = [
  "Ra roughness average",
  "Rz mean roughness depth",
  "Rk core roughness",
  "Rpk reduced peak height",
  "Rvk reduced valley depth",
  "Rmr material ratio",
  "Abbott bearing curve",
  "Waviness Wa",
  "Lay and directionality",
  "ISO 4287",
  "ISO 21920",
];

const FALLBACK_MECHANISM = {
  label: "How MMP works",
  heading: "It filters the surface. It does not grind it.",
  body: "MMP is a mechanical-physical-catalytic treatment carried out in dedicated tanks. A catalytic film forms on the surface and is wiped from the high points only, so roughness and the machine tool's waviness come away while the component's form is left untouched. Nothing is added, and nothing moves off tolerance.",
};

const FALLBACK_SPEC: SpecTableCopy = {
  heading: "What the process can hold",
  intro:
    "Achievable values depend on the incoming surface, the alloy and the geometry. These are the bands INFINI works to, confirmed against your own parts during validation.",
  caption: "Typical treatment envelope",
  rows: [
    { parameter: "Achievable roughness", unit: "µm Ra", value: "0.1 to 0.02" },
    { parameter: "Achievable roughness", unit: "µin Ra", value: "4 to 0.8" },
    { parameter: "Dimensional change", unit: "µm", value: "None measurable", note: "Form and tolerance preserved" },
    { parameter: "Material added", unit: "", value: "None", note: "A treatment, not a coating" },
    { parameter: "Substrate", unit: "", value: "Any alloy, any hardness" },
    {
      parameter: "Incoming condition",
      unit: "",
      value: "Machined, ground, EDM, cast, forged, additive",
      note: "Including EDM recast layer removal",
    },
  ],
};

const FALLBACK_STATS: StatTripletCopy = {
  heading: "Measured, not asserted.",
  figures: [
    { value: "0.02", unit: "µm Ra", label: "Achievable finish", detail: "Verified on the part before the batch ships." },
    { value: "8", label: "Industries served", detail: "From cutting tools to powder metallurgy." },
    { value: "ISO 9001", label: "Certified process", detail: "Quality management across the treatment line." },
  ],
};

const FALLBACK_COMPARISON: ComparisonCopy = {
  eyebrow: "Set against the alternative",
  heading: "Why not simply polish it?",
  body: "Conventional polishing and lapping abrade the whole surface, which is why they round edges and move dimensions. MMP filters instead of abrading.",
  alternativeLabel: "Conventional polishing",
  rows: [
    {
      criterion: "Dimensional effect",
      mmp: "No measurable change. Form, edges and tolerances are preserved.",
      alternative: "Removes stock. Edges round and tight tolerances drift.",
    },
    {
      criterion: "Complex geometry",
      mmp: "Reaches internal passages, undercuts and blind features.",
      alternative: "Limited to surfaces a tool or wheel can physically touch.",
    },
    {
      criterion: "Batch consistency",
      mmp: "Parameters frozen after validation, so every batch repeats.",
      alternative: "Operator-dependent, varies part to part.",
    },
    {
      criterion: "Surface texture",
      mmp: "Non-directional, with a high bearing ratio for oil retention.",
      alternative: "Leaves directional lay that can channel lubricant away.",
    },
  ],
};

const RELATED = [
  {
    label: "Validation",
    href: "/validation",
    description: "How a treatment is proven on your part before it reaches serial production.",
  },
  {
    label: "Mirror-like finish",
    href: "/mirror-like-finish",
    description: "What the process delivers when the target is optical or sealing quality.",
  },
  {
    label: "Deburring and polishing",
    href: "/deburring-polishing",
    description: "Where MMP replaces a conventional finishing step, and where it does not.",
  },
];

export function TechnologyPageContent({
  hero,
  blocks,
  industries,
  gallery,
  process,
  mechanism = FALLBACK_MECHANISM,
  spec = FALLBACK_SPEC,
  stats = FALLBACK_STATS,
  comparison = FALLBACK_COMPARISON,
}: {
  hero: PageHeroCopy;
  blocks: ContentBlock[];
  industries: WithId<IndustryDoc>[];
  gallery: GalleryCopy | null;
  process: TechnologyCopy | null;
  mechanism?: { label: string; heading: string; body: string };
  spec?: SpecTableCopy;
  stats?: StatTripletCopy;
  comparison?: ComparisonCopy;
}) {
  return (
    <main className="min-h-screen bg-background">
      {/* Dark run: hero, a thin marquee for punctuation, then the component rail. */}
      <TechnologyHero hero={hero} />
      <Ticker items={PARAMETERS} />
      <ComponentGallery copy={gallery} />

      {/* Light run: the claim, the figure that proves it, then the process in photographs. */}
      <MechanismStatement label={mechanism.label} heading={mechanism.heading} body={mechanism.body} />
      <RoughnessDecomposition heading="One trace, taken apart." body={FIGURE_BODY} surface="light" />
      <ProcessSection copy={process} />

      {/* Dark run: the numbers, then the readout. */}
      <StatTriplet copy={stats} />
      <SpecTable copy={spec} surface="dark" />

      {/* Light: the comparison a reader is actually making in their head. */}
      <ComparisonTable copy={comparison} surface="light" />

      <ContentBlocks blocks={blocks} surface="dark" />

      {/* Dark close: the logo wall, then the ask on brand red. */}
      <TrustSection />
      <PageTail industries={industries} related={RELATED} surface="light" />
    </main>
  );
}

const FIGURE_BODY =
  "A measured surface is three things layered on top of each other. Separating them is the whole argument for MMP, because only two of the three are removed.";
