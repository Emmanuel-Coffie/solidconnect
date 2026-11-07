import { NextResponse, type NextRequest } from "next/server";
import { portalDestination } from "@/lib/portal-routing";

// Deploy the same application on an optional dedicated portal domain.
// Sessions stay host-only; the portal never depends on the public site's shell.
export function middleware(request: NextRequest) {
  const destination = portalDestination(request.url, {
    portalHost: process.env.PORTAL_HOST,
    portalUrl: process.env.PORTAL_URL,
    publicUrl: process.env.NEXTAUTH_URL,
  });
  if (destination) return NextResponse.redirect(destination);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
