import { NextResponse, type NextRequest } from "next/server";

// Deploy the same application on an optional dedicated portal domain.
// Sessions stay host-only; the portal never depends on the public site's shell.
export function middleware(request: NextRequest) {
  const portalHost = process.env.PORTAL_HOST?.toLowerCase();
  const url = request.nextUrl.clone();
  if (
    portalHost &&
    url.hostname.toLowerCase() === portalHost &&
    !url.pathname.startsWith("/portal") &&
    !url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/_next") &&
    !url.pathname.includes(".")
  ) {
    if (url.pathname === "/") url.pathname = "/portal";
    else if (
      [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/admin",
      ].includes(url.pathname)
    )
      url.pathname = "/portal" + url.pathname;
    else return NextResponse.next();
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
