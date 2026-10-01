# Local verification

## October brand redesign

- Supplied logo is displayed from the original image in shared navigation/footer.
- Marketplace, service overview, homepage, recruitment, property, contact and about openings were inspected with browser screenshots.
- Recruitment, property, contact and about reported no horizontal overflow, no broken eager images and no browser page errors. Reduced-motion mode reported `animation: none` for page arrival.
- Marketplace and service overview were checked at 390px width with no horizontal overflow.
- The homepage headline now renders without waiting for JavaScript animation initialization.
- The owner-facing setup and launch instructions are in `START-HERE.md`.
- DESIGN.md lint and the strict UI audit reported zero errors and zero warnings.
- Added the official MUI App Router cache provider for server/client stylesheet consistency. Integration reference: https://mui.com/material-ui/integrations/nextjs/.
- Dependency audit reported zero known vulnerabilities after pinning patched PostCSS 8.5.28 and deepmerge-ts 8.0.2 through npm overrides. Prisma client generation passed with the updated dependencies. Keep these overrides until their parent packages include patched versions.

## Core platform

Verified on 1 October 2026 using local PostgreSQL and the production Next.js build.

- Production compilation and TypeScript checks passed.
- ESLint passed.
- Six domain tests passed: registration validation, listing validation, request validation, webhook signatures, safe redirects and server-owned prices.
- Three browser journey tests passed in Microsoft Edge: public navigation/search/tracking/mobile; account/listing/application/enquiry/message/favourite/payment journeys; admin moderation, invalid uploads, failed-payment replay and account isolation.
- Strict UI audit reported zero findings. This is an automated project check, not an accessibility certification.
- Homepage, recruitment service page and resource article loaded with zero broken images and no desktop horizontal overflow. Mobile service and dashboard checks also found no horizontal overflow.
- Desktop and mobile screenshots are saved in this directory for review.

Tests create QA records in the local development database. Demo payments do not charge money. Live Paystack, email delivery, production storage, real carrier tracking, external service fulfillment, load testing and production recovery were not verified. See LAUNCH_PLAN.md for the remaining launch work.
