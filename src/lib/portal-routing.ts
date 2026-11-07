type PortalOrigins = {
  portalHost?: string;
  portalUrl?: string;
  publicUrl?: string;
};

/** Canonical host transitions preserve deep links, queries and host-only sessions. */
export function portalDestination(
  requestUrl: string,
  origins: PortalOrigins,
): URL | null {
  const current = new URL(requestUrl);
  const portalHost = origins.portalHost?.toLowerCase();
  if (!portalHost) return null;
  const portal = origins.portalUrl ? new URL(origins.portalUrl) : null;
  const website = origins.publicUrl ? new URL(origins.publicUrl) : null;
  const isPortal =
    current.pathname === "/portal" || current.pathname.startsWith("/portal/");
  if (
    website &&
    portal &&
    current.host === website.host &&
    portal.host !== website.host &&
    isPortal
  ) {
    return new URL(current.pathname + current.search, portal.origin);
  }
  if (
    current.hostname !== portalHost ||
    isPortal ||
    current.pathname.startsWith("/api/") ||
    current.pathname.startsWith("/_next/") ||
    current.pathname.includes(".")
  )
    return null;
  if (current.pathname === "/") current.pathname = "/portal";
  else if (
    [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/admin",
    ].includes(current.pathname)
  )
    current.pathname = "/portal" + current.pathname;
  else if (
    current.pathname === "/dashboard" ||
    current.pathname.startsWith("/dashboard/")
  )
    current.pathname = current.pathname.replace("/dashboard", "/portal");
  else if (website && current.host !== website.host)
    return new URL(current.pathname + current.search, website.origin);
  else return null;
  return current;
}
