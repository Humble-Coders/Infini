/**
 * Populates REAL launch content (industries, certifications, settings,
 * pages, sample testimonials/events/news) into the actual Firebase project
 * — unlike seed.ts, which only ever targets the emulator. Content itself
 * lives in content.ts, shared between the two so they can't drift apart.
 *
 * Run once via `npm run seed-real-content`. Safe to re-run — every write is
 * a `set()` on a fixed doc ID, so re-running just re-applies the same
 * content rather than duplicating it.
 */
process.loadEnvFile(".env");
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { buildCertifications, buildEvents, buildIndustries, buildNews, buildPages, buildSettings, buildTestimonials } from "./content";

const EXPECTED_PROJECT_ID = "infini-f4388";
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (projectId !== EXPECTED_PROJECT_ID) {
  throw new Error(
    `Refusing to run: resolved projectId is "${projectId ?? "(unset)"}", expected "${EXPECTED_PROJECT_ID}". ` +
      "Check NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env before re-running — this script writes real Firestore data."
  );
}

const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app =
  clientEmail && privateKey
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : initializeApp({ credential: applicationDefault(), projectId });

const db = getFirestore(app);

async function seed() {
  console.log(`Targeting Firebase project: ${projectId}`);
  const batch = db.batch();

  for (const certDoc of buildCertifications(Timestamp)) {
    const { id, ...data } = certDoc;
    batch.set(db.collection("certifications").doc(id), data);
  }

  for (const industry of buildIndustries()) {
    const { slug, ...data } = industry;
    batch.set(db.collection("industries").doc(slug), { slug, ...data });
  }

  for (const testimonial of buildTestimonials()) {
    const { id, ...data } = testimonial;
    batch.set(db.collection("testimonials").doc(id), data);
  }

  for (const event of buildEvents(Timestamp)) {
    const { id, ...data } = event;
    batch.set(db.collection("events").doc(id), data);
  }

  for (const post of buildNews(Timestamp)) {
    const { id, ...data } = post;
    batch.set(db.collection("news").doc(id), data);
  }

  batch.set(db.collection("settings").doc("global"), buildSettings());

  const pages = buildPages();
  for (const page of Object.values(pages)) {
    const { id, ...data } = page;
    batch.set(db.collection("pages").doc(id), data);
  }

  await batch.commit();
  console.log("Seeded industries, certifications, settings, pages, testimonials, events, news into the real project.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
