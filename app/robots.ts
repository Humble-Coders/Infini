import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Mirrors middleware.ts: only the T26 production deploy (NEXT_PUBLIC_SITE_ENV
// === "production") is allowed to be crawled. Kept as two explicit branches
// (not a spread + a shared `disallow`) because a shared key would silently
// overwrite the staging branch's sitewide block — staging must disallow "/"
// and nothing else needs saying there.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
