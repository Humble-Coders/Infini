/**
 * Applies the corrections and additions from the client's MMP brochure
 * (INF_V2-09/2025) to the real Firebase project, field by field.
 *
 * seed-real-content.ts set()s whole documents, which would wipe anything
 * edited in Firestore since the last seed. This script touches only the
 * specific fields the brochure changed, takes the new values from content.ts
 * so the two can't drift, and prints every change before making it.
 *
 *   npm run apply-brochure-content              dry run: reads, prints, writes nothing
 *   npm run apply-brochure-content -- --apply   writes the changes
 */
import { existsSync } from "node:fs";
// Admin credentials live in .env.local on dev machines. loadEnvFile never
// overwrites a variable that is already set, so the file loaded first wins.
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { buildIndustries, buildPages, buildSettings } from "./content";

const EXPECTED_PROJECT_ID = "infini-f4388";
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (projectId !== EXPECTED_PROJECT_ID) {
  throw new Error(
    `Refusing to run: resolved projectId is "${projectId ?? "(unset)"}", expected "${EXPECTED_PROJECT_ID}".`
  );
}

const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app =
  clientEmail && privateKey
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : initializeApp({ credential: applicationDefault(), projectId });

const db = getFirestore(app);
const APPLY = process.argv.includes("--apply");

/** Per industry, exactly the fields the brochure changed. Nothing else on the document is touched. */
const INDUSTRY_FIELDS: Record<string, string[]> = {
  "cutting-tools": ["applications", "benefits", "capabilities", "relevance"],
  "forge-stamping-die": ["applications", "benefits"],
  "plastic-injection-molds": ["applications", "benefits"],
  "medical-implants": ["applications", "benefits"],
  aerospace: ["applications", "benefits", "capabilities"],
  "additive-manufacturing": ["applications", "benefits", "capabilities", "overview", "relevance", "seo"],
  "gears-transmission": ["applications", "benefits"],
  "powder-metallurgy": ["published"],
};

/** Page section fields that changed (body unless named), matched by type and, for text blocks, by heading. */
const PAGE_SECTIONS: { page: string; type: string; heading?: string; field?: string }[] = [
  { page: "home", type: "hero", field: "ctaNote" },
  { page: "home", type: "technology" },
  { page: "technology", type: "textBlock", heading: "What MMP actually is" },
  { page: "technology", type: "textBlock", heading: "How frequency-based removal works" },
  { page: "mirror-like-finish", type: "textBlock", heading: "Strengths, and where it doesn't apply" },
];

interface Section {
  type: string;
  fields: Record<string, unknown>;
}
interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const preview = (value: unknown) => {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (text === undefined) return "(unset)";
  return text.length > 110 ? `${text.slice(0, 107)}...` : text;
};

async function run() {
  console.log(`${APPLY ? "APPLYING to" : "Dry run against"} Firebase project ${projectId}\n`);
  const batch = db.batch();
  let changes = 0;
  const note = (path: string, field: string, from: unknown, to: unknown) => {
    changes++;
    console.log(`${path}  ${field}\n    - ${preview(from)}\n    + ${preview(to)}`);
  };

  // Industries: applications and benefits from the market table, plus the corrected claims.
  const industries = new Map(
    buildIndustries().map((industry) => [industry.slug, industry as unknown as Record<string, unknown>])
  );
  for (const [slug, fields] of Object.entries(INDUSTRY_FIELDS)) {
    const ref = db.collection("industries").doc(slug);
    const snap = await ref.get();
    const next = industries.get(slug);
    if (!snap.exists || !next) {
      console.warn(`skip industries/${slug}: ${snap.exists ? "not in content.ts" : "no such document"}`);
      continue;
    }
    const current = snap.data() ?? {};
    const update: Record<string, unknown> = {};
    for (const field of fields) {
      if (same(current[field], next[field])) continue;
      note(`industries/${slug}`, field, current[field], next[field]);
      update[field] = next[field];
    }
    if (Object.keys(update).length > 0) batch.update(ref, update);
  }

  // Settings: the brochure's contact email, and the nav without unpublished industries.
  const settingsRef = db.collection("settings").doc("global");
  const settingsSnap = await settingsRef.get();
  if (settingsSnap.exists) {
    const current = settingsSnap.data() ?? {};
    const seed = buildSettings();
    const update: Record<string, unknown> = {};

    const currentEmail = (current.contact as { email?: string } | undefined)?.email;
    if (currentEmail !== seed.contact.email) {
      note("settings/global", "contact.email", currentEmail, seed.contact.email);
      update["contact.email"] = seed.contact.email;
    }

    const hidden = [...industries.values()]
      .filter((industry) => industry.published === false)
      .map((industry) => `/industries/${industry.slug as string}`);
    const nav = (current.nav as NavItem[] | undefined) ?? [];
    const prunedNav = nav.map((item) =>
      item.children ? { ...item, children: item.children.filter((child) => !hidden.includes(child.href)) } : item
    );
    if (!same(nav, prunedNav)) {
      note("settings/global", "nav", "industries submenu", `without ${hidden.join(", ")}`);
      update.nav = prunedNav;
    }

    if (Object.keys(update).length > 0) batch.update(settingsRef, update);
  } else {
    console.warn("skip settings/global: no such document");
  }

  // Pages: section bodies only, read-modify-write so every other section is left exactly as it is.
  const pages = buildPages() as unknown as Record<string, { sections: Section[] }>;
  const pageIds = [...new Set(PAGE_SECTIONS.map((target) => target.page))];
  for (const pageId of pageIds) {
    const ref = db.collection("pages").doc(pageId);
    const snap = await ref.get();
    if (!snap.exists) {
      console.warn(`skip pages/${pageId}: no such document`);
      continue;
    }
    const sections = ((snap.data()?.sections as Section[] | undefined) ?? []).map((section) => ({
      ...section,
      fields: { ...section.fields },
    }));
    let changed = false;

    for (const target of PAGE_SECTIONS.filter((candidate) => candidate.page === pageId)) {
      const label = `${target.type}${target.heading ? ` "${target.heading}"` : ""}`;
      const matches = (section: Section) =>
        section.type === target.type && (target.heading === undefined || section.fields.heading === target.heading);
      const live = sections.find(matches);
      const seed = pages[pageId]?.sections.find(matches);
      if (!live || !seed) {
        console.warn(`skip pages/${pageId} ${label}: not found in ${live ? "content.ts" : "Firestore"}`);
        continue;
      }
      const field = target.field ?? "body";
      if (same(live.fields[field], seed.fields[field])) continue;
      note(`pages/${pageId}`, `${label} ${field}`, live.fields[field], seed.fields[field]);
      live.fields[field] = seed.fields[field];
      changed = true;
    }

    if (changed) batch.update(ref, { sections });
  }

  // News: take the development placeholder post off the public archive.
  const placeholders = await db.collection("news").where("slug", "==", "sample-first-post").get();
  for (const doc of placeholders.docs) {
    const status = doc.get("status");
    if (status === "draft") continue;
    note(`news/${doc.id}`, "status", status, "draft");
    batch.update(doc.ref, { status: "draft" });
  }

  if (changes === 0) {
    console.log("Nothing to change: Firestore already matches the brochure content.");
    return;
  }
  if (!APPLY) {
    console.log(`\n${changes} change(s) planned. Nothing written. Re-run with --apply to write them.`);
    return;
  }
  await batch.commit();
  console.log(`\nWrote ${changes} change(s). Public pages pick them up within their 10-minute revalidate window.`);
}

run().catch((error) => {
  console.error("Failed:", error);
  process.exitCode = 1;
});
