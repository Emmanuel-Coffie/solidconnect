"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header, Footer, Logo } from "./layout";
import { useAuth } from "./providers";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const portal = pathname === "/portal" || pathname.startsWith("/portal/");
  if (!portal)
    return (
      <>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </>
    );
  return (
    <div className="portal-app">
      <a className="skip-link" href="#main">
        Skip to portal content
      </a>
      <header className="portal-header">
        <div className="portal-brand">
          <Logo />
          <span className="portal-label">Advertiser portal</span>
        </div>
        <nav aria-label="Portal navigation">
          <Link href="/marketplace">View marketplace ↗</Link>
          {user ? (
            <Link href="/portal">My workspace</Link>
          ) : (
            <Link
              href={
                pathname === "/portal/register"
                  ? "/portal/login"
                  : "/portal/register"
              }
            >
              {pathname === "/portal/register" ? "Sign in" : "Create account"}
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/portal/admin">Admin inbox</Link>
          )}
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="portal-footer">
        Solid Connect · Products, services, and opportunities.
        <Link href="/contact">Contact the admin team</Link>
      </footer>
    </div>
  );
}
