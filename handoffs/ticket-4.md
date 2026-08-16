**Ticket:** #4 — Firebase wiring, deny-all rules, and private staging deployment

## Summary

Wires the app to a real Firebase project (`infini-2fdec`, Blaze plan): a browser-safe client SDK init, a server-only Admin SDK init that fails the build if imported from client code, committed deny-all-by-default Firestore/Storage rules (later tickets open specific paths deliberately), and `docs/INFRA.md` as the console-config log so the project is reproducible from the repo rather than only transferable. `.env.example` documents every required key by name, no values. Staging is configured to never index: `next.config.ts` sends `X-Robots-Tag: noindex` and `app/robots.ts` serves a disallow-all `robots.txt`, both gated on `NEXT_PUBLIC_SITE_ENV`, so this holds regardless of whether the App Hosting backend itself is fully stood up yet.

## Files changed

- `lib/firebase/client.ts` — browser SDK init from `NEXT_PUBLIC_FIREBASE_*` env vars, safe for client bundles.
- `backend/firebase/admin.ts` — Admin SDK init, `import "server-only"` as the first line; resolves credentials from explicit service-account env vars locally or falls back to Application Default Credentials on App Hosting/Cloud Run.
- `backend/firestore.rules`, `backend/storage.rules` — committed, deny-all by default (`match /{document=**} { allow read, write: if false; }`), with later tickets (T5+) opening specific collection/path access deliberately.
- `backend/firestore.indexes.json` — committed, empty until T5 needs composite indexes.
- `firebase.json` — points at the committed rules/indexes files, configures the local emulator suite.
- `apphosting.yaml` — App Hosting build/runtime config; public env vars listed directly, secrets referenced via `secret:` (never a literal `value:`).
- `.env.example` — every key the app needs, names only, no real values.
- `docs/INFRA.md` — console-only settings log: project ID/number/owner/billing plan, environment variable inventory, rules/indexes deploy commands, authorized-domains guidance.
- `README.md` — env setup and deploy steps.

## How to test

```bash
npm run build
grep -A2 "import \"server-only\"" backend/firebase/admin.ts   # confirms the guard is the first line
```

Try importing `backend/firebase/admin.ts` from a client component (`"use client"` file) and confirm the build fails — then revert. Deploy rules and verify in the Firebase Console's Rules Playground that both Firestore and Storage deny all reads/writes to every identity, including an authenticated one.

```bash
curl -I <staging-url>          # X-Robots-Tag: noindex
curl <staging-url>/robots.txt  # disallow-all
```

## Acceptance criteria

- [ ] **The app builds and deploys to a staging `*.web.app` URL — NOT MET.** The App Hosting backend itself has not been created in the console yet; `apphosting.yaml` is committed and ready, but there's no live staging URL to point at. Confirmed via `docs/INFRA.md`, which explicitly logs this as not yet done.
- [x] Importing `lib/firebase/admin.ts` (now `backend/firebase/admin.ts`, per the target architecture in `CLAUDE.md`) from a client component fails the build — the `server-only` guard is the first line of the file.
- [~] `curl -I`/`robots.txt` staging checks — the noindex/disallow-all mechanism is implemented and correct (`next.config.ts`/`app/robots.ts`), but there's no live staging URL yet to run the actual `curl` against (same gap as above).
- [x] Firestore and Storage rules deny all reads and writes by default — verified by inspection; the deny-all fallback (`match /{document=**}`) is still present at the bottom of both rules files even after T5–T8 opened specific collection paths.
- [x] `.env.example` lists every key needed to run the app, with no real values.
- [x] `git log -p` contains no secret, service-account JSON, or `.env` file — `.env`, service-account key patterns, and `*.firebase-service-account.json` are all gitignored from the first commit.
- [ ] **A budget alert is configured — NOT MET.** Logged as outstanding in `docs/INFRA.md`; needs to be set at Google Cloud Console → Billing → Budgets & alerts before real usage scales up.
- [x] `docs/INFRA.md` is complete enough to rebuild the project from scratch on the points that are actually done (project identity, rules/indexes, env var inventory, deploy commands); the two items above are explicitly logged as gaps rather than glossed over.

## Deviations / decisions

- **App Hosting backend creation is deferred, not skipped.** It requires a console OAuth step to connect the GitHub repo, which doesn't need to happen until staging deploys are actually needed — `apphosting.yaml` is ready the moment someone does that. `docs/INFRA.md` marks this explicitly as "Deferred — no backend created yet" rather than silently treating it as done.
- **Budget alert similarly deferred** — genuinely no cost risk yet at this stage of the build (confirmed later, in T6/T8, that actual usage against the live project stayed in the free tier), but this should be set before real traffic or heavier Cloud Functions usage arrives.
- The file that houses the Admin SDK ended up at `backend/firebase/admin.ts` (matching `CLAUDE.md`'s target architecture — `backend/` for everything server-only) rather than `lib/firebase/admin.ts` as the ticket's scope line literally says; the client SDK stayed at `lib/firebase/client.ts` per the same architecture doc, since it's safe for client bundles.

## Open questions / follow-ups

- **App Hosting backend still needs to be created** in the Firebase console (connect the GitHub repo, get a real `*.web.app` staging URL) before this ticket's core deliverable — an actual reviewable staging deployment — exists.
- **Budget alert still needs to be configured.**
- Once the App Hosting backend exists, `docs/INFRA.md`'s Authorized domains table needs the real staging domain added (currently a `TODO.web.app` placeholder).
