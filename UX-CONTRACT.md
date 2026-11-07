# Solid Connect UX contract

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | MUI TextField and MenuItem | UX-CONTRACT.md | authored | tests/e2e/platform.spec.ts |
| Date | MUI TextField with date type | UX-CONTRACT.md | native | browser input check |
| Form | RequestForm and AuthForm | src/lib/validation.ts | create / edit | tests/e2e/platform.spec.ts |
| Scrollbar | src/app/globals.css | DESIGN.md | native | mobile overflow assertion |
| Toast | MUI Alert | UX-CONTRACT.md | inline success / error | tests/e2e/platform.spec.ts |
| CRUD | src/app/api/platform/route.ts | server ownership rules | create / edit / withdraw | tests/e2e/platform.spec.ts |
- Select/Listbox: MUI TextField select and MenuItem. Authored popup. Shared forms own options.
- Date: native date input via TextField. Platform-owned calendar is accepted.
- Form: React Hook Form with Zod schemas, shared RequestForm and AuthForm. noValidate, textual errors, first-error focus, disable pending submissions.
- Scrollbar: globals.css, native document scroll and stable gutter.
- Toast: MUI Alert inline live feedback; no competing transient notification system.
- CRUD: /api/platform validates all changes; ownership enforced on server. Creation returns persisted IDs, errors preserve values; admin moderation is reversible.
- Overlay: MUI Dialog/Menu/Drawer, focus trapping and restoration, Escape closes.

## State and navigation
Search and filters commit to URL. Search clears immediately. Dashboard data belongs to signed-in user. Public demo listings are explicitly labelled. Saved records persist on server. Empty collections explain the next action. Auth returns only to local allowed paths. Mutations require same origin and a signed cookie. Admin role cannot be selected at registration. Local file persistence is development-only; production requires PostgreSQL. Online payments and subscriptions are unavailable. Historical billing rows are retained without processing.

## November owner brief
Authority: owner request in this implementation chat, recorded in docs/PRODUCTION.md. Customers submit guest enquiries to admin. Advertisers only receive their own submitted requests; listing ownership never grants access to incoming customer requests or messages. Request-status changes require ADMIN. The standalone /portal shell owns advertiser authentication and management; public marketing navigation is absent. Native date pickers and MUI authored selects retain the existing ownership contracts.

## Portal workspace refinement
- PortalWorkspace owns shared role-specific navigation, responsive MUI Drawer and sign-out. Admin login without an explicit safe return path opens `/portal/admin`; advertiser login opens `/portal`. Explicit safe return paths retain precedence.
- Six advertiser destinations: Overview, My listings, Requests & messages, Saved items, Updates, Account. Orders and Applications redirect to Requests; Settings redirects to Account. Existing stored records remain intact. Requests link to their admin conversation.
- Admin section, status and page are URL state. Search is deliberately transient React state because it includes customer names, email, phone and enquiry references; do not put these personal searches into URLs or persistent browser storage. Search is local, immediate, and has an explicit clear action that restores focus. Every admin collection renders at most eight records per page; page boundaries clamp after filtering/mutation. This is UI pagination over the existing full-dataset API, not server pagination.
- Admin queue is newest first. Desktop shows one selected detail panel; phone opens that same detail with Back to enquiries. Guest email replies open the email application and are explicitly described as untracked. Signed-in requester replies remain stored in the existing conversation. A refresh failure preserves the current dataset and exposes Retry. Mutations are pending-disabled and failures retain entered text.
- UnsavedChanges owns account/listing form navigation confirmation and browser-unload warnings. Save returns to the existing list for listing creation/edit; local draft save is explicitly browser-only. Withdrawal is reversible suspension, uses warning intent and focuses Keep listing by default.
- Logistics collects only relevant optional details for rental/passenger/vehicle hire, moving/relocation, or freight. Changing service clears incompatible optional details. Customers still submit without accounts.
- Image uploads accept JPG/PNG/WebP up to 4 MB, keeping multipart requests below the production serverless request-body ceiling. Both client and server enforce the limit. No payment or subscription flow is introduced.
- Public Contact has one hero. Navigation offers real logistics enquiries instead of promoting demo shipment tracking.
- Canonical production hosts: public account links retain their path/query while redirecting to PORTAL_URL; public pages opened from the portal return to NEXTAUTH_URL. Portal aliases and legacy dashboard paths resolve locally. API, asset and preview-host requests are excluded. Sessions remain host-only. Custom-domain ownership and HTTPS were verified during deployment.
