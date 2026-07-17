import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    // Admins paste cover image URLs from arbitrary hosts (image hosts, drive
    // links, etc.) via the CMS, so we can't maintain a fixed allowlist here
    // without every new host crashing the site until a code change ships.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
