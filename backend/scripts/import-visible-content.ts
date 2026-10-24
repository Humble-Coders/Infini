/**
 * Copies what the public site shows visitors today into Firestore, so every
 * admin dashboard screen starts populated and the client edits/replaces real
 * documents instead of facing empty lists.
 *
 *   npx tsx backend/scripts/import-visible-content.ts            # dry run (default)
 *   npx tsx backend/scripts/import-visible-content.ts --write    # apply
 *
 * Safe to re-run: documents that already exist are never overwritten; in
 * settings/global only empty or placeholder ("+91 XX…") values are filled.
 * Targets the emulator when FIRESTORE_EMULATOR_HOST is set, otherwise the
 * real project (credentials from FIREBASE_ADMIN_* env or serviceAccountKey.json).
 *
 * Deliberately imported as DRAFTS (visible in the dashboard, hidden on the
 * site): the demo testimonials, whose people and companies are invented,
 * and the "via LinkedIn" mock case study. Publishing either would present
 * made-up material as genuine.
 */
// Plain tsx script: does not import backend/firebase/admin.ts ("server-only").
import fs from "fs";
import path from "path";
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp, type Firestore } from "firebase-admin/firestore";
import { buildCaseStudies } from "./content";

const WRITE = process.argv.includes("--write");
const ROOT = path.resolve(import.meta.dirname, "..", "..");

for (const file of [".env.local", ".env"]) {
  const full = path.join(ROOT, file);
  if (fs.existsSync(full)) process.loadEnvFile(full);
}

function init(): Firestore {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (process.env.FIRESTORE_EMULATOR_HOST) return getFirestore(initializeApp({ projectId }));
  const keyFile = path.join(ROOT, "serviceAccountKey.json");
  const { FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail, FIREBASE_ADMIN_PRIVATE_KEY: rawKey } = process.env;
  const credential =
    clientEmail && rawKey
      ? cert({ projectId, clientEmail, privateKey: rawKey.replace(/\\n/g, "\n") })
      : fs.existsSync(keyFile)
        ? cert(JSON.parse(fs.readFileSync(keyFile, "utf8")))
        : applicationDefault();
  return getFirestore(initializeApp({ credential, projectId }));
}

const db = init();
const ts = { fromDate: (date: Date) => Timestamp.fromDate(date) };
const log: string[] = [];

async function createIfMissing(collection: string, id: string, data: Record<string, unknown>) {
  const ref = db.collection(collection).doc(id);
  if ((await ref.get()).exists) {
    log.push(`skip   ${collection}/${id} (already exists)`);
    return;
  }
  log.push(`create ${collection}/${id}${data.published === false ? " (draft)" : ""}`);
  if (WRITE) await ref.create(data);
}

/* --- Case studies: the set the site renders while the collection is empty --- */
async function caseStudies() {
  for (const study of buildCaseStudies(ts)) {
    const { id, ...data } = study as { id: string } & Record<string, unknown>;
    await createIfMissing("caseStudies", id, { ...data, updatedAt: Timestamp.now() });
  }
  await createIfMissing("caseStudies", "linkedin-recent-achievement", {
    slug: "linkedin-recent-achievement",
    industryId: "cutting-tools",
    title: "Recent Success in Carbide Drills (Via LinkedIn)",
    challenge: "A key aerospace partner needed a massive 300% tool life increase on their carbide drills.",
    solution: "Applied specialized MMP surface finish that removed micro-defects without altering cutting edge geometry.",
    process: "Automated batch processing with targeted wave-length filtering using proprietary media.",
    result: "Tool life increased by 300%, cutting speeds improved, and friction reduced drastically.",
    results: [
      { label: "Tool Life", value: "300% Increase", direction: "up" },
      { label: "Friction", value: "Reduced", direction: "down" },
    ],
    beforeImage: "/images/cutting-tool-1.jpg",
    afterImage: "/images/cutting-tool-3.webp",
    gallery: [],
    specs: { material: "Carbide", process: "MMP Treatment", duration: "" },
    published: false,
    publishedAt: null,
    updatedAt: Timestamp.now(),
    seo: {
      title: "Recent Success in Carbide Drills",
      description: "Carbide drill tool life after MMP treatment.",
      ogTitle: "Recent Success in Carbide Drills",
      ogDescription: "Carbide drill tool life after MMP treatment.",
      ogImage: "",
      canonical: "/case-studies/linkedin-recent-achievement",
      noindex: false,
    },
  });
}

/* --- Testimonials shown on the home page (fictional: drafts) --- */
const DEMO_TESTIMONIALS = [
  {
    id: "demo-t1",
    quote: "Burr free edges on every batch, with measurement data we can file directly into our quality system.",
    personName: "Aarav Sharma",
    designation: "Quality Head",
    company: "AeroWorks",
    industry: "Aerospace & Defense",
    rating: 5,
  },
  {
    id: "demo-t2",
    quote: "Mirror finishes on our implants, batch after batch, with zero deviations across the validation run.",
    personName: "Meera Iyer",
    designation: "Process Engineer",
    company: "MediCore",
    industry: "Medical Implants",
    rating: 5,
  },
  {
    id: "demo-t3",
    quote: "Our dies release cleaner and run longer since switching treatment to INFINI's in-house line.",
    personName: "Rahul Verma",
    designation: "Toolroom Lead",
    company: "ForgeLine",
    industry: "Forging & Stamping Dies",
    rating: 4.8,
  },
  {
    id: "demo-t4",
    quote: "Cutting edges hold their line under load far longer, tool life is up across every station.",
    personName: "Sneha Kulkarni",
    designation: "Production Manager",
    company: "CutWell Tools",
    industry: "Cutting Tools & Tooling",
    rating: 4.9,
  },
  {
    id: "demo-t5",
    quote: "As printed roughness on our AM lattices came down to spec without touching the geometry.",
    personName: "Vikram Nair",
    designation: "AM Lead",
    company: "PrintForm",
    industry: "Additive Manufacturing",
    rating: 5,
  },
];

async function testimonials() {
  let order = 1;
  for (const { id, ...item } of DEMO_TESTIMONIALS) {
    await createIfMissing("testimonials", id, { ...item, logoUrl: "", order: order++, published: false });
  }
}

/* --- Home page banner the site showed (it has ended, so it stays hidden automatically) --- */
async function eventBanner() {
  await createIfMissing("settings", "eventBanner", {
    enabled: true,
    badge: "Meet us",
    title: "Upcoming Exhibition: EMO Hannover",
    location: "Hannover, Germany (Hall 11, Booth D32)",
    startDate: "2026-09-18",
    endDate: "2026-09-23",
    ctaText: "",
    ctaUrl: "",
  });
}

/* --- Contact details and social links the footer shows today --- */
const VISIBLE_CONTACT = {
  phone: "+91 (1792) 234459",
  email: "superfinish@infini.co.in",
  address: "Treatment & validation labs, Parwanoo, Himachal Pradesh, India",
  googleMapsUrl: "https://maps.google.com/maps?q=1%20Taksal%20Road%2C%20Parwanoo%2C%20Himachal%20Pradesh%20173220&z=14&output=embed",
};
const VISIBLE_SOCIAL = {
  linkedin: "https://www.linkedin.com/in/infini-precision-private-limited-73b19921b/",
  instagram: "https://www.instagram.com/infiniprecisionpvt.ltd/",
  youtube: "https://youtu.be/YKcmtDuxXks",
  facebook: "https://www.facebook.com/profile.php?id=100064548354724",
  x: "https://x.com/preision",
};

// "enquiries@infini.co.in" is the original seed value; the site shows (and the brochure confirms) superfinish@.
const SEEDED_VALUES = new Set(["enquiries@infini.co.in"]);
const isPlaceholder = (value: unknown) =>
  typeof value !== "string" || !value.trim() || /X{2,}[\s-]+X{2,}/.test(value) || SEEDED_VALUES.has(value.trim());

async function settings() {
  const ref = db.collection("settings").doc("global");
  const current = (await ref.get()).data() ?? {};
  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(VISIBLE_CONTACT)) {
    if (isPlaceholder(current.contact?.[key])) update[`contact.${key}`] = value;
  }
  for (const [key, value] of Object.entries(VISIBLE_SOCIAL)) {
    if (isPlaceholder(current.social?.[key])) update[`social.${key}`] = value;
  }
  if (Object.keys(update).length === 0) {
    log.push("skip   settings/global (contact and social already set)");
    return;
  }
  log.push(`update settings/global: ${Object.keys(update).join(", ")}`);
  if (!WRITE) return;
  if (Object.keys(current).length === 0) {
    await ref.set({ contact: VISIBLE_CONTACT, social: VISIBLE_SOCIAL }, { merge: true });
  } else {
    await ref.update(update);
  }
}

/* --- Media library: index the photos the site already ships, so pickers aren't empty --- */
const IMAGE_TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

function siteImages(): string[] {
  const dirs = ["images/placeholders", "images"];
  const files: string[] = [];
  for (const dir of dirs) {
    const full = path.join(ROOT, "public", dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full)) {
      const ext = path.extname(name).toLowerCase();
      // Skip the logo and PNGs that have a lighter .webp twin.
      const hasWebp = ext === ".png" && fs.existsSync(path.join(full, name.replace(/\.png$/i, ".webp")));
      if (IMAGE_TYPES[ext] && name !== "logo.png" && !hasWebp && fs.statSync(path.join(full, name)).isFile()) {
        files.push(`${dir}/${name}`);
      }
    }
  }
  return files;
}

async function media() {
  for (const rel of siteImages()) {
    const filename = path.basename(rel);
    const id = `site-${rel.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
    const alt = filename
      .replace(/\.[^.]+$/, "")
      .replace(/^(gallery|process)-\d+-/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    await createIfMissing("media", id, {
      url: `/${rel}`,
      // Not in Firebase Storage: a file shipped with the website itself.
      path: "",
      external: true,
      filename,
      alt: alt.charAt(0).toUpperCase() + alt.slice(1),
      contentType: IMAGE_TYPES[path.extname(rel).toLowerCase()],
      width: 0,
      height: 0,
      sizeBytes: fs.statSync(path.join(ROOT, "public", rel)).size,
      uploadedBy: "Imported from the website",
      uploadedAt: Timestamp.now(),
    });
  }
}

async function main() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "(from credentials)";
  const target = process.env.FIRESTORE_EMULATOR_HOST ? `emulator ${process.env.FIRESTORE_EMULATOR_HOST}` : `project ${projectId}`;
  console.log(`${WRITE ? "WRITING to" : "DRY RUN against"} ${target}\n`);
  await caseStudies();
  await testimonials();
  await eventBanner();
  await settings();
  await media();
  console.log(log.join("\n"));
  if (!WRITE) console.log("\nNothing written. Re-run with --write to apply.");
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
