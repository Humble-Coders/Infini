import type { MetadataRoute } from "next";

// Mirrors middleware.ts: only the T26 production deploy (NEXT_PUBLIC_SITE_ENV
// === "production") is allowed to be crawled.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

  return {
    rules: {
      userAgent: "*",
      [isProduction ? "allow" : "disallow"]: "/",
    },
  };
}
