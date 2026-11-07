import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
const config = (phase: string): NextConfig => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  devIndicators: false,
  async redirects() {
    return [
      ...[
        "login",
        "register",
        "forgot-password",
        "reset-password",
        "verify-email",
        "admin",
      ].map((route) => ({
        source: `/${route}`,
        destination: `/portal/${route}`,
        permanent: false,
      })),
      {
        source: "/dashboard/:path*",
        destination: "/portal/:path*",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  poweredByHeader: false,
});
export default config;
