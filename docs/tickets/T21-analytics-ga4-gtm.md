**Issue:** [#21](https://github.com/Humble-Coders/Infini/issues/21)
**Milestone:** M5 — SEO, analytics & legal
**Blocked by:** T17 (RFQ fires the event), T22 (consent gates the tags)

## 📖 Story / Why

Without analytics the client can't tell whether the new site works. The one number that matters is **Request a Quote submissions** — that's the metric the whole revamp is judged on.

GTM goes in as well as GA4 so INFINI can add future tracking without a developer, which is the same principle as the CMS.

## 🧭 Context

**Scope:** GA4 configured, GTM container installed, and at minimum the **Request a Quote interaction and submission** tracked as conversion events.

**Consent ordering matters.** T22 builds cookie consent, and this ticket must respect it: **analytics tags do not fire before consent is given.** Wiring GA4 to load unconditionally and adding consent afterwards produces a site that tracks users who declined — which defeats the point of the banner and is a real compliance problem. Use GTM's consent mode and treat "denied" as the default state until the user chooses.

**Account ownership is open item O6.** GA4 and GTM should ideally be created under an account **INFINI owns**, with us granted access — otherwise their analytics history is stranded in someone else's account at handover, which is the same trap as the Firebase project. **Confirm with the manager before creating anything.**

Track the funnel, not just the endpoint: CTA clicks, form starts, and submissions. Knowing that 200 people clicked and 4 submitted is far more actionable than knowing there were 4 leads.

## 🔑 Access & prerequisites

- [ ] T17 merged; T22 merged or in progress.
- [ ] Branch `feature/<issue#>-analytics` off `main`.
- [ ] **GA4 property and GTM container** — ownership confirmed with the manager first (O6).
- [ ] Measurement ID and GTM container ID recorded in `docs/INFRA.md`.

## ✅ Scope / What to build

- [ ] GTM container installed site-wide, correctly for the App Router.
- [ ] GA4 configured through GTM, not hardcoded separately.
- [ ] **Consent mode** — no analytics tag fires before consent.
- [ ] Events: `request_quote_click` (CTA), `request_quote_start` (form engaged), `request_quote_submit` (success).
- [ ] Mark submission as a conversion in GA4.
- [ ] Useful supporting events: certificate downloads, phone tap-to-call, industry page views.
- [ ] Exclude `/admin` traffic.
- [ ] Verify no analytics runs on staging, or that it's clearly separated from production data.
- [ ] Document the event schema in `docs/ANALYTICS.md` so future tracking stays consistent.

## 🎯 Acceptance Criteria

- [ ] **With consent declined, no GA4 or GTM network request fires.** Verify in the Network tab — this is the check that matters most in this ticket.
- [ ] With consent granted, pageviews and events reach GA4 — confirm in **DebugView**, not by assuming the code ran.
- [ ] All three request-quote events fire at the right moments.
- [ ] Submission is registered as a conversion in GA4.
- [ ] `/admin` traffic is excluded.
- [ ] Staging traffic does not pollute production analytics.
- [ ] GA4 and GTM ownership matches what was agreed with the manager.
- [ ] IDs recorded in `docs/INFRA.md`; event schema in `docs/ANALYTICS.md`.

## 🚫 Out of scope

- The consent banner UI — T22. Third-party marketing pixels unless the client asks.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §6 analytics, §9 open item **O6**.

## 🤖 Kickoff prompt

```
/start-ticket 21
```
