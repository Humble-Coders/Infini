**Issue:** [#18](https://github.com/Humble-Coders/Infini/issues/18)
**Milestone:** M4 — Conversion
**Blocked by:** T17 (RFQ pipeline), T7 (admin shell)

## 📖 Story / Why

Leads arrive by email today, which means they live in someone's inbox, get missed, and have no status. The dashboard makes every enquiry visible in one place with a state attached, so nothing quietly goes cold.

It also carries a safety function: **surfacing email delivery failures.** T17 is built so a lead survives an SMTP outage — but that only helps if someone finds out. This is where they find out.

## 🧭 Context

**Lead fields** (PRD §4.3): name · company · email · phone · enquiryType · industryId · message · sourcePage · status · createdAt · notes.

**Access is restricted to Super Admin and Leads Manager.** A Content Editor must not be able to read leads — this is customer contact data, and the restriction is enforced in the Firestore rules from T5/T6, not by hiding the nav item.

**Leads are never bulk-deleted.** They're commercial records. Deletion, if offered at all, is Super Admin only and individual. Treat this as data you're custodian of, not content.

**The email-failure view is the part that's easy to skip and shouldn't be.** If T17 logged a send failure, this dashboard shows it prominently — an enquiry that was captured but never reached anyone at INFINI needs to be obvious the same day, not discovered at the next review.

## 🔑 Access & prerequisites

- [ ] T17, T7 merged. Branch `feature/<issue#>-leads-dashboard` off `main`.
- [ ] Test leads in the development environment — **never real customer data in a dev environment.**

## ✅ Scope / What to build

- [ ] `/admin/leads` list: newest first, with search and filtering by status, date and industry.
- [ ] Lead detail view showing every captured field including `sourcePage`.
- [ ] Status workflow — new / contacted / quoted / closed, or whatever the manager confirms.
- [ ] Internal notes on a lead, with author and timestamp.
- [ ] **Prominent indicator for leads whose notification email failed to send**, with a way to retry.
- [ ] Dashboard summary: recent leads and counts by status.
- [ ] CSV export for the client's own reporting.
- [ ] Empty state for a genuinely empty pipeline.
- [ ] `mailto:` and `tel:` links so staff can act on a lead directly.

## 🎯 Acceptance Criteria

- [ ] All leads are listed newest-first, and search and filters work.
- [ ] **A Content Editor cannot reach `/admin/leads`**, and the underlying Firestore read fails at the rules layer when attempted directly.
- [ ] A lead with a failed notification email is **visibly flagged**, and retry works.
- [ ] Status changes and notes persist, with author and timestamp recorded.
- [ ] No bulk delete exists. Any individual delete is Super Admin only and confirmed.
- [ ] CSV export contains every field and opens correctly in Excel — check encoding on names with non-ASCII characters.
- [ ] Usable on tablet.
- [ ] No customer data is logged to the console or included in error reporting.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- CRM integration. Automated follow-up email. Lead scoring.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.10 leads, §4.3 data model, §4.4 security.

## 🤖 Kickoff prompt

```
/start-ticket 18
```
