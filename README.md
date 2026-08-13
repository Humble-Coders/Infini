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
