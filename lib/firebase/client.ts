import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getFunctions, type Functions } from "firebase/functions";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Optional: only used by Analytics (see initAnalytics below).
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const configured = Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);

/**
 * Local-only: point the web SDK at `firebase emulators:start --only firestore`.
 * Unlike the Admin SDK, the web SDK ignores FIRESTORE_EMULATOR_HOST, so this
 * is an explicit opt-in. NEXT_PUBLIC_ so server and browser renders hit the
 * same emulator; guarded on NODE_ENV so a stray value can never reach a build.
 */
const emulatorHost =
  process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST : undefined;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let functions: Functions | null = null;
let storage: FirebaseStorage | null = null;

if (configured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
  if (emulatorHost) {
    const [host, port] = emulatorHost.split(":");
    // Idempotent for an identical host/port, so HMR re-evaluating this module is safe.
    connectFirestoreEmulator(db, host, Number(port));
  }
  auth = getAuth(app);
  functions = getFunctions(app);
  storage = getStorage(app);
} else if (process.env.NODE_ENV === "development") {
  console.warn(
    "Infini: Firebase is not configured. Copy .env.example to .env and add your Firebase web app keys."
  );
}

/**
 * Firebase Analytics, started on demand from the browser.
 *
 * Deliberately not initialised at module load: this module is imported by
 * server components (via lib/data/*), and `getAnalytics()` throws outside a
 * browser. It is also not called anywhere yet on purpose. Analytics is T21 and
 * cookie consent is T22, so switching collection on belongs with the consent
 * banner rather than ahead of it. Once that lands, call this from a client
 * component after consent:
 *
 *   useEffect(() => { void initAnalytics(); }, []);
 *
 * Resolves to null when unsupported, unconfigured, or run on the server.
 */
export async function initAnalytics() {
  if (typeof window === "undefined" || !app || !firebaseConfig.measurementId) return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (!(await isSupported())) return null;
  return getAnalytics(app);
}

export { app, db, auth, functions, storage };
