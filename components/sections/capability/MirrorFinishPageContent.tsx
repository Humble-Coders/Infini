import { CapabilityHero } from "./CapabilityHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { ContentBlocks } from "./ContentBlocks";
import { GradeLadder } from "./GradeLadder";
import { MirrorBrillianceSection } from "./MirrorBrillianceSection";
import { PageTail } from "./PageTail";
import { SpecTable } from "./SpecTable";
import { StatTriplet } from "./StatTriplet";
import { ComponentGallery } from "@/components/sections/home/ComponentGallery";
import { TrustSection } from "@/components/sections/home/TrustSection";
import type {
  ContentBlock,
  GalleryCopy,
  IndustryDoc,
  PageHeroCopy,
  SpecTableCopy,
  StatTripletCopy,
  WithId,
} from "@/lib/types";

/*
 * /mirror-like-finish is the first outcome page: named after the result the
 * customer wants rather than the process that produces it. It is the template
 * for the outcome axis, so its shape matters as much as its content.
 *
 * Its centrepiece is the logarithmic grade scale. Engineers arrive holding a
 * roughness figure off a drawing, and the distance between as-machined and
 * mirror is the whole argument, which a list of grades flattens and a drawn
 * scale does not.
 */

const FALLBACK_SPEC: SpecTableCopy = {
  heading: "What a mirror finish costs you in tolerance",
  intro:
    "Very little, which is the point. Conventional routes to this finish keep removing stock until the roughness is gone; MMP filters the surface with a small, controlled removal, so form and tolerance hold.",
  caption: "Treatment envelope for mirror work",
  rows: [
    { parameter: "Achievable roughness", unit: "µm Ra", value: "0.05 to 0.02" },
    { parameter: "Achievable roughness", unit: "µin Ra", value: "2 to 0.8" },
    { parameter: "Material removal", unit: "", value: "Minimal, controlled", note: "Form and tolerance held" },
    { parameter: "Edge condition", unit: "", value: "Controlled micro-radius", note: "Set by the aggregate size" },
    { parameter: "Texture", unit: "", value: "Non-directional", note: "No lay to channel lubricant away" },
    { parameter: "Substrate", unit: "", value: "Any material" },
    { parameter: "Not removed", unit: "", value: "Deep scratches, form defects", note: "Correct these before treatment" },
  ],
};

const FALLBACK_STATS: StatTripletCopy = {
  heading: "What a mirror surface is actually for.",
  figures: [
    {
      value: "Flow",
      label: "Aerodynamic and hydraulic",
      detail: "Less boundary-layer disruption across blades and passages.",
    },
    {
      value: "Release",
      label: "Moulds and dies",
      detail: "Plastic and forgings release cleanly, with fewer cycles lost.",
    },
    {
      value: "Clean",
      label: "Medical and food contact",
      detail: "No texture for contaminant to sit in, easier to validate.",
    },
  ],
};

const RELATED = [
  {
    label: "The MMP process",
    href: "/technology",
    description: "How the finish is reached while the part keeps its form.",
  },
  {
    label: "Validation",
    href: "/validation",
    description: "How a target roughness is proven and then held in series.",
  },
  {
    label: "Deburring and polishing",
    href: "/deburring-polishing",
    description: "Where conventional finishing stops and MMP begins.",
  },
];

export function MirrorFinishPageContent({
  hero,
  blocks,
  industries,
  gallery,
  spec = FALLBACK_SPEC,
  stats = FALLBACK_STATS,
}: {
  hero: PageHeroCopy;
  blocks: ContentBlock[];
  industries: WithId<IndustryDoc>[];
  gallery: GalleryCopy | null;
  spec?: SpecTableCopy;
  stats?: StatTripletCopy;
}) {
  return (
    <main className="min-h-screen bg-background">
      {/* Dark run: hero, then the parts themselves, mirror-finished. */}
      <CapabilityHero
        hero={hero}
        image={HERO_IMAGERY.mirror}
        badges={[{ label: "0.02 µm Ra" }, { label: "Non-directional" }, { label: "Form preserved" }]}
        spec={{ title: "Mirror band", body: "0.05 down to 0.02 µm Ra, reached by filtering the surface with a minimal, controlled removal, so the part keeps its form." }}
      />
      <ComponentGallery copy={gallery} />

      {/* Light run: the scale, then what it costs in tolerance. */}
      <GradeLadder
        heading="Find your number on the scale."
        body="Roughness spans two orders of magnitude between a machined surface and a mirror. Plotted logarithmically, the gap MMP closes is the gap that matters."
      />
      <SpecTable copy={spec} surface="light" />

      {/* Dark run: brochure form integrity & internal flow rules */}
      <MirrorBrillianceSection surface="dark" />

      {/* Outcomes, the detail, the logo wall, then the ask. */}
      <StatTriplet copy={stats} />
      <ContentBlocks blocks={blocks} surface="dark" />
      <TrustSection />
      <PageTail industries={industries} related={RELATED} surface="light" />
    </main>
  );
}
