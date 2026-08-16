import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CertificationDoc, WithId } from "@/lib/types";

const COLLECTION = "certifications";

/** All published certifications, in display order — including expired ones. Used by admin and as the base for public reads. */
export async function getPublishedCertifications(): Promise<WithId<CertificationDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("order"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CertificationDoc) }));
}

/**
 * Published AND not past `validUntil` — what the public site actually
 * displays. Filtered client-side (not a Firestore range query) so it can
 * share the same `orderBy("order")` index as getPublishedCertifications
 * rather than needing a second composite index for a validUntil range.
 * See docs/QUESTIONS.md (T12) — hiding expired certs is an interim
 * decision pending client confirmation, not a fixed requirement.
 */
export async function getActiveCertifications(): Promise<WithId<CertificationDoc>[]> {
  const published = await getPublishedCertifications();
  const now = Date.now();
  return published.filter((cert) => cert.validUntil.toDate().getTime() >= now);
}

/** Active (published + not expired) certifications by document ID, in the order given — for an industry's `relatedCertIds`. */
export async function getCertificationsByIds(ids: string[]): Promise<WithId<CertificationDoc>[]> {
  if (ids.length === 0) return [];
  const active = await getActiveCertifications();
  const byId = new Map(active.map((cert) => [cert.id, cert]));
  return ids.map((id) => byId.get(id)).filter((cert): cert is WithId<CertificationDoc> => Boolean(cert));
}

/** Every certification regardless of published/expiry state, in display order — the admin list view. */
export async function getAllCertifications(): Promise<WithId<CertificationDoc>[]> {
  const snap = await getDocs(query(collection(requireDb(), COLLECTION), orderBy("order")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CertificationDoc) }));
}

export async function getCertificationById(id: string): Promise<WithId<CertificationDoc> | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as CertificationDoc) };
}

/** New certifications land at the end of the display order. */
export async function createCertification(input: Omit<CertificationDoc, "order">): Promise<WithId<CertificationDoc>> {
  const existing = await getAllCertifications();
  const nextOrder = existing.length === 0 ? 1 : Math.max(...existing.map((c) => c.order)) + 1;
  const ref = await addDoc(collection(requireDb(), COLLECTION), { ...input, order: nextOrder });
  const snap = await getDoc(ref);
  return { id: snap.id, ...(snap.data() as CertificationDoc) };
}

export async function updateCertification(id: string, patch: Partial<CertificationDoc>): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, id), patch);
}

export async function deleteCertification(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}

/** Swaps this certification's `order` with its neighbor in `direction` — the admin list's reorder control. */
export async function moveCertification(id: string, direction: "up" | "down"): Promise<void> {
  const db = requireDb();
  const all = await getAllCertifications();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return;
  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  if (neighborIndex < 0 || neighborIndex >= all.length) return;

  const current = all[index];
  const neighbor = all[neighborIndex];

  await runTransaction(db, async (tx) => {
    tx.update(doc(db, COLLECTION, current.id), { order: neighbor.order });
    tx.update(doc(db, COLLECTION, neighbor.id), { order: current.order });
  });
}
