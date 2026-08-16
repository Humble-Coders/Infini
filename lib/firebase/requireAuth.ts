import type { Auth } from "firebase/auth";
import type { Functions } from "firebase/functions";
import type { FirebaseStorage } from "firebase/storage";
import { auth, functions, storage } from "@/lib/firebase/client";

/** Throws loudly at call time rather than silently failing sign-in. */
export function requireAuth(): Auth {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not configured — copy .env.example to .env and set the NEXT_PUBLIC_FIREBASE_* keys."
    );
  }
  return auth;
}

/** Throws loudly at call time rather than silently failing a callable function invocation. */
export function requireFunctions(): Functions {
  if (!functions) {
    throw new Error(
      "Firebase Functions is not configured — copy .env.example to .env and set the NEXT_PUBLIC_FIREBASE_* keys."
    );
  }
  return functions;
}

/** Throws loudly at call time rather than silently failing a media upload/delete. */
export function requireStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error(
      "Firebase Storage is not configured — copy .env.example to .env and set the NEXT_PUBLIC_FIREBASE_* keys."
    );
  }
  return storage;
}
