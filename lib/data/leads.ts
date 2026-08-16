import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { LeadDoc, WithId } from "@/lib/types";

const COLLECTION = "leads";

/**
 * Most recent leads, newest first — for the T7 dashboard widget. Gated by
 * Firestore rules to Super Admin / Leads Manager only; callers should not
 * invoke this for any other role (avoids a permission-denied round trip).
 */
export async function listRecentLeads(count: number): Promise<WithId<LeadDoc>[]> {
  const snap = await getDocs(query(collection(requireDb(), COLLECTION), orderBy("createdAt", "desc"), limit(count)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as LeadDoc) }));
}
