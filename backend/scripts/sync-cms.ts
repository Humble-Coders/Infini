import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { buildIndustries } from "./content";

// Initialize the Firebase Admin SDK using the credentials specified in GOOGLE_APPLICATION_CREDENTIALS
const app = initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore(app);

async function syncCMS() {
  console.log("Syncing industries to Firestore...");
  const industries = buildIndustries();

  for (const industry of industries) {
    const slug = industry.slug;
    
    // We only update the document, we don't overwrite it entirely, to preserve `published` flags etc.
    const ref = db.collection("industries").doc(slug);
    
    // Convert to a plain object
    const data = JSON.parse(JSON.stringify(industry));
    
    // Update the document with merge: true so it only overrides provided fields
    await ref.set(data, { merge: true });
    
    console.log(`Updated industry: ${slug}`);
  }

  // Also update the global settings with the new email
  console.log("Updating global settings...");
  await db.collection("settings").doc("global").set({
    contact: {
      email: "superfinish@infini.co.in"
    }
  }, { merge: true });

  console.log("Sync complete!");
}

syncCMS().catch(console.error);
