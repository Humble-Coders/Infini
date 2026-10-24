/**
 * Creates first drafts of the Privacy Policy and Terms of Use in
 * `pages/privacy` and `pages/terms`, which the admin dashboard (Legal pages)
 * then edits. Never overwrites an existing page.
 *
 *   npx tsx backend/scripts/seed-legal-pages.ts            # dry run
 *   npx tsx backend/scripts/seed-legal-pages.ts --write
 *
 * The text describes what this website actually does with data (enquiry
 * form, Firebase storage, email notification, consent-based analytics). It is
 * a starting draft for INFINI's legal adviser, not legal advice.
 */
import fs from "fs";
import path from "path";
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const WRITE = process.argv.includes("--write");
const ROOT = path.resolve(import.meta.dirname, "..", "..");
for (const file of [".env.local", ".env"]) {
  const full = path.join(ROOT, file);
  if (fs.existsSync(full)) process.loadEnvFile(full);
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const keyFile = path.join(ROOT, "serviceAccountKey.json");
const app = process.env.FIRESTORE_EMULATOR_HOST
  ? initializeApp({ projectId })
  : initializeApp({
      projectId,
      credential: fs.existsSync(keyFile) ? cert(JSON.parse(fs.readFileSync(keyFile, "utf8"))) : applicationDefault(),
    });
const db = getFirestore(app);

const CONTACT_EMAIL = "superfinish@infini.co.in";

const PRIVACY = `This policy explains what information INFINI Precision Private Limited ("INFINI", "we") collects through this website, why, and the choices you have. INFINI is a precision surface-finishing company based in Parwanoo, Himachal Pradesh, India.

## Information we collect

**When you send an enquiry.** The contact and quote form asks for your name and email address, and optionally your company, phone number, industry and a message. You may also attach a photo or drawing of your component. We use this only to answer your enquiry and, if you go ahead, to prepare a quotation and deliver the work.

**When you browse.** Our hosting provider records standard technical information (such as IP address, browser type and the pages requested) to keep the site secure and working. We do not use this to identify you.

**Analytics, only with your consent.** If you accept analytics cookies, Google Analytics measures how the site is used (pages visited, approximate location, device type). It is not loaded at all unless you choose to allow it, and you can change your choice at any time from the "Cookie settings" link in the footer.

**On your device.** The site stores two small preferences in your browser's local storage: whether you closed the event banner, and your cookie choice. They never leave your device.

## How we store and protect it

Enquiries are stored in Google Firebase (Google Cloud), with access limited to authorised INFINI staff who handle enquiries. Data is encrypted in transit and at rest. A copy of each new enquiry is emailed to our team so we can respond quickly. We do not sell your information or share it for advertising.

## How long we keep it

We keep enquiries for as long as needed to respond, quote and support an ongoing business relationship, and to meet legal and accounting obligations. You can ask us to delete your information sooner (see below).

## Your rights

Under India's Digital Personal Data Protection Act, 2023 and other applicable laws, you may ask us to:

- tell you what personal data we hold about you and how it is used,
- correct or complete inaccurate information,
- erase your information when it is no longer needed,
- withdraw any consent you have given (for example, to analytics).

To make a request or raise a concern, email **${CONTACT_EMAIL}**. We will respond within a reasonable time. If you are not satisfied with our response, you may approach the Data Protection Board of India.

## Changes

We may update this policy as our website or the law changes. The date at the top shows when it last changed.

## Contact

INFINI Precision Private Limited, Parwanoo, Himachal Pradesh, India. Email: ${CONTACT_EMAIL}`;

const TERMS = `These terms apply to your use of the INFINI website. By using the site you agree to them.

## About the information on this site

INFINI provides precision surface-finishing services (MMP treatment) for components that our customers manufacture. Descriptions, results, roughness values and case studies on this site are given for general information. Outcomes depend on the material, geometry and condition of each component, and are confirmed only by trials and a written quotation.

## Enquiries and quotations

Submitting an enquiry does not create a contract. Any work is governed by the written quotation and terms we agree with you. Please do not send confidential drawings unless you are comfortable doing so; we treat what you send as confidential and use it only to assess your request.

## Intellectual property

The text, photographs, diagrams and logos on this site belong to INFINI or its partners and are protected by law. You may view and share pages for your own reference, but you may not copy, modify or republish them without our written permission. MMP is a technology developed by BinC Industries; related names and marks belong to their respective owners.

## Acceptable use

Please do not misuse the site: no attempts to gain unauthorised access, disrupt the service, submit false or harmful content, or collect other users' information.

## Links to other sites

We may link to other websites (such as our social media pages). We are not responsible for their content or privacy practices.

## Liability

We take care to keep the site accurate and available, but it is provided "as is". To the extent the law allows, INFINI is not liable for losses arising from use of, or reliance on, information on this website.

## Governing law

These terms are governed by the laws of India, and the courts of Himachal Pradesh have jurisdiction over any dispute relating to this website.

## Contact

Questions about these terms: **${CONTACT_EMAIL}**.`;

const PAGES = [
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "How INFINI collects, uses and protects the information you share through this website.",
    body: PRIVACY,
  },
  { id: "terms", title: "Terms of Use", description: "The terms that apply when you use the INFINI website.", body: TERMS },
];

async function main() {
  console.log(`${WRITE ? "WRITING to" : "DRY RUN against"} ${process.env.FIRESTORE_EMULATOR_HOST ? "emulator" : `project ${projectId}`}`);
  for (const { id, ...page } of PAGES) {
    const ref = db.collection("pages").doc(id);
    if ((await ref.get()).exists) {
      console.log(`skip   pages/${id} (already exists)`);
      continue;
    }
    console.log(`create pages/${id}`);
    if (WRITE) await ref.create({ kind: "legal", ...page, updatedAt: Timestamp.now() });
  }
  if (!WRITE) console.log("Nothing written. Re-run with --write to apply.");
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
