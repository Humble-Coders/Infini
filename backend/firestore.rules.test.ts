/**
 * Automated equivalent of the Rules Playground checks T6's acceptance
 * criteria calls for — run against the emulator so the role matrix is
 * verified by CI/`npm run test:rules`, not just eyeballed once by hand.
 *
 * Run via `npm run test:rules` (wraps this in `firebase emulators:exec`,
 * same pattern as `npm run seed`). Never targets a real project.
 */
import { strict as assert } from "node:assert";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, setDoc } from "firebase/firestore";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error(
    "FIRESTORE_EMULATOR_HOST is not set — run this via `npm run test:rules`, not directly."
  );
}

async function run() {
  const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
    projectId: "infini-rules-test",
    firestore: { rules: readFileSync("backend/firestore.rules", "utf8") },
  });

  const unauthenticated = testEnv.unauthenticatedContext();
  const contentEditor = testEnv.authenticatedContext("editor-uid", { role: "contentEditor" });
  const leadsManager = testEnv.authenticatedContext("leads-uid", { role: "leadsManager" });
  const superAdmin = testEnv.authenticatedContext("super-uid", { role: "superAdmin" });

  // Seed one published industry doc and one users doc, bypassing rules.
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "industries", "cutting-tools"), { published: true, name: "Cutting Tools" });
    await setDoc(doc(db, "users", "editor-uid"), { role: "contentEditor", active: true });
  });

  // Unauthenticated: leads is unreadable and unwritable, full stop.
  await assertFails(getDoc(doc(unauthenticated.firestore(), "leads", "lead-1")));
  await assertFails(setDoc(doc(unauthenticated.firestore(), "leads", "lead-1"), { name: "x" }));
  console.log("✓ unauthenticated cannot read or write leads");

  // Leads is unreadable even by an authenticated Leads Manager — write-only
  // from the server (T17's Cloud Function via the Admin SDK), never a client.
  await assertFails(getDoc(doc(leadsManager.firestore(), "leads", "lead-1")));
  console.log("✓ Leads Manager (authenticated) still cannot read leads directly");

  // Content Editor CAN write content per the role matrix.
  await assertSucceeds(
    setDoc(doc(contentEditor.firestore(), "industries", "cutting-tools"), { published: true, name: "Cutting Tools" })
  );
  console.log("✓ Content Editor can write industries content");

  // Leads Manager cannot write content — the acceptance criterion.
  await assertFails(
    setDoc(doc(leadsManager.firestore(), "industries", "cutting-tools"), { published: true, name: "Hacked" })
  );
  console.log("✓ Leads Manager cannot write content");

  // Content Editor cannot read the users collection (Users & Settings is
  // Super-Admin-only) except their own document.
  await assertSucceeds(getDoc(doc(contentEditor.firestore(), "users", "editor-uid")));
  await assertFails(getDoc(doc(contentEditor.firestore(), "users", "super-uid")));
  console.log("✓ Content Editor can read own user doc but not others");

  // Only Super Admin can write the users collection.
  await assertFails(
    setDoc(doc(contentEditor.firestore(), "users", "editor-uid"), { role: "superAdmin" })
  );
  await assertSucceeds(
    setDoc(doc(superAdmin.firestore(), "users", "editor-uid"), { role: "contentEditor", active: true })
  );
  console.log("✓ Only Super Admin can write the users collection");

  await testEnv.cleanup();
  console.log("\nAll rules checks passed.");
}

run().catch((error) => {
  console.error("Rules test failed:", error);
  assert.fail(error);
});
