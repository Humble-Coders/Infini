import { doc, getDoc } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { PageDoc, PageId, PageSection } from "@/lib/types";

const COLLECTION = "pages";

/** A singleton page's content by ID (home, company, capabilities, contact). */
export async function getPage(id: PageId): Promise<PageDoc | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return snap.data() as PageDoc;
}

/**
 * A named section's `fields`, cast to the shape the calling component
 * expects. `PageSection.fields` is intentionally untyped at rest (section
 * shapes vary by `type`) — this is the one place that narrows it, so a
 * missing section fails loudly (a page rendering with a hole) rather than
 * silently rendering `undefined` deep inside a section component.
 */
export function getSection<T>(page: PageDoc | null, type: string): T | null {
  const section = page?.sections.find((s: PageSection) => s.type === type);
  return section ? (section.fields as T) : null;
}
