"use client";
import { LinkButton } from "./link-button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Alert,
  TextField,
  MenuItem,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Add from "@mui/icons-material/Add";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { api, useAuth } from "./providers";
import { Icon } from "./icon";
import { ListingCard } from "./cards";
import { CategorySelect } from "./forms";
import { listingSchema } from "@/lib/validation";
import { type Listing, money, services, photo } from "@/lib/catalog";
import type { Entry, Payment, Message, User } from "@/lib/store";
export type DashboardData = {
  user: Omit<User, "passwordHash">;
  listings: Listing[];
  requests: Entry[];
  saved: Listing[];
  messages: Message[];
  payments: Payment[];
  notifications: {
    id: string;
    text: string;
    read: boolean;
    createdAt: string;
  }[];
};
const links = [
  ["Overview", "/dashboard", "dashboard"],
  ["My profile", "/dashboard/profile", "person"],
  ["My listings", "/dashboard/listings", "inventory"],
  ["My orders", "/dashboard/orders", "inventory"],
  ["My requests", "/dashboard/requests", "chat"],
  ["Applications", "/dashboard/applications", "people"],
  ["Saved items", "/dashboard/saved", "saved"],
  ["Messages", "/dashboard/messages", "chat"],
  ["Payments", "/dashboard/payments", "receipt"],
  ["Notifications", "/dashboard/notifications", "check"],
  ["Settings", "/dashboard/settings", "person"],
];
function NavIcon({ name }: { name: string }) {
  if (name === "dashboard") return <DashboardOutlined />;
  if (name === "person") return <PersonOutline />;
  if (name === "chat") return <ChatBubbleOutline />;
  if (name === "saved") return <BookmarkBorder />;
  if (name === "receipt") return <ReceiptLongOutlined />;
  return <Icon name={name} />;
}
export function Dashboard({ section = "overview" }: { section?: string }) {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setData(await api<DashboardData>("dashboard"));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    if (!loading && !user)
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    if (user) load();
  }, [user, loading, router, pathname, load]);
  if (!user)
    return (
      <div className="loading-page">
        <p>{loading ? "Loading your account…" : "Taking you to sign in…"}</p>
      </div>
    );
  const title =
    section === "overview"
      ? `Welcome back, ${user.name.split(" ")[0]}.`
      : section === "new"
        ? "Create a listing"
        : (links.find((l) => l[1].endsWith(`/${section}`))?.[0] ??
          "Your dashboard");
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="profile-summary">
          <span className="avatar">{user.name[0]}</span>
          <div>
            <b>{user.company || user.name}</b>
            <small>{user.accountType} account</small>
          </div>
        </div>
        <h4>Your workspace</h4>
        {links.map(([label, url, icon]) => (
          <Link
            href={url}
            className={pathname === url ? "active" : ""}
            key={url}
          >
            <NavIcon name={icon} />
            {label}
          </Link>
        ))}
        {user.role === "ADMIN" && (
          <Link href="/admin">
            <Icon name="check" />
            Administration
          </Link>
        )}
        <Button
          onClick={async () => {
            await api("logout", {});
            await refresh();
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </aside>
      <div className="dashboard-body">
        <div className="dashboard-title row-between">
          <div>
            <div className="eyebrow">Your connections, in one place</div>
            <h1>{title}</h1>
            <p>
              {section === "overview"
                ? "Here’s what’s happening in your Solid Connect world."
                : "Keep your opportunities moving forward."}
            </p>
          </div>
          {section !== "new" && (
            <LinkButton
              href="/dashboard/listings/new"
              variant="contained"
              color="secondary"
              startIcon={<Add />}
            >
              Post a listing
            </LinkButton>
          )}
        </div>
        {error && (
          <Alert
            severity="error"
            action={<Button onClick={load}>Retry</Button>}
          >
            {error}
          </Alert>
        )}
        {!data ? (
          <Skeleton variant="rounded" height={350} />
        ) : section === "overview" ? (
          <Overview data={data} />
        ) : section === "new" ? (
          <ListingWizard onCreated={load} />
        ) : section === "profile" || section === "settings" ? (
          <ProfileForm
            data={data}
            refresh={async () => {
              await load();
              await refresh();
            }}
          />
        ) : section === "saved" ? (
          data.saved.length ? (
            <div className="listing-grid">
              {data.saved.map((l) => (
                <ListingCard key={l.id} listing={l} initialSaved />
              ))}
            </div>
          ) : (
            <Empty
              title="Your next opportunity is worth saving."
              text="Save a listing in the marketplace and find it here."
            />
          )
        ) : section === "messages" ? (
          <Messages data={data} reload={load} />
        ) : section === "listings" ? (
          <MyListings data={data} reload={load} />
        ) : section === "payments" ? (
          <PaymentHistory payments={data.payments} />
        ) : section === "notifications" ? (
          <Notifications data={data} reload={load} />
        ) : (
          <Requests data={data} section={section} reload={load} />
        )}
      </div>
    </div>
  );
}
export function Empty({
  title = "Nothing here just yet.",
  text = "Your activity will appear here as you make new connections.",
  href = "/marketplace",
  cta = "Explore marketplace",
}: {
  title?: string;
  text?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
      <LinkButton href={href} variant="outlined">
        {cta}
      </LinkButton>
    </div>
  );
}
function Overview({ data }: { data: DashboardData }) {
  return (
    <>
      <div className="stats-grid">
        {[
          [
            "Active listings",
            String(
              data.listings.filter((l) => l.status === "published").length,
            ),
          ],
          ["Saved opportunities", String(data.saved.length)],
          [
            "Ongoing requests",
            String(
              data.requests.filter(
                (r) => r.status !== "Completed" && r.status !== "Rejected",
              ).length,
            ),
          ],
          [
            "Total payments",
            money(
              data.payments
                .filter((p) => p.status === "success")
                .reduce((sum, p) => sum + p.amount / 100, 0),
            ),
          ],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <div className="panel">
          <div className="row-between">
            <h3>Recent activity</h3>
            <Link href="/dashboard/requests" className="text-link">
              View all
            </Link>
          </div>
          {data.requests.length ? (
            data.requests
              .slice(-5)
              .reverse()
              .map((r) => (
                <Link
                  href="/dashboard/messages"
                  className="activity-row"
                  key={r.id}
                >
                  <span className="menu-icon">
                    <Icon name="people" />
                  </span>
                  <div>
                    <h4>{r.subject}</h4>
                    <p>
                      {r.kind} ·{" "}
                      {new Date(r.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span className="status">{r.status}</span>
                </Link>
              ))
          ) : (
            <Empty
              title="Start with a connection."
              text="Enquiries, applications and bookings appear here."
            />
          )}
        </div>
        <div className="panel">
          <h3>Make your next move</h3>
          <div className="quick-actions">
            {[
              ["Post a new listing", "/dashboard/listings/new", "inventory"],
              ["Find your next hire", "/services/recruitment", "people"],
              ["Track a shipment", "/track", "shipping"],
              ["Request a quote", "/services/logistics", "globe"],
              ["Explore opportunities", "/marketplace", "arrow"],
            ].map(([label, url, icon]) => (
              <Link href={url} key={label}>
                <Icon name={icon} />
                {label}
                <span style={{ marginLeft: "auto" }}>↗</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="notice">
        Your workspace starts with your own activity. Marketplace listings
        marked Demo are examples.
      </div>
    </>
  );
}
function ProfileForm({
  data,
  refresh,
}: {
  data: DashboardData;
  refresh: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: data.user.name,
    bio: data.user.bio ?? "",
    company: data.user.company ?? "",
    phone: data.user.phone ?? "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="panel wide-form">
      <h2>Your profile</h2>
      <form
        noValidate
        className="form-stack"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            await api("profile", form);
            await refresh();
            setStatus("Profile updated.");
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {(["name", "company", "phone", "bio"] as const).map((key) => (
          <TextField
            key={key}
            label={
              {
                name: "Full name",
                company: "Business name (optional)",
                phone: "Phone number (optional)",
                bio: "About you",
              }[key]
            }
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            multiline={key === "bio"}
            minRows={key === "bio" ? 4 : undefined}
          />
        ))}
        <TextField
          label="Email address"
          value={data.user.email}
          disabled
          helperText="Contact support to change your email address."
        />
        {data.user.emailVerified ? (
          <Alert severity="success">Email verified</Alert>
        ) : (
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const response = await api<{ message: string }>(
                  "send-verification",
                  {},
                );
                setStatus(response.message);
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Send email verification link
          </Button>
        )}
        {status && <Alert severity="success">{status}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
function MyListings({
  data,
  reload,
}: {
  data: DashboardData;
  reload: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<Listing | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!data.listings.length)
    return (
      <Empty
        title="Your expertise belongs here."
        text="Create your first listing to connect with the people who need you."
        href="/dashboard/listings/new"
        cta="Create a listing"
      />
    );
  return (
    <div className="record-list">
      {error && <Alert severity="error">{error}</Alert>}
      {data.listings.map((l) => (
        <div className="record" key={l.id}>
          <div className="row-between">
            <div>
              <small className="muted">
                {l.category} · {l.location}
              </small>
              <h3>{l.title}</h3>
            </div>
            <span className={`status ${l.status}`}>{l.status}</span>
          </div>
          <p>{l.description}</p>
          <div className="button-row">
            <LinkButton href={`/dashboard/listings/new?edit=${l.id}`}>
              Edit listing
            </LinkButton>
            {l.status === "published" && (
              <LinkButton href={`/marketplace/${l.id}`}>
                View listing
              </LinkButton>
            )}
            {l.status !== "suspended" && (
              <Button color="error" onClick={() => setSelected(l)}>
                Withdraw listing
              </Button>
            )}
          </div>
        </div>
      ))}
      <Dialog open={!!selected} onClose={() => !busy && setSelected(null)}>
        <DialogTitle>Withdraw this listing?</DialogTitle>
        <DialogContent>
          <p>
            “{selected?.title}” will no longer appear in the marketplace. You
            can edit and resubmit it later.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)} disabled={busy}>
            Keep listing
          </Button>
          <Button
            color="error"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await api("listing-status", { id: selected?.id });
                setSelected(null);
                await reload();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Withdraw listing
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
function Requests({
  data,
  section,
  reload,
}: {
  data: DashboardData;
  section: string;
  reload: () => Promise<void>;
}) {
  const [error, setError] = useState("");
  const items = data.requests.filter((r) =>
    section === "applications"
      ? r.kind === "Job application"
      : section === "orders"
        ? r.status === "Completed" || r.status === "Quoted"
        : true,
  );
  return items.length ? (
    <div className="record-list">
      {error && <Alert severity="error">{error}</Alert>}
      {items.map((r) => (
        <div className="record" key={r.id}>
          <div className="row-between">
            <div>
              <small className="muted">
                {r.kind} · {new Date(r.createdAt).toLocaleDateString("en-GB")}
              </small>
              <h3>{r.subject}</h3>
            </div>
            <span className="status">{r.status}</span>
          </div>
          <p>{r.message}</p>
          {r.details && (
            <p>
              {Object.entries(r.details)
                .filter(([, v]) => v)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ")}
            </p>
          )}
          <div className="button-row">
            <LinkButton href={`/dashboard/messages?conversation=${r.id}`}>
              Open conversation
            </LinkButton>
            {data.listings.some((l) => l.id === r.listingId) && (
              <TextField
                select
                label="Application status"
                value={r.status}
                sx={{ maxWidth: 200 }}
                onChange={async (e) => {
                  try {
                    await api("request-status", {
                      id: r.id,
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
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Empty
      title={
        section === "applications"
          ? "Your next chapter is waiting."
          : section === "orders"
            ? "No confirmed orders yet."
            : "No requests yet."
      }
      text={
        section === "applications"
          ? "Apply for a role and track your application here."
          : "Start a conversation from a service or marketplace listing."
      }
    />
  );
}
function Messages({
  data,
  reload,
}: {
  data: DashboardData;
  reload: () => Promise<void>;
}) {
  const [selected, setSelected] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("conversation");
    setSelected(
      id && data.requests.some((r) => r.id === id)
        ? id
        : (data.requests[0]?.id ?? ""),
    );
  }, [data.requests]);
  const entry = data.requests.find((r) => r.id === selected);
  if (!data.requests.length)
    return (
      <Empty
        title="A conversation can change everything."
        text="Send an enquiry to start a conversation with a provider."
      />
    );
  return (
    <div className="messages-layout">
      <div className="conversation-list">
        {data.requests.map((r) => (
          <button
            className={selected === r.id ? "active" : ""}
            key={r.id}
            onClick={() => setSelected(r.id)}
          >
            <b>{r.subject}</b>
            <small style={{ display: "block" }}>{r.kind}</small>
          </button>
        ))}
      </div>
      <div className="message-area">
        <div className="row-between">
          <h3>{entry?.subject}</h3>
          <Button onClick={reload} size="small">
            Refresh
          </Button>
        </div>
        <p className="small-caption">
          Messages are saved in this platform. Refresh to check for replies.
        </p>
        <div className="message-history">
          <div className="message-bubble">
            {entry?.message}
            <small>Initial enquiry</small>
          </div>
          {data.messages
            .filter((m) => m.conversationId === selected)
            .map((m) => (
              <div
                className={`message-bubble ${m.userId === data.user.id ? "own" : ""}`}
                key={m.id}
              >
                {m.text}
                <small>{new Date(m.createdAt).toLocaleString("en-GB")}</small>
              </div>
            ))}
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        <form
          noValidate
          className="message-compose"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await api("message", { conversationId: selected, text });
              setText("");
              await reload();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <TextField
            label="Write a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={busy || !text.trim()}
          >
            {busy ? "Sending…" : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
export function PaymentHistory({ payments }: { payments: Payment[] }) {
  return payments.length ? (
    <div className="record-list">
      {payments
        .slice()
        .reverse()
        .map((p) => (
          <div className="record row-between" key={p.id}>
            <div>
              <h3>{p.description}</h3>
              <p>{p.reference}</p>
              <small>
                {p.provider === "mock" ? "Test payment · " : ""}
                {new Date(p.createdAt).toLocaleDateString("en-GB")}
              </small>
            </div>
            <div>
              <strong>{money(p.amount / 100)}</strong>
              <p>
                <span className={`status ${p.status}`}>{p.status}</span>
              </p>
              <Link
                className="text-link"
                href={`/payment/success?reference=${p.reference}`}
              >
                View receipt
              </Link>
            </div>
          </div>
        ))}
    </div>
  ) : (
    <Empty
      title="No payments yet."
      text="Your transaction history and receipts will appear here."
      href="/pricing"
      cta="Explore plans"
    />
  );
}
function Notifications({
  data,
  reload,
}: {
  data: DashboardData;
  reload: () => Promise<void>;
}) {
  const [error, setError] = useState("");
  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        sx={{ mb: 2 }}
        onClick={async () => {
          try {
            await api("read-notifications", {});
            await reload();
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        Mark all as read
      </Button>
      {data.notifications.length ? (
        <div className="record-list">
          {data.notifications
            .slice()
            .reverse()
            .map((n) => (
              <div className="record" key={n.id}>
                <div className="row-between">
                  <h3>{n.text}</h3>
                  {!n.read && <span className="status">New</span>}
                </div>
                <p>{new Date(n.createdAt).toLocaleString("en-GB")}</p>
              </div>
            ))}
        </div>
      ) : (
        <Empty
          title="You’re all caught up."
          text="Updates about your requests will appear here."
        />
      )}
    </>
  );
}
const draftDefault = {
  title: "",
  category: "Jobs",
  location: "",
  price: "0",
  unit: "/ month",
  description: "",
  image: services[0].image as string,
  details: {} as Record<string, string>,
};
function ListingWizard({ onCreated }: { onCreated: () => Promise<void> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(draftDefault);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState("");
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("edit");
    if (id)
      api<DashboardData>("dashboard")
        .then((d) => {
          const l = d.listings.find((x) => x.id === id);
          if (l) {
            setForm({ ...l, price: String(l.price) });
            setEditId(id);
          }
        })
        .catch((e) => setError(e.message));
  }, []);
  const draftKey = `solid-listing-draft:${user?.id}`;
  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value });
  function next() {
    setError("");
    if (step === 0 && (!form.title.trim() || !form.location.trim())) {
      setError("Add a title and location to continue.");
      return;
    }
    if (step === 1) {
      const parsed = listingSchema.safeParse(form);
      if (!parsed.success) {
        setError(parsed.error.issues[0].message);
        return;
      }
    }
    setStep(step + 1);
  }
  return (
    <div className="panel wide-form">
      <div className="row-between">
        <h2>{editId ? "Edit your listing" : "Share your next opportunity."}</h2>
        <small>Step {step + 1} of 3</small>
      </div>
      <div className="form-steps">
        {[0, 1, 2].map((i) => (
          <span key={i} className={step >= i ? "active" : ""} />
        ))}
      </div>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}
      <form
        noValidate
        className="form-stack"
        onSubmit={async (e) => {
          e.preventDefault();
          if (step < 2) {
            next();
            return;
          }
          setBusy(true);
          try {
            await api("listing", { ...form, id: editId || undefined });
            localStorage.removeItem(draftKey);
            await onCreated();
            router.push("/dashboard/listings");
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {step === 0 ? (
          <>
            <CategorySelect
              value={form.category}
              onChange={(v) => {
                setForm({
                  ...form,
                  category: v,
                  image:
                    services.find((s) => s.category === v)?.image ??
                    services[0].image,
                });
              }}
            />
            <TextField
              label="Listing title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              helperText="Be specific. Tell people what you offer."
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
            <div className="form-grid">
              <TextField
                label="Price or salary (GHS)"
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
              <TextField
                label="Price unit"
                value={form.unit}
                onChange={(e) => update("unit", e.target.value)}
                helperText="For example: / month, per item, starting from"
              />
            </div>
          </>
        ) : step === 1 ? (
          <>
            <TextField
              multiline
              minRows={5}
              label="Description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              helperText="At least 30 characters. Include scope, requirements, or key features."
            />
            {(form.category === "Jobs"
              ? ["Employment type", "Experience", "Industry"]
              : form.category === "Properties"
                ? ["Bedrooms", "Bathrooms", "Area", "Furnished"]
                : ["Specialty", "Availability"]
            ).map((label) => (
              <TextField
                label={label}
                key={label}
                value={form.details[label] ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    details: { ...form.details, [label]: e.target.value },
                  })
                }
              />
            ))}
            <img
              className="preview-image"
              src={photo(form.image)}
              alt="Listing preview"
            />
            <Button component="label" variant="outlined" disabled={busy}>
              Upload a listing image
              <input
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const body = new FormData();
                  body.append("file", file);
                  setBusy(true);
                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body,
                    });
                    const result = await res.json();
                    if (!res.ok) throw new Error(result.error);
                    update("image", result.url);
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </Button>
            <p className="small-caption">
              JPG, PNG or WebP, up to 5 MB. Only upload images you are entitled
              to use.
            </p>
          </>
        ) : (
          <>
            <div className="notice">
              Review your listing. It will be submitted for moderation before
              appearing in the marketplace.
            </div>
            <img
              className="preview-image"
              src={photo(form.image)}
              alt={form.title}
            />
            <h2>{form.title}</h2>
            <p>
              {form.category} · {form.location} · {money(Number(form.price))}{" "}
              {form.unit}
            </p>
            <p>{form.description}</p>
          </>
        )}
        <div className="row-between">
          <div className="button-row">
            {step > 0 && (
              <Button onClick={() => setStep(step - 1)}>Back</Button>
            )}
            <Button
              onClick={() => {
                try {
                  localStorage.setItem(draftKey, JSON.stringify(form));
                  setNotice("Draft saved in this browser.");
                } catch {
                  setError("Your browser could not save this draft.");
                }
              }}
            >
              Save draft
            </Button>
            {step === 0 && (
              <Button
                onClick={() => {
                  try {
                    const saved = localStorage.getItem(draftKey);
                    if (saved) {
                      setForm({ ...draftDefault, ...JSON.parse(saved) });
                      setNotice("Draft restored.");
                    } else setNotice("No saved draft in this browser.");
                  } catch {
                    setError("This draft could not be restored.");
                  }
                }}
              >
                Restore draft
              </Button>
            )}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={busy}
          >
            {busy ? "Saving…" : step === 2 ? "Submit for review" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
