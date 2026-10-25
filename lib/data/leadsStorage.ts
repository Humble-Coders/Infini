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
  createdAt?: string;
  status: "New" | "In Review" | "Sample Requested" | "Quoted" | "Won";
  hasDrawing: boolean;
  imageUrl?: string | null;
  notes?: string[];
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
    date: "14 Oct 2026, 11:20 AM",
    createdAt: "14 Oct 2026, 11:20 AM",
    status: "New",
    hasDrawing: true,
    imageUrl: "/images/placeholders/gallery-01-turbine-ring.jpg",
    notes: ["Initial inquiry received via website contact form with uploaded component drawing."],
  },
  {
    id: "lead-2",
    name: "Dr. Ananya Roy",
    company: "OrthoPrecision Implants",
    email: "ananya.roy@orthoprecision.in",
    phone: "+91 94330 98765",
    industry: "Medical",
    message: "CoCr knee femoral heads batch validation inquiry, Ra target 0.01 um mirror finish.",
    date: "12 Oct 2026, 03:45 PM",
    createdAt: "12 Oct 2026, 03:45 PM",
    status: "In Review",
    hasDrawing: true,
    imageUrl: "/images/placeholders/gallery-03-knee-implant.jpg",
    notes: [
      "Assigned to Senior Metallurgist for recipe recommendation.",
      "Sample coupons requested from client.",
    ],
  },
  {
    id: "lead-3",
    name: "Marcus Vance",
    company: "Vance Precision Tooling",
    email: "m.vance@vancetooling.de",
    phone: "+49 711 987654",
    industry: "Cutting Tools",
    message: "Carbide micro-drills flutes polishing for friction reduction and tool life extension.",
    date: "10 Oct 2026, 09:15 AM",
    createdAt: "10 Oct 2026, 09:15 AM",
    status: "Quoted",
    hasDrawing: false,
    imageUrl: "/images/placeholders/gallery-05-carbide-drills.jpg",
    notes: [
      "Quotation Q-2026-88 dispatched to client.",
      "Expected decision by end of month.",
    ],
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "leads.json");

function readFallbackFile(): LeadItem[] | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          ...item,
          createdAt: item.createdAt || item.date || "Recent",
          date: item.date || item.createdAt || "Recent",
          notes: Array.isArray(item.notes) ? item.notes : [],
          hasDrawing: Boolean(item.hasDrawing || item.imageUrl),
        }));
      }
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
            ? data.createdAt.toDate().toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
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
            createdAt,
            status:
              data.status === "new"
                ? "New"
                : data.status === "in_review"
                ? "In Review"
                : data.status === "quoted"
                ? "Quoted"
                : data.status || "New",
            hasDrawing: Boolean(data.imageUrl),
            notes: Array.isArray(data.notes) ? data.notes : [],
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
  const nowFormatted = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newLead: LeadItem = {
    id,
    name: leadData.name || "Customer",
    company: leadData.company || "Private Manufacturing",
    email: leadData.email || "",
    phone: leadData.phone || "",
    industry: leadData.industry || "General Engineering",
    message: leadData.message || "",
    date: leadData.date || leadData.createdAt || nowFormatted,
    createdAt: leadData.createdAt || leadData.date || nowFormatted,
    status: leadData.status || "New",
    hasDrawing: Boolean(leadData.hasDrawing || leadData.imageUrl),
    imageUrl: leadData.imageUrl || null,
    notes: Array.isArray(leadData.notes) ? leadData.notes : [],
  };

  const existingIdx = current.findIndex((l) => l.id === id);
  let updatedList: LeadItem[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = {
      ...updatedList[existingIdx],
      ...newLead,
      notes: leadData.notes !== undefined ? leadData.notes : updatedList[existingIdx].notes || [],
    };
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
          notes: newLead.notes || [],
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
  status: "New" | "In Review" | "Sample Requested" | "Quoted" | "Won"
): Promise<boolean> {
  const leads = await getStoredLeads();
  const target = leads.find((l) => l.id === id);
  if (!target) return false;

  await saveStoredLead({ ...target, status });
  return true;
}

/**
 * Add an engineering activity log note to a lead.
 */
export async function addStoredLeadNote(id: string, note: string): Promise<boolean> {
  const leads = await getStoredLeads();
  const target = leads.find((l) => l.id === id);
  if (!target) return false;

  const currentNotes = target.notes || [];
  const updatedNotes = [...currentNotes, note];
  await saveStoredLead({ ...target, notes: updatedNotes });
  return true;
}

/**
 * Delete a lead record.
 */
export async function deleteStoredLead(id: string): Promise<boolean> {
  const leads = await getStoredLeads();
  const filtered = leads.filter((l) => l.id !== id);
  writeFallbackFile(filtered);

  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    await adminDb.collection("leads").doc(id).delete();
  } catch (err) {
    console.warn("[leadsStorage] Firestore delete skipped/failed:", err);
  }

  return true;
}
