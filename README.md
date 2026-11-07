# Solid Connect

A Ghana-focused marketplace for advertising products, professional services, property, jobs and logistics. Customers browse and enquire without accounts. Solid Connect admin coordinates customer conversations and advertiser availability.

## Main flows

- `/marketplace`: searchable products and services with guest enquiry forms.
- `/services/logistics`: home and office moves, car rentals, drivers, vans, trucks, delivery and freight requests.
- `/portal`: independent advertiser workspace, profile, listings and notifications.
- `/portal/admin`: moderated listings and a private customer enquiry inbox.
- Online payments and subscriptions are disabled. Historical billing data is retained.

The portal has its own layout and can use a dedicated hostname through `PORTAL_HOST`. It shares the application backend and database. See [Production setup](docs/PRODUCTION.md) for the deployment contract and current limits.

## Local development

Use Node.js 22 or newer. Copy `.env.example` to `.env`; set a random `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and optionally PostgreSQL `DATABASE_URL`. Without a database, development uses a serialized local `.data/platform.json` file.

```sh
npm ci
npm run db:generate
npm run dev
```

For PostgreSQL, run `npm run db:migrate`. Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD`, then `npm run db:seed` to provision an administrator. Registration cannot grant admin access.

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Browser tests use `http://127.0.0.1:3001` and Edge. Set the local origin in `.env`, provision the test admin, run `npm run dev -- --port 3001`, then `npm run test:e2e`. Use a disposable database or local demo store. Tests exercise guest requests, logistics rentals, independent portal navigation, service listings, disabled payments, admin moderation and advertiser isolation.

## Production

Production requires PostgreSQL, a durable image upload provider, HTTPS, a real admin account and email delivery configuration. Local demo persistence is rejected unless explicitly enabled. Demo shipment tracking is not a live carrier feed. Follow [docs/PRODUCTION.md](docs/PRODUCTION.md); older launch documents describe the previous payment-enabled preview and are superseded for this release.
