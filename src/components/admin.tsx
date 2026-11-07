"use client";
import { LinkButton } from "./link-button";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Alert,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Pagination,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";
import Refresh from "@mui/icons-material/Refresh";
import { useSearchParams, useRouter } from "next/navigation";
import { PortalWorkspace } from "./portal-workspace";
import { api, useAuth } from "./providers";
import { type Listing } from "@/lib/catalog";
import type { User, Entry, Message } from "@/lib/store";
type Data = {
  users: Omit<User, "passwordHash">[];
  listings: Listing[];
  requests: Entry[];
  messages: Message[];
};
const pageSize = 8;
export function Admin() {
  const { user, loading } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const tab = ["requests", "listings", "users"].includes(
    params.get("tab") ?? "",
  )
    ? params.get("tab")!
    : "requests";
  const allowedStatuses =
    tab === "listings"
      ? ["pending", "published", "rejected", "suspended"]
      : [
          "Submitted",
          "In review",
          "Quoted",
          "Shortlisted",
          "Completed",
          "Rejected",
        ];
  const status = allowedStatuses.includes(params.get("status") ?? "")
    ? params.get("status")!
    : "all";
  const requestedPage = Number(params.get("page"));
  const page = Number.isFinite(requestedPage)
    ? Math.max(1, Math.floor(requestedPage))
    : 1;
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const load = useCallback(async () => {
    setBusy(true);
    try {
      setData(await api<Data>("admin"));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    if (user?.role === "ADMIN") load();
  }, [user, load]);
  function navigate(values: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(values).forEach(([k, v]) =>
      v === "all" || v === "1" ? next.delete(k) : next.set(k, v),
    );
    router.replace(`/portal/admin?${next.toString()}`, { scroll: false });
    setShowDetail(false);
  }
  if (loading)
    return (
      <div className="loading-page" role="status">
        Checking access…
      </div>
    );
  if (user?.role !== "ADMIN")
    return (
      <div className="container section">
        <Alert severity="warning">
          This workspace requires an administrator account.
        </Alert>
        <LinkButton
          href={user ? "/portal" : "/portal/login?next=/portal/admin"}
        >
          Go to {user ? "workspace" : "sign in"}
        </LinkButton>
      </div>
    );
  const q = query.trim().toLowerCase();
  const requests = (data?.requests ?? [])
    .filter(
      (r) =>
        (status === "all" || r.status === status) &&
        [
          r.subject,
          r.name,
          r.email,
          r.phone,
          r.id,
          r.kind,
          ...Object.values(r.details ?? {}),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const listings = (data?.listings ?? []).filter(
    (l) =>
      (status === "all" || l.status === status) &&
      [l.title, l.provider, l.category, l.location]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
  const users = (data?.users ?? []).filter((u) =>
    [u.name, u.email, u.company].join(" ").toLowerCase().includes(q),
  );
  const count =
    tab === "requests"
      ? requests.length
      : tab === "listings"
        ? listings.length
        : users.length;
  const pages = Math.max(1, Math.ceil(count / pageSize));
  const current = Math.min(page, pages);
  const offset = (current - 1) * pageSize;
  const visibleRequests = requests.slice(offset, offset + pageSize);
  const entry =
    visibleRequests.find((r) => r.id === selected) ?? visibleRequests[0];
  const pending =
    data?.listings.filter((l) => l.status === "pending").length ?? 0;
  const fresh =
    data?.requests.filter((r) => r.status === "Submitted").length ?? 0;
  return (
    <PortalWorkspace admin>
      <header className="workspace-page-heading">
        <div>
          <span className="eyebrow">Solid Connect administration</span>
          <h1>
            Every enquiry.
            <br className="mobile-break" /> One admin team.
          </h1>
          <p>A clear view of your customers, listings and next steps.</p>
        </div>
        <Button
          variant="outlined"
          startIcon={busy ? <CircularProgress size={16} /> : <Refresh />}
          disabled={busy}
          onClick={load}
        >
          Refresh inbox
        </Button>
      </header>
      <div className="stats-grid workspace-stats admin-stats">
        {[
          [
            "New enquiries",
            fresh,
            "requests",
            "Submitted",
            "Ready for your first response",
          ],
          [
            "Listing reviews",
            pending,
            "listings",
            "pending",
            "Help an advertiser go live",
          ],
          [
            "All enquiries",
            data?.requests.length ?? 0,
            "requests",
            "all",
            "Every customer connection",
          ],
          [
            "Accounts",
            data?.users.length ?? 0,
            "users",
            "all",
            "Your growing network",
          ],
        ].map(([label, value, destination, filter, hint]) => (
          <button
            className="stat-card"
            key={label}
            onClick={() => {
              setQuery("");
              navigate({
                tab: String(destination),
                status: String(filter),
                page: "1",
              });
            }}
          >
            <span>
              {label}
              <span aria-hidden="true">↗</span>
            </span>
            <strong>{value}</strong>
            <small>{hint}</small>
          </button>
        ))}
      </div>
      {error && (
        <Alert severity="error" action={<Button onClick={load}>Retry</Button>}>
          {error} Your current view is preserved.
        </Alert>
      )}
      <section className="operations-panel" aria-busy={busy}>
        <nav className="workspace-tabs" aria-label="Administration sections">
          {[
            ["requests", "Enquiries", fresh],
            ["listings", "Listings", pending],
            ["users", "Accounts", data?.users.length ?? 0],
          ].map(([value, label, badge]) => (
            <LinkButton
              key={value}
              href={`/portal/admin?tab=${value}`}
              className={tab === value ? "active" : ""}
              aria-current={tab === value ? "page" : undefined}
              onClick={() => {
                setQuery("");
                setShowDetail(false);
              }}
            >
              {label}
              <span>{badge}</span>
            </LinkButton>
          ))}
        </nav>
        <div className="operations-toolbar">
          <TextField
            inputRef={searchRef}
            label={
              tab === "requests"
                ? "Search enquiries"
                : tab === "listings"
                  ? "Search listings"
                  : "Search accounts"
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate({ page: "1" });
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear search"
                      onClick={() => {
                        setQuery("");
                        navigate({ page: "1" });
                        searchRef.current?.focus();
                      }}
                    >
                      <Close />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
          {tab !== "users" && (
            <TextField
              select
              label="Filter by status"
              value={status}
              onChange={(e) => navigate({ status: e.target.value, page: "1" })}
            >
              <MenuItem value="all">All statuses</MenuItem>
              {(tab === "requests"
                ? [
                    "Submitted",
                    "In review",
                    "Quoted",
                    "Shortlisted",
                    "Completed",
                    "Rejected",
                  ]
                : ["pending", "published", "rejected", "suspended"]
              ).map((x) => (
                <MenuItem value={x} key={x}>
                  {x === "pending"
                    ? "In review"
                    : x.charAt(0).toUpperCase() + x.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          )}
          <span className="results-count" role="status">
            {count}{" "}
            {tab === "users"
              ? "accounts"
              : tab === "requests"
                ? "enquiries"
                : "listings"}
          </span>
        </div>
        {!data ? (
          <div className="workspace-loading" role="status">
            {!error && <CircularProgress size={24} />}
            <p>
              {error
                ? "Could not load your workspace. Try again."
                : "Loading your workspace…"}
            </p>
          </div>
        ) : !count ? (
          <div className="empty-state">
            <h3>
              {q || status !== "all"
                ? "No matches found."
                : tab === "requests"
                  ? "Your inbox is clear."
                  : "Nothing to review yet."}
            </h3>
            <p>
              {q || status !== "all"
                ? "Try another search or reset the status filter."
                : "New activity will appear here. Refresh to check for updates."}
            </p>
            <Button
              variant="outlined"
              onClick={() => {
                setQuery("");
                navigate({ status: "all", page: "1" });
                searchRef.current?.focus();
              }}
            >
              Reset view
            </Button>
          </div>
        ) : tab === "requests" ? (
          <div className={`inbox-workbench ${showDetail ? "detail-open" : ""}`}>
            <div className="inbox-queue" aria-label="Customer enquiries">
              {visibleRequests.map((r) => (
                <button
                  className={`inbox-item ${entry?.id === r.id ? "selected" : ""}`}
                  key={r.id}
                  aria-pressed={entry?.id === r.id}
                  onClick={() => {
                    setSelected(r.id);
                    setShowDetail(true);
                  }}
                >
                  <span className="inbox-item-meta">
                    <b>{r.name || "Customer"}</b>
                    <time dateTime={r.createdAt}>
                      {new Date(r.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </time>
                  </span>
                  <strong>{r.subject}</strong>
                  <p>{r.message}</p>
                  <span className="inbox-item-meta">
                    <span>{r.kind}</span>
                    <span
                      className={`status ${r.status.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      {r.status}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div className="inbox-detail">
              <Button
                className="inbox-back"
                onClick={() => setShowDetail(false)}
              >
                ← Back to enquiries
              </Button>
              {entry && (
                <RequestRow
                  key={entry.id}
                  entry={entry}
                  messages={data.messages.filter(
                    (m) => m.conversationId === entry.id,
                  )}
                  reload={load}
                />
              )}
            </div>
          </div>
        ) : tab === "listings" ? (
          <div className="operations-records">
            {listings.slice(offset, offset + pageSize).map((l) => (
              <Moderation key={l.id} listing={l} reload={load} />
            ))}
          </div>
        ) : (
          <div className="account-directory">
            {users.slice(offset, offset + pageSize).map((u) => (
              <div className="directory-row" key={u.id}>
                <span className="avatar">{u.name.slice(0, 1)}</span>
                <div>
                  <h3>{u.name}</h3>
                  <p>{u.email}</p>
                  {u.company && <small>{u.company}</small>}
                </div>
                <span className="status">
                  {u.role === "ADMIN" ? "Administrator" : u.accountType}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="operations-pagination">
          <span>
            {count
              ? `${offset + 1}–${Math.min(offset + pageSize, count)} of ${count}`
              : "0 results"}
          </span>
          <Pagination
            count={pages}
            page={current}
            onChange={(_, v) => navigate({ page: String(v) })}
            size="small"
            aria-label="Results pages"
          />
        </div>
      </section>
    </PortalWorkspace>
  );
}
function Moderation({
  listing,
  reload,
}: {
  listing: Listing;
  reload: () => Promise<void>;
}) {
  const [status, setStatus] = useState(listing.status);
  const [featured, setFeatured] = useState(listing.featured);
  const [verified, setVerified] = useState(listing.verified);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <div className="record">
      <div className="row-between">
        <div>
          <small>
            {listing.category} · {listing.provider}
            {listing.demo ? " · Demo" : ""}
          </small>
          <h3>{listing.title}</h3>
        </div>
        <span className={`status ${listing.status}`}>{listing.status}</span>
      </div>
      <p>{listing.description}</p>
      <div className="button-row">
        <TextField
          select
          label="Status"
          value={status}
          sx={{ width: 180 }}
          onChange={(e) => {
            setStatus(e.target.value as Listing["status"]);
            setSaved(false);
          }}
        >
          {["published", "pending", "rejected", "suspended"].map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Switch
              checked={featured}
              onChange={(_, v) => {
                setFeatured(v);
                setSaved(false);
              }}
            />
          }
          label="Featured"
        />
        <FormControlLabel
          control={
            <Switch
              checked={verified}
              onChange={(_, v) => {
                setVerified(v);
                setSaved(false);
              }}
            />
          }
          label="Verified provider"
        />
        <Button
          variant="contained"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api("moderate", {
                id: listing.id,
                status,
                featured,
                verified,
              });
              setSaved(true);
              await reload();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Saving…" : saved ? "Saved" : "Save decision"}
        </Button>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
}
function RequestRow({
  entry,
  messages,
  reload,
}: {
  entry: Entry;
  messages: Message[];
  reload: () => Promise<void>;
}) {
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <div className="record request-detail-card">
      <div className="row-between">
        <div>
          <small>
            {entry.kind} · {entry.email}
          </small>
          <h3>{entry.subject}</h3>
        </div>
        <TextField
          select
          label="Request status"
          sx={{ width: 180 }}
          value={entry.status}
          disabled={busy}
          onChange={async (e) => {
            setBusy(true);
            setError("");
            setNotice("");
            try {
              await api("request-status", {
                id: entry.id,
                status: e.target.value,
              });
              setNotice("Request status updated.");
              await reload();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {[
            "Submitted",
            "In review",
            "Shortlisted",
            "Rejected",
            "Quoted",
            "Completed",
          ].map((s) => (
            <MenuItem value={s} key={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {notice && <Alert severity="success">{notice}</Alert>}
      <div className="enquiry-message">
        <span className="eyebrow">Customer enquiry</span>
        <p>{entry.message}</p>
      </div>
      <dl className="request-meta">
        {Object.entries({
          Reference: entry.id,
          Name: entry.name,
          Email: entry.email,
          Phone: entry.phone,
          Listing: entry.listingId,
          ...entry.details,
        })
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
      <p className="small-caption">
        Customer details stay with Solid Connect admin. Coordinate with
        advertisers separately.
      </p>
      {entry.email && (
        <a
          className="text-link"
          href={`mailto:${encodeURIComponent(entry.email)}?subject=${encodeURIComponent(`Solid Connect enquiry ${entry.id}`)}`}
        >
          Reply by email ↗
        </a>
      )}
      {!entry.userId && (
        <p className="small-caption">
          Guest enquiry · Reply opens your email app. Email replies are not
          stored in this inbox.
        </p>
      )}
      {entry.userId && (
        <>
          <div className="message-history">
            {messages.map((message) => (
              <div className="message-bubble" key={message.id}>
                {message.text}
                <small>
                  {message.userId === entry.userId
                    ? "Requester"
                    : "Solid Connect admin"}{" "}
                  ·{" "}
                  {new Date(message.createdAt).toLocaleString("en-GB", {
                    timeZone: "UTC",
                  })}{" "}
                  UTC
                </small>
              </div>
            ))}
          </div>
          <form
            noValidate
            className="message-compose"
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy || !text.trim()) return;
              setBusy(true);
              setError("");
              try {
                await api("message", { conversationId: entry.id, text });
                setText("");
                await reload();
              } catch (error) {
                setError((error as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <TextField
              label="Reply as Solid Connect admin"
              value={text}
              onChange={(event) => setText(event.target.value)}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={busy || !text.trim()}
            >
              {busy ? "Sending…" : "Send reply"}
            </Button>
          </form>
        </>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
}
