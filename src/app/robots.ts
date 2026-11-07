import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/portal/admin", "/api", "/checkout", "/payment"],
    },
    sitemap: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/sitemap.xml`,
  };
}
