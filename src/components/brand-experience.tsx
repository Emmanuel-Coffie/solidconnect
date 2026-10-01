import Image from "next/image";
import Link from "next/link";
import { photo, services } from "@/lib/catalog";

export function ConnectionPaths({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`connection-paths ${className}`}
      viewBox="0 0 900 650"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="connection-ribbon"
        d="M-80 500C140 680 320 500 270 320S380 40 545 110S740 395 990 200"
      />
      <path
        className="connection-thread"
        d="M-60 535C160 705 354 505 305 317S399 83 535 145S733 435 995 245"
      />
      <path
        className="connection-thread"
        d="M-90 460C120 642 286 472 237 294S389 0 563 75S760 348 980 160"
      />
      <circle cx="546" cy="111" r="10" fill="currentColor" />
      <circle cx="272" cy="329" r="6" fill="currentColor" />
    </svg>
  );
}

export function ExperienceHero({
  title,
  description,
  image,
  eyebrow = "Solid Connect",
  children,
  market = false,
}: {
  title: string;
  description?: string;
  image?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  market?: boolean;
}) {
  const service = services.find((s) => s.name === eyebrow);
  const primary = image
    ? photo(image, 1200)
    : eyebrow === "Shipment tracking"
      ? photo(services[2].image)
      : "/images/business-studio.png";
  const supporting =
    service?.slug === "artisans"
      ? services[3].image
      : service?.slug === "real-estate"
        ? "photo-1497366754035-f200968a6e72"
        : service?.slug === "logistics" || service?.slug === "import-export"
          ? services[4].image
          : service?.slug === "recruitment" ||
              service?.slug === "sales-marketing"
            ? services[5].image
            : services[1].image;
  return (
    <section
      className={`experience-hero ${market ? "market-experience" : ""} ${eyebrow === "Secure checkout" ? "checkout-experience" : ""}`}
      data-scene={service?.slug ?? "network"}
    >
      <ConnectionPaths />
      <div className="experience-grid container">
        <div className="experience-copy">
          <div className="eyebrow orange">
            <span />
            {eyebrow}
          </div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {children}
          <div className="experience-signoff">
            <span className="connection-dot" /> Rooted in Ghana{" "}
            <span className="signoff-line" /> Connected to possibility
          </div>
        </div>
        <div className="experience-art">
          <div className="experience-main-photo">
            <Image
              src={primary}
              alt={
                service
                  ? `${service.name} in focus`
                  : "Ghanaian business owner in a collaborative studio"
              }
              fill
              priority
              sizes="(max-width:700px) 90vw, 45vw"
            />
          </div>
          <div className="experience-small-photo">
            <Image
              src={photo(supporting)}
              alt={
                service?.slug === "real-estate"
                  ? "Contemporary workspace"
                  : "Craftsmanship and spaces within the network"
              }
              fill
              sizes="(max-width:700px) 35vw, 18vw"
            />
          </div>
          <div className="experience-stamp" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <path
                d="M20 64C-3 35 30 9 47 35M80 36C103 65 70 91 53 65M37 50H63"
                fill="none"
                stroke="currentColor"
                strokeWidth="11"
                strokeLinecap="round"
              />
            </svg>
            <span>
              Better
              <br />
              connected.
            </span>
          </div>
          <div className="experience-caption">
            <span>
              {service?.name ??
                (market
                  ? "Discover your next opportunity"
                  : "People at the heart of progress")}
            </span>
            <b>↗</b>
          </div>
        </div>
      </div>
      <div className="experience-edge" aria-hidden="true" />
    </section>
  );
}

export function NetworkEditorial() {
  return (
    <section className="network-editorial">
      <div className="container network-editorial-grid">
        <div className="editorial-photos">
          <div className="editorial-photo-primary">
            <Image
              src="/images/business-studio.png"
              alt="Entrepreneur in a sunlit business studio"
              fill
              sizes="(max-width:700px) 90vw, 40vw"
            />
          </div>
          <div className="editorial-photo-detail">
            <Image
              src="/images/artisan.png"
              alt="Craftsperson finishing a handmade table"
              fill
              sizes="(max-width:700px) 40vw, 20vw"
            />
          </div>
          <span className="editorial-photo-label">People with purpose.</span>
          <ConnectionPaths />
        </div>
        <div className="editorial-copy">
          <div className="eyebrow">
            <span />
            One connection can change the picture
          </div>
          <h2>
            Big ambitions.
            <br />
            <em>Human connections.</em>
          </h2>
          <p>
            A new team. A space to grow. A craft worth sharing with the world.
            Behind every opportunity is a person ready for their next chapter.
          </p>
          <p>
            Bring us your next step. Explore a network that brings people,
            expertise, and practical support together.
          </p>
          <Link className="editorial-link" href="/about">
            Meet Solid Connect <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
