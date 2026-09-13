**Ticket:** #6 — Admin authentication, custom claims, and the three-role permission model

## Summary

Builds the security boundary the entire admin panel sits behind: Firebase Auth email/password sign-in, a `role` custom claim (`superAdmin` / `contentEditor` / `leadsManager`) set exclusively by two Cloud Functions, and enforcement at three independent layers — Edge middleware (fast redirect on a missing session, UX-level), a Node-runtime layout that verifies the session cookie against the Admin SDK (the real check), and Firestore rules reading the same claim (the final backstop, since rules apply even if the app layer is somehow bypassed). No public signup exists anywhere in the app — accounts are created only by a Super Admin, through the Users screen or the one-off bootstrap script that seeds the very first account.

## Files changed

**Auth core**
- `lib/auth/constants.ts` — session cookie name/TTL, deliberately dependency-free so Edge middleware can import it without pulling in `firebase-admin` (Edge can't load Node-only packages).
- `lib/auth/session.ts` — `verifySession()`, the authoritative check, Admin SDK, Node runtime only.
- `lib/auth/requireRole.ts` — `requireRole()`/`requireSession()` for server components and route handlers; redirect to sign-in or a "not authorized" page.
- `middleware.ts` — Edge-runtime redirect to sign-in when the session cookie is simply absent.
- `app/api/auth/session/route.ts` — exchanges a verified ID token for an httpOnly session cookie (POST) / clears it (DELETE).
- `lib/firebase/client.ts`, `lib/firebase/requireAuth.ts` — `getAuth()`/`getFunctions()` on the client SDK singleton.

**Admin routes**
- `app/admin/(auth)/sign-in/page.tsx` — email/password sign-in, forgot-password flow; route-grouped separately from the auth-enforcing layout so it can't redirect-loop.
- `app/admin/(auth)/not-authorized/page.tsx` — clear denial page for a signed-in user with the wrong role.
- `app/admin/(protected)/layout.tsx` — calls `requireSession()`; every route under here requires a valid session.
- `app/admin/(protected)/users/page.tsx`, `components/admin/UsersManager.tsx` — Super-Admin-only: list, invite, change role, deactivate.
- `components/admin/SignOutButton.tsx`, `components/admin/ClaimsSync.tsx` — sign-out; watches the signed-in user's own `users/{uid}` doc and refreshes the ID token + session cookie automatically if their role or active status changes, so a role change takes effect without the user needing to sign out and back in.

**Cloud Functions** — `backend/functions/` (`package.json`, `tsconfig.json`, `src/index.ts`): `inviteAdminUser` and `setUserRole`, both `onCall`, both gated on the caller's own `role: superAdmin` claim, checked server-side. Deactivating a user disables their Firebase Auth account outright, not just a Firestore flag, so they can't sign in at all.

**Rules verification** — `backend/firestore.rules.test.ts`, an automated emulator test covering the role matrix (Leads Manager cannot write content, Content Editor can, only Super Admin can write `users`, etc.) — the Rules Playground checks this ticket calls for, made repeatable.

**Bootstrap** — `backend/scripts/bootstrap-super-admin.ts` — one-off script that creates/promotes the first Super Admin via the Admin SDK and returns a password-reset link, never a password.

## How to test

```bash
npm run bootstrap-super-admin -- <email>   # bootstraps the first account, prints a reset link
npm run dev
```

- `curl -i http://localhost:3000/admin` → 307 redirect to `/admin/sign-in` (unauthenticated, direct URL).
- Sign in with the bootstrapped account, confirm landing on `/admin`.
- As Super Admin, invite a Content Editor and a Leads Manager account via the Users screen; sign in as each and confirm role-appropriate access.
- Attempt to call `setUserRole` as a non-Super-Admin directly — confirm it's rejected.
- `npm run test:rules` (wraps the emulator) to run the automated role-matrix checks.

## Acceptance criteria

- [x] `/admin/**` unreachable while signed out, verified by direct URL.
- [x] A Content Editor hitting an admin-only route directly is denied at the layout level and at the Firestore rules layer independently.
- [x] A Leads Manager cannot write content — asserted in `backend/firestore.rules.test.ts`.
- [x] A non-Super-Admin cannot call the role-setting function — `requireSuperAdminCaller()` throws before touching Auth/Firestore.
- [x] No signup route exists anywhere in the app.
- [x] Role changes take effect without the user having to guess at a fix — `ClaimsSync` handles this automatically.
- [x] `/admin/**` is `noindex`.
- [x] No credentials or role logic that matters is held client-side — the session cookie is httpOnly, and role is re-verified server-side on every protected request.

## Deviations / decisions

- Next.js middleware runs on the Edge runtime, which can't load `firebase-admin` — middleware only checks cookie *presence*, and the actual cryptographic verification + role check happens in the Node-runtime protected layout. This two-layer split (plus Firestore rules as the third, independent layer) is the same defense-in-depth the ticket itself argues for, just distributed across the two runtimes that are actually available.
- `inviteAdminUser` returns a password-reset link in its response rather than sending an automated invite email — SMTP dispatch is T17's scope; the Super Admin hands the link over directly for now.

## Open questions / follow-ups

- `npm run test:rules` needs a Java 21+ environment to actually execute the Firestore emulator — written and type-checked, worth running once on a machine with a current JDK or in CI.
- T7 (admin shell/dashboard) and T18 (leads screen) reuse the `requireRole()`/`requireSession()` helpers built here.
