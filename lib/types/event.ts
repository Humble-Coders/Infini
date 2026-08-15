import type { FirestoreTimestamp } from "./common";

/** `events` collection — trade shows, announcements. */
export interface EventDoc {
  title: string;
  startDate: FirestoreTimestamp;
  endDate: FirestoreTimestamp;
  location: string;
  description: string;
  images: string[];
  link: string;
  published: boolean;
}
