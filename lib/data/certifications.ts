import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CertificationDoc, WithId } from "@/lib/types";

const COLLECTION = "certifications";

/** All published certifications, in display order. */
export async function getPublishedCertifications(): Promise<WithId<CertificationDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("order"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CertificationDoc) }));
}

/** Published certifications by their document IDs, in the order given — for an industry's `relatedCertIds`. */
export async function getCertificationsByIds(ids: string[]): Promise<WithId<CertificationDoc>[]> {
  if (ids.length === 0) return [];
  const all = await getPublishedCertifications();
  const byId = new Map(all.map((cert) => [cert.id, cert]));
  return ids.map((id) => byId.get(id)).filter((cert): cert is WithId<CertificationDoc> => Boolean(cert));
}
