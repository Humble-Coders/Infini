import type { FirestoreTimestamp } from "./common";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "quoted"
  | "won"
  | "completed"
  | "lost"
  | "closed";

export interface LeadNote {
  authorId: string;
  text: string;
  createdAt: FirestoreTimestamp;
}

/**
 * `leads` collection, server-only, never deleted by non-super-admins.
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

/** Pipeline stages shown in the admin, in order. Stored lowercase in `leads.status`. */
export const LEAD_STAGES = [
  { key: "new", label: "New" },
  { key: "in_review", label: "In Review" },
  { key: "quoted", label: "Quoted" },
  { key: "completed", label: "Completed" },
  { key: "closed", label: "Closed" },
] as const;

export type LeadStageLabel = (typeof LEAD_STAGES)[number]["label"];

export interface EmailLogEntry {
  recipient: string;
  subject: string;
  template: string;
  sentAt: string;
  bodySnippet: string;
}

/** Whether the "new enquiry" email to the INFINI team went out (set by /api/contact after the Firestore write). */
export interface LeadNotification {
  status: "sent" | "failed" | "not_configured";
  error?: string;
  at?: string;
}

/** A lead as the admin UI receives it from /api/admin/leads: dates formatted, status as its display label. */
export interface LeadRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
  imageUrl?: string | null;
  createdAt: string;
  createdAtIso: string | null;
  status: LeadStageLabel;
  notes: string[];
  emailLogs?: EmailLogEntry[];
  notification?: LeadNotification | null;
}
