/**
 * Deliberately its own file with zero other imports. middleware.ts (Edge
 * runtime) needs the cookie name but must never pull in lib/auth/session.ts,
 * which imports backend/firebase/admin.ts (firebase-admin) — a Node-only
 * dependency that Edge's webpack bundle can't resolve (node:crypto, node:fs, …).
 */
export const SESSION_COOKIE = "infini_session";

/** Firebase session cookies default to 2 weeks; we use 5 days to match typical admin shift patterns. */
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;
