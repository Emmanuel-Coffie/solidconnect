"use client";
import { LinkButton } from "./link-button";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import { api, useAuth } from "./providers";
import { type Listing } from "@/lib/catalog";
import type { User, Entry, Message } from "@/lib/store";
type Data = {
  users: Omit<User, "passwordHash">[];
  listings: Listing[];
  requests: Entry[];
  messages: Message[];
};
export function Admin() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("requests");
  async function load() {
    try {
      setData(await api<Data>("admin"));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    if (user?.role === "ADMIN") load();
  }, [user]);
  if (loading) return <div className="loading-page">Checking access…</div>;
  if (user?.role !== "ADMIN")
    return (
      <div className="container section">
        <Alert severity="warning">
          This area requires an administrator account.
        </Alert>
        <LinkButton
          href={user ? "/portal" : "/portal/login?next=/portal/admin"}
        >
          Go to {user ? "dashboard" : "sign in"}
        </LinkButton>
      </div>
    );
  return (
    <section className="workspace">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Solid Connect administration</div>
            <h1>Every enquiry. One admin team.</h1>
          </div>
          <Button onClick={load}>Refresh</Button>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        {!data ? (
          <Skeleton height={400} />
        ) : (
          <>
            <div className="stats-grid">
              {[
                ["Accounts", data.users.length],
                [
                  "Pending listings",
                  data.listings.filter((l) => l.status === "pending").length,
                ],
                ["Service requests", data.requests.length],
                [
                  "Awaiting review",
                  data.requests.filter((r) => r.status === "Submitted").length,
                ],
              ].map(([label, value]) => (
                <div className="stat-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              sx={{ mb: 3 }}
            >
              {["requests", "listings", "users"].map((x) => (
                <Tab key={x} value={x} label={x} />
              ))}
            </Tabs>
            <div className="admin-grid admin-inbox">
              {tab === "listings"
                ? data.listings.map((l) => (
                    <Moderation key={l.id} listing={l} reload={load} />
                  ))
                : tab === "requests"
                  ? data.requests.map((r) => (
                      <RequestRow
                        key={r.id}
                        entry={r}
                        messages={data.messages.filter(
                          (m) => m.conversationId === r.id,
                        )}
                        reload={load}
                      />
                    ))
                  : data.users.map((u) => (
                      <div className="record row-between" key={u.id}>
                        <div>
                          <h3>{u.name}</h3>
                          <p>{u.email}</p>
                        </div>
                        <span className="status">
                          {u.role} · {u.accountType}
                        </span>
                      </div>
                    ))}
            </div>
          </>
        )}
      </div>
    </section>
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
  return (
    <div className="record">
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
          onChange={async (e) => {
            try {
              await api("request-status", {
                id: entry.id,
                status: e.target.value,
              });
              await reload();
            } catch (e) {
              setError((e as Error).message);
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
      <p>{entry.message}</p>
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
