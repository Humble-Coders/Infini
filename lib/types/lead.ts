import type { FirestoreTimestamp } from "./common";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface LeadNote {
  authorId: string;
  text: string;
  createdAt: FirestoreTimestamp;
}

/**
 * `leads` collection — server-only, never deleted by non-super-admins.
 * No accessor exists for this in lib/data/: the RFQ Cloud Function (T17) is
 * the sole writer, and only Super Admin / Leads Manager read it via rules.
 * This type exists so the Cloud Function and the admin dashboard (T18) share
 * one shape.
 */
export interface LeadDoc {
  name: string;
  company: string;
  email: string;
  phone: string;
  enquiryType: string;
  industryId: string;
  message: string;
  sourcePage: string;
  status: LeadStatus;
  createdAt: FirestoreTimestamp;
  notes: LeadNote[];
}
