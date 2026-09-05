/**
 * Populates the Firestore emulator with real launch content — industries,
 * certifications, settings, pages, and light sample content for the rest —
 * for local dev. Content itself lives in content.ts, shared with
 * seed-real-content.ts so local (emulator) and the actual project never
 * describe INFINI differently.
 *
 * Run via `npm run seed` (wraps this in `firebase emulators:exec`, which
 * starts the emulator, sets FIRESTORE_EMULATOR_HOST, runs this script, then
 * tears the emulator down). Never targets a real project — there is no
 * credential path here that could reach production Firestore.
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { buildCertifications, buildEvents, buildIndustries, buildNews, buildPages, buildSettings, buildTestimonials } from "./content";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error(
    "FIRESTORE_EMULATOR_HOST is not set — run this via `npm run seed`, not directly, so it never touches a real project."
  );
}

const app = initializeApp({ projectId: process.env.GCLOUD_PROJECT ?? "infini-f4388" });
const db = getFirestore(app);

async function seed() {
  const batch = db.batch();

  for (const cert of buildCertifications(Timestamp)) {
    const { id, ...data } = cert;
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

  console.log("Seeded industries, certifications, settings, pages, testimonials, events, news.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
