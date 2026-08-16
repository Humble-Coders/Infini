# INFRA — Firebase project setup

This is the console-only settings log for T4. Per `CLAUDE.md` / PRD decision
**D5**, this file must stay complete enough that a different developer could
rebuild the whole Firebase project from scratch without asking anyone.
Fill in each `TODO` **as you create the thing**, not from memory afterward.

---

## Project

| Field | Value |
|---|---|
| Project name | TODO |
| Project ID | TODO |
| Project number | TODO |
| Billing plan | Blaze (required — App Hosting, Cloud Functions, reCAPTCHA Enterprise do not run on Spark) |
| Owner account | TODO — the Google account that created the project; transfers per D5 at handover |
| Region (Firestore / Functions / App Hosting) | TODO — pick one region and use it everywhere; note it here |

## Budget alert

| Field | Value |
|---|---|
| Alert threshold | TODO (e.g. $25) |
| Notification channel | TODO (email address(es)) |
| Configured at | Google Cloud Console → Billing → Budgets & alerts, on the billing account linked to this project |

## App Hosting

| Field | Value |
|---|---|
| Backend name | TODO |
| Staging URL | `https://TODO.web.app` |
| Connected repo | `Humble-Coders/Infini`, branch TODO |
| Root config | `apphosting.yaml` (committed) |
| Build command | `npm run build` (default) |

**Staging must never be indexed.** Enforced two ways — both already in the
repo, neither needs console configuration:
- `next.config.ts`'s `headers()` sets `X-Robots-Tag: noindex` on every
  response unless `NEXT_PUBLIC_SITE_ENV=production` (resolved at build time,
  not per request — no Edge Middleware invocation cost).
- `app/robots.ts` serves a disallow-all `robots.txt` under the same condition.

`NEXT_PUBLIC_SITE_ENV` is set to `staging` for this backend (see Environment
variables below) and only ever flips to `production` on the T26 production
backend.

## Authorized domains (Firebase Auth)

| Domain | Why |
|---|---|
| `TODO.web.app` | staging App Hosting default domain |
| `localhost` | local dev |

Configured at Console → Authentication → Settings → Authorized domains.
Production domain (`infini.co.in`) is added in T26, not here.

## Environment variables

Names only — real values live in `.env` (local, gitignored) or App Hosting's
env/secret config (`apphosting.yaml` + `firebase apphosting:secrets:set`),
never in this repo. Full list and purpose of each key: `.env.example`.

| Variable | Where it lives | Secret? |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (6 keys) | `apphosting.yaml` env, `.env` locally | No — public web config by design |
| `NEXT_PUBLIC_SITE_ENV` | `apphosting.yaml` env | No |
| `FIREBASE_ADMIN_PROJECT_ID` / `_CLIENT_EMAIL` / `_PRIVATE_KEY` | `.env` locally only | Yes — not set on App Hosting; Admin SDK there uses Application Default Credentials instead |

Service account keys, if ever generated for local dev, are downloaded once
from Console → Project settings → Service accounts and never committed —
copy the three fields into your local `.env` and discard the JSON file.

## Firestore

- Rules: `backend/firestore.rules` (committed, deny-all — later tickets open
  specific paths as each collection lands).
- Indexes: `backend/firestore.indexes.json` (committed, empty until T5 needs
  composite indexes).
- Deploy rules with `firebase deploy --only firestore:rules`.

## Storage

- Rules: `backend/storage.rules` (committed — `media/` allows public read, Content
  Editor/Super Admin write, 10MB image / 20MB PDF limits enforced in the rules).
- Default bucket: `infini-2fdec.firebasestorage.app`.
- Deploy rules with `firebase deploy --only storage:rules`.
- **CORS (T8):** required for the browser-based upload SDK to work at all —
  without it, `uploadBytesResumable`'s cross-origin PUT fails preflight.
  Config: `backend/storage.cors.json`, applied via:
  ```bash
  gsutil cors set backend/storage.cors.json gs://infini-2fdec.firebasestorage.app
  ```
  Currently allows `localhost:3000`/`localhost:3100` (dev) and `infini.co.in`
  (production). GCS CORS `origin` entries must be exact strings — no
  wildcards — so **add the actual staging App Hosting domain to this file
  and re-run the command above once T4's backend exists** with a real URL.

## Deploying

```bash
firebase login
firebase use --add          # select the project, alias it "default"
firebase deploy --only firestore:rules,storage:rules
```

App Hosting deploys automatically on push to the connected branch once the
backend is created and linked in the Firebase console; no manual
`firebase deploy` step is needed for the Next.js app itself.

## Authentication (T6)

| Field | Value |
|---|---|
| Sign-in provider | Email/Password, enabled at Console → Authentication → Sign-in method |
| Public signup | None anywhere in the app — admin accounts are created only via the Super Admin's Users screen (`inviteAdminUser` Cloud Function) or the one-off bootstrap script below |
| Session mechanism | Firebase session cookie (httpOnly, 5-day expiry), minted by `app/api/auth/session/route.ts` from a verified ID token — not the raw ID token itself |
| Roles | `superAdmin` / `contentEditor` / `leadsManager`, stored as a Firebase Auth custom claim (`role`) and mirrored on `users/{uid}` for display. Set exclusively by the `setUserRole` / `inviteAdminUser` Cloud Functions (Super Admin only) |

**Bootstrapping the first Super Admin.** There's no console UI for setting a
custom claim, so the very first account is created by a one-off script rather
than the (not-yet-existent, chicken-and-egg) Users screen:

```bash
npm run bootstrap-super-admin -- <email>
```

Requires `FIREBASE_ADMIN_*` vars in `.env` (or `gcloud auth application-default login`
against this project). Prints a password-reset link once — send it to the
account owner directly, never commit or log it beyond that.

## Out of scope here

- Firestore collections/documents and typed accessors — T5.
- reCAPTCHA Enterprise key, SMTP app password, Cloud Functions config/secrets
  — T17 (these get their own entries in this file when that ticket lands).
- Production backend, custom domain, DNS — T26.
