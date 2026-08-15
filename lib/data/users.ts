import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { UserDoc, WithId } from "@/lib/types";

const COLLECTION = "users";

/** A single admin user document by Auth UID. Read is gated by rules to Super Admin, or the user themselves. */
export async function getUserByUid(uid: string): Promise<WithId<UserDoc> | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as UserDoc) };
}

/** All admin users, by name — for the Super Admin user management screen (T7). */
export async function listUsers(): Promise<WithId<UserDoc>[]> {
  const snap = await getDocs(query(collection(requireDb(), COLLECTION), orderBy("name")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as UserDoc) }));
}
