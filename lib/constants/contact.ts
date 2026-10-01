import type { SettingsContact } from "@/lib/types";

/**
 * INFINI's real contact details for the Parwanoo facility, as published on the
 * legacy site and the MMP brochure. Used directly while the live `settings`
 * document still holds placeholders and the admin editor is not yet built.
 * Once `settings.contact` carries these values, switch the consumers back to
 * `settings?.contact` so the CMS wins again.
 */
export const INFINI_CONTACT: SettingsContact = {
  phone: "+91 (1792) 234459",
  email: "superfinish@infini.co.in",
  address: "Treatment & validation labs, Parwanoo, Himachal Pradesh, India",
};
