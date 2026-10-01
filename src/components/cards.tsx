"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconButton, Snackbar, Alert } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import VerifiedOutlined from "@mui/icons-material/VerifiedOutlined";
import { services, photo, money, type Listing } from "@/lib/catalog";
import { Icon } from "./icon";
import { api, useAuth } from "./providers";
export function ServiceCards({ large = false }: { large?: boolean }) {
  return (
    <div className={`service-grid ${large ? "large" : ""}`}>
      {services.map((s) => (
        <Link
          href={`/services/${s.slug}`}
          className="service-card"
          key={s.slug}
        >
          <div className="service-image">
            <Image
              src={photo(s.image, 500)}
              alt={s.name}
              fill
              sizes="(max-width:600px) 50vw, 20vw"
            />
          </div>
          <span className="service-icon" style={{ background: s.color }}>
            <Icon name={s.icon} />
          </span>
          <div className="service-body">
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <span className="service-arrow">
              <Icon name="arrow" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function ListingCard({
  listing,
  initialSaved = false,
}: {
  listing: Listing;
  initialSaved?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  async function toggle() {
    if (!user) {
      router.push(`/login?next=/marketplace/${listing.id}`);
      return;
    }
    setBusy(true);
    try {
      const result = await api<{ saved: boolean }>("save", {
        listingId: listing.id,
      });
      setSaved(result.saved);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="listing-card">
      <div className="listing-image">
        <Link href={`/marketplace/${listing.id}`} tabIndex={-1}>
          <Image
            src={photo(listing.image, 700)}
            alt={listing.title}
            fill
            sizes="(max-width:600px) 100vw, 33vw"
          />
        </Link>
        <span className="category-badge">{listing.category}</span>
        <IconButton
          className="save-button"
          aria-label={`${saved ? "Unsave" : "Save"} ${listing.title}`}
          aria-pressed={saved}
          disabled={busy}
          onClick={toggle}
        >
          {saved ? <Favorite color="secondary" /> : <FavoriteBorder />}
        </IconButton>
      </div>
      <div className="listing-body">
        <div className="listing-provider">
          {listing.provider}
          {listing.verified && <VerifiedOutlined fontSize="inherit" />}
          {listing.demo && <span>Demo</span>}
        </div>
        <Link href={`/marketplace/${listing.id}`}>
          <h3>{listing.title}</h3>
        </Link>
        <p className="location">
          <PlaceOutlined fontSize="inherit" />
          {listing.location}
        </p>
        <div className="listing-bottom">
          <strong>{listing.price ? money(listing.price) : "Let’s talk"}</strong>
          <span>{listing.unit}</span>
          <Link
            href={`/marketplace/${listing.id}`}
            aria-label={`View ${listing.title}`}
          >
            <Icon name="arrow" />
          </Link>
        </div>
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </article>
  );
}
