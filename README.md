# INFINI

Corporate website + admin panel for **INFINI**, a precision surface-finishing company. Next.js (App Router) + TypeScript + Tailwind CSS, on Firebase.

See [`CLAUDE.md`](./CLAUDE.md) for architecture rules and [`docs/PRD.md`](./docs/PRD.md) for the full product spec.

## Getting started

**Requirements:** Node 20+.

```bash
git clone git@github.com:Humble-Coders/Infini.git
cd Infini
npm install
```

Copy the environment template and fill in your Firebase web app config (Console → Project settings → Your apps):

```bash
cp .env.example .env
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For Admin SDK access locally (`backend/firebase/admin.ts`), also set
`FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL` and
`FIREBASE_ADMIN_PRIVATE_KEY` in `.env` from a service account key — see the
comments in `.env.example`. Not needed to run the public site.

## Local preview without project credentials

The public pages read from Firestore, so with an empty `.env` the home page
throws. To work on the site with the real launch content and no access to the
Firebase project, run the Firestore emulator and seed it (needs Java and the
Firebase CLI):

```bash
firebase emulators:start --only firestore --project infini-2fdec
```

In a second terminal, seed it with the shared content from `backend/scripts/content.ts`:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 GCLOUD_PROJECT=infini-2fdec npx tsx backend/scripts/seed.ts
```

Then point the web SDK at the emulator in `.env` (any non-empty API key works,
nothing reaches Google) and start `npm run dev`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=local-emulator
NEXT_PUBLIC_FIREBASE_PROJECT_ID=infini-2fdec
NEXT_PUBLIC_FIREBASE_APP_ID=local
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
```

`NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST` is only honoured when `NODE_ENV=development`
(`lib/firebase/client.ts`), so it can never leak into a build.

## Client colour review (temporary)

The home page exists in two colourways for the client to compare: the brand
red build at `/` and an MMP-blue variant at `/blue`. Both render the identical
page through `components/layout/SiteShell.tsx`; the blue one only adds
`data-theme="mmp-blue"`, which `app/globals.css` keys its token overrides on.
A fixed "Colour" pill (`components/preview/ColourSwitcher.tsx`) flips between
them. Once a colour is chosen, delete `app/(blue)`, the switcher, and the
`[data-theme="mmp-blue"]` block (or promote its values into `@theme`).

## Firebase project

Rules and config are committed as code (`firebase.json`, `backend/firestore.rules`,
`backend/storage.rules`, `backend/firestore.indexes.json`, `apphosting.yaml`). Console-only
settings (project ID, budget alert, authorized domains, App Hosting backend)
are logged in [`docs/INFRA.md`](./docs/INFRA.md) — that file is the source of
truth for anything clicked rather than committed.

Deploy Firestore/Storage rules:

```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules,storage:rules
```

The Next.js app itself deploys automatically to the staging `*.web.app` URL
on push, once the App Hosting backend is created and linked (see
`docs/INFRA.md`). Staging always serves `X-Robots-Tag: noindex` and a
disallow-all `robots.txt` (`next.config.ts` headers, `app/robots.ts`) until
`NEXT_PUBLIC_SITE_ENV=production` is set on the production backend (T26).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (also type-checks and lints) |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Project structure

```
app/            # App Router routes — public site + /admin
components/ui/  # Radix primitives — presentational only
lib/            # Browser-safe Firebase client, typed Firestore data accessors, shared types
backend/        # Server-only: Admin SDK, Firestore/Storage rules, Cloud Functions
```

Full target layout and the rules behind it live in [`CLAUDE.md`](./CLAUDE.md).
