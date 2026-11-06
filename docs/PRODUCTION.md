# Solid Connect production handoff

The November 2026 owner brief is the authority for this release: advertise products and services; customers enquire without an account; admin coordinates every customer conversation; advertiser accounts live in an independent portal; online payments and subscriptions are unavailable; logistics includes moving out, relocation, car rentals and vehicle hire.

## Deploy the application

Use a Node.js host with PostgreSQL and HTTPS. This is a server-backed Next.js app, not a static export. Configure `DATABASE_URL`, a long random `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` with the public HTTPS origin. Leave `ALLOW_LOCAL_DEMO=false` in production. Run `npm ci`, `npm run db:generate`, `npm run db:migrate`, `npm run build`, then `npm run start` behind the host's proxy. The start command binds loopback by default; use `next start --hostname 0.0.0.0 --port $PORT` when required by a container host.

Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` of at least 14 characters, then run `npm run db:seed` once against the production database. This provisions an admin without exposing a public role selector. Rotate bootstrap credentials after provisioning through the normal password-reset process. Do not use QA credentials or copy `.data` to production.

Configure `RESEND_API_KEY`, `EMAIL_FROM` (a verified sending domain), and `ADMIN_EMAIL` for request acknowledgements, admin notifications, verification and resets. Requests persist even if notification delivery fails; the admin must monitor the inbox. Guest replies currently open the admin's email application; they are not sent or tracked automatically. Signed-in requesters can exchange stored messages with admin. No customer details or incoming enquiries are exposed to advertisers.

Configure the existing Cloudinary variables for durable uploads on serverless hosts. Local uploads require persistent disk. Confirm the approved contact details, service areas, real advertisers, imagery rights, privacy wording and terms before public launch. Sample listings remain labelled Demo on editorial pages; the production marketplace API excludes Demo records unless demo mode is explicitly enabled. Shipment tracking remains a labelled demonstration, not a carrier integration.

## Independent advertiser portal

`/portal` has its own header, footer, authentication, navigation and listing management; the public website shell is absent. `/portal/admin` is the admin enquiry inbox. Old `/dashboard`, login and admin addresses redirect to the new routes, preserving query strings through Next.js configuration.

For a dedicated domain such as `portal.example.com`, route that hostname to the same Node application and set `PORTAL_HOST=portal.example.com`. Its root opens `/portal`. This provides an independently accessible portal using the same application and database, not a separate codebase. Cookies are host-only, so each hostname has its own session. Configure password-reset and verification origins for the host where users sign in; if both origins are used, choose a canonical portal origin for email links and test cross-host return links. A fully separate deployment requires the same database, secret and storage configuration, plus the chosen canonical origins.

## Removed commerce flows

Pricing, checkout and payment result routes redirect to Contact. Payment initiation, mock settlement, payment reads and the webhook cannot process transactions. Provider implementation and subscription offers are removed. Historical payment models and rows are retained so existing records are not destroyed. No destructive database migration is needed for this release.

## Release verification

Run `npm run db:generate`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e`. Browser tests need the local test server at `127.0.0.1:3001`, a local `.env`, and a seeded test admin to exercise administrator cases. Use a disposable database or local demo store for QA.

The current store adapter serializes writes and reads the complete dataset. Before substantial traffic, replace that with paginated queries and targeted transactions, configure shared rate limiting at the host, backups, monitoring and tested restore procedures. Hosting, production credentials, DNS and a real email sending domain are deployment prerequisites, not included secrets.

## Recommended domain layout
Use Vercel for the Next.js application and Neon PostgreSQL for the database. Add www.solidconnectltd.com and portal.solidconnectltd.com to the project; redirect solidconnectltd.com to the www hostname. Set NEXTAUTH_URL=https://www.solidconnectltd.com, PORTAL_HOST=portal.solidconnectltd.com and PORTAL_URL=https://portal.solidconnectltd.com. Use the DNS records supplied by Vercel for each domain, not guessed values. vercel.json generates Prisma before each build. Run schema migrations with the database provider’s migration-compatible direct connection before serving traffic; use a pooled runtime connection where supported.
