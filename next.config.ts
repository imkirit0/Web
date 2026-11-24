import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: __dirname },
  // Dev only: allow opening the dev server from any IPv4 address on the network (bare "*" is rejected by Next).
  allowedDevOrigins: ["*.*.*.*"],
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        // Stop other sites framing pages (clickjacking, esp. the payment forms).
        { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=63072000" },
      ],
    },
  ],
  // Old WordPress archive URLs from the live site.
  redirects: async () => [
    { source: "/blog/author/:path*", destination: "/blog", permanent: true },
    { source: "/blog/category/:path*", destination: "/blog", permanent: true },
  ],
};

export default config;
