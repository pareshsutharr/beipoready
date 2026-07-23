@AGENTS.md

## Data layer

MongoDB via Mongoose (`src/lib/mongodb.ts` singleton connection, models in `src/models/*.ts`). Public-site reads go through `src/lib/cms.ts`; admin CMS mutations go through the Server Actions in `src/app/admin/(protected)/cms/actions.ts`. A parallel REST surface (`/api/blog`, `/api/case-studies`, `/api/faqs`, `/api/clients`, `/api/testimonials`, `/api/site-alerts`, `/api/site-stats`) is protected by the admin JWT cookie (`src/lib/auth.ts`). Public lead-capture forms and the eligibility form post through `/api/leads` and `/api/eligibility` since Mongoose can't run in the browser.

## Typography — two fonts only

The entire site uses exactly two fonts, loaded via `next/font/google` in `src/app/layout.tsx`:

- **Hanken Grotesk** — all headings/display text. Tailwind class: `font-heading` (token `--font-heading`).
- **Montserrat** — all body text. Tailwind class: `font-sans` (token `--font-sans`, default on `<body>`).

Never introduce another font family (no `font-serif`, no inline `font-family`, no other Google fonts). Every new component must use only these two classes/tokens. Standalone generated documents (e.g. print popups) must link these same fonts explicitly.
