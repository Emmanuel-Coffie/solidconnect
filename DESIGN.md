---
version: alpha
colors:
  primary: "#1668E8"
  navy: "#061B3A"
  orange: "#FF681C"
  blue: "#1668E8"
  sky: "#EAF4FF"
  sand: "#FFF3E9"
  ice: "#E7F1F8"
typography:
  display:
    fontFamily: "Outfit"
  body:
    fontFamily: "Plus Jakarta Sans"
rounded:
  control: "8px"
  panel: "12px"
spacing:
  base: "8px"
  desktopGutter: "40px"
---
# Solid Connect design

## North Star
The supplied Solid Connect references: a white navigation bar above a cinematic navy business ecosystem, orange actions, seven photographic service cards. Ghanaian professionals and global trade are the subject. Marketing routes tell the company story; product routes prioritize finding and managing opportunities.

## Tokens and ownership
Model B: src/app/globals.css is canonical for runtime tokens. MUI maps the same palette in src/components/providers.tsx; verify these values together when changing the palette. Navy #061B3A, orange #FF681C, blue #1668E8, sky #EAF4FF, background #F7F9FC, text #0B1D3A, muted #5E6B7C. White surfaces, 12px card radius, 8px controls, fine blue-gray borders. Plus Jakarta Sans display and body, system fallback; tabular numbers for amounts. Spacing uses 8px steps with 24px page gutters, max width 1320px. Desktop seven-column service strip; tablet three; phone one/two according to available width. Breakpoints 600, 900, 1200px.

## Signature
An expansive photographic global-connections hero with a navy text-safe edge, followed by a continuous seven-service strip. Orange identifies the next meaningful action; blue identifies navigation and informational states. No invented partner logos or unlabelled demonstration metrics.

## Components and states
Shared Header, Footer, ServiceCards, ListingCard, RequestForm and dashboard shell. MUI owns dialogs, menus, fields, selects, tabs and alerts. Visible keyboard focus, reduced-motion overrides, stable image aspect ratios and natural document scrolling. Errors retain form values; success points to the created record. English, Ghana currency GHS; UTC dates in records.

## October owner-requested redesign

The owner requested expressive photography and creative shapes using their supplied logo. This intentionally evolves the former rectangular banner/card signature. The unchanged logo is displayed through a CSS crop in the shared header/footer. ExperienceHero replaces the plain PageHero implementation with sculpted photographs, subject-specific secondary imagery, and sweeping SVG connection paths. NetworkEditorial adds a photographic brand story to the homepage. Product controls and authorization retain their established owners in UX-CONTRACT.md.

Runtime ownership: globals.css continues to own the core palette and product tokens. brand.css owns the marketing composition layer, adding --brand-sand #FFF3E9 and --brand-ice #E7F1F8. The core navy/orange/blue palette is unchanged. Outfit now owns h1/h2 display typography through --font-display in app/layout.tsx; Plus Jakarta Sans remains body/control typography. This supersedes the earlier single-family display rule. Image frames use asymmetric 12–130px corners and subtle rotations; ordinary product panels retain their control-friendly geometry.

The actual container is 1360px including 40px desktop gutters. Large service galleries have three columns, then two below 1100px and one below 700px. The homepage strip has seven, then four, then two. These brand breakpoints supplement the existing core breakpoints. The original desktop seven-service strip remains recognizable while photographs gain greater prominence.

A 650ms CSS arrival on app/template.tsx makes page navigation feel intentional. Reduced-motion disables arrival and image zoom transitions. Decorative paths never capture pointer events. No endless movement or autoplay is introduced. Generated editorial photographs illustrate possibilities and must not be described as real staff or premises.
