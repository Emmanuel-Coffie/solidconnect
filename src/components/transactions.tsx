"use client";
import { LinkButton } from "./link-button";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Skeleton,
} from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import Close from "@mui/icons-material/Close";
import { api, useAuth } from "./providers";
import { PageHero } from "./public-pages";
import { Icon } from "./icon";
import { money } from "@/lib/catalog";
import type { Payment } from "@/lib/store";
type Shipment = {
  reference: string;
  origin: string;
  destination: string;
  status: string;
  eta: string;
  demo: boolean;
  events: { label: string; date: string; done: boolean }[];
};
export function Track() {
  const [reference, setReference] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function track(value = reference) {
    setError("");
    setBusy(true);
    setShipment(null);
    try {
      const res = await fetch(
        `/api/platform?action=track&reference=${encodeURIComponent(value)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShipment(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHero
        title="Every step. Connected."
        description="Know where your shipment is and what comes next."
        eyebrow="Shipment tracking"
      />
      <section className="workspace">
        <div className="container">
          <div className="panel">
            <h2>Track your shipment</h2>
            <form
              noValidate
              className="filter-bar"
              onSubmit={(e) => {
                e.preventDefault();
                track();
              }}
            >
              <TextField
                label="Tracking number"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: reference ? (
                      <IconButton
                        aria-label="Clear tracking number"
                        onClick={() => {
                          setReference("");
                          setShipment(null);
                        }}
                      >
                        <Close />
                      </IconButton>
                    ) : null,
                  },
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={busy || !reference.trim()}
              >
                {busy ? "Checking…" : "Track shipment"}
              </Button>
            </form>
            <p className="small-caption">
              Explore an example:{" "}
              <Button
                size="small"
                onClick={() => {
                  setReference("SC-DEMO-2026");
                  track("SC-DEMO-2026");
                }}
              >
                SC-DEMO-2026
              </Button>
            </p>
            {error && <Alert severity="error">{error}</Alert>}
            {shipment && (
              <>
                <div className="row-between" style={{ marginTop: 30 }}>
                  <div>
                    <h3>{shipment.reference}</h3>
                    <p>Estimated arrival: {shipment.eta}</p>
                  </div>
                  <span className="status">{shipment.status}</span>
                </div>
                <div className="tracking-timeline">
                  {shipment.events.map((event) => (
                    <div
                      key={event.label}
                      className={`tracking-step ${event.done ? "done" : ""}`}
                    >
                      <span>
                        <Icon name="check" />
                      </span>
                      <b>{event.label}</b>
                      <small>{event.date}</small>
                    </div>
                  ))}
                </div>
                <div className="route-map">
                  <div>
                    <Icon name="home" />
                    <h4>{shipment.origin}</h4>
                    <small>Origin</small>
                  </div>
                  <div className="route-line">
                    <Icon name="shipping" />
                  </div>
                  <div>
                    <Icon name="globe" />
                    <h4>{shipment.destination}</h4>
                    <small>Destination</small>
                  </div>
                </div>
                <div className="notice">
                  Demonstration shipment. Route illustration is schematic; it is
                  not live vehicle tracking.
                </div>
                <LinkButton href="/contact">
                  Contact shipment support
                </LinkButton>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
const products = [
  {
    id: "professional",
    label: "Professional membership · one month",
    amount: 99,
  },
  { id: "consultation", label: "Business consultation", amount: 1200 },
  { id: "listing", label: "Featured listing credit", amount: 49 },
];
export function Checkout() {
  const { user, loading } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(
    products.some((p) => p.id === params.get("product"))
      ? params.get("product")!
      : "professional",
  );
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [billing, setBilling] = useState("");
  const ref = params.get("reference");
  useEffect(() => {
    if (!loading && !user)
      router.replace(
        `/login?next=${encodeURIComponent("/checkout" + (params.toString() ? `?${params}` : ""))}`,
      );
  }, [loading, user, router, params]);
  useEffect(() => {
    if (ref && user)
      fetch(`/api/platform?action=payment&reference=${encodeURIComponent(ref)}`)
        .then((r) => r.json())
        .then((d) => (d.payment ? setPayment(d.payment) : setError(d.error)))
        .catch(() => setError("Could not load the payment. Try again."));
  }, [ref, user]);
  if (!user) return <div className="loading-page">Loading checkout…</div>;
  const selected = products.find((p) => p.id === product)!;
  return (
    <>
      <PageHero
        title="Your next step, made simple."
        eyebrow="Secure checkout"
      />
      <section className="workspace">
        <div className="container content-grid">
          <div className="panel">
            <h2>{payment ? "Test your payment" : "Payment details"}</h2>
            {payment ? (
              <>
                <Alert severity="info">
                  This is a test transaction. No money is charged and no card
                  details are collected.
                </Alert>
                <p style={{ margin: "22px 0" }}>
                  Reference: {payment.reference}
                </p>
                <div className="button-row">
                  <Button
                    variant="contained"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api("mock-settle", {
                          reference: payment.reference,
                          status: "success",
                        });
                        router.push(
                          `/payment/success?reference=${payment.reference}`,
                        );
                      } catch (e) {
                        setError((e as Error).message);
                        setBusy(false);
                      }
                    }}
                  >
                    Simulate successful payment
                  </Button>
                  <Button
                    color="error"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api("mock-settle", {
                          reference: payment.reference,
                          status: "failed",
                        });
                        router.push(
                          `/payment/failed?reference=${payment.reference}`,
                        );
                      } catch (e) {
                        setError((e as Error).message);
                        setBusy(false);
                      }
                    }}
                  >
                    Simulate failed payment
                  </Button>
                </div>
              </>
            ) : (
              <form
                noValidate
                className="form-stack"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError("");
                  if (billing.trim().length < 2) {
                    setError("Please add your billing name.");
                    return;
                  }
                  setBusy(true);
                  try {
                    const result = await api<{ url: string; payment: Payment }>(
                      "checkout",
                      { product, billing },
                    );
                    if (result.payment.provider === "mock") {
                      setPayment(result.payment);
                      router.replace(result.url);
                    } else window.location.assign(result.url);
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <TextField
                  label="Billing name"
                  value={billing}
                  onChange={(e) => setBilling(e.target.value)}
                />
                <TextField label="Email address" value={user.email} disabled />
                <TextField
                  label="Choose a service"
                  select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Alert severity="info">
                  Demo prices. Payment mode is confirmed before payment. Live
                  payments are handled by Paystack; the platform never asks for
                  your card number.
                </Alert>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={busy}
                >
                  {busy ? "Preparing checkout…" : "Continue to payment"}
                </Button>
              </form>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </div>
          <div className="panel detail-side">
            <h2>Order summary</h2>
            <p>{payment?.description ?? selected.label}</p>
            <div className="activity-row row-between">
              <span>Subtotal</span>
              <b>{money(payment ? payment.amount / 100 : selected.amount)}</b>
            </div>
            <div className="activity-row row-between">
              <span>Platform fee</span>
              <b>{money(0)}</b>
            </div>
            <div className="activity-row row-between">
              <strong>Total</strong>
              <strong>
                {money(payment ? payment.amount / 100 : selected.amount)}
              </strong>
            </div>
            <p className="small-caption" style={{ marginTop: 20 }}>
              One-time charge. No automatic renewal. Benefits are illustrative
              in this demo.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export function PaymentResult() {
  const params = useSearchParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function verify() {
    const reference = params.get("reference");
    if (!reference) {
      setError(
        "No payment reference was provided. Open your payment history to find the transaction.",
      );
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(
        `/api/platform?action=payment&reference=${encodeURIComponent(reference)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayment(data.payment);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    verify(); /* A result is always verified on the server, never inferred from the URL. */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return (
    <section className="workspace">
      <div className="panel payment-result">
        {busy && !payment ? (
          <Skeleton height={250} />
        ) : (
          <>
            {payment?.status === "success" ? (
              <CheckCircleOutline />
            ) : (
              <ErrorOutline style={{ color: "var(--orange)" }} />
            )}
            <h1>
              {payment?.status === "success"
                ? payment.provider === "mock"
                  ? "Test payment successful"
                  : "Payment successful"
                : payment?.status === "failed"
                  ? "Payment was not completed"
                  : "Checking your payment"}
            </h1>
            {payment && (
              <>
                <p>
                  {payment.provider === "mock"
                    ? "Demo transaction — no money was charged."
                    : "Your payment status has been verified with the provider."}
                </p>
                <h2>{money(payment.amount / 100)}</h2>
                <p>{payment.description}</p>
                <p className="small-caption">Reference: {payment.reference}</p>
              </>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            <div className="button-row">
              <LinkButton href="/dashboard/payments" variant="contained">
                View payment history
              </LinkButton>
              {payment?.status !== "success" && (
                <Button onClick={verify} disabled={busy}>
                  Check again
                </Button>
              )}
              {payment?.status === "failed" && (
                <LinkButton href="/checkout">Try again</LinkButton>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
