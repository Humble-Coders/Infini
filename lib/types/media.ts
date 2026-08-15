import type { FirestoreTimestamp } from "./common";

/** `media` collection — asset library index (Storage upload + metadata). */
export interface MediaDoc {
  url: string;
  path: string;
  filename: string;
  alt: string;
  width: number;
  height: number;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: FirestoreTimestamp;
}
