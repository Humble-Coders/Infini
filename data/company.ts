export interface CompanyFact {
  label: string;
  value: string;
}

export const companySeo = {
  title: "About INFINI — Precision Surface Finishing",
  description:
    "INFINI Precision Pvt. Ltd. applies MMP surface-finishing technology from its treatment facility in Parwanoo, Himachal Pradesh, serving precision manufacturers across seven industries.",
};

export const companyHero = {
  eyebrow: "Company",
  heading: "A specialist surface-finishing partner, not a manufacturer.",
  body: "INFINI Precision Pvt. Ltd. applies MMP surface-finishing technology to components its customers manufacture — it does not manufacture the parts itself. The company operates from a treatment facility in Parwanoo, Himachal Pradesh, and serves precision manufacturers across seven industries.",
};

export const companyFacts: CompanyFact[] = [
  { label: "Legal entity", value: "INFINI Precision Pvt. Ltd." },
  { label: "Facility location", value: "Parwanoo, Himachal Pradesh, India" },
  {
    label: "Markets served",
    value: "Cutting Tools, Forge/Stamping/Die, Plastic Injection Molds, Medical Implants, Aerospace, Additive Manufacturing, Gears & Transmission",
  },
  { label: "Certifications held", value: "ISO 9001, ISO 13485, ISO 14001, ISO 45001, Udyam registration" },
];

export const companyProcessSummary = {
  heading: "How INFINI treats a surface",
  body: "INFINI's MMP (Micro Machining Process) technology is a mechanical treatment, not a chemical one, applied to parts placed in a treatment tank. It maps a surface as a collection of roughness frequencies and removes the highest frequencies first, working progressively lower — which means the process can stop at any target roughness rather than over-treating the part. Because material removal is controlled and selective, MMP preserves the part's form, including fine features that conventional polishing would alter or destroy.",
};

export const companyQualitySummary = {
  heading: "How a treatment is validated",
  body: "Before a component goes to production volume, INFINI measures the workpiece's surface roughness, accounts for the material being treated, and agrees the target roughness and constraints with the customer. Production batches are then run against that agreed objective, with traceability and control built into the process rather than checked after the fact.",
};
