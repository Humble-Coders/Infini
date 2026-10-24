# Operations runbook

How the INFINI website and admin dashboard run in production, and what to do when something breaks. Keep this current; it is the first thing to open during an incident.

## Shape of the system

| Piece | Repo | Hosting | Talks to |
|---|---|---|---|
| Public website | `Humble-Coders/Infini` | Vercel (or Firebase App Hosting) | Firestore (read, rules-bound), Storage (contact attachments), SMTP |
| Admin dashboard | `i-shubham24/Infini-Dashboard` (cloned into `admin/` locally) | Separate Vercel project | Firestore + Auth + Storage via Admin SDK; website `/api/revalidate` |
| Data | Firebase project `infini-f4388` | Google Cloud | — |

- **Content flow:** an admin saves → the dashboard writes Firestore → it calls the website's signed `/api/revalidate` → pages rebuild on their next request. If that call fails, pages still refresh within 10 minutes (ISR), and the editor sees a warning.
- **Enquiries:** contact form → validate → spam checks → store attachment → **write the lead** → email the team → record email status on the lead. A lead never depends on email delivery. Failed emails show in the dashboard.

## One-time setup checklist

The dashboard's home page shows a **Setup needed** panel until these are done.

1. **Firebase Authentication:** console → Build → Authentication → Get started → Email/Password. This lets team members (not just the owner) sign in.
2. **Firebase Storage:** console → Build → Storage → Get started. Then deploy the rules: `npx firebase deploy --only storage --project infini-f4388`.
3. **Firestore rules:** `npx firebase deploy --only firestore:rules --project infini-f4388`. Rules live in `backend/firestore.rules` and must be redeployed whenever they change.
4. **TTL for rate-limit counters:** console → Firestore → TTL policies → collection `rateLimits`, field `expiresAt`.
5. **Environment variables.** Templates: `.env.example` in each repo.
   - **Both deployments:** `REVALIDATE_SECRET`, the same 32+ random characters in each.
   - **Dashboard:** owner account via `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (from `npm run hash-password`) and `ADMIN_SESSION_SECRET`.
   - **Website:** `SMTP_*` and `LEAD_NOTIFY_TO` for enquiry emails, and `ADMIN_DASHBOARD_URL`.
6. **Owner two-factor sign-in:** sign in → Security → Set up, then add the shown `ADMIN_TOTP_SECRET` to the dashboard deployment.
7. **Rotate the old admin password.** The previous code shipped a hardcoded fallback password, and it is visible in the public dashboard repo's history. Treat it as public: never reuse it on a live deployment.
8. **Uptime monitoring:** point a monitor (UptimeRobot, Better Stack, Vercel Checks) at `https://<site>/api/health?deep=1` and `https://<dashboard>/api/health?deep=1`. Both return 503 when Firestore is unreachable.
9. **Backups:** enable Firestore scheduled backups (Blaze plan), daily with 14-day retention:
   `gcloud firestore backups schedules create --database='(default)' --recurrence=daily --retention=14d --project=infini-f4388`

## Secrets

- Never commit secrets: `.env*`, `serviceAccountKey.json` and `*firebase-adminsdk*.json` are all gitignored.
- `NEXT_PUBLIC_*` values ship to browsers. Only the Firebase web config and the site URL may use that prefix.
- **Rotation**
  - **Owner password:** generate a new hash with `npm run hash-password`, replace `ADMIN_PASSWORD_HASH`, redeploy.
  - **`ADMIN_SESSION_SECRET`:** rotating it signs the owner out everywhere.
  - **`REVALIDATE_SECRET`:** change it on both deployments together.
  - **Service-account keys:** rotate in the Google Cloud console under IAM → Service accounts.

## Service levels

| Objective | Target | Measured by |
|---|---|---|
| Website availability | 99.9% monthly (about 43 minutes of downtime) | uptime monitor on `/api/health?deep=1` |
| Enquiry durability | 100% of valid submissions stored | leads in Firestore vs. form submissions in logs |
| Enquiry email delivery | 99% within 1 minute | `notification.status` on leads; failures show on the dashboard |
| Admin save visible on site | p95 under 30 s | revalidate call result (editor warning on failure) |

If the monthly downtime budget runs out, freeze feature work and spend the time on reliability.

## Incidents

1. **Acknowledge.** One person owns the incident and posts in the team channel.
2. **Triage**, depending on the symptom:
   - **Site down:** check the hosting status page, then `/api/health?deep=1`.
   - **Admin changes not showing:** check `REVALIDATE_SECRET` matches on both deployments. The dashboard says "couldn't refresh" when it doesn't.
   - **No enquiry emails:** the leads are safe in the dashboard. Check the `SMTP_*` values, e.g. a Google App Password that was revoked.
   - **Can't sign in:** use the owner account. If two-factor is lost, remove `ADMIN_TOTP_SECRET`, redeploy, and set it up again.
3. **Mitigate first**, root cause later. On Vercel: Deployments → previous good deployment → Promote (instant rollback).
4. **Postmortem within 3 working days**, blameless, saved to `docs/postmortems/YYYY-MM-DD-title.md`. Cover:
   - what happened, with a timeline
   - impact (users, enquiries, duration)
   - root cause
   - what went well and what didn't
   - action items, each with an owner and a date

## Deployments

- **Previews:** every pull request gets a Vercel preview URL. Review on the preview, never on production.
- **Merging:** merge to `main` only after CI is green (typecheck, lint, dependency audit, build).
- **Rollback:** Vercel instant rollback (promote the previous deployment). Firestore content is not rolled back by a deploy; restore from a backup if data itself is wrong.
- **Rules:** rule changes deploy separately with `firebase deploy --only firestore:rules,storage`. Deploy rules **before** the code that depends on them.

## Not applicable here (on purpose)

This is a small, two-app Next.js + Firebase deployment on managed hosting, so these are handled by the platform or not needed:
- **Containers and infrastructure tooling:** Docker, Kubernetes, Helm, Terraform.
- **Distributed-systems machinery:** service discovery, load balancers, message queues, sagas, leader election, sharding, read replicas.
- **Networking choices:** HTTP/2 and HTTP/3 come from the CDN. WAF and DDoS protection are covered by Vercel's edge firewall (enable Attack Challenge Mode during an attack). TLS and encryption at rest come from Google Cloud and Vercel by default.

Revisit only if traffic or the team grows by an order of magnitude.
