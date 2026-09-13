**Issue:** [#23](https://github.com/Humble-Coders/Infini/issues/23)
**Milestone:** M6 — Hardening & launch
**Blocked by:** all M4 and M5 tickets

## 📖 Story / Why

The current site has a **poor security rating**, and improving it is an explicit, contracted requirement. This ticket is the audit pass that confirms the protections built along the way actually hold — with the whole system assembled, which is the only state in which some of these failures are visible.

Approach it adversarially. The question isn't "did we add security headers", it's "what can an unauthenticated stranger reach right now".

## 🧭 Context

Everything here should already be partly in place from earlier tickets. This is verification and gap-closing, not a first attempt.

**The audit surface:**
- **Security headers** — HSTS, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, and a real CSP.
- **Firestore rules** — every collection, every role, both directions.
- **Storage rules** — including content-type and size enforcement.
- **Admin route protection** — by direct URL, not by clicking.
- **Leads protection** — the most sensitive data on the site.
- **Input validation** — server-side, everywhere, not only client-side.
- **Secrets** — nothing in the client bundle, nothing in git history.

**CSP is where this ticket usually stalls.** GTM, GA4 and reCAPTCHA all inject scripts, and a strict CSP will break them. Getting a policy that's genuinely restrictive *and* doesn't break analytics takes iteration — budget for it, and don't resolve it by weakening the policy to `unsafe-inline` and moving on.

**Test the rules with the emulator and the Rules Playground, not through the UI.** The UI tests the UI. An attacker uses the SDK directly, and so should you.

## 🔑 Access & prerequisites

- [ ] All M4 and M5 tickets merged. Branch `feature/<issue#>-security-hardening` off `main`.
- [ ] Test accounts for all three roles, plus an unauthenticated session.

## ✅ Scope / What to build

- [ ] Configure all security headers on App Hosting; get an A rating on securityheaders.com.
- [ ] A CSP that is genuinely restrictive and doesn't break GTM, GA4 or reCAPTCHA.
- [ ] Full Firestore rules audit against the role matrix — every collection, every role.
- [ ] Full Storage rules audit including type and size limits.
- [ ] Verify every `/admin` route rejects unauthenticated and wrongly-roled access by **direct URL**.
- [ ] Confirm `leads` is unreadable and unwritable by every client identity.
- [ ] Server-side validation on every input path, including the Cloud Functions.
- [ ] Scan the client bundle and full git history for secrets.
- [ ] Rate limiting on the enquiry endpoint beyond reCAPTCHA.
- [ ] Confirm no customer data is logged or included in error reporting.
- [ ] Document findings and fixes in `docs/SECURITY.md`.

## 🎯 Acceptance Criteria

- [ ] **securityheaders.com rates the production configuration A or better.**
- [ ] CSP is active with no `unsafe-inline` in script-src, and analytics and reCAPTCHA still work.
- [ ] Every role/collection combination in the matrix is tested in the Rules Playground and behaves correctly.
- [ ] **A Content Editor cannot read a single lead by any route**, including direct SDK access.
- [ ] Unauthenticated direct requests to every `/admin` route are rejected.
- [ ] Unpublished content is unreachable by an unauthenticated client via direct SDK query.
- [ ] `git log -p` contains no secret at any point in history — check history, not just the current tree.
- [ ] No secret appears in the built client bundle.
- [ ] The enquiry endpoint is rate limited; verify by submitting rapidly.
- [ ] `docs/SECURITY.md` records what was tested, what was found, and what was fixed.

## 🚫 Out of scope

- Third-party penetration testing. Performance — T24.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §4.4 security model, §6 non-functional requirements.
- [`CLAUDE.md`](../../CLAUDE.md) — secrets rules.

## 🤖 Kickoff prompt

```
/start-ticket 23
```
