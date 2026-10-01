"use client";
import { ConnectionPaths, NetworkEditorial } from "./brand-experience";
import { LinkButton } from "./link-button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import Close from "@mui/icons-material/Close";
import { ServiceCards, ListingCard } from "./cards";
import { Icon } from "./icon";
import { WhyConnect } from "./company-information";
import { seedListings, photo, articles } from "@/lib/catalog";
export function Home() {
  const [story, setStory] = useState(false);
  return (
    <>
      <section className="hero">
        <Image
          src="/images/hero.png"
          alt="African business professionals connected to global logistics and opportunities"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <ConnectionPaths className="home-connection-paths" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow orange">
              <span />
              Building connections that hold weight
            </div>
            <h1>
              People. Businesses.
              <br />
              Opportunities.
              <br />
              <em>Connected.</em>
            </h1>
            <p>
              Great things happen when the right connections come together. Find
              the people, services, and opportunities to move you forward.
            </p>
            <div className="button-row">
              <LinkButton
                href="/services"
                variant="contained"
                color="secondary"
                endIcon={<Icon name="arrow" />}
              >
                Explore Our Services
              </LinkButton>
              <Button
                className="light-button"
                onClick={() => setStory(true)}
                startIcon={<PlayCircleOutline />}
              >
                Our story
              </Button>
            </div>
            <div className="hero-footnote">
              <span className="mini-avatars">
                <i>SC</i>
                <i>KM</i>
                <i>AA</i>
              </span>
              <span>One platform. A world of possibilities.</span>
            </div>
          </div>
          <div className="hero-caption">
            <span className="caption-icon">
              <Icon name="globe" />
            </span>
            <div>
              <b>Local expertise. Global possibilities.</b>
              <small>Your next connection starts here.</small>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="container trust-grid">
          {[
            ["inventory", "7", "Connected service areas"],
            ["people", "People first", "Built around your goals"],
            ["check", "Reliability", "At the heart of every connection"],
            ["globe", "Local & global", "Opportunities without borders"],
          ].map(([icon, value, label]) => (
            <div key={value}>
              <Icon name={icon} />
              <span>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="section services-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                Our services
              </div>
              <h2>Seven ways we connect.</h2>
              <p>
                From your next hire to your next horizon. Let’s make it happen.
              </p>
            </div>
            <Link href="/services" className="text-link">
              Explore all services <Icon name="arrow" />
            </Link>
          </div>
          <ServiceCards />
        </div>
      </section>
      <NetworkEditorial />
      <section className="purpose-section">
        <div className="container purpose-grid">
          <div className="purpose-photo">
            <Image
              src={photo("photo-1497366754035-f200968a6e72")}
              alt="A bright collaborative workplace"
              fill
              sizes="(max-width:900px) 100vw, 40vw"
            />
            <div>
              <span className="eyebrow">The power of connection</span>
              <h3>
                Stronger together.
                <br />
                Further, together.
              </h3>
            </div>
          </div>
          <div className="purpose-copy">
            <div className="eyebrow">
              <span />
              About Solid Connect
            </div>
            <h2>
              Building connections
              <br />
              that hold weight.
            </h2>
            <p>
              We connect people, businesses, and industries through reliable
              solutions. Because the right connection doesn’t just solve today’s
              challenge. It opens tomorrow’s opportunity.
            </p>
            <LinkButton
              href="/about"
              variant="contained"
              color="secondary"
              endIcon={<Icon name="arrow" />}
            >
              Get to know us
            </LinkButton>
          </div>
          <div className="purpose-values">
            {[
              [
                "globe",
                "Our vision",
                "Connections that empower people and businesses to grow with trust, reliability, and speed.",
              ],
              [
                "people",
                "Our mission",
                "Help businesses communicate, collaborate, and scale without friction.",
              ],
              [
                "check",
                "Our approach",
                "Reliability first. Clarity and simplicity. Partnerships built to last.",
              ],
            ].map(([icon, title, text]) => (
              <div key={title}>
                <span>
                  <Icon name={icon} />
                </span>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                The marketplace
              </div>
              <h2>Your next opportunity is here.</h2>
              <p>
                Discover a few of the connections you can make. Sample listings
                shown.
              </p>
            </div>
            <Link className="text-link" href="/marketplace">
              Explore marketplace <Icon name="arrow" />
            </Link>
          </div>
          <div className="listing-grid">
            {seedListings.slice(0, 3).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>
      <section className="how-section section">
        <div className="container">
          <div className="section-heading center">
            <div>
              <div className="eyebrow">A simpler way forward</div>
              <h2>From possibility to progress.</h2>
            </div>
          </div>
          <div className="steps">
            {[
              ["Discover", "Explore opportunities that match your ambitions."],
              ["Connect", "Start a conversation with the right people."],
              ["Transact", "Agree on the details and take the next step."],
              ["Grow", "Build a relationship that keeps moving you forward."],
            ].map(([title, text], i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                Insights & resources
              </div>
              <h2>A little knowledge. A bigger advantage.</h2>
            </div>
            <Link className="text-link" href="/resources">
              All insights <Icon name="arrow" />
            </Link>
          </div>
          <div className="listing-grid">
            {articles.map((a) => (
              <Link
                href={`/resources/${a.slug}`}
                className="article-card"
                key={a.slug}
              >
                <div className="article-image">
                  <Image
                    src={photo(a.image)}
                    alt={a.category}
                    fill
                    sizes="33vw"
                  />
                </div>
                <small>{a.category} · 4 min read</small>
                <h3>{a.title}</h3>
                <p>{a.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <WhyConnect />
      <Cta />
      <Dialog
        open={story}
        onClose={() => setStory(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="row-between">
          Building connections that hold weight
          <IconButton onClick={() => setStory(false)} aria-label="Close story">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p>
            Solid Connect is a technology and solutions company focused on
            creating reliable, scalable connections between people, teams, and
            systems.
          </p>
          <p>
            Our seven service areas bring talent, craftsmanship, logistics,
            property, distribution, marketing and international trade together.
          </p>
          <p>
            Reliability first. Clarity and simplicity. Long-term partnerships.
          </p>
          <LinkButton href="/about" onClick={() => setStory(false)}>
            Read our story
          </LinkButton>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Cta() {
  return (
    <section className="cta-section">
      <div className="container row-between">
        <div>
          <div className="eyebrow">Let’s build what’s next</div>
          <h2>
            Better connections.
            <br />
            Bigger possibilities.
          </h2>
        </div>
        <div>
          <p>Whatever your next step, take it with Solid Connect.</p>
          <div className="button-row">
            <LinkButton
              href="/marketplace"
              variant="contained"
              color="secondary"
            >
              Explore the marketplace
            </LinkButton>
            <LinkButton href="/contact" className="light-button">
              Talk to us <Icon name="arrow" />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
