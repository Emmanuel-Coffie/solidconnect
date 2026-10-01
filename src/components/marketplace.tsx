"use client";
import { ExperienceHero } from "./brand-experience";
import { LinkButton } from "./link-button";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Alert,
  Button,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Skeleton,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";
import VerifiedOutlined from "@mui/icons-material/VerifiedOutlined";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import { type Listing, photo, money, services, articles } from "@/lib/catalog";
import { api, useAuth } from "./providers";
import { ListingCard } from "./cards";
import { RequestForm } from "./forms";
export function Marketplace({
  category = "All",
  searchPage = false,
}: {
  category?: string;
  searchPage?: boolean;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = params.get("q") ?? "";
  const categoryValue = params.get("category") ?? category;
  const selected = [
    "All",
    "Jobs",
    "Artisans",
    "Properties",
    "Products",
    "Logistics",
    "Business Services",
  ].includes(categoryValue)
    ? categoryValue
    : "All";
  const location = params.get("location") ?? "All locations";
  const sort = params.get("sort") ?? "Featured";
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
  const [text, setText] = useState(query);
  useEffect(() => {
    setText(query);
  }, [query]);
  useEffect(() => {
    api<{ listings: Listing[] }>("listings")
      .then((d) => setItems(d.listings))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  function update(values: Record<string, string>) {
    const p = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(values)) {
      if (value) p.set(key, value);
      else p.delete(key);
    }
    if (!values.page) p.delete("page");
    startTransition(() =>
      router.replace(
        `${searchPage ? "/search" : "/marketplace"}?${p.toString()}`,
        { scroll: false },
      ),
    );
  }
  const filtered = items
    .filter(
      (l) =>
        (selected === "All" || l.category === selected) &&
        (location === "All locations" || l.location.includes(location)) &&
        l.price >= (Number(params.get("min")) || 0) &&
        (!params.get("max") || l.price <= Number(params.get("max"))) &&
        (!params.get("type") ||
          (l.details.Type ?? l.details["Employment type"]) ===
            params.get("type")) &&
        (!params.get("bedrooms") ||
          Number(l.details.Bedrooms) >= Number(params.get("bedrooms"))) &&
        `${l.title} ${l.description} ${l.location} ${l.provider} ${l.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Price: low to high"
        ? a.price - b.price
        : sort === "Newest"
          ? b.createdAt.localeCompare(a.createdAt)
          : Number(b.featured) - Number(a.featured),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 6));
  const safePage = Math.min(page, pages);
  return (
    <>
      <ExperienceHero
        market
        eyebrow={
          searchPage ? "Search Solid Connect" : "The Solid Connect marketplace"
        }
        title={
          searchPage
            ? "Find your next connection."
            : "People. Products. Possibilities."
        }
        description="Find the talent, spaces, services, and partners to take your next step."
      />
      <section className="workspace">
        <div className="container">
          <div className="market-tabs">
            <Tabs
              value={selected}
              onChange={(_, v) => update({ category: v })}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Marketplace categories"
            >
              {[
                "All",
                "Jobs",
                "Artisans",
                "Properties",
                "Products",
                "Logistics",
                "Business Services",
              ].map((c) => (
                <Tab key={c} value={c} label={c} />
              ))}
            </Tabs>
          </div>
          <form
            noValidate
            className="filter-bar"
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: text });
            }}
          >
            <TextField
              label="What are you looking for?"
              disabled={pending}
              value={text}
              onChange={(e) => setText(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                  endAdornment: text ? (
                    <IconButton
                      aria-label="Clear search"
                      onClick={() => {
                        setText("");
                        update({ q: "" });
                      }}
                    >
                      <Close />
                    </IconButton>
                  ) : null,
                },
              }}
            />
            <TextField
              select
              label="Location"
              value={location}
              onChange={(e) => update({ location: e.target.value })}
            >
              {["All locations", "Accra", "Kumasi", "Tema"].map((l) => (
                <MenuItem value={l} key={l}>
                  {l}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={pending}
            >
              Search
            </Button>
          </form>
          <div className="market-layout">
            <aside className="filter-panel">
              <h3>Refine your search</h3>
              <TextField
                label="Minimum price (GHS)"
                type="number"
                value={params.get("min") ?? ""}
                onChange={(e) => update({ min: e.target.value })}
              />
              <TextField
                label="Maximum price (GHS)"
                type="number"
                value={params.get("max") ?? ""}
                onChange={(e) => update({ max: e.target.value })}
              />
              {(selected === "Jobs" || selected === "Properties") && (
                <TextField
                  select
                  label={
                    selected === "Jobs" ? "Employment type" : "Property purpose"
                  }
                  value={params.get("type") ?? ""}
                  onChange={(e) => update({ type: e.target.value })}
                >
                  <MenuItem value="">Any</MenuItem>
                  {(selected === "Jobs"
                    ? ["Full-time", "Part-time", "Contract"]
                    : ["Buy", "Rent", "Commercial", "Invest"]
                  ).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              {selected === "Properties" && (
                <TextField
                  select
                  label="Bedrooms"
                  value={params.get("bedrooms") ?? ""}
                  onChange={(e) => update({ bedrooms: e.target.value })}
                >
                  <MenuItem value="">Any</MenuItem>
                  {["1", "2", "3", "4"].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}+
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <TextField
                select
                label="Sort by"
                value={sort}
                onChange={(e) => update({ sort: e.target.value })}
              >
                {["Featured", "Newest", "Price: low to high"].map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={() => {
                  setText("");
                  router.replace("/marketplace");
                }}
                size="small"
              >
                Reset filters
              </Button>
              <p className="small-caption">
                Sample listings are labelled Demo. Availability and prices are
                illustrative.
              </p>
            </aside>
            <div className="market-results">
              {searchPage && (
                <div className="search-groups">
                  <h3>Services</h3>
                  <div className="button-row">
                    {services
                      .filter((s) =>
                        `${s.name} ${s.description}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((s) => (
                        <LinkButton
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          variant="outlined"
                        >
                          {s.name}
                        </LinkButton>
                      ))}
                  </div>
                  <h3>Resources</h3>
                  <div className="record-list">
                    {articles
                      .filter((a) =>
                        `${a.title} ${a.category} ${a.summary}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((a) => (
                        <Link
                          className="text-link"
                          key={a.slug}
                          href={`/resources/${a.slug}`}
                        >
                          {a.title}
                        </Link>
                      ))}
                  </div>
                  <h3>Marketplace</h3>
                </div>
              )}
              <div className="row-between results-heading">
                <span>
                  <b>{filtered.length}</b> opportunities to explore
                </span>
                <Link className="text-link" href="/dashboard/listings/new">
                  Post a listing
                </Link>
              </div>
              {error && <Alert severity="error">{error}</Alert>}
              {loading ? (
                <div className="listing-grid">
                  {[1, 2, 3].map((x) => (
                    <Skeleton key={x} variant="rounded" height={350} />
                  ))}
                </div>
              ) : filtered.length ? (
                <div className="listing-grid">
                  {filtered.slice((safePage - 1) * 6, safePage * 6).map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No matches just yet.</h3>
                  <p>Try a different keyword, location, or category.</p>
                  <Button
                    onClick={() => {
                      setText("");
                      update({
                        q: "",
                        category: "All",
                        location: "All locations",
                      });
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
              <div className="pagination">
                <Pagination
                  count={pages}
                  page={safePage}
                  onChange={(_, p) => update({ page: String(p) })}
                  color="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export function ListingDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [shared, setShared] = useState(false);
  useEffect(() => {
    api<{ listings: Listing[] }>("listings")
      .then((d) => {
        const item = d.listings.find((x) => x.id === id);
        if (item) setListing(item);
        else setError("This listing is unavailable.");
      })
      .catch((e) => setError(e.message));
  }, [id]);
  if (error)
    return (
      <div className="container section">
        <Alert severity="error">{error}</Alert>
        <LinkButton href="/marketplace">Back to marketplace</LinkButton>
      </div>
    );
  if (!listing)
    return (
      <div className="container section">
        <Skeleton height={500} />
      </div>
    );
  const job = listing.category === "Jobs";
  const action = job
    ? "Apply for this role"
    : listing.category === "Properties"
      ? "Schedule a viewing"
      : "Request a quote";
  const kind = job
    ? "Job application"
    : listing.category === "Properties"
      ? "Property viewing"
      : `${listing.category} enquiry`;
  return (
    <section className="workspace">
      <div className="container">
        <div className="breadcrumbs" style={{ color: "var(--muted)" }}>
          <Link href="/marketplace" style={{ color: "var(--blue)" }}>
            Marketplace
          </Link>{" "}
          / {listing.category} / {listing.title}
        </div>
        <div className="content-grid">
          <div>
            <span className="eyebrow orange">
              {listing.category}
              {listing.demo ? " · Demo listing" : ""}
            </span>
            <h1 style={{ fontSize: 38 }}>{listing.title}</h1>
            <p style={{ marginTop: 14 }}>{listing.location}</p>
            <div className="detail-photo">
              <Image
                src={photo(listing.image, 1400)}
                alt={listing.title}
                fill
                sizes="(max-width:700px) 100vw, 60vw"
              />
            </div>
            <div className="panel">
              <h2>About this opportunity</h2>
              <p>{listing.description}</p>
              <div className="detail-specs">
                {Object.entries(listing.details).map(([key, value]) => (
                  <div key={key}>
                    <small>{key}</small>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
              {listing.demo && (
                <Alert severity="info">
                  This is a demonstration listing. Enquiries and applications
                  are saved in the platform; no external provider is contacted.
                </Alert>
              )}
            </div>
          </div>
          <aside className="panel detail-side">
            <div className="listing-provider">
              {listing.verified && <VerifiedOutlined />}
              {listing.provider}
            </div>
            <h2>{listing.price ? money(listing.price) : "Let’s talk"}</h2>
            <p>{listing.unit}</p>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setOpen(true)}
            >
              {action}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ShareOutlined />}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setShared(true);
                } catch {
                  setError(
                    "Copy the address from your browser to share this listing.",
                  );
                }
              }}
            >
              {shared ? "Link copied" : "Share opportunity"}
            </Button>
            <p className="small-caption" style={{ marginTop: 20 }}>
              Start a conversation to confirm availability, scope, and pricing
              with the provider.
            </p>
          </aside>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="row-between">
          {action}
          <IconButton onClick={() => setOpen(false)} aria-label="Close request">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {user ? (
            <RequestForm kind={kind} listingId={id} subject={listing.title} />
          ) : (
            <>
              <p>
                Sign in to keep track of this {job ? "application" : "enquiry"}{" "}
                and your conversation with the provider.
              </p>
              <LinkButton
                href={`/login?next=/marketplace/${id}`}
                variant="contained"
                sx={{ mt: 3 }}
              >
                Sign in to continue
              </LinkButton>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
