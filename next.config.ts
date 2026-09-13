import type { NextConfig } from "next";
import path from "path";

// Staging must never be indexable. Resolved once at build time (not per
// request like the middleware this replaces) since NEXT_PUBLIC_SITE_ENV is
// fixed per deployment. Only ever "production" on the T26 production deploy.
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
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

    // Baseline hardening. Deliberately no Content-Security-Policy here: the
    // app ships inline scripts/styles (route curtain, fonts, oily anti-flicker
    // bits) that a static CSP string would break. A nonce-based CSP is the
    // right follow-up and needs middleware support, not a one-line header.
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      // Production-only: App Hosting already terminates TLS, so HSTS just
      // pins the browser to it. Never on staging, where preview URLs vary.
      ...(isProduction
        ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
        : []),
    ];

    const globalSecurity = { source: "/:path*", headers: securityHeaders };

    if (isProduction) return [assetCaching, globalSecurity];
    return [
      assetCaching,
      globalSecurity,
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: isProduction ? { exclude: ["error", "warn"] } : false,
  },
  // Trim the client bundle: barrel imports from icons and motion engines resolve to
  // just the modules actually used.
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "lenis",
      "lenis/react",
      "sonner",
    ],
  },
};

export default nextConfig;
