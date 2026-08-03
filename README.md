# TINWA website

Marketing website for TINWA (Pty) Ltd — a South African software consultancy.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Zod · Resend · Vitest · Playwright · Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

## Environment variables

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends contact and careers submissions |
| `CONTACT_TO_EMAIL` | Inbox that receives submissions |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and Open Graph |

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run check:env` | Fails if a required environment variable is missing |

`npm run test:e2e` builds and boots a production server itself (see `playwright.config.ts`'s
`webServer` block) — there is no need to have `npm run dev` running first.

## How the code is organised

Three rules keep this maintainable:

1. **Components contain no copy.** Every user-visible string lives in `src/content/` and arrives as props.
2. **Content modules contain no markup.** They export typed plain data.
3. **`src/lib/` never imports from `src/components/`.** Validation, env and mail work without React.

## Changing company details

Every company fact — registration number, address, phone, email, B-BBEE level — lives in
`src/content/company.ts`. Change it there and it updates the footer, the About page, the Contact
page and the structured data at once. `src/content/company.test.ts` asserts these values, so a
deliberate change means updating the test too.

## Adding a logo to the experience wall

1. Confirm the company publishes a brand or press kit whose terms permit this use.
2. Save the mark to `public/logos/<slug>.svg`, matching the `slug` in `src/content/experience.ts`.
3. Add an entry to `src/content/logoManifest.ts` with the asset's intrinsic width and height.

Any entry without a manifest entry renders as a text chip. That is the intended fallback — do not
recreate or approximate a mark that is not publicly available.

## Deployment

Not yet deployed. Once a Vercel project is linked and `main` is connected to it, pushes to `main`
deploy to production and pull requests get preview URLs.

## Open items

1. **Register `tinwa.co.za`** and provision the `hello@` mailbox.
2. **Create a Resend account**, verify the sending domain, and supply `RESEND_API_KEY`.
3. **Confirm the B-BBEE level.** The affidavit ticks Level 4 but its bullets declare 100% black
   ownership, which would be Level 1 — a 35-point difference in procurement recognition. The site
   publishes Level 4; changing it is one line in `company.ts` plus its test.
4. **Review the experience wall** once logos are sourced, and confirm each mark that appears.
5. **Link and deploy to Vercel**, then attach the custom domain once it is registered.
