import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: __dirname },
  // Dev only: allow opening the dev server from any IPv4 address on the network (bare "*" is rejected by Next).
  allowedDevOrigins: ["*.*.*.*"],
  // Old WordPress archive URLs from the live site.
  redirects: async () => [
    { source: "/blog/author/:path*", destination: "/blog", permanent: true },
    { source: "/blog/category/:path*", destination: "/blog", permanent: true },
  ],
};

export default config;
