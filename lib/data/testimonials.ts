import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { TestimonialDoc, WithId } from "@/lib/types";

const COLLECTION = "testimonials";

/** All published testimonials, in display order. */
export async function getPublishedTestimonials(): Promise<WithId<TestimonialDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("order"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as TestimonialDoc) }));
}
