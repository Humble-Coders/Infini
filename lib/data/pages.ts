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

/**
 * Every non-hero section on the T16 legacy capability pages uses just two
 * section types — "textBlock" and "list" — in document order, so they can
 * be read generically rather than each page.tsx pulling sections out by
 * name one at a time.
 */
export function getContentBlocks(
  page: PageDoc | null
): Array<{ type: "text"; heading: string; body: string } | { type: "list"; heading: string; items: string[] }> {
  if (!page) return [];
  return page.sections
    .filter((s) => s.type === "textBlock" || s.type === "list")
    .map((s) =>
      s.type === "list"
        ? { type: "list" as const, heading: s.fields.heading as string, items: s.fields.items as string[] }
        : { type: "text" as const, heading: s.fields.heading as string, body: s.fields.body as string }
    );
}
