import ContactPage, { metadata } from "../contact/page";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

// Same page as /contact, so the contact metadata (canonical /contact) is
// reused verbatim and this URL stays out of app/sitemap.ts.
export { metadata };
export default ContactPage;
