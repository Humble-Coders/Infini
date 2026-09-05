/**
 * One-off: creates (or promotes) the first Super Admin account on a REAL
 * Firebase project — unlike seed.ts, this intentionally targets a real
 * project, not the emulator.
 *
 * Run once via `npm run bootstrap-super-admin -- <email>`. Never sets or
 * prints a password — it generates a password-reset link so the account
 * owner sets their own.
 */
// Deliberately does NOT import backend/firebase/admin.ts: that module starts
// with `import "server-only"`, which throws under plain `tsx` execution (it
// only no-ops under Next's bundler-recognized "react-server" condition). This
// script re-does the same Admin SDK init directly instead.
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Unlike Next.js, plain `tsx` does not auto-load .env — without this, the
// script silently fell back to whatever project the gcloud CLI happened to
// have active, and created a Super Admin in the wrong Firebase project.
process.loadEnvFile(".env");

const EXPECTED_PROJECT_ID = "infini-f4388";

const email = process.argv[2];
if (!email) {
  throw new Error("Usage: npm run bootstrap-super-admin -- <email>");
}

// `||`, not `??`: .env.example documents these keys with empty values, so an
// unfilled FIREBASE_ADMIN_PROJECT_ID is "" (defined), not undefined — `??`
// would never fall through to NEXT_PUBLIC_FIREBASE_PROJECT_ID. This exact bug
// is what sent the first bootstrap attempt to the wrong Firebase project.
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (projectId !== EXPECTED_PROJECT_ID) {
  throw new Error(
    `Refusing to run: resolved projectId is "${projectId ?? "(unset)"}", expected "${EXPECTED_PROJECT_ID}". ` +
      "Check NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env before re-running — this script writes real Auth/Firestore data."
  );
}

const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app =
  clientEmail && privateKey
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : initializeApp({ credential: applicationDefault(), projectId });

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

console.log(`Targeting Firebase project: ${projectId}`);

async function bootstrap() {
  let userRecord;
  try {
    userRecord = await adminAuth.getUserByEmail(email);
    console.log(`Found existing Auth user ${userRecord.uid} for ${email}.`);
  } catch {
    userRecord = await adminAuth.createUser({ email, emailVerified: false, disabled: false });
    console.log(`Created Auth user ${userRecord.uid} for ${email}.`);
  }

  await adminAuth.setCustomUserClaims(userRecord.uid, { role: "superAdmin" });

  await adminDb
    .collection("users")
    .doc(userRecord.uid)
    .set(
      {
        uid: userRecord.uid,
        email,
        name: email.split("@")[0],
        role: "superAdmin",
        active: true,
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  const resetLink = await adminAuth.generatePasswordResetLink(email);

  console.log(`\n${email} is now a Super Admin.`);
  console.log(`Password reset link (use once, then discard — do not commit or share beyond the account owner):`);
  console.log(resetLink);
}

bootstrap().catch((error) => {
  console.error("Bootstrap failed:", error);
  process.exitCode = 1;
});
