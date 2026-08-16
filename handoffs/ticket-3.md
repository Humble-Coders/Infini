**Ticket:** #3 — App shell — header, navigation, footer, persistent Request a Quote CTA

## Summary

Builds the header, responsive navigation (including the 7-item Industries dropdown and the Capabilities dropdown covering the four legacy MMP pages), a real mobile navigation pattern (not a shrunken desktop menu), and footer that wrap every public page. The Request a Quote CTA is a property of the shell — present and reachable on every viewport, including mobile, never buried inside the hamburger menu. The mobile menu is fully keyboard operable: opens, traps focus within itself, closes on Escape, and returns focus to its trigger button on close; background scroll locks while it's open. The phone number in the footer is a `tel:` link for tap-to-call.

Nav structure, footer legal links, and contact details are sourced from a single place (`settings` in Firestore, read once in `app/(public)/layout.tsx` and passed down as props to `Navbar`/`Footer`) rather than scattered through JSX — no nav label is hardcoded in a component.

## Files changed

- `app/layout.tsx` — root layout: default metadata (title template, description, Open Graph defaults), font wiring.
- `app/(public)/layout.tsx` — fetches `settings` once, renders `AnnouncementBar`/`Navbar`/`Footer` around every public page.
- `components/layout/Navbar.tsx` — responsive header, desktop dropdown (hover + keyboard + `aria-expanded`/`aria-haspopup`), mobile panel with focus trap, Escape-to-close, body-scroll lock while open, and an accordion-style expandable submenu for mobile. Request a Quote button rendered at both desktop and mobile widths, never inside the collapsed menu.
- `components/layout/Footer.tsx` — navigation, contact details (`tel:`/`mailto:` links derived from `settings.contact`), and legal-link slots (Privacy, Terms — wired, pages themselves are T22's scope).
- `components/layout/AnnouncementBar.tsx` — dismissible top bar.
- `app/(public)/page.tsx` — placeholder proving shell, tokens, and fonts render together (later fully built out by T9).

## How to test

```bash
npm run dev
```

- Resize to 375px, 768px, 1280px, 1920px and confirm header/nav/mobile menu/footer are correct at each.
- Confirm Request a Quote is visible and reachable at every width, including mobile — not hidden inside the burger menu.
- Open the mobile menu: confirm it traps focus (Tab cycles within it), closes on Escape, and returns focus to the trigger button.
- Confirm the Industries and Capabilities dropdowns work via keyboard (not hover alone) and on touch.
- Confirm background scroll is locked while the mobile menu is open.
- On a real mobile device, confirm the footer phone number opens the dialer.
- `curl -s http://localhost:3000/ | grep -i "<title>\|og:"` — default metadata present in raw HTML.

## Acceptance criteria

- [x] Header, nav, mobile menu and footer correct at 375/768/1280/1920px.
- [x] Request a Quote visible and reachable on every viewport, including mobile.
- [x] Mobile menu fully keyboard operable — opens, traps focus, closes on Escape, returns focus to trigger.
- [x] Industries/Capabilities dropdowns work by keyboard and touch, not hover alone.
- [x] Background scroll locked while the mobile menu is open.
- [x] Phone number is a `tel:` link.
- [x] Nav labels come from one source (`settings.nav`, fetched once and passed down) — no nav label hardcoded in a component.
- [x] Default metadata renders in the raw HTML.
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- Nav/footer content is sourced from Firestore (`settings`) rather than a local typed constant — since the data layer (T5) and public-content wiring were completed in the same broader effort as this shell, going straight to the Firestore-backed source avoided a throwaway intermediate step.
- Route links for pages that don't exist yet (Industries sub-pages before T10, Case Studies before T13, Certifications before T12, the four legacy Capabilities pages before T16) are wired anyway and will 404 until those land — expected per this ticket's scope.

## Open questions / follow-ups

- Final nav label wording is still open (flagged as PRD open item O4) — current labels are a reasonable placeholder set, not signed off.
- Privacy/Terms footer links point to routes that don't exist until T22.
