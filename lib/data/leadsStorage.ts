import fs from "fs";
import path from "path";

export interface LeadItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  industry: string;
  message: string;
  date: string;
  status: "New" | "In Review" | "Quoted" | "Won";
  hasDrawing: boolean;
  imageUrl?: string | null;
}

export const SAMPLE_LEADS: LeadItem[] = [
  {
    id: "lead-1",
    name: "Vikram Singhania",
    company: "Aerospace Dynamics Ltd",
    email: "v.singhania@aero-dyn.com",
    phone: "+91 98201 54321",
    industry: "Aerospace",
    message: "Titanium compressor blades need Ra reduction from 0.8 to 0.04 um with zero profile loss.",
    date: "14 Oct 2026",
    status: "New",
    hasDrawing: true,
    imageUrl: "/images/placeholders/gallery-01-turbine-ring.jpg",
  },
  {
    id: "lead-2",
    name: "Dr. Ananya Roy",
    company: "OrthoPrecision Implants",
    email: "ananya.roy@orthoprecision.in",
    phone: "+91 94330 98765",
    industry: "Medical",
    message: "CoCr knee femoral heads batch validation inquiry, Ra target 0.01 um mirror finish.",
    date: "12 Oct 2026",
    status: "In Review",
    hasDrawing: true,
    imageUrl: "/images/placeholders/gallery-03-knee-implant.jpg",
  },
  {
    id: "lead-3",
    name: "Marcus Vance",
    company: "Vance Precision Tooling",
    email: "m.vance@vancetooling.de",
    phone: "+49 711 987654",
    industry: "Cutting Tools",
    message: "Carbide micro-drills flutes polishing for friction reduction and tool life extension.",
    date: "10 Oct 2026",
    status: "Quoted",
    hasDrawing: false,
    imageUrl: "/images/placeholders/gallery-05-carbide-drills.jpg",
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "leads.json");

function readFallbackFile(): LeadItem[] | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(raw) as LeadItem[];
    }
  } catch (err) {
    console.warn("[leadsStorage] Failed to read fallback file:", err);
  }
  return null;
}

function writeFallbackFile(leads: LeadItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.warn("[leadsStorage] Failed to write fallback file:", err);
  }
}

/**
 * Retrieve all leads with dual-layer cloud/local persistence.
 */
export async function getStoredLeads(): Promise<LeadItem[]> {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const snap = await adminDb.collection("leads").orderBy("createdAt", "desc").limit(50).get();
      if (!snap.empty) {
        return snap.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Recent";

          return {
            id: doc.id,
            name: data.name || "Anonymous",
            company: data.company || "Individual / Private",
            email: data.email || "",
            phone: data.phone || "",
            industry: data.industry || "General Engineering",
            message: data.message || "",
            imageUrl: data.imageUrl || null,
            date: createdAt,
            status: data.status === "new" ? "New" : data.status === "quoted" ? "Quoted" : data.status || "New",
            hasDrawing: Boolean(data.imageUrl),
          };
        });
      }
    } catch (err) {
      console.warn("[leadsStorage] Firestore read fallback:", err);
    }
  }

  const fileData = readFallbackFile();
  if (fileData && fileData.length > 0) {
    return fileData;
  }

  // Seed fallback
  writeFallbackFile(SAMPLE_LEADS);
  return SAMPLE_LEADS;
}

/**
 * Save or insert a lead.
 */
export async function saveStoredLead(leadData: Partial<LeadItem>): Promise<LeadItem> {
  const current = await getStoredLeads();
  const id = leadData.id || `lead-${Date.now()}`;
  const newLead: LeadItem = {
    id,
    name: leadData.name || "Customer",
    company: leadData.company || "Private Manufacturing",
    email: leadData.email || "",
    phone: leadData.phone || "",
    industry: leadData.industry || "General Engineering",
    message: leadData.message || "",
    date:
      leadData.date ||
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    status: leadData.status || "New",
    hasDrawing: Boolean(leadData.hasDrawing || leadData.imageUrl),
    imageUrl: leadData.imageUrl || null,
  };

  const existingIdx = current.findIndex((l) => l.id === id);
  let updatedList: LeadItem[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...newLead };
  } else {
    updatedList = [newLead, ...current];
  }

  writeFallbackFile(updatedList);

  // Sync to Firestore if cloud credentials exist
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const { FieldValue } = await import("firebase-admin/firestore");
    await adminDb
      .collection("leads")
      .doc(id)
      .set(
        {
          name: newLead.name,
          company: newLead.company,
          email: newLead.email,
          phone: newLead.phone,
          industry: newLead.industry,
          message: newLead.message,
          imageUrl: newLead.imageUrl,
          status: newLead.status,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  } catch (err) {
    console.warn("[leadsStorage] Firestore write skipped/failed:", err);
  }

  return newLead;
}

/**
 * Update lead status (e.g. from New -> In Review -> Quoted).
 */
export async function updateStoredLeadStatus(
  id: string,
  status: "New" | "In Review" | "Quoted" | "Won"
): Promise<boolean> {
  const leads = await getStoredLeads();
  const target = leads.find((l) => l.id === id);
  if (!target) return false;

  await saveStoredLead({ ...target, status });
  return true;
}
