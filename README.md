# Solid Connect

**Start here:** [Owner's running and launch guide](START-HERE.md).

A locally runnable Next.js MVP for Solid Connect, based on the supplied business profile, written brief and visual references. The interface uses a navy, orange and white design system with Ghanaian/global business imagery.

## Run the current workspace

The development preview runs at http://127.0.0.1:3001. A dedicated PostgreSQL 17 Docker container named `solidconnect-postgres` listens on 127.0.0.1:55432. Its local-only configuration is in the ignored `.env` file.

```powershell
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev -- --port 3001
```

The local administrator is `admin@solidconnect.local`. Its development-only password is in `.env` under `ADMIN_PASSWORD`. Register an Individual or Business account through the UI to test normal permissions. Never reuse local demo credentials for deployment.

## A fresh checkout

Requires Node.js 22+, npm and PostgreSQL 16+. Copy `.env.example` to `.env`, set `DATABASE_URL`, generate a long random `NEXTAUTH_SECRET`, and set `NEXTAUTH_URL` to the exact browser origin. Run the commands above. `npm run db:migrate` applies the committed initial migration. `npm run db:push` is available only for disposable development databases.

Without `DATABASE_URL`, development uses ignored `.data/platform.json` with serialized writes and atomic replacement. Production fails closed unless PostgreSQL is configured or `ALLOW_LOCAL_DEMO=true` is explicitly set for a local preview. This fallback is unsuitable for multiple application processes.

## Implemented workflows

- Responsive homepage, about, seven service pages, resources, pricing, FAQ, contact and draft legal policies.
- Searchable marketplace with categories, locations, sorting, pagination, detail pages and saved listings.
- Email/password registration and login, signed HttpOnly sessions, account profiles, password reset email architecture and server-side authorization.
- Listing creation, validation, image upload, browser draft saving, preview, editing, withdrawal and admin moderation.
- Job applications with duplicate prevention, provider shortlisting/status changes, artisan/property enquiries and service-specific request forms.
- Persisted logistics, trade, marketing and procurement requests; sample shipment tracking with error states.
- User/business workspace, conversations, messages, notifications, payment history and receipts.
- Server-priced checkout, explicit test success/failure simulation, Paystack initialization/verification adapter and signed webhooks.
- Admin accounts, listings, service requests and payment views.

All sample providers, listings, prices and tracking events are marked as demonstrations. The homepage does not present unsupported numerical business claims. No external service provider is contacted by a demo request.

## Routes

Public: `/`, `/about`, `/services`, `/services/recruitment`, `/services/artisans`, `/services/logistics`, `/services/real-estate`, `/services/distribution`, `/services/sales-marketing`, `/services/import-export`, `/marketplace`, `/marketplace/jobs`, `/marketplace/artisans`, `/marketplace/properties`, `/marketplace/products`, `/marketplace/[listing-id]`, `/search`, `/pricing`, `/resources`, `/resources/[slug]`, `/contact`, `/faq`, `/track`, `/terms`, `/privacy`, `/cookies`, `/refunds`.

Account: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`.

Workspace: `/dashboard`, `/dashboard/profile`, `/dashboard/listings`, `/dashboard/listings/new`, `/dashboard/orders`, `/dashboard/requests`, `/dashboard/applications`, `/dashboard/saved`, `/dashboard/messages`, `/dashboard/payments`, `/dashboard/notifications`, `/dashboard/settings`.

Payments and administration: `/checkout`, `/payment/success`, `/payment/failed`, `/payment/pending`, `/admin`.

APIs: `/api/platform`, `/api/upload`, `/api/payments/webhook`.

## Architecture

Next.js App Router, strict TypeScript, React 19, MUI, Framer Motion, React Hook Form and Zod. Public route configuration uses a catch-all dispatcher with route metadata; interactive features are shared client components. Server actions are centralized in the platform API and validated with Zod. Authentication uses bcrypt password hashes and JOSE-signed expiring sessions. A session version invalidates old tokens on password reset. Roles are loaded from the database, never accepted from registration input.

`src/lib/catalog.ts` owns service content, sample listings and plan configuration. `src/lib/validation.ts` owns input schemas. `src/lib/store.ts` selects PostgreSQL or the development file adapter. `src/lib/database.ts` maps domain state to relational records inside an advisory-locked transaction. Flexible per-category attributes use JSON payloads alongside indexed ownership, category and lifecycle columns. The current unit-of-work loads and persists the small MVP dataset; replace this with targeted repositories before large-scale traffic.

Shared UI: Header, Footer, Logo, ServiceCards, ListingCard, PageHero, RequestForm, AuthForm, Dashboard, ListingWizard, ProfileForm, Messages and payment/admin screens. `DESIGN.md` and `UX-CONTRACT.md` describe visual tokens and interaction ownership.

## Database models

User, Account, Profile, BusinessProfile, Listing, Job, JobApplication, ArtisanProfile, PortfolioItem, Property, Product, SupplierProfile, ServiceListing, ServiceRequest, LogisticsRequest, Shipment, ShipmentEvent, TradeRequest, MarketingRequest, Quote, Conversation, Message, Favourite, Payment, Notification, Review, ContactSubmission and AuthToken.

The core account/listing/request/message/payment models and service-specific extensions are persisted. Account OAuth records, portfolio collections, supplier profiles, quote issuance, reviews and live shipment events are extension models; their full management workflows are not yet implemented.

## Payments

Default `PAYMENTS_MODE=mock`. The server creates a unique reference with its own product amount in integer pesewas. Test settlement only accepts an authenticated owner of a mock payment; final states cannot be replayed into a different outcome. Test transactions clearly state that no money was charged.

To use Paystack, set `PAYMENTS_MODE=live` and `PAYSTACK_SECRET_KEY` (use a Paystack test key while integrating). Set `NEXTAUTH_URL` to your HTTPS origin and configure `/api/payments/webhook` in Paystack. A missing live key fails closed. Hosted checkout supports card and mobile money channels where the provider/account supports them. The server verifies reference, amount, currency and provider status. Webhooks verify HMAC-SHA512 against the raw body and then verify the transaction again. The browser never determines payment success. Recurring billing and entitlement fulfillment are not enabled; current items are one-time demo products.

Provider references: https://paystack.com/docs/payments/accept-payments/ and https://paystack.com/docs/payments/verify-payments/ and https://paystack.com/docs/payments/webhooks/.

## Email and storage

Set `RESEND_API_KEY` and a verified `EMAIL_FROM` to enable the email adapter. Without them, requests still persist and reset-password reports that delivery is not configured. Welcome, verification, password reset and enquiry confirmations use this adapter. Further templates can reuse it. External email delivery has not been tested without credentials.

Image uploads validate file signatures and a 5 MB limit. Development stores images in ignored `public/uploads`. Set the Cloudinary cloud name, API key and API secret for signed server-side production uploads. Never expose the API secret. Production uploads fail closed when storage is not configured. The public upload form accepts images only; CVs currently use a portfolio/CV link, not a private document upload. Production should add a malware scanning service and private signed document storage before accepting CV documents.

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Browser tests use installed Microsoft Edge against port 3001. Start the application before running them. Tests cover public navigation, search, no-results, tracking errors, mobile navigation/overflow, registration, listing creation, job application duplicate prevention, enquiries, messages, favourites, mock payment verification and authorization failures. Tests create clearly named QA accounts and records in the development database.

Development output uses `.next-dev`; production uses `.next`, so checks do not corrupt the running preview. Use `npm run start -- --port 3001` after a build for a production preview (stop the development process first).

## Deployment and remaining work

Follow the detailed [launch plan](docs/LAUNCH_PLAN.md) for business decisions, provider accounts, remaining engineering, staging acceptance checks and production operations.

This is a working local MVP foundation, not a completed commercial launch. Before launch: approve contact information and pricing; legally review policy drafts; configure and verify Paystack, Resend and Cloudinary; complete verified provider onboarding; replace example listings and editorial content; configure email verification, implement Google OAuth and private CV/attachment uploads, issued quotes, service bookings/fulfillment, live tracking integration, team permissions, reviews and richer reporting as needed. Payment confirmation must connect to approved order/entitlement lifecycle rules before selling real services.

Deploy the Node application to a provider supporting Next.js server routes and an external PostgreSQL database. Apply migrations before startup; require HTTPS and a strong session secret. The in-process rate-limit adapter is suitable for this local MVP only; use shared Redis and trusted reverse-proxy configuration for multiple replicas. Add backups, monitoring and tested recovery procedures. No production hosting or paid provider account has been provisioned.

## Assets

Hero and artisan photographs are original generated illustrations (photorealistic), stored in `public/images`. Other stock photographs are stored locally to avoid third-party load failures. Asset sources and generation prompts are recorded in `docs/assets.md`.
