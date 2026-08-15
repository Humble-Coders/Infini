import type { FirestoreTimestamp } from "./common";

/** `certifications` collection — certificates as real, downloadable content. */
export interface CertificationDoc {
  name: string;
  logoUrl: string;
  certificateNumber: string;
  issuedDate: FirestoreTimestamp;
  validUntil: FirestoreTimestamp;
  description: string;
  fileUrl: string;
  order: number;
  published: boolean;
}
