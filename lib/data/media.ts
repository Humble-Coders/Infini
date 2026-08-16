import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
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

/** Indexes a freshly-uploaded Storage object. Alt text is required — enforced here as well as in the upload form UI. */
export async function createMedia(input: Omit<MediaDoc, "uploadedAt">): Promise<WithId<MediaDoc>> {
  if (!input.alt.trim()) {
    throw new Error("Alt text is required.");
  }
  const data = { ...input, uploadedAt: serverTimestamp() };
  const ref = await addDoc(collection(requireDb(), COLLECTION), data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...(snap.data() as MediaDoc) };
}

/** Edits alt text and/or filename after upload — the only fields the ticket allows changing post-upload. */
export async function updateMedia(id: string, patch: Partial<Pick<MediaDoc, "alt" | "filename">>): Promise<void> {
  if (patch.alt !== undefined && !patch.alt.trim()) {
    throw new Error("Alt text is required.");
  }
  await updateDoc(doc(requireDb(), COLLECTION, id), patch);
}

/** Removes the Firestore index entry only — callers delete the Storage object separately (lib/storage/uploadMediaFile.ts), after this succeeds. */
export async function deleteMediaDoc(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}
