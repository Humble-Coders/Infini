import type { FirestoreTimestamp } from "./common";

/** `media` collection — asset library index (Storage upload + metadata). */
export interface MediaDoc {
  url: string;
  path: string;
  filename: string;
  alt: string;
  /** e.g. "image/jpeg", "application/pdf" — lets the picker/grid distinguish images from certificate PDFs (T8/T12). */
  contentType: string;
  /** 0 for non-image assets (PDFs), where dimensions aren't meaningful. */
  width: number;
  height: number;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: FirestoreTimestamp;
}
