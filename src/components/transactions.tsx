"use client";
import { LinkButton } from "./link-button";
import { useState } from "react";
import { Alert, Button, TextField, IconButton } from "@mui/material";
import Close from "@mui/icons-material/Close";
import { PageHero } from "./public-pages";
import { Icon } from "./icon";
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
