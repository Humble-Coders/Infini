import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/backend/firebase/admin";
import { requireApiRole, SETTINGS_ROLES } from "@/lib/auth/requireApiRole";
import { isRole } from "@/lib/auth/session";
import { sendPasswordResetEmail } from "@/lib/leadNotification";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatDate(value?: string): string {
  if (!value) return "Never";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

/** Team members: Firebase Auth users that carry an admin role claim. */
export async function GET(request: NextRequest) {
  const guard = await requireApiRole(request, SETTINGS_ROLES);
  if (guard.error) return guard.error;

  try {
    const { users } = await adminAuth.listUsers(1000);
    const team = users
      .filter((u) => isRole(u.customClaims?.role))
      .map((u) => ({
        uid: u.uid,
        name: u.displayName || u.email || "Team member",
        email: u.email || "",
        role: u.customClaims!.role,
        disabled: u.disabled,
        lastActive: u.metadata.lastSignInTime ? formatDate(u.metadata.lastSignInTime) : "Invited",
        joinedDate: formatDate(u.metadata.creationTime),
      }));
    return NextResponse.json({ ok: true, team });
  } catch (error) {
    console.error("[api/admin/users] GET error:", error);
    return NextResponse.json({ error: "Could not load the team. Check Firebase Authentication is enabled." }, { status: 500 });
  }
}

/** Invite: creates the Auth user with its role claim and emails a set-password link. */
export async function POST(request: NextRequest) {
  const guard = await requireApiRole(request, SETTINGS_ROLES);
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim().slice(0, 100);
  if (!EMAIL_RE.test(email) || !name || !isRole(body.role)) {
    return NextResponse.json({ error: "Enter a name, a valid email and a role." }, { status: 400 });
  }

  try {
    const user = await adminAuth.createUser({ email, displayName: name, disabled: false });
    await adminAuth.setCustomUserClaims(user.uid, { role: body.role });
    await adminDb
      .collection("users")
      .doc(user.uid)
      .set({ uid: user.uid, email, name, role: body.role, active: true, createdAt: FieldValue.serverTimestamp() });

    const link = await adminAuth.generatePasswordResetLink(email);
    const sent = await sendPasswordResetEmail(email, link);
    // Without SMTP the Super Admin hands the link over themselves.
    return NextResponse.json({ ok: true, uid: user.uid, emailed: sent.status === "sent", link: sent.status === "sent" ? undefined : link });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "auth/email-already-exists") {
      return NextResponse.json({ error: "That email already has an account." }, { status: 409 });
    }
    console.error("[api/admin/users] POST error:", error);
    return NextResponse.json({ error: "Could not invite this team member." }, { status: 500 });
  }
}

/** Change role and/or disable. Signs the user out everywhere so it applies at once. */
export async function PATCH(request: NextRequest) {
  const guard = await requireApiRole(request, SETTINGS_ROLES);
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => ({}));
  const uid = typeof body.uid === "string" ? body.uid : "";
  if (!uid || (body.role !== undefined && !isRole(body.role)) || (body.disabled !== undefined && typeof body.disabled !== "boolean")) {
    return NextResponse.json({ error: "Invalid change." }, { status: 400 });
  }
  if (uid === guard.session.uid) {
    return NextResponse.json({ error: "You can't change your own role or access." }, { status: 400 });
  }

  try {
    const user = await adminAuth.getUser(uid);
    if (!isRole(user.customClaims?.role)) {
      return NextResponse.json({ error: "Not a team member." }, { status: 404 });
    }
    const role = body.role ?? user.customClaims!.role;
    const disabled = body.disabled ?? user.disabled;

    await adminAuth.setCustomUserClaims(uid, { role });
    await adminAuth.updateUser(uid, { disabled });
    await adminAuth.revokeRefreshTokens(uid);
    await adminDb.collection("users").doc(uid).set({ role, active: !disabled }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/users] PATCH error:", error);
    return NextResponse.json({ error: "Could not update this team member." }, { status: 500 });
  }
}
