# Solid Connect — how to run and launch your website

This guide is for the owner of this project. Start with Part 1 to open the existing website on this computer. Part 2 covers moving a copy to another computer. Part 3 covers what must happen before customers use it publicly.

## 1. Run the website on this computer

Your project folder is:

```text
C:\Users\Rich Ali\Documents\ChatGPT\solidconnect
```

You need Node.js, npm and Docker Desktop running. These have already been used to run this project here. Keep the existing `.env` file: it contains the local database connection and account settings. Do not share it publicly.

### Step A — start the database

Open Docker Desktop and wait until its engine is running. Open PowerShell and run:

```powershell
cd 'C:\Users\Rich Ali\Documents\ChatGPT\solidconnect'
docker start solidconnect-postgres
```

This starts the existing local database. It does not reset your accounts or listings. Do not delete the database container or its storage to troubleshoot a website problem.

### Step B — install dependencies if needed

On this computer, dependencies are already installed. Run these commands after copying the project, updating dependencies, or if `node_modules` is missing:

```powershell
npm ci
npm run db:generate
```

### Step C — apply database updates

```powershell
npm run db:migrate
```

The demo administrator and example catalogue were already seeded on this computer. For a new development database only, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then run `npm run db:seed`.

### Step D — start the website

For editing and developing:

```powershell
npm run dev -- --port 3001
```

Keep this PowerShell window open. Visit [Solid Connect locally](http://127.0.0.1:3001).

For a preview of the optimized production build, first stop the development server with Ctrl+C, then run:

```powershell
npm run build
npm run start -- --port 3001
```

Only run one website process on port 3001. The preview may already be running from the design session; if the address opens, you do not need to start another copy.

### Step E — try the product

1. Open **Get Started** and create an Individual or Business account.
2. Explore the marketplace, save a listing and send an enquiry.
3. Open the dashboard, create a listing and submit it for review.
4. Sign in as the local administrator to approve it at `/admin`. The local administrator email is `admin@solidconnect.local`; find its password in `.env` under `ADMIN_PASSWORD`.
5. Try checkout in test mode. No money is collected by the simulated payment buttons.

Email delivery, live payments and external storage need provider configuration. A saved enquiry is not a confirmed or fulfilled service. Example shipment tracking is not connected to a carrier.

### Stop and restart

- Stop the website: Ctrl+C in its PowerShell window.
- Stop the development database when you no longer need it: `docker stop solidconnect-postgres`.
- To return later: start Docker Desktop, run `docker start solidconnect-postgres`, then start the website again.
- The local website is available on this computer only. Sending another person `127.0.0.1` will not let them see your copy.

## 2. Set up a fresh computer or checkout

Install Node.js 22 or later, npm, and Docker Desktop (or supply a PostgreSQL database). Copy the source project and preserve its `package-lock.json`.

From the project folder:

```powershell
npm ci
Copy-Item .env.example .env
```

Only copy `.env.example` when `.env` does not already exist. Configure `.env` in your editor:

- `DATABASE_URL`: your PostgreSQL connection string.
- `NEXTAUTH_SECRET`: a long random session secret. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and place the output in `.env`.
- `NEXTAUTH_URL=http://127.0.0.1:3001` for this local setup.
- `PAYMENTS_MODE=mock` to keep payments simulated.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: your own development administrator credentials.

For a new local database using the included `compose.yaml`, add `POSTGRES_PASSWORD` to `.env`. Use a long, random hexadecimal password to avoid URL-encoding problems. Set `DATABASE_URL` to `postgresql://solidconnect:YOUR_PASSWORD@127.0.0.1:55432/solidconnect`, replacing `YOUR_PASSWORD` with that same password. Then run:

```powershell
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev -- --port 3001
```

Do not run this new Compose database alongside the existing `solidconnect-postgres` container on the same port. Part 1 is the correct route for this computer's existing data.

## 3. Make the product ready for customers

### Your business decisions and content

- Confirm the legal company name, address, phone number, support email, domain and operating locations.
- Approve each service's scope, pricing, commissions, availability and responsible staff.
- Replace demo listings with real offers and verified provider information.
- Supply authorized photography of your business and providers where available. The generated editorial images are illustrations, not actual staff or premises.
- Have the draft terms, privacy and refund policies reviewed and approved for your operations.

### Accounts you need to own

- A domain and DNS account.
- Hosting that runs Next.js server routes, plus a separate staging environment.
- A managed PostgreSQL database with backups.
- Paystack for payments, subject to merchant onboarding.
- Resend and a verified sending domain for account verification, password reset and enquiry emails.
- Cloudinary for production listing images.

Put credentials in the hosting provider's environment settings. Never place live keys in frontend code or publish `.env`.

### Engineering still required

The current site is a working MVP foundation. These are implementation tasks, not settings you can simply switch on:

- Provider quotes, customer acceptance, bookings/orders and service completion.
- Connecting verified payments to those orders or entitlements, including cancellation/refund handling.
- Private CV/document uploads and controlled downloads.
- Real shipment events from carriers or your operations team.
- Any launch-required portfolios, reviews, business team permissions and reporting.
- Shared rate limiting and targeted database operations for production scale.
- Google sign-in, if you want it; the current implemented login uses email/password.

Assign a developer to complete these around your actual business rules. Launch only the service workflows that are finished and tested.

### Configure and test staging first

1. Deploy a staging copy with a separate database and a strong new session secret.
2. Set `NEXTAUTH_URL` to the staging HTTPS address.
3. Configure Resend using `RESEND_API_KEY` and `EMAIL_FROM`.
4. Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.
5. For Paystack integration testing, set `PAYMENTS_MODE=live` **with a Paystack test secret key**. In this codebase, `live` selects the Paystack adapter; the provider key determines test versus real-money mode. Keep production merchant keys out of staging.
6. Register the staging `/api/payments/webhook` URL with Paystack and test signature validation and repeated delivery.
7. Test registration, verification emails, password reset, listings, moderation, enquiries, messages, payments and completed orders with staff.
8. Test phones, keyboard navigation, failed payments, invalid uploads and recovery after provider failures.

### Publish the approved version

After the staging pilot passes, configure the production domain, HTTPS, production environment variables and production database. Apply `npm run db:migrate` as a release step and run the Next.js build. Do not seed demo data into production. Create the production administrator through a controlled developer-managed process using unique credentials.

Before enabling real payments, confirm fulfillment, refunds, support, monitoring, backups and restore procedures. Start with a small group of customers and approved providers.

See [the full launch acceptance checklist](docs/LAUNCH_PLAN.md) for service-by-service requirements.

## 4. Common problems

- **The site does not open:** confirm the terminal says Ready and use the port printed there.
- **Port 3001 is already in use:** open the existing preview or stop that project's existing server before restarting. Do not terminate unrelated programs.
- **Database connection fails:** open Docker Desktop, start `solidconnect-postgres`, and check `DATABASE_URL` in `.env`.
- **Images fail after a production build:** rebuild after changing files in `public/images`, then restart the server.
- **Password reset email does not arrive:** real delivery needs configured and verified Resend credentials.
- **A new listing is missing from the marketplace:** check its review status and approve it using the admin account.
- **A payment succeeds but no service is delivered:** the demo records payment status; service fulfillment must be implemented before real sales.

## 5. Developer checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

With the website running at port 3001 and the local database available:

```powershell
npm run test:e2e
```

Browser tests use Microsoft Edge and create QA records. Use a development database, never production, for these tests. See [README.md](README.md) for the route list and architecture.
