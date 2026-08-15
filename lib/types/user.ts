import type { FirestoreTimestamp, Role } from "./common";

/** `users` collection — admin accounts. Doc ID is the Firebase Auth UID. */
export interface UserDoc {
  uid: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  createdAt: FirestoreTimestamp;
}
