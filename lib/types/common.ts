/**
 * Structural interface so shared types don't have to import a concrete SDK —
 * both `firebase/firestore` and `firebase-admin/firestore` Timestamps satisfy it.
 */
export interface FirestoreTimestamp {
  toDate(): Date;
  seconds: number;
  nanoseconds: number;
}

/** Adds the Firestore document ID to a collection's data shape, as accessors return it. */
export type WithId<T> = T & { id: string };

export type Role = "superAdmin" | "contentEditor" | "leadsManager";
