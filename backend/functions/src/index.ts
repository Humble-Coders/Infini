import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

initializeApp();

const auth = getAuth();
const db = getFirestore();

type Role = "superAdmin" | "contentEditor" | "leadsManager";
const VALID_ROLES: Role[] = ["superAdmin", "contentEditor", "leadsManager"];

/** Throws if the caller isn't signed in with a verified superAdmin claim. Never trust the request body for this. */
function requireSuperAdminCaller(authContext: { uid: string; token: Record<string, unknown> } | undefined) {
  if (!authContext) {
    throw new HttpsError("unauthenticated", "Sign in required.");
  }
  if (authContext.token.role !== "superAdmin") {
    throw new HttpsError("permission-denied", "Only a Super Admin can manage admin users.");
  }
  return authContext.uid;
}

function assertValidRole(role: unknown): asserts role is Role {
  if (typeof role !== "string" || !VALID_ROLES.includes(role as Role)) {
    throw new HttpsError("invalid-argument", `role must be one of: ${VALID_ROLES.join(", ")}`);
  }
}

/**
 * Creates a new admin account: Firebase Auth user + role custom claim +
 * mirrored users/{uid} Firestore doc. Super Admin only. Returns a
 * password-reset link for the Super Admin to hand to the new user directly —
 * there is no automated invite email yet (that lands with T17's SMTP
 * dispatch); nothing is ever set with a committed or logged password.
 */
export const inviteAdminUser = onCall(async (request) => {
  requireSuperAdminCaller(request.auth);

  const { email, name, role } = request.data as { email?: string; name?: string; role?: unknown };
  if (typeof email !== "string" || !email.includes("@")) {
    throw new HttpsError("invalid-argument", "A valid email is required.");
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new HttpsError("invalid-argument", "A name is required.");
  }
  assertValidRole(role);

  const userRecord = await auth.createUser({ email, displayName: name, disabled: false });
  await auth.setCustomUserClaims(userRecord.uid, { role });

  await db
    .collection("users")
    .doc(userRecord.uid)
    .set({ uid: userRecord.uid, email, name, role, active: true, createdAt: FieldValue.serverTimestamp() });

  const resetLink = await auth.generatePasswordResetLink(email);
  return { uid: userRecord.uid, resetLink };
});

/**
 * Changes an existing admin's role and/or active status. Super Admin only.
 * Deactivating disables the Firebase Auth account outright (not just a
 * Firestore flag), so a deactivated user can't sign in at all, not merely
 * lose access after the fact.
 */
export const setUserRole = onCall(async (request) => {
  const callerUid = requireSuperAdminCaller(request.auth);

  const { uid, role, active } = request.data as { uid?: string; role?: unknown; active?: unknown };
  if (typeof uid !== "string" || !uid) {
    throw new HttpsError("invalid-argument", "uid is required.");
  }
  assertValidRole(role);
  if (typeof active !== "boolean") {
    throw new HttpsError("invalid-argument", "active must be a boolean.");
  }
  if (uid === callerUid && (!active || role !== "superAdmin")) {
    throw new HttpsError("failed-precondition", "You cannot demote or deactivate your own account.");
  }

  await auth.setCustomUserClaims(uid, { role });
  await auth.updateUser(uid, { disabled: !active });
  await db.collection("users").doc(uid).set({ role, active }, { merge: true });

  return { ok: true };
});
