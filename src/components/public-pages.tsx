"use client";
import { LinkButton } from "./link-button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { services, photo, seedListings, articles } from "@/lib/catalog";
import { ServiceCards, ListingCard } from "./cards";
import { Cta } from "./home";
import { Icon } from "./icon";
import { RequestForm } from "./forms";
import { serviceContent } from "@/lib/service-content";
import { ServiceIntroduction, ServiceInformation } from "./service-information";
import { ArticleBody } from "./article";
import { AboutNetwork } from "./company-information";
export { ExperienceHero as PageHero } from "./brand-experience";
import { ExperienceHero as PageHero } from "./brand-experience";
export function Services() {
  return (
    <>
      <PageHero
        title="Seven ways to create stronger connections."
        description="One reliable partner. An ecosystem of services built around your next step."
      />
      <section className="section">
        <div className="container">
          <ServiceCards large />
        </div>
      </section>
      <section className="section how-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                Better together
              </div>
              <h2>Connected services. Greater possibilities.</h2>
            </div>
          </div>
          <div className="capability-grid">
            {[
              [
                "Recruitment + Logistics",
                "Build the team behind a stronger supply chain.",
              ],
              [
                "Distribution + Sales",
                "Get your products to market, and help them move.",
              ],
              [
                "Trade + Logistics",
                "Connect international sourcing to reliable delivery.",
              ],
              [
                "Property + Management",
                "Find the right space and keep it working for you.",
              ],
            ].map(([a, b]) => (
              <div className="capability" key={a}>
                <Icon name="check" />
                <h3>{a}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
export function ServicePage({ slug }: { slug: string }) {
  const service = services.find((s) => s.slug === slug)!;
  const [open, setOpen] = useState(false);
  const matches = seedListings.filter((l) => l.category === service.category);
  return (
    <>
      <PageHero
        title={service.headline}
        description={service.description}
        image={service.image}
        eyebrow={service.name}
      >
        <div className="button-row">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(true)}
          >
            {service.cta}
          </Button>
          <LinkButton
            href={
              slug === "logistics"
                ? "/track"
                : `/marketplace?category=${encodeURIComponent(service.category)}`
            }
            className="light-button"
          >
            {slug === "logistics"
              ? "Track a shipment"
              : slug === "recruitment"
                ? "Find jobs"
                : "Explore opportunities"}
          </LinkButton>
        </div>
      </PageHero>
      <ServiceIntroduction slug={slug} />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                What we do
              </div>
              <h2>Expertise you can build on.</h2>
            </div>
          </div>
          <div className="capability-grid">
            {service.capabilities.map((c, i) => (
              <div className="capability" key={c}>
                <Icon name={service.icon} />
                <h3>{c}</h3>
                <p>{serviceContent[slug].capabilities[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section how-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                Explore the network
              </div>
              <h2>
                {slug === "recruitment"
                  ? "Your next role starts here."
                  : "Make your next connection."}
              </h2>
              <p>Explore sample opportunities from the marketplace.</p>
            </div>
            <Link
              className="text-link"
              href={`/marketplace?category=${encodeURIComponent(service.category)}`}
            >
              View all <Icon name="arrow" />
            </Link>
          </div>
          <div className="listing-grid">
            {matches.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>
      <ServiceInformation slug={slug} onEnquire={() => setOpen(true)} />
      <Cta />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="row-between">
          {service.cta}
          <IconButton aria-label="Close request" onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <RequestForm kind={service.name} subject={service.cta} />
        </DialogContent>
      </Dialog>
    </>
  );
}
export function About() {
  return (
    <>
      <PageHero
        title="Building connections that hold weight."
        description="We believe the right connections can change what’s possible — for people, for businesses, and for the communities around them."
        image="photo-1653566031535-bcf33e1c2893"
        eyebrow="About Solid Connect"
      />
      <section className="section">
        <div className="container content-grid">
          <div>
            <div className="eyebrow">
              <span />
              Who we are
            </div>
            <h2>
              One network.
              <br />
              Stronger possibilities.
            </h2>
            <p style={{ marginTop: 24 }}>
              Solid Connect is a technology and solutions company focused on
              creating reliable, scalable connections between people, teams, and
              systems. We specialize in turning fragmented networks into
              unified, dependable infrastructure.
            </p>
            <p style={{ marginTop: 20 }}>
              From connecting talent with employers to helping goods reach new
              markets, we bring the same commitment to every service:
              relationships that work, and results you can build on.
            </p>
          </div>
          <div className="panel">
            <h3>Our vision</h3>
            <p>
              To build unbreakable connections that empower people and
              businesses to grow together with trust, reliability, and speed.
            </p>
            <h3 style={{ marginTop: 30 }}>Our mission</h3>
            <p>
              To deliver reliable connection solutions that help businesses
              communicate, collaborate, and scale without friction.
            </p>
          </div>
        </div>
      </section>
      <AboutNetwork />

      <section className="section how-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                How we work
              </div>
              <h2>Our principles are our promise.</h2>
            </div>
          </div>
          <div className="listing-grid">
            {[
              [
                "Reliability first",
                "Everything we build is designed for real-world needs and lasting performance.",
              ],
              [
                "Clarity & simplicity",
                "Complex problems deserve clear solutions. We keep the process understandable.",
              ],
              [
                "Long-term partnerships",
                "We’re here to build durable connections, with support that grows alongside you.",
              ],
            ].map(([title, text]) => (
              <div className="capability" key={title}>
                <Icon name="check" />
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
                Our goal
              </div>
              <h2>A partner you can count on.</h2>
              <p>
                For organizations that need connections that don’t break under
                pressure.
              </p>
            </div>
            <LinkButton href="/contact" variant="contained" color="secondary">
              Start a conversation
            </LinkButton>
          </div>
          <ServiceCards />
        </div>
      </section>
      <Cta />
    </>
  );
}
const faqs = [
  [
    "Account",
    "How do I create an account?",
    "Open the advertiser portal, choose Create account, select Individual or Business, and enter your name, email and a password. You can complete your profile after signing in.",
  ],
  [
    "Marketplace",
    "Can I list my services?",
    "Yes. Open your dashboard and choose Post a listing. Listings are reviewed before appearing in the marketplace.",
  ],
  [
    "Marketplace",
    "Are these listings real?",
    "Listings marked Demo are sample content. Their prices, providers and availability are illustrative. Enquiries are stored locally in this preview and are not sent to external providers.",
  ],
  [
    "Customers",
    "Do I need an account to buy or request a service?",
    "No. Browse products and services, then send your contact details and requirements. Solid Connect admin handles the conversation and coordinates the next steps. Online payments and subscriptions are currently unavailable.",
  ],
  [
    "Logistics",
    "How do I track a shipment?",
    "Open Track a shipment and enter your reference. Try SC-DEMO-2026 to explore the demonstration shipment.",
  ],
  [
    "Support",
    "How can I follow up on a request?",
    "Keep your request reference. Solid Connect admin follows up using the contact details you supplied. Advertisers can also follow their own requests in the portal.",
  ],
  [
    "Properties",
    "Can I arrange a property viewing?",
    "Open a property listing, choose Schedule a viewing, and send your preferred date and contact details.",
  ],
  [
    "Trade",
    "Do you support international trade?",
    "Import & Export services include sourcing, logistics, customs clearance and documentation. Send a trade quote request with your route, product and quantity.",
  ],
];
export function Faq() {
  const [query, setQuery] = useState("");
  return (
    <>
      <PageHero
        title="A little clarity goes a long way."
        description="Answers to common questions about your Solid Connect experience."
        eyebrow="Help & FAQs"
      />
      <section className="section">
        <div className="container faq-list">
          <TextField
            label="Search questions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 3 }}
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
          {faqs
            .filter((f) =>
              f.join(" ").toLowerCase().includes(query.toLowerCase()),
            )
            .map(([cat, q, a]) => (
              <Accordion key={q}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  {q}
                </AccordionSummary>
                <AccordionDetails>
                  <small className="orange">{cat}</small>
                  <p>{a}</p>
                </AccordionDetails>
              </Accordion>
            ))}
          {!faqs.some((f) =>
            f.join(" ").toLowerCase().includes(query.toLowerCase()),
          ) && (
            <div className="empty-state">
              <h3>No matching questions.</h3>
              <p>Try another word or contact us for help.</p>
              <LinkButton href="/contact">Contact us</LinkButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
export function Resources({ slug }: { slug?: string }) {
  const article = articles.find((a) => a.slug === slug);
  if (slug && article)
    return (
      <>
        <PageHero
          title={article.title}
          description={article.summary}
          image={article.image}
          eyebrow={`${article.category} · 4 min read`}
        />
        <ArticleBody slug={slug} />
      </>
    );
  return (
    <>
      <PageHero
        title="Knowledge that moves you forward."
        description="Ideas and practical guidance for your next business decision."
        eyebrow="Insights & resources"
      />
      <section className="section">
        <div className="container listing-grid">
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
      </section>
    </>
  );
}
export function Legal({ kind }: { kind: string }) {
  const names: Record<string, string> = {
    terms: "Terms & conditions",
    privacy: "Privacy policy",
    cookies: "Cookie policy",
    refunds: "Refund policy",
  };
  return (
    <>
      <PageHero
        title={names[kind] ?? "Policies"}
        eyebrow="Transparency & trust"
      />
      <section className="section container prose">
        <div className="legal-review">
          <b>Draft for legal review</b>
          <p>
            This template is part of the MVP and is not an approved commercial
            policy. Company identity, jurisdiction, retention periods, consumer
            rights and contact details must be confirmed before launch.
          </p>
        </div>
        <h2>
          {kind === "privacy"
            ? "Information you share"
            : kind === "cookies"
              ? "Cookies used in this preview"
              : kind === "refunds"
                ? "Payment and cancellation enquiries"
                : "Using Solid Connect"}
        </h2>
        <p>
          {kind === "privacy"
            ? "Your account information, listings, requests and conversations are stored to provide the platform. Customer requests and conversations are handled by Solid Connect admin. Passwords are hashed. Online payments are currently unavailable."
            : kind === "cookies"
              ? "The application uses an essential HttpOnly session cookie to keep you signed in. This preview does not add advertising or analytics cookies. Listing drafts may be saved in your browser when you choose Save draft."
              : kind === "refunds"
                ? "Online payments and subscriptions are currently unavailable. Contact Solid Connect admin about cancellations or changes to an enquiry."
                : "Use accurate information and respect other members. Listings are subject to review. Do not submit unlawful, misleading, abusive or infringing content. Demo opportunities are illustrative and do not represent a commercial offer."}
        </p>
        <h2>Questions and requests</h2>
        <p>
          Use the contact form to request clarification or discuss account
          information. Approved response times and data handling terms will be
          added before commercial launch.
        </p>
        <LinkButton href="/contact" variant="outlined">
          Contact Solid Connect
        </LinkButton>
      </section>
    </>
  );
}
