# November marketplace release verification

Verified locally on Windows, Node.js 24, with the development file store and a disposable seeded admin. This validates application workflows; it does not validate a production PostgreSQL deployment, DNS, email delivery or Cloudinary credentials.

- Prisma client generation: passed.
- TypeScript: passed (`npm run typecheck`).
- ESLint: passed (`npm run lint`).
- Production dependency audit: zero vulnerabilities after upgrading Next.js to 15.5.29 and Zod to 4.6.7.
- Unit tests: 4 passed (`npm test`).
- Browser tests: 5 passed in the final full run (`npm run test:e2e`).
- Optimized Next.js production build: passed.
- Strict premium UI audit: zero findings.
- Git whitespace check: passed.

Browser coverage includes a guest listing enquiry, logistics car rental selection, invalid request and cross-origin rejection, advertiser registration and service listing creation, narrow portal layout, keyboard focus, sign-out, legacy auth query preservation, disabled checkout/settlement/webhook, admin moderation and guest inbox visibility, and denial of customer conversations/status updates to listing owners. Search empty-state recovery and the standalone portal login were exercised at 390px width. Marketplace and portal screenshots were inspected locally.

Two failures found during QA were fixed: sign-out raced the dashboard auth guard, and the inherited mobile auth-card max-width exceeded the viewport. Final relevant browser tests pass after both fixes.

Vercel connection discovery returned no accessible teams or projects. No production deployment, migration, DNS change or email was performed. The domain plan and required environment variables are documented in PRODUCTION.md. Historical payments remain in the database; payment processing is disabled.
