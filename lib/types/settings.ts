import type { SeoMap } from "./seo";

export interface SettingsContact {
  phone: string;
  email: string;
  address: string;
}

export interface SettingsSocial {
  linkedin: string;
  instagram: string;
  youtube: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CookieBannerSettings {
  enabled: boolean;
  message: string;
  policyUrl: string;
}

/** `settings` collection — singleton global site config, doc ID `global`. */
export interface SettingsDoc {
  contact: SettingsContact;
  social: SettingsSocial;
  nav: NavLink[];
  defaultSeo: SeoMap;
  cookieBanner: CookieBannerSettings;
}
