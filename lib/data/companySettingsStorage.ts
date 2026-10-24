import fs from "fs";
import path from "path";
import type { CompanySettings } from "@/components/modules/CompanySettingsManager";
export type { CompanySettings };
import type { SettingsDoc } from "@/lib/types";

export const DEFAULT_SETTINGS: CompanySettings = {
  primaryEmail: "superfinish@infini.co.in",
  technicalPhone: "+91 (1792) 234459",
  dispatchPhone: "+91 1792 233216",
  plantAddress: "Treatment & validation labs, 1 Taksal Road, Parwanoo, Himachal Pradesh 173220, India",
  googleMapsUrl: "https://maps.google.com/maps?q=1%20Taksal%20Road%2C%20Parwanoo%2C%20Himachal%20Pradesh%20173220&z=14&output=embed",
  linkedin: "https://www.linkedin.com/in/infini-precision-private-limited-73b19921b/",
  twitter: "https://x.com/preision",
  instagram: "https://www.instagram.com/infiniprecisionpvt.ltd/?hl=en",
  youtube: "https://youtu.be/YKcmtDuxXks?si=btPyU3ZyS3xiqF5D",
  facebook: "https://www.facebook.com/profile.php?id=100064548354724",
  metaTitle: "INFINI | Precision Surface Finishing & MMP Technology",
  metaDescription: "Super precision surface finishing and micro-edge honing for aerospace, medical implants, cutting tools, and critical dies.",
  cookieBannerEnabled: true,
  logoUrl: "/brand/infini-finish-unlimited.png",
  brochureUrl: "/docs/infini-precision-capability-brochure.pdf",
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "settings.json");

function readFallbackFile(): CompanySettings | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(raw) as CompanySettings;
    }
  } catch (err) {
    console.warn("[companySettingsStorage] Failed to read fallback file:", err);
  }
  return null;
}

function writeFallbackFile(data: CompanySettings) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[companySettingsStorage] Failed to write fallback file:", err);
  }
}

/**
 * Retrieve current company settings.
 * In production: Reads from Google Cloud Firestore settings/global doc.
 * In development: Uses local persisted file fallback, falling back to Firestore.
 */
export async function getStoredCompanySettings(): Promise<CompanySettings> {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const docSnap = await adminDb.collection("settings").doc("global").get();
      if (docSnap.exists) {
        const data = docSnap.data() || {};
        return {
          ...DEFAULT_SETTINGS,
          primaryEmail: data.contact?.email || DEFAULT_SETTINGS.primaryEmail,
          technicalPhone: data.contact?.technicalPhone || DEFAULT_SETTINGS.technicalPhone,
          dispatchPhone: data.contact?.dispatchPhone || data.contact?.phone || DEFAULT_SETTINGS.dispatchPhone,
          plantAddress: data.contact?.address || DEFAULT_SETTINGS.plantAddress,
          googleMapsUrl: data.contact?.googleMapsUrl || DEFAULT_SETTINGS.googleMapsUrl,
          linkedin: data.social?.linkedin || DEFAULT_SETTINGS.linkedin,
          twitter: data.social?.twitter || data.social?.x || DEFAULT_SETTINGS.twitter,
          instagram: data.social?.instagram || DEFAULT_SETTINGS.instagram,
          youtube: data.social?.youtube || DEFAULT_SETTINGS.youtube,
          facebook: data.social?.facebook || DEFAULT_SETTINGS.facebook,
          metaTitle: data.defaultSeo?.title || DEFAULT_SETTINGS.metaTitle,
          metaDescription: data.defaultSeo?.description || DEFAULT_SETTINGS.metaDescription,
          cookieBannerEnabled: data.cookieBanner?.enabled ?? DEFAULT_SETTINGS.cookieBannerEnabled,
          logoUrl: data.branding?.logoUrl || DEFAULT_SETTINGS.logoUrl,
          brochureUrl: data.branding?.brochureUrl || DEFAULT_SETTINGS.brochureUrl,
        };
      }
    } catch (err) {
      console.warn("[companySettingsStorage] Production Firestore read fallback:", err);
    }
  }

  // Local development file check
  const fileData = readFallbackFile();
  if (fileData) {
    return {
      ...DEFAULT_SETTINGS,
      ...fileData,
    };
  }

  if (!isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const docSnap = await adminDb.collection("settings").doc("global").get();
      if (docSnap.exists) {
        const data = docSnap.data() || {};
        const merged: CompanySettings = {
          ...DEFAULT_SETTINGS,
          primaryEmail: data.contact?.email || DEFAULT_SETTINGS.primaryEmail,
          technicalPhone: data.contact?.technicalPhone || DEFAULT_SETTINGS.technicalPhone,
          dispatchPhone: data.contact?.dispatchPhone || data.contact?.phone || DEFAULT_SETTINGS.dispatchPhone,
          plantAddress: data.contact?.address || DEFAULT_SETTINGS.plantAddress,
          googleMapsUrl: data.contact?.googleMapsUrl || DEFAULT_SETTINGS.googleMapsUrl,
          linkedin: data.social?.linkedin || DEFAULT_SETTINGS.linkedin,
          twitter: data.social?.twitter || data.social?.x || DEFAULT_SETTINGS.twitter,
          instagram: data.social?.instagram || DEFAULT_SETTINGS.instagram,
          youtube: data.social?.youtube || DEFAULT_SETTINGS.youtube,
          facebook: data.social?.facebook || DEFAULT_SETTINGS.facebook,
          metaTitle: data.defaultSeo?.title || DEFAULT_SETTINGS.metaTitle,
          metaDescription: data.defaultSeo?.description || DEFAULT_SETTINGS.metaDescription,
          cookieBannerEnabled: data.cookieBanner?.enabled ?? DEFAULT_SETTINGS.cookieBannerEnabled,
          logoUrl: data.branding?.logoUrl || DEFAULT_SETTINGS.logoUrl,
          brochureUrl: data.branding?.brochureUrl || DEFAULT_SETTINGS.brochureUrl,
        };
        writeFallbackFile(merged);
        return merged;
      }
    } catch {
      // offline dev
    }
  }

  // Seed default settings file
  writeFallbackFile(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

/**
 * Retrieve SettingsDoc for public consumer components (SiteShell, Footer, ContactPanel).
 */
export async function getStoredSettingsDoc(): Promise<SettingsDoc> {
  const s = await getStoredCompanySettings();

  return {
    contact: {
      email: s.primaryEmail,
      phone: s.dispatchPhone || s.technicalPhone,
      technicalPhone: s.technicalPhone,
      dispatchPhone: s.dispatchPhone,
      address: s.plantAddress,
      googleMapsUrl: s.googleMapsUrl,
    },
    social: {
      linkedin: s.linkedin,
      x: s.twitter,
      instagram: s.instagram,
      youtube: s.youtube,
      facebook: s.facebook,
      maps: s.googleMapsUrl,
    },
    nav: [],
    footerLegalLinks: [],
    defaultSeo: {
      title: s.metaTitle,
      description: s.metaDescription,
      ogTitle: s.metaTitle,
      ogDescription: s.metaDescription,
      ogImage: s.logoUrl || "",
      canonical: "",
      noindex: false,
    },
    cookieBanner: {
      enabled: s.cookieBannerEnabled,
      message: "We use cookies to analyze site traffic and optimize your user experience.",
      policyUrl: "/privacy-policy",
    },
  };
}

/**
 * Save company settings.
 * Persists locally and synchronizes to Firestore if cloud credentials are present.
 */
export async function saveStoredCompanySettings(payload: Partial<CompanySettings>): Promise<CompanySettings> {
  const current = await getStoredCompanySettings();
  const merged: CompanySettings = {
    ...current,
    ...payload,
  };

  writeFallbackFile(merged);

  // Attempt Firestore write
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const firestoreData = {
      contact: {
        email: merged.primaryEmail,
        phone: merged.dispatchPhone,
        technicalPhone: merged.technicalPhone,
        address: merged.plantAddress,
        googleMapsUrl: merged.googleMapsUrl,
      },
      social: {
        linkedin: merged.linkedin,
        twitter: merged.twitter,
        x: merged.twitter,
        instagram: merged.instagram,
        youtube: merged.youtube,
        facebook: merged.facebook,
      },
      defaultSeo: {
        title: merged.metaTitle,
        description: merged.metaDescription,
        ogTitle: merged.metaTitle,
        ogDescription: merged.metaDescription,
      },
      cookieBanner: {
        enabled: merged.cookieBannerEnabled,
      },
      branding: {
        logoUrl: merged.logoUrl || "",
        brochureUrl: merged.brochureUrl || "",
      },
    };
    await adminDb.collection("settings").doc("global").set(firestoreData, { merge: true });
  } catch (err) {
    console.warn("[companySettingsStorage] Firestore Admin write skipped/failed:", err);
  }

  return merged;
}
