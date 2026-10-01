# Solid Connect launch plan

The repository contains a working local application, not a finished commercial service. Use this sequence to turn it into a product that customers can depend on. The deployment should remain in test mode until the acceptance checks below are complete.

## 1. Confirm the business information

You provide:

- Registered company name, business address, operating locations, phone number, support email and domain.
- Approved logo files and brand assets; permission to use any staff, property or customer photography.
- Final service descriptions, service coverage, opening/support hours and who is responsible for each service.
- Real listings, provider profiles and supporting verification information. Replace every Demo listing before treating it as a commercial offer.
- Approved prices, commissions, membership benefits, cancellation rules and the situations in which customers must pay.

The supplied profile is the content source for the current pages. No unconfirmed address, founding date, leadership biography, partner logo or business performance statistic has been invented.

Acceptance: a named business owner approves public copy, prices and contact details; sample content is removed or clearly kept in a separate demo environment.

## 2. Establish the customer workflows

Decide how each service reaches completion. The MVP currently saves enquiries, listings, applications, conversations and transactions; a payment record alone does not fulfill a service.

- Recruitment: who reviews applications, arranges interviews, communicates decisions and marks a vacancy filled?
- Artisans: who issues a quote, agrees milestones, confirms work completion and handles a disputed job?
- Property: who verifies authority to list, arranges viewings and handles any service fee? Define which transactions stay outside the platform.
- Logistics: which operators provide booking, tracking milestones and proof of delivery?
- Distribution and trade: who confirms specifications, availability, minimum order quantity, quotation terms and shipment responsibilities?
- Marketing: what does a consultation or package include, and how are deliverables accepted?

Acceptance: each service has an agreed sequence of statuses, responsible roles, customer messages, and a clear definition of completion.

## 3. Create the provider accounts and domain

You create and own these accounts. Keep billing and recovery access under the business, rather than under a contractor’s personal account.

- Domain and DNS: the public website address and a business email domain.
- Hosting: a Node/Next.js host and a separate staging environment.
- PostgreSQL: a managed production database with backups and recovery access.
- Paystack: merchant onboarding and test/live credentials appropriate to the business and supported payment methods.
- Resend: a verified sending domain for transactional email.
- Cloudinary: image storage with server-side upload credentials.
- Optional Google OAuth project if Google sign-in is required for launch.

Place secrets in the hosting provider’s environment settings. Do not paste live keys into source files or commit them to Git. `.env.example` lists the supported variables. The current `.env` contains local development settings only.

Acceptance: staging can access its database, upload an image, deliver a test email and complete a provider test payment using staging credentials.

## 4. Complete the remaining product engineering

The following are remaining implementation work, not features that can be enabled merely by adding credentials:

- Connect successful payments to approved orders, bookings or membership/listing entitlements. Define idempotent fulfillment, cancellation and refund states.
- Build provider quotation issuance, customer acceptance and conversion into a booking/order. The Quote model exists, but its full workflow is not implemented.
- Add private CV and reference-document uploads with access control, signed downloads, size/type validation and malware scanning. Current job applications accept a CV/portfolio link; image uploads serve listing photography.
- Connect shipment records and events to a real carrier or operator workflow. Current tracking uses an explicitly labelled example shipment.
- Complete artisan portfolios, supplier profiles, reviews, business team permissions and reports as required for launch. Their presence in the schema does not mean every management screen is complete.
- Add Google sign-in if required. Email/password, reset and email-verification flows already have server implementations; real email delivery still requires configuration and testing.
- Expand automated tests for service-specific validation, quote/order lifecycles, attachment access, email flows and recovery after external-provider failures.
- Refactor the small-dataset persistence unit-of-work into targeted queries and writes before larger scale. Use a shared rate-limit store for multiple server instances.

Acceptance: an individual, a business/provider and an administrator can each complete their assigned steps in every launch service without database edits or developer intervention.

## 5. Approve trust, privacy and customer policies

Arrange appropriate professional review of the legal drafts and operational terms. Confirm the applicable requirements for the markets and services the company actually operates in.

- Terms, privacy, cookies, refunds and service-specific agreements.
- Provider vetting, verification-badge criteria and re-verification.
- Data access, retention, correction, export and deletion processes.
- Listing moderation, complaints, disputes, fraud reports and account suspension.
- Clear support channels and escalation responsibilities.

Acceptance: replace the draft-policy notices with approved documents; support staff can explain and carry out the stated procedures.

## 6. Run a staging pilot

Use a staging domain and provider test mode. Run these journeys with real staff acting as customers and providers:

1. Register, verify email, sign in, reset a password and edit a profile.
2. Create a listing, upload an image, save a draft, submit it, approve it as an admin, edit it and withdraw it.
3. Search/filter on mobile, save a listing, open details and send an enquiry.
4. Submit a job application, shortlist it as the employer and verify that the applicant sees the update.
5. Exchange messages between the correct participants; verify that another account cannot read or change their records.
6. Create and accept a quote, complete the relevant booking/order and confirm its lifecycle. This requires the engineering work in step 4.
7. Complete successful, failed, cancelled and pending payments. Confirm server verification, duplicate webhook handling, correct amounts and access-controlled receipts.
8. Test uploads, email failures, expired links, slow connections, keyboard navigation and narrow-screen layouts.
9. Restore a database backup in a separate environment and confirm the result.

Acceptance: record the results, resolve blocking defects, and obtain approval from the business owner and service leads.

## 7. Deploy and operate

- Set production environment variables and HTTPS.
- Apply committed Prisma migrations; use distinct production credentials and no demo administrator password.
- Configure the Paystack webhook URL and verify delivery and signature validation.
- Verify email authentication and storage configuration.
- Establish database backups, monitoring, error alerts, audit logs, incident contacts and a rollback procedure.
- Limit the initial launch to the services and providers that completed the pilot.
- Monitor enquiries, fulfillment, failed payments, support workload and provider response quality before expanding.

Acceptance: a controlled pilot customer completes a real approved service with payment, support, and fulfillment accounted for. Only then present the platform as commercially live.

## What you can do next

Start with the business contact details, domain choice, final prices and service owners. Then create the provider accounts. Those decisions let the remaining quote/order/fulfillment workflows be implemented around the actual business rather than assumed rules.

Current local commands and developer setup are in `README.md`. The implementation does not require you to configure live payment credentials to explore the demo.
