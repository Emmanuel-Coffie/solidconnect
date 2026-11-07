"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Drawer, IconButton } from "@mui/material";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import Close from "@mui/icons-material/Close";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import PersonOutline from "@mui/icons-material/PersonOutline";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import Logout from "@mui/icons-material/Logout";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import { api, useAuth } from "./providers";

export const workspaceLinks = [
  { label: "Overview", href: "/portal", icon: DashboardOutlined },
  { label: "My listings", href: "/portal/listings", icon: Inventory2Outlined },
  {
    label: "Requests & messages",
    href: "/portal/requests",
    icon: ForumOutlined,
  },
  { label: "Saved items", href: "/portal/saved", icon: BookmarkBorder },
  { label: "Updates", href: "/portal/notifications", icon: NotificationsNone },
  { label: "Account", href: "/portal/profile", icon: PersonOutline },
];

export function PortalWorkspace({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const params = useSearchParams();
  const navigation = admin
    ? [
        { label: "Enquiries", href: "/portal/admin", icon: ForumOutlined },
        {
          label: "Listing reviews",
          href: "/portal/admin?tab=listings",
          icon: Inventory2Outlined,
        },
        {
          label: "Accounts",
          href: "/portal/admin?tab=users",
          icon: PersonOutline,
        },
        { label: "My account", href: "/portal/profile", icon: PersonOutline },
      ]
    : workspaceLinks;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sidebar = (
    <>
      <div className="workspace-identity">
        <span className="workspace-monogram" aria-hidden="true">
          SC<span>↗</span>
        </span>
        <div>
          <b>Solid Connect</b>
          <small>{admin ? "Administration" : "Advertiser workspace"}</small>
        </div>
      </div>
      <div className="workspace-nav-label">Workspace</div>
      <nav aria-label="Workspace navigation">
        {user?.role === "ADMIN" && !admin && (
          <Link
            href="/portal/admin"
            aria-current={admin ? "page" : undefined}
            className={admin ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            <ForumOutlined />
            Admin inbox
            <span className="nav-indicator" />
          </Link>
        )}
        {navigation.map(({ label, href, icon: NavIcon }) => {
          const active = admin
            ? href.includes("?tab=")
              ? params.get("tab") === href.split("?tab=")[1]
              : href === "/portal/admin"
                ? !params.get("tab") || params.get("tab") === "requests"
                : pathname === href
            : href === "/portal"
              ? pathname === href
              : pathname.startsWith(href) ||
                (href === "/portal/requests" &&
                  pathname === "/portal/messages");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={active ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <NavIcon />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="workspace-support">
        <span className="workspace-nav-label">A connection, with support</span>
        <p>
          {admin
            ? "Keep customer conversations with the admin team."
            : "You bring the expertise. Our team coordinates customer enquiries."}
        </p>
        <Link href="/contact">
          Contact Solid Connect <ArrowOutward fontSize="small" />
        </Link>
      </div>
      {admin && (
        <Link className="workspace-switch" href="/portal">
          Open advertiser workspace ↗
        </Link>
      )}
      <div className="workspace-account">
        <span className="avatar">{user?.name.slice(0, 1)}</span>
        <div>
          <b>{user?.company || user?.name}</b>
          <small>
            {user?.role === "ADMIN" ? "Administrator" : "Advertiser"}
          </small>
        </div>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        className="workspace-signout"
        disabled={busy}
        startIcon={<Logout />}
        onClick={async () => {
          setBusy(true);
          try {
            await api("logout", {});
            window.location.assign("/portal/login");
          } catch (e) {
            setError((e as Error).message);
            setBusy(false);
          }
        }}
      >
        {busy ? "Signing out…" : "Sign out"}
      </Button>
    </>
  );
  return (
    <div className="portal-workspace">
      <aside className="workspace-sidebar">{sidebar}</aside>
      <div className="workspace-content">
        <div className="workspace-toolbar">
          <div className="workspace-breadcrumb">
            <IconButton
              className="workspace-menu"
              aria-label="Open workspace navigation"
              onClick={() => setOpen(true)}
            >
              <MenuOutlined />
            </IconButton>
            <span>{admin ? "Administration" : "Workspace"}</span>
            <span aria-hidden="true">/</span>
            <b>
              {admin
                ? "Enquiries & operations"
                : (workspaceLinks.find((x) => x.href === pathname)?.label ??
                  (pathname.includes("new")
                    ? "Create listing"
                    : "Conversation"))}
            </b>
          </div>
          <Link href="/marketplace">
            View marketplace <ArrowOutward fontSize="small" />
          </Link>
        </div>
        <div className="workspace-page">{children}</div>
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { className: "workspace-mobile-drawer" } }}
      >
        <IconButton
          className="workspace-drawer-close"
          aria-label="Close workspace navigation"
          onClick={() => setOpen(false)}
        >
          <Close />
        </IconButton>
        {sidebar}
      </Drawer>
    </div>
  );
}
