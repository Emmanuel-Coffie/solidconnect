"use client";
import { LinkButton } from "./link-button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  TextField,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import { services } from "@/lib/catalog";
import { useAuth } from "./providers";
import { Icon } from "./icon";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Solid Connect home">
      <span className="brand-symbol">
        <Image
          src="/images/solid-connect-logo-original.png"
          alt=""
          width={1536}
          height={1024}
          sizes="120px"
          priority
        />
      </span>
      <span>
        SOLID<span className="orange">CONNECT</span>
      </span>
    </Link>
  );
}
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [menu, setMenu] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const nav = [
    ["Home", "/"],
    ["About", "/about"],
    ["Services", "menu"],
    ["Marketplace", "/marketplace"],
    ["For Business", "business"],
    ["Resources", "resources"],
    ["Contact", "/contact"],
  ];
  const close = () => {
    setAnchor(null);
    setMenu("");
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="header-inner">
          <Logo />
          <nav aria-label="Main navigation" className="desktop-nav">
            {nav.map(([label, url]) =>
              url.startsWith("/") ? (
                <Link
                  key={label}
                  className={pathname === url ? "active" : ""}
                  href={url}
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  className="nav-button"
                  aria-expanded={menu === url}
                  onClick={(e) => {
                    setAnchor(e.currentTarget);
                    setMenu(url);
                  }}
                >
                  {label}
                  <KeyboardArrowDown fontSize="small" />
                </button>
              ),
            )}
          </nav>
          <div className="header-actions">
            <IconButton
              aria-label="Search Solid Connect"
              onClick={() => setSearch(true)}
            >
              <Search />
            </IconButton>
            {user ? (
              <>
                <IconButton
                  component={Link}
                  href="/dashboard/notifications"
                  aria-label="Notifications"
                >
                  <NotificationsNone />
                </IconButton>
                <Link
                  className="avatar"
                  href="/dashboard"
                  title="Open dashboard"
                >
                  {user.name.slice(0, 1)}
                </Link>
              </>
            ) : (
              <>
                <LinkButton href="/login" variant="outlined" className="signin">
                  Sign In
                </LinkButton>
                <LinkButton
                  href="/register"
                  variant="contained"
                  color="secondary"
                  className="get-started"
                >
                  Get Started
                </LinkButton>
              </>
            )}
            <IconButton
              className="mobile-menu"
              aria-label="Open navigation"
              onClick={() => setDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </header>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        slotProps={{ paper: { className: menu === "menu" ? "mega-menu" : "" } }}
      >
        {menu === "menu"
          ? services.map((s) => (
              <MenuItem
                key={s.slug}
                component={Link}
                href={`/services/${s.slug}`}
                onClick={close}
              >
                <span className="menu-icon" style={{ color: s.color }}>
                  <Icon name={s.icon} />
                </span>
                <span>
                  <b>{s.name}</b>
                  <small>{s.headline}</small>
                </span>
              </MenuItem>
            ))
          : (menu === "business"
              ? [
                  ["Business dashboard", "/dashboard"],
                  ["Post a listing", "/dashboard/listings/new"],
                  ["Plans & pricing", "/pricing"],
                ]
              : [
                  ["Insights & resources", "/resources"],
                  ["Help & FAQs", "/faq"],
                  ["Track a shipment", "/track"],
                ]
            ).map(([label, url]) => (
              <MenuItem key={url} component={Link} href={url} onClick={close}>
                {label}
              </MenuItem>
            ))}
      </Menu>
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
        <div className="mobile-drawer">
          <div className="row-between">
            <Logo />
            <IconButton
              aria-label="Close navigation"
              onClick={() => setDrawer(false)}
            >
              <Close />
            </IconButton>
          </div>
          {[
            ["Home", "/"],
            ["About", "/about"],
            ["Services", "/services"],
            ["Marketplace", "/marketplace"],
            ["Dashboard", "/dashboard"],
            ["Resources", "/resources"],
            ["Contact", "/contact"],
            ["Track a shipment", "/track"],
            ["Sign in", "/login"],
          ].map(([label, url]) => (
            <Link key={url} href={url} onClick={() => setDrawer(false)}>
              {label}
            </Link>
          ))}
        </div>
      </Drawer>
      <Dialog
        open={search}
        onClose={() => setSearch(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="row-between">
          Find your next connection
          <IconButton
            aria-label="Close search"
            onClick={() => setSearch(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(false);
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
            className="search-dialog"
          >
            <TextField
              autoFocus
              label="Search jobs, people, properties and services"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: query ? (
                    <IconButton
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    >
                      <Close />
                    </IconButton>
                  ) : null,
                },
              }}
            />
            <Button type="submit" variant="contained">
              Search
            </Button>
          </form>
          <p className="muted">Try “Accra”, “freight”, or “developer”.</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>Building connections that hold weight.</p>
          <p className="footer-note">
            People, businesses and possibilities.
            <br />
            Connected through one platform.
          </p>
        </div>
        {[
          {
            title: "Company",
            links: [
              ["About us", "/about"],
              ["Contact", "/contact"],
              ["Plans & pricing", "/pricing"],
            ],
          },
          {
            title: "Our services",
            links: services.map((s) => [s.name, `/services/${s.slug}`]),
          },
          {
            title: "Explore",
            links: [
              ["Marketplace", "/marketplace"],
              ["Resources", "/resources"],
              ["Track a shipment", "/track"],
              ["Help & FAQs", "/faq"],
            ],
          },
          {
            title: "Legal",
            links: [
              ["Terms", "/terms"],
              ["Privacy", "/privacy"],
              ["Cookies", "/cookies"],
              ["Refunds", "/refunds"],
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            {col.links.map(([name, url]) => (
              <Link key={url} href={url}>
                {name}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Solid Connect. All rights reserved.
        </span>
        <span>Rooted in Ghana. Connected to the world.</span>
      </div>
    </footer>
  );
}
