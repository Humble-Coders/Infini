import type { Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/** Throws loudly at read time rather than silently rendering empty content. */
export function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      "Firestore is not configured — copy .env.example to .env and set the NEXT_PUBLIC_FIREBASE_* keys."
    );
  }
  return db;
}
