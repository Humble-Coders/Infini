import { cache } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CertificationDoc, WithId } from "@/lib/types";

const COLLECTION = "certifications";

import { buildCertifications } from "@/backend/scripts/content";

/** All published certifications, in display order, including expired ones. Used by admin and as the base for public reads. */
async function getPublishedCertificationsUncached(): Promise<WithId<CertificationDoc>[]> {
  try {
    const snap = await getDocs(
      query(collection(requireDb(), COLLECTION), where("published", "==", true))
    );
    const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as CertificationDoc) }));
    return docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    // Only an unreachable Firestore falls back to the built-in list; an empty
    // collection is respected so admin unpublishing takes effect.
    console.warn("[certifications] Firestore issue:", (error as Error)?.message || error);
  }

  const ts = {
    fromDate: (date: Date) => ({
      toDate: () => date,
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: 0,
    }),
  };
  return buildCertifications(ts) as unknown as WithId<CertificationDoc>[];
}

/**
 * Published AND not past `validUntil`, what the public site actually
 * displays. Filtered client-side (not a Firestore range query) so it can
 * share the same `orderBy("order")` index as getPublishedCertifications
 * rather than needing a second composite index for a validUntil range.
 * See docs/QUESTIONS.md (T12), hiding expired certs is an interim
 * decision pending client confirmation, not a fixed requirement.
 */
async function getActiveCertificationsUncached(): Promise<WithId<CertificationDoc>[]> {
  const published = await getPublishedCertifications();
  const now = Date.now();
  return published.filter((cert) => {
    const time = cert.validUntil?.toDate ? cert.validUntil.toDate().getTime() : Infinity;
    return time >= now;
  });
}

/** Active (published + not expired) certifications by document ID, in the order given, for an industry's `relatedCertIds`. */
async function getCertificationsByIdsUncached(ids: string[]): Promise<WithId<CertificationDoc>[]> {
  if (ids.length === 0) return [];
  const active = await getActiveCertifications();
  const byId = new Map(active.map((cert) => [cert.id, cert]));
  return ids.map((id) => byId.get(id)).filter((cert): cert is WithId<CertificationDoc> => Boolean(cert));
}

/*
 * Reads are memoised per request with React's `cache()`.
 *
 * A page and its `generateMetadata` run in the same pass and routinely ask for
 * the same document, so an uncached accessor cost two identical round trips on
 * every request. `cache()` collapses those to one.
 *
 * It has to be `cache()` and not `unstable_cache`: the latter serialises what it
 * stores, which strips `.toDate()` off every Firestore Timestamp and breaks
 * every date on the site. This only dedupes within a single render, so
 * documents arrive exactly as Firestore returned them.
 */
export const getPublishedCertifications = cache(getPublishedCertificationsUncached);
export const getActiveCertifications = cache(getActiveCertificationsUncached);
export const getCertificationsByIds = cache(getCertificationsByIdsUncached);
