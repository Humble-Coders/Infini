import fs from "fs";
import path from "path";
import crypto from "crypto";

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
  // Production disk is ephemeral and per instance: Firestore is the only store there.
  if (process.env.NODE_ENV === "production") return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.warn("[leadsStorage] Failed to write fallback file:", err);
  }
}


const LEAD_STATUSES: readonly LeadItem["status"][] = ["New", "In Review", "Sample Requested", "Quoted", "Won"];

export function isLeadStatus(value: unknown): value is LeadItem["status"] {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}

function formatLeadDate(date: Date): string {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function leadFromFirestore(id: string, data: FirebaseFirestore.DocumentData): LeadItem {
  const createdAt = data.createdAt?.toDate ? formatLeadDate(data.createdAt.toDate()) : "Recent";
  return {
    id,
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
        : isLeadStatus(data.status)
        ? data.status
        : "New",
    hasDrawing: Boolean(data.imageUrl),
    notes: Array.isArray(data.notes) ? data.notes : [],
  };
}

/**
 * Retrieve leads, newest first, from Firestore. Only when Firestore can't be
 * reached in local development does it fall back to the data/leads.json mirror.
 */
export async function getStoredLeads(limit = 200): Promise<LeadItem[]> {
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const snap = await adminDb.collection("leads").orderBy("createdAt", "desc").limit(limit).get();
    return snap.docs.map((doc) => leadFromFirestore(doc.id, doc.data()));
  } catch (err) {
    if (process.env.NODE_ENV === "production") throw err;
    console.warn("[leadsStorage] Firestore unreachable, using data/leads.json:", err);
    return readFallbackFile() ?? [];
  }
}

/** One lead by id, read directly so leads beyond the list limit stay editable. */
async function getStoredLead(id: string): Promise<LeadItem | null> {
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const doc = await adminDb.collection("leads").doc(id).get();
    return doc.exists ? leadFromFirestore(doc.id, doc.data()!) : null;
  } catch (err) {
    if (process.env.NODE_ENV === "production") throw err;
    return (readFallbackFile() ?? []).find((l) => l.id === id) ?? null;
  }
}

/**
 * Save or insert a lead. New leads get a random id and a server createdAt,
 * which the CRM list is ordered by.
 */
export async function saveStoredLead(leadData: Partial<LeadItem>): Promise<LeadItem> {
  const isNew = !leadData.id;
  const id = leadData.id || `lead-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const nowFormatted = formatLeadDate(new Date());

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

  if (process.env.NODE_ENV !== "production") {
    const current = readFallbackFile() ?? [];
    const existingIdx = current.findIndex((l) => l.id === id);
    const updatedList = [...current];
    if (existingIdx >= 0) {
      updatedList[existingIdx] = {
        ...updatedList[existingIdx],
        ...newLead,
        notes: leadData.notes !== undefined ? leadData.notes : updatedList[existingIdx].notes || [],
      };
    } else {
      updatedList.unshift(newLead);
    }
    writeFallbackFile(updatedList);
  }

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
          ...(isNew ? { createdAt: FieldValue.serverTimestamp(), source: "contact-form" } : {}),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  } catch (err) {
    console.warn("[leadsStorage] Firestore write skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return newLead;
}

/**
 * Update lead status (e.g. from New -> In Review -> Quoted).
 */
export async function updateStoredLeadStatus(id: string, status: LeadItem["status"]): Promise<boolean> {
  const target = await getStoredLead(id);
  if (!target) return false;

  await saveStoredLead({ ...target, status });
  return true;
}

/**
 * Add an engineering activity log note to a lead.
 */
export async function addStoredLeadNote(id: string, note: string): Promise<boolean> {
  const target = await getStoredLead(id);
  if (!target) return false;

  await saveStoredLead({ ...target, notes: [...(target.notes || []), note] });
  return true;
}

/**
 * Delete a lead record.
 */
export async function deleteStoredLead(id: string): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    writeFallbackFile((readFallbackFile() ?? []).filter((l) => l.id !== id));
  }

  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    await adminDb.collection("leads").doc(id).delete();
  } catch (err) {
    console.warn("[leadsStorage] Firestore delete skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return true;
}
