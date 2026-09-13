**Issue:** [#4](https://github.com/Humble-Coders/Infini/issues/4)
**Milestone:** M1 — Foundation
**Blocked by:** T1 (Next.js migration). **Can run in parallel with T2/T3.**
**Blocks:** T5 (Firestore schema) and all deployment.

## 📖 Story / Why

This ticket gets the app deployable and connects it to Firebase, so that from here on every merged ticket is visible on a real URL rather than only on someone's laptop.

It also sets up the **private staging environment**. The client's requirement is firm: the unfinished site must **never** be served from `infini.co.in`. Development runs against a staging URL the client reviews privately before cutover.

## 🧭 Context

**Infrastructure ownership — read this, it changes how you work.** You create and own the Firebase project during the build; it transfers to us and then to the client at handover (PRD decision **D5**, revised). Transferring a project between personal Google accounts is manual and error-prone, so **the project must be reproducible from this repo, not merely transferable.**

Concretely: rules and config are committed as code, and every console-only setting is written down **as you create it**, not reconstructed from memory at handover. Assume the whole project will be rebuilt from scratch by someone who wasn't there. That is the standard this ticket is held to.

**Blaze plan is required** — App Hosting, Cloud Functions and reCAPTCHA Enterprise do not run on the free Spark plan. Costs at this stage are negligible, but **set a budget alert** so nothing runs away unnoticed.

**The Admin SDK is the dangerous part.** `lib/firebase/admin.ts` bypasses **all** Firestore security rules. If it ever reaches a client bundle, the database is effectively public. It must begin with `import "server-only"` so the build fails loudly rather than shipping quietly.

**Security rules start deny-all.** Later tickets open specific paths deliberately. Never start permissive "just to unblock development" — that is how a rule set ships to production wide open.

## 🔑 Access & prerequisites

- [ ] T1 merged.
- [ ] Branch `feature/<issue#>-firebase-staging` off `main`.
- [ ] A Firebase project you create, on the **Blaze** plan, with a budget alert configured.
- [ ] **No secrets in this repo.** The Firebase *web* config is public by design and belongs in `NEXT_PUBLIC_*`. Anything genuinely secret — SMTP app password, reCAPTCHA secret key, service-account JSON — goes to Cloud Functions config / Secret Manager and is requested from the manager via secure channel. Never committed, never `NEXT_PUBLIC_`.

## ✅ Scope / What to build

- [ ] `lib/firebase/client.ts` — browser SDK init, safe for client bundles.
- [ ] `lib/firebase/admin.ts` — Admin SDK init, **beginning with `import "server-only"`**.
- [ ] Update `.env.example` with every required key — **names only, never values**.
- [ ] Commit `firebase.json`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`. **Rules deny all access by default.**
- [ ] Create a **staging** App Hosting backend on the Firebase-provided `*.web.app` domain and deploy to it.
- [ ] Staging must send `X-Robots-Tag: noindex` **and** serve a `robots.txt` disallowing everything.
- [ ] Create `docs/INFRA.md` documenting every console-only setting: project ID, backends, environment variable names, authorised domains, budget alert, and anything else clicked rather than committed.
- [ ] Extend `README.md` with env setup and deploy steps.

## 🎯 Acceptance Criteria

- [ ] The app builds and deploys to the staging `*.web.app` URL and loads correctly.
- [ ] **Importing `lib/firebase/admin.ts` from a client component fails the build.** Prove it — try it, confirm the failure, then revert.
- [ ] `curl -I <staging-url>` shows `X-Robots-Tag: noindex`, and `curl <staging-url>/robots.txt` shows a disallow-all rule.
- [ ] Firestore and Storage rules deny all reads and writes. Verify in the Rules Playground.
- [ ] `.env.example` lists every key needed to run the app, with **no real values**.
- [ ] `git log -p` contains no secret, service-account JSON, or `.env` file at any point in history.
- [ ] A budget alert is configured on the Firebase project.
- [ ] **`docs/INFRA.md` is complete enough for a different developer to recreate the entire project from scratch.** This is the acceptance bar for D5 — treat it as a real deliverable, not a formality.

## 🚫 Out of scope

- Firestore collections, documents, and typed data accessors — **T5**.
- Authentication and roles — **T6**.
- Cloud Functions logic (email, reCAPTCHA) — **T17**.
- Production deployment or any DNS change on `infini.co.in` — **T26**.

## 📚 References

- [`CLAUDE.md`](../../CLAUDE.md) — secrets rules and the server-only requirement.
- [`docs/PRD.md`](../PRD.md) §4.4 security model, §10 decision **D5** (infra ownership and the reproducibility mandate).

## 🤖 Kickoff prompt

```
/start-ticket 4
```
