import { cache } from "react";
import { cache } from "react";
import { doc, getDoc } from "firebase/firestore";
import { requireDb } from "./firestore";
import { getStoredSettingsDoc } from "./companySettingsStorage";
import { INFINI_CONTACT } from "@/lib/constants/contact";
import type { SettingsContact, SettingsDoc } from "@/lib/types";

const COLLECTION = "settings";
const GLOBAL_DOC_ID = "global";

const DEFAULT_SEO: SettingsDoc["defaultSeo"] = {
  title: "INFINI | Precision Surface-Finishing",
  description:
    "INFINI is a precision surface-finishing partner to manufacturers, applying ISO 9001-certified MMP treatment.",
  ogTitle: "INFINI | Precision Surface-Finishing",
  ogDescription:
    "INFINI is a precision surface-finishing partner to manufacturers, applying ISO 9001-certified MMP treatment.",
  ogImage: "",
  canonical: "",
  noindex: false,
};

/** Seeded placeholder values ("+91 XX XXXX XXXX") are treated as unset, so they never reach the public site. */
function isReal(value: string | undefined): value is string {
  return Boolean(value && value.trim() && !/X{2,}[\s-]+X{2,}/.test(value));
}

/**
 * Admin-saved contact details win field by field; anything still empty or a
 * seeded placeholder falls back to the real published details in
 * lib/constants/contact.ts.
 */
function resolveContact(stored: Partial<SettingsContact> | undefined): SettingsContact {
  return {
    phone: isReal(stored?.phone) ? stored.phone : INFINI_CONTACT.phone,
    email: isReal(stored?.email) ? stored.email : INFINI_CONTACT.email,
    address: isReal(stored?.address) ? stored.address : INFINI_CONTACT.address,
    secondaryPhone: isReal(stored?.secondaryPhone) ? stored.secondaryPhone : undefined,
    googleMapsUrl: isReal(stored?.googleMapsUrl) ? stored.googleMapsUrl : undefined,
  };
}

/** Global site settings, contact info, social links, nav, default SEO, cookie banner copy. Never throws. */
async function getSettingsUncached(): Promise<SettingsDoc> {
  try {
    return await getStoredSettingsDoc();
  } catch (err) {
    console.error("[getSettingsUncached] error:", err);
  }

  let data: Partial<SettingsDoc> = {};
  try {
    const snap = await getDoc(doc(requireDb(), COLLECTION, GLOBAL_DOC_ID));
    if (snap.exists()) data = snap.data() as Partial<SettingsDoc>;
  } catch (error) {
    console.warn("[settings] Firestore issue:", (error as Error)?.message || error);
  }

  return {
    contact: resolveContact(data.contact),
    social: data.social ?? { linkedin: "", instagram: "", youtube: "" },
    nav: data.nav ?? [],
    footerLegalLinks: data.footerLegalLinks ?? [],
    // Field by field, so a blank admin field falls back instead of blanking the default.
    defaultSeo: Object.fromEntries(
      Object.entries(DEFAULT_SEO).map(([key, fallback]) => {
        const value = (data.defaultSeo as Record<string, unknown> | undefined)?.[key];
        return [key, value === "" || value === undefined || value === null ? fallback : value];
      })
    ) as SettingsDoc["defaultSeo"],
    cookieBanner: data.cookieBanner ?? { enabled: false, message: "", policyUrl: "" },
    branding: data.branding ?? {},
  };
}
}

/*
 * Reads are memoised per request with React's `cache()`.
 *
 * A page and its `generateMetadata` run in the same pass and routinely ask for
 * the same document, so an uncached accessor cost two identical round trips on
 * every request. `cache()` collapses those to one.
 */
export const getSettings = cache(getSettingsUncached);
