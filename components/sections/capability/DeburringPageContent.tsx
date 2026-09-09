import { CapabilityHero } from "./CapabilityHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { ContentBlocks } from "./ContentBlocks";
import { EvidenceImage } from "./EvidenceImage";
import { PageTail } from "./PageTail";
import { SplitComparison } from "./SplitComparison";
import { StatTriplet } from "./StatTriplet";
import { ComponentGallery } from "@/components/sections/home/ComponentGallery";
import type {
  ComparisonCopy,
  ContentBlock,
  GalleryCopy,
  IndustryDoc,
  PageHeroCopy,
  StatTripletCopy,
  WithId,
} from "@/lib/types";

/*
 * /deburring-polishing exists because that is the phrase people search when
 * they have the problem MMP solves. The page meets them in their vocabulary,
 * then draws the distinction, rather than pretending the conventional route
 * does not exist.
 *
 * Its centrepiece is the facing-column split, not a table: someone reading this
 * is choosing between the finishing they already buy and this one, so the page
 * is laid out as that choice. Saying plainly where conventional finishing is
 * still the right answer is deliberate, and rare enough in this category to be
 * worth more than another superlative.
 */

const FALLBACK_COMPARISON: ComparisonCopy = {
  eyebrow: "Where the two differ",
  heading: "One abrades the surface. The other filters it.",
  body: "That single difference decides which one your component needs, and it is why MMP can reach a finish conventional polishing cannot without moving a dimension.",
  alternativeLabel: "Conventional deburr and polish",
  rows: [
    {
      criterion: "How material comes off",
      mmp: "A catalytic film forms on the peaks and is wiped away, so only the high points are touched.",
      alternative: "Abrasive contact across the whole surface, wherever the tool can reach.",
    },
    {
      criterion: "Edges and radii",
      mmp: "Edge condition is controlled. Sharp edges stay sharp unless you ask for a radius.",
      alternative: "Edges round progressively, which is often the reason parts are rejected.",
    },
    {
      criterion: "Internal features",
      mmp: "Treats bores, cooling channels, undercuts and blind pockets.",
      alternative: "Reaches only line-of-sight surfaces.",
    },
    {
      criterion: "Repeatability",
      mmp: "Parameter-driven, so batch two matches batch one.",
      alternative: "Operator skill decides the outcome.",
    },
    {
      criterion: "Best suited to",
      mmp: "Fatigue-critical, sealing, flow and contact surfaces where texture drives performance.",
      alternative: "Cosmetic work, heavy burr removal, and one-off parts where cost rules.",
    },
  ],
};

const FALLBACK_STATS: StatTripletCopy = {
  heading: "What changes when the peaks come off.",
  figures: [
    { value: "Lower", label: "Friction", detail: "Less heat generated in sliding and rolling contact." },
    { value: "Longer", label: "Service life", detail: "Fewer stress risers to initiate a fatigue crack." },
    { value: "Cleaner", label: "Release", detail: "Non-directional texture that does not trap contaminant." },
  ],
};

const RELATED = [
  {
    label: "The MMP process",
    href: "/technology",
    description: "How wavelength-selective removal actually works.",
  },
  {
    label: "Mirror-like finish",
    href: "/mirror-like-finish",
    description: "When the requirement goes past deburring to an optical surface.",
  },
  {
    label: "Validation",
    href: "/validation",
    description: "How the result is proven on your component before series work.",
  },
];

export function DeburringPageContent({
  hero,
  blocks,
  industries,
  gallery,
  comparison = FALLBACK_COMPARISON,
  stats = FALLBACK_STATS,
}: {
  hero: PageHeroCopy;
  blocks: ContentBlock[];
  industries: WithId<IndustryDoc>[];
  gallery: GalleryCopy | null;
  comparison?: ComparisonCopy;
  stats?: StatTripletCopy;
}) {
  return (
    <main className="min-h-screen bg-background">
      <CapabilityHero
        hero={hero}
        image={HERO_IMAGERY.deburring}
        badges={[{ label: "Edges preserved" }, { label: "Reaches internal features" }, { label: "Parameter-driven" }]}
        spec={{ title: "Where MMP differs", body: "Conventional finishing abrades the whole surface. MMP forms a film on the peaks and wipes only those away." }}
      />

      {/* The photograph does the arguing before the words do. */}
      <EvidenceImage
        label="Before and after"
        heading="Turbocharger wheels, as cast and MMP-finished."
        body="Same castings, same geometry. The only variable is the surface, and it is the surface that decides how much of the gas flow becomes work."
        src="/images/placeholders/process-02-turbo-wheels-before-after.jpg"
        alt="Turbocharger wheels shown as cast beside MMP-finished examples"
        readings={[
          { label: "Component", value: "Turbocharger wheel" },
          { label: "Incoming", value: "As cast" },
          { label: "Treatment", value: "MMP finish" },
          { label: "Geometry", value: "Unchanged" },
        ]}
      />

      {/* Light: the choice, laid out as a choice. */}
      <SplitComparison copy={comparison} surface="light" />

      {/* Dark run: outcomes, then the range of parts this applies to. */}
      <StatTriplet copy={stats} />
      <ComponentGallery copy={gallery} />

      <ContentBlocks blocks={blocks} surface="light" />
      <PageTail industries={industries} related={RELATED} surface="dark" />
    </main>
  );
}
