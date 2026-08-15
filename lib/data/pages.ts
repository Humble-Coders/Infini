import { doc, getDoc } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { PageDoc, PageId } from "@/lib/types";

const COLLECTION = "pages";

/** A singleton page's content by ID (home, company, capabilities, contact). */
export async function getPage(id: PageId): Promise<PageDoc | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return snap.data() as PageDoc;
}
