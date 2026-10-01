import type { MetadataRoute } from "next";
import { services, articles } from "@/lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return [
    "",
    "/about",
    "/services",
    "/marketplace",
    "/pricing",
    "/resources",
    "/contact",
    "/faq",
    ...services.map((s) => `/services/${s.slug}`),
    ...articles.map((a) => `/resources/${a.slug}`),
  ].map((url) => ({
    url: base + url,
    changeFrequency: "weekly",
    priority: url ? 0.7 : 1,
  }));
}
