/**
 * Seed content for the two cross-linking axes added in Phase 3: `benefits`
 * (what MMP changes about a part) and `componentTypes` (what the customer
 * physically holds).
 *
 * Kept beside content.ts rather than inside it because these two collections
 * are the matrix, and the relationships between them, the industries and each
 * other are the point. Every `related*Slugs` value below must resolve to a slug
 * that exists in the other collection or in buildIndustries().
 */

const baseSeo = (title: string, description: string) => ({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "",
  canonical: "",
  noindex: false,
});

export function buildBenefits() {
  return [
    {
      slug: "micropitting",
      name: "Micropitting",
      order: 1,
      headline: "Stopping micropitting before it starts.",
      summary: "Surface-initiated fatigue on loaded flanks, removed at its source.",
      mechanism:
        "Micropitting begins where asperities on two loaded surfaces make contact through the oil film. Local pressure at those peaks exceeds what the lubricant can separate, the metal yields, and a network of shallow cracks forms. Left alone it spreads into a grey, matte band on the flank and ends in bulk pitting.",
      whatChanges:
        "MMP removes the peaks that carry that contact without touching the flank geometry. The load spreads across a larger bearing area, the film separates the surfaces at pressures where it previously collapsed, and the initiation sites are simply no longer there.",
      evidence: [
        { label: "Contact area", value: "Increased", note: "Higher bearing ratio after treatment" },
        { label: "Lambda ratio", value: "Improved", note: "Same oil, thicker effective film" },
        { label: "Form", value: "Preserved" },
      ],
      relatedIndustrySlugs: ["gears-transmission", "aerospace"],
      relatedComponentSlugs: ["gears-and-shafts", "bearings"],
    },
    {
      slug: "friction-and-heat",
      name: "Friction and heat",
      order: 2,
      headline: "Less friction, and less of the heat it makes.",
      summary: "Lower sliding resistance in transmission and engine contacts.",
      mechanism:
        "A machined surface meets its counterface on a small fraction of its apparent area. Everything the contact does, shearing the oil film, ploughing asperities, generating heat, happens at those points, and the energy lost there leaves as heat the system then has to carry away.",
      whatChanges:
        "Removing the roughness raises the proportion of the surface actually in contact and gives the lubricant a smoother path across it. Less energy goes into shearing and ploughing, so less becomes heat, and the cooling system has less to do.",
      evidence: [
        { label: "Friction coefficient", value: "Reduced" },
        { label: "Operating temperature", value: "Lower" },
        { label: "Energy loss", value: "Reduced" },
      ],
      relatedIndustrySlugs: ["gears-transmission", "aerospace", "powder-metallurgy"],
      relatedComponentSlugs: ["gears-and-shafts", "bearings", "turbine-and-impeller"],
    },
    {
      slug: "fatigue-life",
      name: "Fatigue life",
      order: 3,
      headline: "Removing the notches a crack would start from.",
      summary: "Fewer stress risers, so fatigue cracks have nowhere to initiate.",
      mechanism:
        "Every valley left by a tool is a stress concentrator. Under cyclic load the stress at the root of a machining mark is far above the nominal stress in the section, which is why fatigue cracks almost always start at the surface rather than inside the material.",
      whatChanges:
        "MMP takes the sharp valleys out of the profile while leaving the section and its residual compressive stress alone. The local stress concentration falls, and with it the probability that any given cycle starts a crack.",
      evidence: [
        { label: "Crack initiation sites", value: "Reduced" },
        { label: "Surface residual stress", value: "Retained", note: "Treatment is not abrasive" },
        { label: "Section geometry", value: "Unchanged" },
      ],
      relatedIndustrySlugs: ["aerospace", "gears-transmission", "additive-manufacturing"],
      relatedComponentSlugs: ["turbine-and-impeller", "gears-and-shafts", "additive-parts"],
    },
    {
      slug: "edm-recast-removal",
      name: "EDM recast layer",
      order: 4,
      headline: "Taking the recast layer off, without taking the form with it.",
      summary: "The heat-affected skin left by spark erosion, removed cleanly.",
      mechanism:
        "Electro-discharge machining melts and re-solidifies a few microns of the surface. That recast skin is brittle, often microcracked, and sits directly on a heat-affected zone. On a fatigue-critical or sealing surface it is a defect layer waiting to be found.",
      whatChanges:
        "MMP removes the recast layer and the roughness under it in the same operation, reaching into the cavities and ribs an abrasive tool cannot. The cavity keeps the geometry the spark erosion produced.",
      evidence: [
        { label: "Recast layer", value: "Removed" },
        { label: "Cavity geometry", value: "Preserved" },
        { label: "Access", value: "Open cavities, ribs and slots" },
      ],
      relatedIndustrySlugs: ["forge-stamping-die", "plastic-injection-molds", "aerospace"],
      relatedComponentSlugs: ["dies-and-moulds", "turbine-and-impeller"],
    },
    {
      slug: "cleanability",
      name: "Cleanability",
      order: 5,
      headline: "Nowhere for contaminant to sit.",
      summary: "Non-directional surfaces that clean, and stay clean.",
      mechanism:
        "Contamination collects in the valleys of a machined surface, and a directional lay gives it channels to travel along. In implant, instrument and food-contact work that is both a cleaning problem and a validation problem, because you have to prove the surface is clean, not assume it.",
      whatChanges:
        "The treated surface is smooth and non-directional, so there are no valleys to hold residue and no lay to carry it. Cleaning cycles get shorter and the result is easier to demonstrate.",
      evidence: [
        { label: "Surface texture", value: "Non-directional" },
        { label: "Retained residue", value: "Reduced" },
        { label: "Material added", value: "None", note: "A treatment, not a coating" },
      ],
      relatedIndustrySlugs: ["medical-implants", "plastic-injection-molds"],
      relatedComponentSlugs: ["implants", "dies-and-moulds"],
    },
    {
      slug: "coating-adhesion",
      name: "Coating adhesion",
      order: 6,
      headline: "A better surface to coat onto.",
      summary: "Preparation before PVD, and a smoother finish after it.",
      mechanism:
        "A coating follows the surface underneath it. Droplets, peaks and recast on the substrate come through into the coated surface, and any contaminant trapped in a valley becomes a place the coating can lift from later.",
      whatChanges:
        "Treating before coating gives a clean, even substrate for the layer to key into. Treating afterwards knocks the droplets off the coated surface without stripping the layer, which is why the same process appears on both sides of a PVD line.",
      evidence: [
        { label: "Substrate condition", value: "Even and clean" },
        { label: "Post-coat roughness", value: "Reduced" },
        { label: "Coating thickness", value: "Retained" },
      ],
      relatedIndustrySlugs: ["cutting-tools", "forge-stamping-die"],
      relatedComponentSlugs: ["cutting-tools", "dies-and-moulds"],
    },
  ].map((benefit) => ({
    ...benefit,
    seo: baseSeo(`${benefit.name}: what MMP changes`, benefit.summary),
    published: true,
  }));
}

export function buildComponentTypes() {
  return [
    {
      slug: "gears-and-shafts",
      name: "Gears and shafts",
      order: 1,
      headline: "Quieter mesh, lower friction, longer service life.",
      summary: "Loaded flanks where surface texture decides how the pair behaves.",
      challenge:
        "A gear is an engineered micro-geometry running under high contact stress, variable speed and shock load. Grinding leaves a directional lay across the flank, and that lay is where the oil film is thinnest, where micropitting starts and where the pair is loudest during break-in.",
      treatment:
        "MMP takes the peaks off the flank while holding profile and lead, so the tooth keeps the geometry it was ground to. The result is a plateaued, non-directional surface with a high bearing ratio.",
      envelope: [
        { label: "Typical incoming", value: "Ground or hobbed" },
        { label: "Achievable", value: "0.1 to 0.02 µm Ra" },
        { label: "Profile and lead", value: "Held" },
        { label: "Batch or single part", value: "Both" },
      ],
      materials: ["Case-hardened alloy steel", "Nitrided steel", "Powder-metal gears"],
      relatedIndustrySlugs: ["gears-transmission", "aerospace", "powder-metallurgy"],
      relatedBenefitSlugs: ["micropitting", "friction-and-heat", "fatigue-life"],
    },
    {
      slug: "turbine-and-impeller",
      name: "Turbine wheels and impellers",
      order: 2,
      headline: "Flow surfaces, finished without losing the aerofoil.",
      summary: "Blades, blisks, impellers and diffusers where texture costs efficiency.",
      challenge:
        "On a flow surface, roughness disrupts the boundary layer and some of the energy that should have become work becomes turbulence and heat instead. The surfaces that matter most are also the hardest to reach: blade roots, fillets, the concave side of an aerofoil.",
      treatment:
        "The treatment works in a tank rather than with a tool, so it reaches the whole aerofoil including roots and fillets, and it removes roughness while holding the profile, leaving the leading edge with a controlled micro-radius rather than an uneven one.",
      envelope: [
        { label: "Typical incoming", value: "Cast, machined or additive" },
        { label: "Achievable", value: "0.05 to 0.02 µm Ra" },
        { label: "Edge condition", value: "Controlled" },
        { label: "Access", value: "Roots, fillets, concave faces" },
      ],
      materials: ["Inconel 718", "Titanium Ti-6Al-4V", "Stainless steel", "Aluminium"],
      relatedIndustrySlugs: ["aerospace", "additive-manufacturing"],
      relatedBenefitSlugs: ["fatigue-life", "friction-and-heat", "edm-recast-removal"],
    },
    {
      slug: "dies-and-moulds",
      name: "Dies and moulds",
      order: 3,
      headline: "Cavities that release cleanly and run longer.",
      summary: "Forging dies, stamping tools and injection-mould cavities.",
      challenge:
        "A cavity surface transfers itself into every part it makes. EDM leaves a recast skin, polishing by hand is slow and inconsistent between operators, and both leave texture that resists release and shortens the interval between reworks.",
      treatment:
        "MMP removes the recast layer and the roughness beneath it in one operation, across ribs, slots and open cavities, and it does so without opening the cavity or softening a detail.",
      envelope: [
        { label: "Typical incoming", value: "EDM, milled or ground" },
        { label: "Achievable", value: "0.05 to 0.02 µm Ra" },
        { label: "Cavity dimensions", value: "Unchanged" },
        { label: "Detail and texture", value: "Preserved" },
      ],
      materials: ["P20 tool steel", "H13", "Stainless mould steel"],
      relatedIndustrySlugs: ["forge-stamping-die", "plastic-injection-molds"],
      relatedBenefitSlugs: ["edm-recast-removal", "cleanability", "coating-adhesion"],
    },
    {
      slug: "cutting-tools",
      name: "Cutting tools",
      order: 4,
      headline: "Edges that hold their line under load.",
      summary: "Drills, end mills and inserts, before and after coating.",
      challenge:
        "A cutting edge fails at the micro-scale first. Grinding leaves a serrated edge and a rough rake face, chips weld to the peaks, and the coating that was meant to protect the tool inherits every droplet and defect on the substrate.",
      treatment:
        "Treating the substrate gives the coating an even surface to key into. Treating after coating removes the droplets without stripping the layer. Either way the edge preparation is controlled rather than incidental.",
      envelope: [
        { label: "Typical incoming", value: "Ground carbide or HSS" },
        { label: "Achievable", value: "0.1 to 0.02 µm Ra" },
        { label: "Edge radius", value: "Controlled" },
        { label: "Stage", value: "Pre-coat, post-coat, or both" },
      ],
      materials: ["Solid carbide", "HSS", "Cermet", "PVD-coated tooling"],
      relatedIndustrySlugs: ["cutting-tools"],
      relatedBenefitSlugs: ["coating-adhesion", "friction-and-heat"],
    },
    {
      slug: "implants",
      name: "Implants and instruments",
      order: 5,
      headline: "Surfaces that go inside people.",
      summary: "Orthopaedic implants and surgical instruments, finished and validated.",
      challenge:
        "An implant surface has to be smooth enough not to abrade its counterface, clean enough to validate, and consistent enough to prove batch after batch. Hand polishing meets none of those three reliably.",
      treatment:
        "The treatment is parameter-driven rather than operator-driven, so every part in the batch gets the same surface, and the result is non-directional with no valleys to hold residue.",
      envelope: [
        { label: "Typical incoming", value: "Machined or additive" },
        { label: "Achievable", value: "0.05 to 0.02 µm Ra" },
        { label: "Texture", value: "Non-directional" },
        { label: "Material added", value: "None" },
      ],
      materials: ["Titanium Ti-6Al-4V", "CoCr alloy", "316L stainless"],
      relatedIndustrySlugs: ["medical-implants", "additive-manufacturing"],
      relatedBenefitSlugs: ["cleanability", "fatigue-life"],
    },
    {
      slug: "additive-parts",
      name: "Additive parts",
      order: 6,
      headline: "The finish 3D printing cannot give you on its own.",
      summary: "Printed geometries, including surfaces a tool will never reach.",
      challenge:
        "Powder-bed parts come off the plate with partially sintered particles on every face and a stepped, directional texture that follows the build layers. Internal channels, lattices and conformal cooling are exactly the geometries additive is chosen for, and exactly the ones no abrasive process can reach.",
      treatment:
        "Because the treatment works in a tank, it follows complex printed shapes and treats straight or gently curved channels wide enough for the roughness, removing loose particles and layer texture without eroding the printed geometry.",
      envelope: [
        { label: "Typical incoming", value: "As printed, DMLS or SLM" },
        { label: "Achievable", value: "0.1 to 0.02 µm Ra" },
        { label: "Internal channels", value: "Straight or gently curved, from 5 mm" },
        { label: "Printed geometry", value: "Retained" },
      ],
      materials: ["Inconel 718", "Titanium Ti-6Al-4V", "AlSi10Mg", "316L stainless"],
      relatedIndustrySlugs: ["additive-manufacturing", "aerospace", "medical-implants"],
      relatedBenefitSlugs: ["fatigue-life", "cleanability", "friction-and-heat"],
    },
    {
      slug: "bearings",
      name: "Bearings and raceways",
      order: 7,
      headline: "Rolling contacts that keep their film.",
      summary: "Raceways and rolling elements under concentrated contact stress.",
      challenge:
        "A rolling contact concentrates load into an area smaller than a fingernail. The oil film separating the two surfaces is thinner than the roughness of a ground raceway, which is why asperity contact, and the fatigue that follows it, is the normal failure mode.",
      treatment:
        "Smoothing the raceway raises the film thickness ratio without changing the race geometry, so the same lubricant separates surfaces it previously could not.",
      envelope: [
        { label: "Typical incoming", value: "Ground or honed" },
        { label: "Achievable", value: "0.05 to 0.02 µm Ra" },
        { label: "Race geometry", value: "Held" },
        { label: "Batch or single part", value: "Both" },
      ],
      materials: ["Bearing steel", "Case-hardened steel", "Ceramic hybrids"],
      relatedIndustrySlugs: ["gears-transmission", "aerospace"],
      relatedBenefitSlugs: ["micropitting", "friction-and-heat", "fatigue-life"],
    },
  ].map((type) => ({
    ...type,
    seo: baseSeo(`Surface finishing for ${type.name.toLowerCase()}`, type.summary),
    published: true,
  }));
}
