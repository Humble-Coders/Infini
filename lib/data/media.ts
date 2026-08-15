import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { MediaDoc, WithId } from "@/lib/types";

const COLLECTION = "media";

/** The full media library index, newest upload first — for the admin MediaPicker (T8). */
export async function getMediaLibrary(): Promise<WithId<MediaDoc>[]> {
  const snap = await getDocs(query(collection(requireDb(), COLLECTION), orderBy("uploadedAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as MediaDoc) }));
}

/** A single media asset by its document ID. */
export async function getMediaById(id: string): Promise<WithId<MediaDoc> | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as MediaDoc) };
}
