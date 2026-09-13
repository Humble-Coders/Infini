import type { TestimonialDoc, WithId } from "@/lib/types";

// TEMP DEMO DATA, sample quotes so the QuoteWall and Testimonials bands
// have something to show before real testimonials are published in
// Firestore. Names and companies are fictional placeholders for visual
// review only. HomePage falls back to this list when the collection is
// empty; real documents always win. Delete this file once real
// testimonials are authored.
export const DEMO_TESTIMONIALS: WithId<TestimonialDoc>[] = [
  {
    id: "demo-t1",
    quote: "Burr free edges on every batch, with measurement data we can file directly into our quality system.",
    personName: "Aarav Sharma",
    designation: "Quality Head",
    company: "AeroWorks",
    logoUrl: "",
    order: 1,
    published: true,
  },
  {
    id: "demo-t2",
    quote: "Mirror finishes on our implants, batch after batch, with zero deviations across the validation run.",
    personName: "Meera Iyer",
    designation: "Process Engineer",
    company: "MediCore",
    logoUrl: "",
    order: 2,
    published: true,
  },
  {
    id: "demo-t3",
    quote: "Our dies release cleaner and run longer since switching treatment to INFINI's in-house line.",
    personName: "Rahul Verma",
    designation: "Toolroom Lead",
    company: "ForgeLine",
    logoUrl: "",
    order: 3,
    published: true,
  },
  {
    id: "demo-t4",
    quote: "Cutting edges hold their line under load far longer, tool life is up across every station.",
    personName: "Sneha Kulkarni",
    designation: "Production Manager",
    company: "CutWell Tools",
    logoUrl: "",
    order: 4,
    published: true,
  },
  {
    id: "demo-t5",
    quote: "As printed roughness on our AM lattices came down to spec without touching the geometry.",
    personName: "Vikram Nair",
    designation: "AM Lead",
    company: "PrintForm",
    logoUrl: "",
    order: 5,
    published: true,
  },
];
