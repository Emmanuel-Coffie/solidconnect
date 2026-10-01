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
Search and filters commit to URL. Search clears immediately. Dashboard data belongs to signed-in user. Public demo listings are explicitly labelled. Saved records persist on server. Empty collections explain the next action. Auth returns only to local allowed paths. Mutations require same origin and a signed cookie. Admin role cannot be selected at registration. Local file persistence is development-only; production requires PostgreSQL. Payments use server-defined prices, server verification, unique references and idempotent transitions. Demo settlement is never a live payment. No actual card data is collected.
