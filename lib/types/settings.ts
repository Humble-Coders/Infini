import type { SeoMap } from "./seo";

export interface SettingsContact {
  /** The tap-to-call number shown across the site. */
  phone: string;
  email: string;
  address: string;
  phone: string;
  email: string;
  address: string;
  technicalPhone?: string;
  dispatchPhone?: string;
  secondaryPhone?: string;
  googleMapsUrl?: string;
  googleMapsUrl?: string;
}

export interface SettingsSocial {
  linkedin: string;
  instagram: string;
  youtube: string;
  facebook?: string;
  x?: string;
  whatsapp?: string;
  maps?: string;
}

export interface NavLink {
  label: string;
  href: string;
  /** Dropdown sub-items (desktop) / expandable section (mobile), e.g. Capabilities' legacy MMP-process pages. */
  children?: NavLink[];
}

export interface CookieBannerSettings {
  enabled: boolean;
  message: string;
  policyUrl: string;
}

export interface BrandingSettings {
  /** Downloadable capability brochure (PDF), linked from the site when set. */
  brochureUrl?: string;
}

/** `settings` collection, singleton global site config, doc ID `global`. */
export interface SettingsDoc {
  contact: SettingsContact;
  social: SettingsSocial;
  nav: NavLink[];
  footerLegalLinks: NavLink[];
  defaultSeo: SeoMap;
  cookieBanner: CookieBannerSettings;
  branding?: BrandingSettings;
}
