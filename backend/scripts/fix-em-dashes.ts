/**
 * One-off content repair: strips em dashes out of every string field in the
 * Firestore content collections.
 *
 * Why this exists: the house copy rule (commit 404fdb6, "Remove em dashes from
 * all site-facing copy") landed *after* the launch content had already been
 * seeded into the real project. `backend/scripts/content.ts` is clean today,
 * but the documents in Firestore still carry the pre-cleanup sentences, and
 * the public pages render their copy from those documents, not from the seed
 * file. Fixing the code therefore does nothing for the deployed site.
 *
 * Unlike seed-real-content.ts, this rewrites *only* the dashes. Every other
 * field is left exactly as it is, so admin edits, publish flags and any
 * content authored through the admin panel survive. That also means it fixes
 * admin-created documents, which a re-seed would miss.
 *
 *   npx tsx backend/scripts/fix-em-dashes.ts             # report only, writes nothing
 *   npx tsx backend/scripts/fix-em-dashes.ts --apply     # perform the writes
 *   npx tsx backend/scripts/fix-em-dashes.ts --emulator  # target the local emulator
 *
 * Credentials: same as seed-real-content.ts. Set FIREBASE_ADMIN_PROJECT_ID,
 * FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in .env, or have
 * Application Default Credentials available for the project.
 */
process.loadEnvFile(".env");
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const APPLY = process.argv.includes("--apply");
const EMULATOR = process.argv.includes("--emulator");

const EXPECTED_PROJECT_ID = "infini-f4388";
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (EMULATOR) {
  // The Admin SDK routes through the emulator via this variable, so set it before init.
  process.env.FIRESTORE_EMULATOR_HOST ||= process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
} else if (projectId !== EXPECTED_PROJECT_ID) {
  throw new Error(
    `Refusing to run: resolved projectId is "${projectId ?? "(unset)"}", expected "${EXPECTED_PROJECT_ID}". ` +
      "Check NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env before re-running, this script writes real Firestore data."
  );
}

/** Collections whose documents hold site-facing copy. */
const COLLECTIONS = ["pages", "industries", "certifications", "testimonials", "events", "news", "caseStudies", "settings"];

/**
 * Sentences where a plain comma reads badly. Applied before the general rule,
 * so the paired-dash aside becomes a parenthetical rather than a third clause
 * in an already comma-heavy list, matching how content.ts now words it.
 */
const OVERRIDES: Array<[RegExp, string]> = [
  // Brand and tagline: every other title on the site uses the pipe separator.
  [/^INFINI\s*—\s*/, "INFINI | "],
  // "our process controls — a, b, and c — are run to ..." reads as a list without the brackets.
  [/\s*—\s*(process documentation, batch traceability, and contamination control)\s*—\s*/, " ($1) "],
];

function fixString(value: string): string {
  if (!value.includes("—")) return value;
  let out = value;
  for (const [pattern, replacement] of OVERRIDES) out = out.replace(pattern, replacement);
  // General rule: an em dash used as a sentence break becomes a comma.
  out = out.replace(/\s*—\s*/g, ", ");
  // Tidy the seams a comma can create next to existing punctuation.
  return out
    .replace(/,\s*,/g, ",")
    .replace(/,\s*([.;:!?])/g, "$1")
    .replace(/\s+,/g, ",");
}

interface Change {
  path: string;
  before: string;
  after: string;
}

/**
 * Walks a document's fields, rewriting strings in place. Firestore Timestamps
 * and other non-plain objects are returned untouched, so nothing but copy moves.
 */
function fixValue(value: unknown, path: string, changes: Change[]): unknown {
  if (typeof value === "string") {
    const next = fixString(value);
    if (next !== value) changes.push({ path, before: value, after: next });
    return next;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => fixValue(item, `${path}[${index}]`, changes));
  }
  // Plain objects only: a Timestamp (or any class instance) is left alone.
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
      out[key] = fixValue(inner, path ? `${path}.${key}` : key, changes);
    }
    return out;
  }
  return value;
}

const app = (() => {
  if (EMULATOR) return initializeApp({ projectId: projectId ?? EXPECTED_PROJECT_ID });
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return clientEmail && privateKey
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : initializeApp({ credential: applicationDefault(), projectId });
})();

const db = getFirestore(app);

async function run() {
  console.log(
    `${APPLY ? "APPLYING to" : "Dry run against"} ${EMULATOR ? `emulator (${process.env.FIRESTORE_EMULATOR_HOST})` : `project ${projectId}`}\n`
  );

  let documentsChanged = 0;
  let fieldsChanged = 0;

  for (const collection of COLLECTIONS) {
    const snapshot = await db.collection(collection).get();
    for (const doc of snapshot.docs) {
      const changes: Change[] = [];
      const updated = fixValue(doc.data(), "", changes) as Record<string, unknown>;
      if (changes.length === 0) continue;

      documentsChanged += 1;
      fieldsChanged += changes.length;
      console.log(`${collection}/${doc.id}`);
      for (const change of changes) {
        console.log(`  ${change.path}`);
        console.log(`    -  ${change.before.slice(0, 150)}`);
        console.log(`    +  ${change.after.slice(0, 150)}`);
      }
      if (APPLY) await doc.ref.set(updated);
    }
  }

  console.log(
    `\n${fieldsChanged} field(s) across ${documentsChanged} document(s)` +
      (APPLY ? " updated." : " would change. Re-run with --apply to write them.")
  );
  if (APPLY && documentsChanged > 0 && !EMULATOR) {
    console.log("Public pages are built from this data, so redeploy (or revalidate) for the change to show.");
  }
}

run().catch((error) => {
  console.error("fix-em-dashes failed:", error);
  process.exitCode = 1;
});
