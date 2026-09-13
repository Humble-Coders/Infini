**Issue:** [#26](https://github.com/Humble-Coders/Infini/issues/26)
**Milestone:** M6 — Hardening & launch
**Blocked by:** T25, and client sign-off on staging
**⚠️ The irreversible one. Nothing here should be improvised on the day.**

## 📖 Story / Why

The cutover: `infini.co.in` stops serving the WordPress site and starts serving this one.

Everything else on this project can be fixed in a follow-up commit. This can't — a botched DNS change takes the client's website off the internet, and a missed redirect quietly destroys search ranking that took years to build. Treat launch day as an execution of a written plan, not a sequence of decisions.

## 🧭 Context

**Prerequisites that are genuinely blocking:**
- T25 complete, all critical and high defects fixed.
- **The client has reviewed staging and signed off.** The proposal describes a soft launch and review before go-live — do not cut over without explicit approval.
- DNS/registrar access for `infini.co.in` (open item **O5**).
- **The Firebase project transfer plan is agreed** (PRD decision D5). The project is developer-owned, so this is the moment it must move. `docs/INFRA.md` should make this reproducible — if it doesn't, fix that before launch day, not during it.

**Back up the existing WordPress site before touching anything.** Files and database. It costs an hour and it is the only thing standing between a bad cutover and a total loss.

**Lower DNS TTL 24–48 hours in advance.** If TTL is still at 24 hours when you cut over, a rollback takes a day to propagate. Lowering it first turns a potential day-long outage into minutes.

**Don't launch on a Friday**, and don't launch at 6pm. Launch when the whole team is available to watch and respond.

## 🔑 Access & prerequisites

- [ ] T25 complete; all critical/high defects fixed.
- [ ] **Written client sign-off on staging.**
- [ ] **DNS/registrar access (O5)** — confirmed working before launch day, not requested on it.
- [ ] Firebase project transfer plan agreed with the manager.
- [ ] Production GA4/GTM confirmed (O6).
- [ ] Production SMTP credentials and recipient list confirmed (O7).
- [ ] An agreed launch window with the team available.

## ✅ Scope / What to build

**Before**
- [ ] Full backup of the existing WordPress site — files and database. Verify the backup is restorable.
- [ ] Lower DNS TTL 24–48 hours ahead.
- [ ] Configure the production App Hosting backend.
- [ ] Production environment variables and secrets in place.
- [ ] Production Firestore rules and indexes deployed.
- [ ] Production `robots.txt` — allow crawling, unlike staging.
- [ ] Final content review with the client.
- [ ] Write `docs/LAUNCH-RUNBOOK.md`, **including the rollback procedure.**

**Cutover**
- [ ] Point `infini.co.in` at Firebase Hosting; configure the custom domain.
- [ ] Confirm SSL is provisioned and valid.
- [ ] Verify all 301s on the live domain.
- [ ] Verify analytics on production.
- [ ] Submit the sitemap to Search Console for the live domain.
- [ ] Test Request a Quote on production — a real submission, confirmed received.

**After**
- [ ] Enable scheduled Firestore backups (PRD §6).
- [ ] Monitor Search Console for crawl errors over the following days.
- [ ] Transfer the Firebase project per the agreed plan.
- [ ] Hand over `docs/INFRA.md`, admin credentials process, and a short training session for INFINI staff on the admin panel.

## 🎯 Acceptance Criteria

- [ ] `https://infini.co.in` serves the new site with valid SSL.
- [ ] **Every 301 from the T20 map verified on the live domain** with `curl -I`. Not on staging — on production.
- [ ] `www` and apex both resolve correctly to one canonical host.
- [ ] **A real Request a Quote submission on production writes a lead and delivers the email** to the confirmed recipients.
- [ ] Admin login works on production for all three roles.
- [ ] GA4 receives production traffic and the conversion event fires.
- [ ] Production `robots.txt` allows crawling and the sitemap is submitted.
- [ ] Scheduled Firestore backups are enabled and verified.
- [ ] The WordPress backup is stored somewhere retrievable and its restorability confirmed.
- [ ] Firebase project transferred per the agreed plan, with the client able to access it.
- [ ] `docs/LAUNCH-RUNBOOK.md` complete, including a rollback procedure that was written **before** launch.
- [ ] INFINI staff have been walked through the admin panel.
- [ ] No Search Console crawl errors in the first 48 hours beyond expected transition noise.

## 🚫 Out of scope

- Post-launch feature work. Ongoing SEO or content services.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §7 URL migration, §8 delivery plan, §10 decision **D5**, §9 open items **O5**, **O6**, **O7**.
- `docs/INFRA.md`, `docs/REDIRECTS.md` — created by earlier tickets.

## 🤖 Kickoff prompt

```
/start-ticket 26
```
