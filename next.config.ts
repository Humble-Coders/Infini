import type { NextConfig } from "next";

// Staging must never be indexable. Resolved once at build time (not per
// request like the middleware this replaces) since NEXT_PUBLIC_SITE_ENV is
// fixed per deployment. Only ever "production" on the T26 production deploy.
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    // getDownloadURL() from Firebase Storage always resolves to this host,
    // regardless of the project's bucket-naming style — needed so
    // next/image (T8 media library, MediaPicker) can serve uploaded assets.
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
  async headers() {
    if (isProduction) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
