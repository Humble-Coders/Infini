/**
 * Writes only the events and case studies from content.ts, nothing else.
 *
 * `seed-real-content.ts` rewrites industries, pages and settings too, which
 * would roll back any edit made in the admin panel since the last run. This
 * script touches only `events` and `caseStudies`, so adding a show to the
 * calendar cannot cost you a content edit somewhere else.
 *
 * Needs Admin SDK credentials in .env (FIREBASE_ADMIN_CLIENT_EMAIL and
 * FIREBASE_ADMIN_PRIVATE_KEY, or GOOGLE_APPLICATION_CREDENTIALS). Writes are
 * `set()` on fixed document IDs, so re-running re-applies rather than
 * duplicating.
 *
 *   npm run seed-content
 */
process.loadEnvFile(".env");
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { buildEvents } from "./content";

const EXPECTED_PROJECT_ID = "infini-f4388";
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (projectId !== EXPECTED_PROJECT_ID) {
  throw new Error(
    `Refusing to run: resolved projectId is "${projectId ?? "(unset)"}", expected "${EXPECTED_PROJECT_ID}". ` +
      "Check NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env before re-running, this script writes real Firestore data."
  );
}

const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app =
  clientEmail && privateKey
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : initializeApp({ credential: applicationDefault(), projectId });

const db = getFirestore(app);

async function seedEvents() {
  const events = buildEvents(Timestamp);
  const batch = db.batch();

  for (const event of events) {
    const { id, ...data } = event;
    batch.set(db.collection("events").doc(id), data);
  }

  await batch.commit();
  for (const event of events) {
    console.log(`  ${event.published ? "published" : "draft    "}  ${event.id}  ${event.title}`);
  }
  console.log(`\nWrote ${events.length} event(s) to ${EXPECTED_PROJECT_ID}.`);
}

seedEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
