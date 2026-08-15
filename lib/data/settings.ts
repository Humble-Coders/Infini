import { doc, getDoc } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { SettingsDoc } from "@/lib/types";

const COLLECTION = "settings";
const GLOBAL_DOC_ID = "global";

/** Global site settings — contact info, social links, nav, default SEO, cookie banner copy. */
export async function getSettings(): Promise<SettingsDoc | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, GLOBAL_DOC_ID));
  if (!snap.exists()) return null;
  return snap.data() as SettingsDoc;
}
