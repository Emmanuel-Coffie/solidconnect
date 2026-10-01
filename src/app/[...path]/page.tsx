import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Services,
  ServicePage,
  About,
  Faq,
  Pricing,
  Resources,
  Legal,
  PageHero,
} from "@/components/public-pages";
import { Marketplace, ListingDetail } from "@/components/marketplace";
import { AuthForm, Contact, VerifyEmail } from "@/components/forms";
import { Dashboard } from "@/components/dashboard";
import { Track, Checkout, PaymentResult } from "@/components/transactions";
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
    description:
      service?.description ??
      "Explore Solid Connect — people, businesses and opportunities, connected.",
  };
}
export default async function Page({ params }: Props) {
  const { path } = await params;
  const [root, sub, third] = path;
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
    };
    page =
      !sub || categories[sub] ? (
        <Marketplace category={categories[sub] ?? "All"} />
      ) : (
        <ListingDetail id={sub} />
      );
  } else if (root === "search") page = <Marketplace searchPage />;
  else if (root === "contact")
    page = (
      <>
        <PageHero
          title="Good things start with a conversation."
          description="Tell us about your next step. Let’s find the right connection."
          eyebrow="Contact us"
        />
        <Contact />
      </>
    );
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
        "payments",
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
  else if (root === "checkout") page = <Checkout />;
  else if (root === "payment" && ["success", "failed", "pending"].includes(sub))
    page = <PaymentResult />;
  else if (root === "pricing") page = <Pricing />;
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
