import type { NextConfig } from "next";

// Staging must never be indexable. Resolved once at build time (not per
// request like the middleware this replaces) since NEXT_PUBLIC_SITE_ENV is
// fixed per deployment. Only ever "production" on the T26 production deploy.
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    // Modern formats first (smaller files), week-long optimizer cache so
    // repeat visits never re-pay the resize cost.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800,
    // getDownloadURL() from Firebase Storage always resolves to this host,
    // regardless of the project's bucket-naming style, needed so
    // next/image (T8 media library, MediaPicker) can serve uploaded assets.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // Newer SDKs hand back download URLs on the bucket's own domain.
      { protocol: "https", hostname: "*.firebasestorage.app" },
      // TEMP DEMO, topical industry photos (see DEMO_HERO_IMAGES in
      // lib/data/industries.ts). Delete with that map once real
      // photography is supplied.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    // The route curtain's clip is a fixed, versionless asset that every page
    // load and reload asks for. Without an explicit header, /public files are
    // revalidated on each visit, which puts a round trip in front of an
    // animation whose whole job is to start instantly. It is immutable in
    // practice: replacing it means shipping a new file.
    const assetCaching = {
      source: "/infinity_animation.mp4",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    };

    if (isProduction) return [assetCaching];
    return [
      assetCaching,
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  // Trim the client bundle: barrel imports from the motion engine resolve to
  // just the modules actually used.
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
