export interface CapabilityItem {
  title: string;
  description: string;
}

export const capabilitiesSeo = {
  title: "Capabilities — MMP Surface Finishing Process",
  description:
    "INFINI's treatment capabilities: MMP surface finishing from controlled roughness to mirror-like brilliance, with measured, traceable batch validation.",
};

export const capabilitiesHero = {
  eyebrow: "Capabilities",
  heading: "From controlled roughness to mirror-like brilliance.",
  body: "MMP treatment covers a range of finishes on a single process — the same underlying technology takes a surface from a specified controlled roughness through to a mirror-like finish, depending on what the application needs.",
};

export const processCapabilities: CapabilityItem[] = [
  {
    title: "Selective, frequency-based removal",
    description:
      "The surface is mapped as a collection of roughness frequencies. Treatment removes the highest frequencies first, then progressively lower ones, so the process can stop at any target roughness instead of over-treating the part.",
  },
  {
    title: "Geometry-preserving",
    description:
      "Because material removal is controlled and selective rather than abrasive across the whole surface, MMP preserves the part's form — including fine features that conventional polishing would alter or destroy.",
  },
  {
    title: "Measured and traceable",
    description:
      "Every treatment starts from a roughness measurement of the actual workpiece and an agreed target with the customer, and production batches are run and documented against that objective.",
  },
];

export const capacitySummary = {
  heading: "Capacity & lead times",
  body: "Production capacity, batch size and turnaround depend on the component, material and finish specified. Rather than publish a generic figure that may not hold for your part, tell us what you're treating and we'll give you a capacity and lead-time estimate specific to it.",
};
