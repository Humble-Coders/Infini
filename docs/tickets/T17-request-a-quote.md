**Issue:** [#17](https://github.com/Humble-Coders/Infini/issues/17)
**Milestone:** M4 — Conversion
**Blocked by:** T3 (shell CTA), T5 (data layer)
**This is the commercial point of the entire website.**

## 📖 Story / Why

Everything else on this site exists to get someone to this form. If it breaks, the site generates nothing — and worse, it breaks silently: a failed submission looks the same as a quiet week.

Build it accordingly. Every other ticket can be imperfect and recoverable. This one loses revenue when it's wrong.

## 🧭 Context

**The submission sequence is fixed. Do not reorder it:**

1. Client-side validation
2. **Server-side** reCAPTCHA Enterprise verification
3. **Write the lead to Firestore**
4. Send the email notification
5. Return an explicit success state
6. Fire the GA4 conversion event via GTM

**Step 3 precedes step 4 deliberately** (PRD decision D4). Firestore is the system of record; email is a notification. Email is the least reliable link in the chain — SMTP via a Google App Password has send limits, weaker corporate deliverability, and app passwords break on Google policy changes. **A lead must never cease to exist because an email failed to send.**

Corollary: if the email fails, the submission still **succeeds** from the user's perspective, the failure is logged, and it's surfaced in the admin dashboard (T18). A silent SMTP outage that nobody notices for three weeks is the specific disaster this design prevents.

**reCAPTCHA verification is server-side.** A client-side-only check is decorative — it stops nothing.

**Form fields** are open item **O1**, and the notification recipient list is **O7**. Both need the client. Build against the PRD's minimum — contact name, company, email, phone, industry/service, requirement, message — and **confirm the final list in the ticket thread before building the form.** Adding a field later is cheap; discovering at go-live that INFINI needs part quantity is not.

**Secrets:** the SMTP app password and reCAPTCHA secret key live in Cloud Functions config / Secret Manager. Request them from the manager via secure channel. Never committed, never `NEXT_PUBLIC_`.

## 🔑 Access & prerequisites

- [ ] T3, T5 merged. Branch `feature/<issue#>-request-a-quote` off `main`.
- [ ] **Final field list confirmed** with the manager (O1).
- [ ] **Notification recipients confirmed** (O7).
- [ ] reCAPTCHA Enterprise site key and secret key — create the key, record the site key in `docs/INFRA.md`, keep the secret in Secret Manager.
- [ ] SMTP credentials — from the manager via secure channel.

## ✅ Scope / What to build

- [ ] `/request-a-quote` page with the full form.
- [ ] Compact enquiry form on `/contact`.
- [ ] Industry pre-selection when arriving from an industry page.
- [ ] Client-side validation with inline, accessible error messages.
- [ ] Cloud Function implementing the fixed sequence above.
- [ ] reCAPTCHA Enterprise, verified server-side, kept as frictionless as possible.
- [ ] Email notification via SMTP (Nodemailer) with a readable template.
- [ ] `sourcePage` captured on the lead so INFINI knows what the enquiry came from.
- [ ] Explicit success state; specific, recoverable error states.
- [ ] GA4 conversion event via GTM on successful submission.
- [ ] Log email failures in a way T18 can surface.

## 🎯 Acceptance Criteria

- [ ] A valid submission writes a complete lead to Firestore and delivers the email.
- [ ] **With SMTP deliberately broken, the lead is still written and the user still sees success.** Test this explicitly — it is the single most important behaviour in the ticket.
- [ ] The email failure is logged and retrievable for T18.
- [ ] A submission with an invalid or absent reCAPTCHA token is **rejected server-side**. Verify by calling the function directly, bypassing the browser.
- [ ] The browser cannot write to `leads` directly — confirm the rules deny it.
- [ ] Validation errors are inline, specific, and announced to screen readers.
- [ ] Correct input types and mobile keyboards: `email`, `tel`, appropriate `inputmode` and `autocomplete`.
- [ ] The focused field stays visible when the mobile keyboard opens.
- [ ] Double-submission is prevented.
- [ ] GA4 receives the conversion event — verify in GA4 DebugView, not just that the code runs.
- [ ] No secret appears in the client bundle. Search the built output for the app password and reCAPTCHA secret.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- The leads dashboard — T18. Full GA4/GTM setup — T21 (this ticket fires the event; T21 configures the container).

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.10 Request a Quote, §10 decision **D4**, §9 open items **O1**, **O7**.
- [`CLAUDE.md`](../../CLAUDE.md) — secrets and the fixed submission order.

## 🤖 Kickoff prompt

```
/start-ticket 17
```
