import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Services,
  ServicePage,
  About,
  Faq,
  Resources,
  Legal,
} from "@/components/public-pages";
import { Marketplace, ListingDetail } from "@/components/marketplace";
import { AuthForm, Contact, VerifyEmail } from "@/components/forms";
import { Dashboard } from "@/components/dashboard";
import { Track } from "@/components/transactions";
import { Admin } from "@/components/admin";
import { services, articles } from "@/lib/catalog";
type Props = { params: Promise<{ path: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const service = services.find((s) => s.slug === path[1]);
  const title =
    path[0] === "services" && service
      ? service.name
      : path.map((p) => p.replaceAll("-", " ")).join(" · ");
  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    ...(path[0] === "portal"
      ? { robots: { index: false, follow: false } }
      : {}),
    description:
      service?.description ??
      "Explore Solid Connect — people, businesses and opportunities, connected.",
  };
}
export default async function Page({ params }: Props) {
  const { path } = await params;
  const [original, ...rest] = path;
  if (original === "portal" && ["orders", "applications"].includes(rest[0]))
    redirect("/portal/requests");
  if (original === "portal" && rest[0] === "settings")
    redirect("/portal/profile");
  if (original === "dashboard")
    redirect("/portal" + (rest.length ? "/" + rest.join("/") : ""));
  // Legacy auth routes retain query strings through next.config redirects.
  const [root, sub, third] =
    original === "portal"
      ? rest.length
        ? ["dashboard", ...rest]
        : ["dashboard"]
      : path;
  if (
    original === "portal" &&
    [
      "login",
      "register",
      "forgot-password",
      "reset-password",
      "verify-email",
      "admin",
    ].includes(rest[0])
  )
    return (
      <Suspense fallback={<div className="loading-page">Loading portal…</div>}>
        {rest[0] === "admin" ? (
          <Admin />
        ) : rest[0] === "verify-email" ? (
          <VerifyEmail />
        ) : (
          <AuthForm
            mode={
              rest[0] === "forgot-password"
                ? "forgot"
                : rest[0] === "reset-password"
                  ? "reset"
                  : (rest[0] as "login" | "register")
            }
          />
        )}
      </Suspense>
    );
  let page: React.ReactNode;
  if (root === "services" && !sub) page = <Services />;
  else if (root === "services" && services.some((s) => s.slug === sub))
    page = <ServicePage slug={sub} />;
  else if (root === "about") page = <About />;
  else if (root === "marketplace") {
    const categories: Record<string, string> = {
      jobs: "Jobs",
      artisans: "Artisans",
      properties: "Properties",
      products: "Products",
      logistics: "Logistics",
      services: "Services",
    };
    page =
      !sub || categories[sub] ? (
        <Marketplace category={categories[sub] ?? "All"} />
      ) : (
        <ListingDetail id={sub} />
      );
  } else if (root === "search") page = <Marketplace searchPage />;
  else if (root === "contact") page = <Contact />;
  else if (root === "login" || root === "register")
    page = <AuthForm mode={root} />;
  else if (root === "forgot-password") page = <AuthForm mode="forgot" />;
  else if (root === "reset-password") page = <AuthForm mode="reset" />;
  else if (root === "verify-email") page = <VerifyEmail />;
  else if (
    root === "dashboard" &&
    (!sub ||
      [
        "profile",
        "listings",
        "orders",
        "requests",
        "applications",
        "saved",
        "messages",
        "settings",
        "notifications",
      ].includes(sub))
  )
    page = (
      <Dashboard
        section={
          sub === "listings" && third === "new" ? "new" : (sub ?? "overview")
        }
      />
    );
  else if (root === "track") page = <Track />;
  else if (["checkout", "payment", "pricing"].includes(root))
    redirect("/contact");
  else if (root === "faq") page = <Faq />;
  else if (
    root === "resources" &&
    (!sub || articles.some((a) => a.slug === sub))
  )
    page = <Resources slug={sub} />;
  else if (["terms", "privacy", "cookies", "refunds"].includes(root))
    page = <Legal kind={root} />;
  else if (root === "admin") page = <Admin />;
  else notFound();
  return (
    <Suspense
      fallback={<div className="loading-page">Loading your connections…</div>}
    >
      {page}
    </Suspense>
  );
}
