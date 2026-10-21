export interface EmailLogEntry {
  recipient: string;
  subject: string;
  template: string;
  sentAt: string;
  bodySnippet: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
  imageUrl?: string | null;
  createdAt: string;
  status: "New" | "In Review" | "Quoted" | "Completed" | "Closed";
  notes: string[];
  emailLogs?: EmailLogEntry[];
}

export const DEMO_LEADS: LeadRecord[] = [
  {
    id: "lead-101",
    name: "Vikram Singhania",
    company: "Aerospace Dynamics Ltd",
    email: "v.singhania@aero-dyn.com",
    phone: "+91 98201 54321",
    industry: "Aerospace",
    message: "Titanium compressor blisks require Ra reduction from 0.8 um down to 0.04 um. Critical: profile geometry must remain unaltered with minimal edge radius.",
    imageUrl: "/images/placeholders/gallery-01-turbine-ring.jpg",
    createdAt: "14 Oct 2026, 11:20 AM",
    status: "New",
    notes: ["Initial inquiry received via website contact form with uploaded component drawing."],
    emailLogs: [],
  },
  {
    id: "lead-102",
    name: "Dr. Ananya Roy",
    company: "OrthoPrecision Implants",
    email: "ananya.roy@orthoprecision.in",
    phone: "+91 94330 98765",
    industry: "Medical",
    message: "Need batch validation for CoCr knee femoral components. Target Ra 0.01 um mirror finish. Looking to process 500 units per month.",
    imageUrl: "/images/placeholders/gallery-03-knee-implant.jpg",
    createdAt: "12 Oct 2026, 03:45 PM",
    status: "In Review",
    notes: [
      "Assigned to Senior Metallurgist for recipe recommendation.",
      "Sample coupons requested from client.",
    ],
    emailLogs: [],
  },
  {
    id: "lead-103",
    name: "Marcus Vance",
    company: "Vance Precision Tooling",
    email: "m.vance@vancetooling.de",
    phone: "+49 711 987654",
    industry: "Cutting Tools",
    message: "Carbide micro-drills flutes superfinishing for friction reduction and tool life extension on deep-hole drilling operations.",
    imageUrl: "/images/placeholders/gallery-05-carbide-drills.jpg",
    createdAt: "10 Oct 2026, 09:15 AM",
    status: "Quoted",
    notes: [
      "Quotation Q-2026-88 dispatched to client.",
      "Expected decision by end of month.",
    ],
    emailLogs: [
      {
        recipient: "m.vance@vancetooling.de",
        subject: "Formal Quotation & Process Schedule - INFINI Precision Surface Finishing",
        template: "Commercial Quotation & Lead Time",
        sentAt: "10 Oct 2026, 11:30 AM",
        bodySnippet: "Following our technical assessment for Vance Precision Tooling, we are pleased to submit our commercial quotation...",
      },
    ],
  },
];
