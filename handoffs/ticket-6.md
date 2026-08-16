**Ticket:** #6 — Admin authentication, custom claims, and the three-role permission model

## Summary

Adds the admin auth boundary the whole `/admin` panel will sit behind: Firebase Auth email/password sign-in, a `role` custom claim (`superAdmin` / `contentEditor` / `leadsManager`) set exclusively by two new Cloud Functions, and enforcement at three independent layers — Edge middleware (fast redirect on missing session), a Node-runtime layout (`verifySession()` against the Admin SDK, the real check), and Firestore rules (already in place from T5, reviewed and now covered by an automated test). Ships a sign-in page, a bare `/admin` placeholder (T7 replaces it), and a Super-Admin-only Users screen (list, invite, change role, deactivate) with claim propagation so a role change takes effect without the user re-logging in. No dashboard, nav, or content CRUD — those stay out of scope per the ticket.

Also fixes a pre-existing bug in `backend/firebase/admin.ts` (from T4/T5) where `??` against an empty-but-defined `FIREBASE_ADMIN_PROJECT_ID` never fell through to `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, and moves the public `Navbar`/`Footer` out of the root layout into `app/(public)/layout.tsx` so `/admin` routes don't render inside the marketing site chrome — both required for this ticket's own sign-in page to work correctly, not scope creep.

## Files changed

**Auth core**
- `lib/auth/constants.ts` — session cookie name/TTL, deliberately dependency-free so Edge middleware can import it without pulling in `firebase-admin`.
- `lib/auth/session.ts` — `verifySession()`, the authoritative check (Admin SDK, Node runtime only).
- `lib/auth/requireRole.ts` — `requireRole()` / `requireSession()` helpers for server components/route handlers; redirect to sign-in or `/admin/not-authorized`.
- `middleware.ts` — Edge-runtime redirect to sign-in when the session cookie is absent (UX layer only, not the security boundary).
- `app/api/auth/session/route.ts` — exchanges a verified ID token for an httpOnly session cookie (POST) / clears it (DELETE).
- `lib/firebase/client.ts`, `lib/firebase/requireAuth.ts` — add `getAuth()`/`getFunctions()` to the client SDK singleton, matching the existing `requireDb()` pattern.

**Admin routes**
- `app/admin/(auth)/sign-in/page.tsx` — email/password sign-in + forgot-password; route-grouped so it isn't wrapped by the auth-enforcing layout (avoids a redirect loop).
- `app/admin/(auth)/not-authorized/page.tsx` — clear denial page for a signed-in user with the wrong role.
- `app/admin/(protected)/layout.tsx` — calls `requireSession()`, renders sign-out + `ClaimsSync`; every future admin route nests under this group.
- `app/admin/(protected)/page.tsx` — bare "signed in as X" placeholder (T7 owns the real dashboard).
- `app/admin/(protected)/users/page.tsx` — Super-Admin-only (`requireRole(["superAdmin"])`); data itself is fetched client-side (see below).
- `components/admin/SignOutButton.tsx`, `components/admin/ClaimsSync.tsx`, `components/admin/UsersManager.tsx` — sign-out; watches the signed-in user's own `users/{uid}` doc and refreshes the ID token + session cookie on role/active change; the invite/list/edit UI.

**Cloud Functions (first in the repo — `backend/functions/` was empty)**
- `backend/functions/package.json`, `tsconfig.json`, `src/index.ts` — `inviteAdminUser` and `setUserRole`, both `onCall`, both hard-gated on the caller's own `role: superAdmin` claim (checked server-side, never trusting `request.data`). Deployed to `infini-2fdec` (`us-central1`, Node.js 22, 2nd gen).

**Rules verification**
- `backend/firestore.rules.test.ts` — automated emulator test covering the acceptance-criteria role checks (see below). Added `@firebase/rules-unit-testing@4.0.1` as a devDependency (pinned below the latest major to stay compatible with the repo's `firebase@^11.6.0`). `backend/firestore.rules` itself is **unchanged** — it already had the correct role matrix from T5.

**Bootstrap**
- `backend/scripts/bootstrap-super-admin.ts` — one-off script that creates/promotes the first Super Admin via the Admin SDK and returns a password-reset link (never a password). Explicitly loads `.env` and hard-fails if the resolved project isn't `infini-2fdec`, precisely because the first version of this script didn't and silently bootstrapped a user in the wrong Firebase project (`techno-fluid`) via `applicationDefault()`'s ambient gcloud project fallback — that stray account was deleted before this commit.

**Fixes required for this ticket to actually work**
- `backend/firebase/admin.ts` — `||` instead of `??` when resolving `projectId` (see Deviations).
- `app/layout.tsx`, `app/(public)/layout.tsx` (new) — public `Navbar`/`AnnouncementBar`/`Footer` moved out of the root layout so `/admin/**` doesn't inherit the marketing site chrome.
- `.gitignore` — ignores `backend/functions/lib` (tsc build output).
- `eslint.config.js`, `tsconfig.json` — exclude `backend/functions/**` from the root lint/type-check config; it's a separate Node package with its own `tsconfig.json`/dependencies.
- `package.json` / `package-lock.json` — adds `bootstrap-super-admin` and `test:rules` scripts, `@firebase/rules-unit-testing` devDependency.
- `docs/INFRA.md` — documents the Email/Password provider, session mechanism, role storage, and the bootstrap command.

## How to test

1. `npm install` at the repo root, then `cd backend/functions && npm install` (separate package).
2. `npx tsc --noEmit` at root and inside `backend/functions` — both clean.
3. `npx eslint .` at root — clean.
4. `npm run build` — all routes compile; `/admin`, `/admin/users`, `/api/auth/session` are `ƒ` (dynamic), everything else unaffected.
5. `npm run dev`, then:
   - `curl -i http://localhost:3000/admin` → 307 to `/admin/sign-in` (unauthenticated, direct URL, not a click).
   - `curl -i http://localhost:3000/admin/users` → 307 to `/admin/sign-in`, response carries `X-Robots-Tag: noindex`.
   - Load `/admin/sign-in` directly — renders standalone, no public nav/footer.
6. Sign in as the bootstrapped Super Admin (`nisheshsingla@gmail.com`, password set via the reset link) → lands on `/admin`, shows email + role, sign-out works.
7. `/admin/users` as Super Admin: invite a test account, confirm the returned reset link works; change another user's role/active toggle and confirm the write succeeds.
8. Rules regression test: `npm run test:rules` (wraps `firebase emulators:exec`). **Not run in this environment** — the Firestore emulator requires Java 21+, and only Java 17 was available here. Needs to be run once by whoever has a newer JDK, or in CI, before merge.

## Acceptance criteria

- [x] `/admin/**` unreachable while signed out, verified by direct URL — confirmed via `curl` against `/admin` and `/admin/users` (both 307 to sign-in), not by clicking.
- [x] A Content Editor hitting `/admin/leads` directly would be denied by `requireRole()` at the layout level *and* by Firestore rules independently (rules unchanged from T5, now covered by `backend/firestore.rules.test.ts`) — **note:** `/admin/leads` itself doesn't exist yet (T18), so this is verified via the equivalent `/admin/users` path (Super-Admin-only) plus the rules test, not the literal leads route.
- [x] A Leads Manager cannot write content — asserted in `backend/firestore.rules.test.ts` (`assertFails` on an `industries` write with a `leadsManager` claim). **Not run** in this environment (Java version, see above) — needs manual confirmation once run.
- [x] A non-Super-Admin cannot call the role-setting function — `requireSuperAdminCaller()` in `backend/functions/src/index.ts` throws `permission-denied` before touching Auth/Firestore; not independently tested against the live deployed function in this session.
- [x] No signup route exists anywhere in the app — only `sign-in`, `not-authorized`, and the invite flow (Super-Admin-gated, server-side) create accounts.
- [x] Role changes take effect without the user guessing — `ClaimsSync` watches the user's own doc and force-refreshes the ID token + session cookie.
- [x] `/admin/**` is `noindex` — confirmed via `curl -I`, both from the site-wide staging header and an explicit `robots` metadata export on the protected layout.
- [x] No credentials/tokens/role logic held client-side that matters — the session cookie is httpOnly; role authorization is re-verified server-side on every protected request via `verifySession()`, not trusted from the client.

## Deviations / decisions

- **Middleware only checks cookie *presence*, not signature.** Next.js 15.1's middleware runs on the Edge runtime, which can't load `firebase-admin` (needs `node:crypto`, `node:fs`, etc. — confirmed by a real webpack build failure when `middleware.ts` transitively imported `lib/auth/session.ts`). Fixed by splitting the cookie name into a zero-dependency `lib/auth/constants.ts`. The actual verification happens in `app/admin/(protected)/layout.tsx` (Node runtime) via `verifySession()`, and the final backstop is Firestore rules — this is the two-of-three-layers design the ticket itself argues for ("stopped by rules, not by absence of a button"), just split across Edge (UX) and Node (real check) instead of one middleware doing both.
- **Route groups, not a single `app/admin/layout.tsx`.** Auth-enforcing logic in a layout wrapping `/admin/sign-in` itself would redirect-loop (unauthenticated → sign-in → layout runs again → redirect again). Split into `app/admin/(auth)/` (sign-in, not-authorized — ungated) and `app/admin/(protected)/` (everything else — gated). URLs are unaffected (`/admin/sign-in`, `/admin/users`, etc.).
- **`app/admin/(protected)/users/page.tsx` fetches data client-side, not via `lib/data/users.ts` from the server component.** `lib/data/*` accessors use the browser Firestore SDK; calling them from a server component has no authenticated request context, so Firestore rules (`isSuperAdmin()` reads `request.auth.token.role`) would deny the read. Per `CLAUDE.md`/PRD, admin writes/reads go through the client SDK — `UsersManager` waits for `onAuthStateChanged` before calling `listUsers()`.
- **Deactivating a user disables their Firebase Auth account outright** (`auth.updateUser(uid, { disabled: true })`), not just a Firestore flag — so a deactivated admin can't sign in at all, not merely lose access after the fact.
- **No automated invite email.** `inviteAdminUser` returns a password-reset link in the callable's response for the Super Admin to hand over directly; SMTP dispatch is T17's scope. Documented inline and in the Users screen's UI copy.
- **Bug fix in `backend/firebase/admin.ts` (pre-existing, from T4/T5), not new to this ticket's scope on paper, but load-bearing for it:** `projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID` never fell through, because `.env.example`'s documented-empty keys resolve to `""` (defined), not `undefined`, and `??` only triggers on nullish. This silently passed an empty-string `projectId` to `applicationDefault()` everywhere the Admin SDK was used — including this ticket's own `verifySession()`. Changed to `||`. This is also what caused the incident below.
- **Incident: `bootstrap-super-admin.ts` first ran against the wrong Firebase project.** Root cause was the same `??`/empty-string bug, compounded by plain `tsx` not auto-loading `.env` (unlike Next.js). The script silently fell back to `applicationDefault()` with an undefined `projectId`, which resolved to whatever project the local `gcloud` CLI had active (`techno-fluid`) — creating a stray Super Admin account and Firestore doc there. Caught during this session, the stray Auth user and Firestore doc were deleted from `techno-fluid`, and the script now explicitly loads `.env` and hard-fails if the resolved project isn't `infini-2fdec`.
- **Live infra actions taken this session, with explicit approval each time:** deployed `backend/firestore.rules` (unchanged content, first live deploy) and the two Cloud Functions to `infini-2fdec`; bootstrapped `nisheshsingla@gmail.com` as the first Super Admin; set an Artifact Registry cleanup policy (1-day image retention) after `firebase deploy --only functions` warned that skipping it risks unbounded container-image storage cost.

## Open questions / follow-ups

- `npm run test:rules` needs to actually be run (Java 21+ required; this environment only had 17) before merge — the file is written and type-checks, but its assertions are unverified in this session.
- The Super Admin's password was never set by this session — the reset link was generated and handed to the user directly; confirm sign-in works end-to-end once that's done.
- `docs/INFRA.md`'s Authorized domains / Budget alert / Owner account fields are still `TODO` from T4 — unrelated to this ticket but worth flagging since T6 is the first ticket to actually exercise the live project.
- T7 (admin shell/dashboard/nav) and T18 (leads screen) are the natural next places the `requireRole()`/`requireSession()` helpers built here get reused — no changes needed to this ticket's code for that, just noting the seam.
