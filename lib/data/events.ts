import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { EventDoc, WithId } from "@/lib/types";

const COLLECTION = "events";

/** All published events, soonest first. */
export async function getPublishedEvents(): Promise<WithId<EventDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("startDate"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as EventDoc) }));
}
