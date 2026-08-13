export const technologySectionCopy = {
  eyebrow: "The MMP Process",
  heading: "A treatment, not a coating.",
  body: "MMP (Micro Machining Process) is a mechanical-physical-chemical treatment performed in dedicated tanks. It selectively removes frequencies of surface roughness from components our customers manufacture — no material added, no dimensional drift, just a controlled finish verified against measurable roughness targets.",
};

export interface TechnologyStep {
  step: string;
  title: string;
  description: string;
}

export const technologySteps: TechnologyStep[] = [
  {
    step: "01",
    title: "Validation",
    description: "Component geometry, material and target roughness are assessed before treatment begins.",
  },
  {
    step: "02",
    title: "Treatment",
    description: "The MMP process runs in-house, in tanks tuned to the component and finish required.",
  },
  {
    step: "03",
    title: "Verification",
    description: "Every batch is measured against the agreed roughness spec before it ships.",
  },
];
