import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Inlines route CSS into <style> tags instead of render-blocking <link>
    // requests — removes the CSS request waterfall on first paint. Tailwind's
    // atomic output stays small per-route, so the cost (no cross-page CSS
    // caching) is worth the FCP/LCP win for first-time visitors.
    inlineCss: true,
  },
  images: {
    // Admins paste cover image URLs from arbitrary hosts (image hosts, drive
    // links, etc.) via the CMS, so we can't maintain a fixed allowlist here
    // without every new host crashing the site until a code change ships.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    localPatterns: [
      {
        pathname: "/**",
      },
      {
        pathname: "/teamfolder/**",
        search: "?v=20260708",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
