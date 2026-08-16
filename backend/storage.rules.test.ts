/**
 * Verifies the size/type limits in backend/storage.rules are enforced by
 * the rules themselves, not just the client-side checks in
 * lib/storage/uploadMediaFile.ts — the T8 acceptance criterion explicitly
 * calls for a direct SDK upload attempt, not just trusting the UI.
 *
 * Run via `npm run test:storage-rules` (wraps this in `firebase
 * emulators:exec --only storage`, same pattern as `npm run test:rules`).
 * Never targets a real project. Uses the Storage compat SDK because
 * @firebase/rules-unit-testing's `.storage()` returns a compat instance,
 * not the modular `firebase/storage` client used by the app itself.
 */
import { strict as assert } from "node:assert";
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import type firebase from "firebase/compat/app";
import "firebase/compat/storage";

if (!process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
  throw new Error("FIREBASE_STORAGE_EMULATOR_HOST is not set — run this via `npm run test:storage-rules`, not directly.");
}

function bytes(size: number): Uint8Array {
  return new Uint8Array(size);
}

// The compat SDK's .put() returns an UploadTask (thenable, not a strict
// Promise) — assertSucceeds/assertFails need a real Promise.
function putFile(fileRef: firebase.storage.Reference, size: number, contentType: string): Promise<unknown> {
  return Promise.resolve(fileRef.put(bytes(size), { contentType }));
}

async function run() {
  const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
    projectId: "infini-storage-rules-test",
    storage: { rules: readFileSync("backend/storage.rules", "utf8") },
  });

  const unauthenticated = testEnv.unauthenticatedContext();
  const leadsManager = testEnv.authenticatedContext("leads-uid", { role: "leadsManager" });
  const contentEditor = testEnv.authenticatedContext("editor-uid", { role: "contentEditor" });

  // Public read of anything under media/ — next/image and direct <img> both need this.
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await putFile(context.storage().ref("media/seed.jpg"), 1024, "image/jpeg");
  });
  await assertSucceeds(unauthenticated.storage().ref("media/seed.jpg").getDownloadURL());
  console.log("✓ public can read media/*");

  // Unauthenticated and Leads Manager cannot write at all — content upload is Content Editor / Super Admin only.
  await assertFails(putFile(unauthenticated.storage().ref("media/x.jpg"), 1024, "image/jpeg"));
  await assertFails(putFile(leadsManager.storage().ref("media/x.jpg"), 1024, "image/jpeg"));
  console.log("✓ unauthenticated and Leads Manager cannot upload");

  // Content Editor can upload a normal image.
  await assertSucceeds(putFile(contentEditor.storage().ref("media/ok.jpg"), 1024 * 1024, "image/jpeg"));
  console.log("✓ Content Editor can upload an image under the size limit");

  // Oversized image (>10MB) is rejected even for an authorized role — the whole point of this test.
  await assertFails(putFile(contentEditor.storage().ref("media/too-big.jpg"), 11 * 1024 * 1024, "image/jpeg"));
  console.log("✓ an 11MB image is rejected by Storage rules, not just the UI");

  // Wrong content-type is rejected regardless of size.
  await assertFails(putFile(contentEditor.storage().ref("media/not-an-image.exe"), 1024, "application/octet-stream"));
  console.log("✓ a non-image, non-PDF content type is rejected");

  // A PDF under 20MB is accepted (certificate uploads, T12).
  await assertSucceeds(putFile(contentEditor.storage().ref("media/cert.pdf"), 5 * 1024 * 1024, "application/pdf"));
  console.log("✓ a 5MB PDF is accepted");

  // A PDF over 20MB is rejected.
  await assertFails(putFile(contentEditor.storage().ref("media/huge-cert.pdf"), 21 * 1024 * 1024, "application/pdf"));
  console.log("✓ a 21MB PDF is rejected");

  await testEnv.cleanup();
  console.log("\nAll storage rules checks passed.");
}

run().catch((error) => {
  console.error("Storage rules test failed:", error);
  assert.fail(error);
});
