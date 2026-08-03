# TINWA Website — Design Spec

**Date:** 2026-08-03
**Repo:** https://github.com/tapsshore/tinwa-website (exists, empty, public)
**Status:** Approved for planning

---

## 1. What we're building

A marketing website for **TINWA (Pty) Ltd**, a South African software consultancy. The site has two jobs, in priority order:

1. **Win talent engagements** — convince a company to place a TINWA senior engineer into their team.
2. **Win delivery engagements** — convince a company to hand TINWA a scoped build.

Structural and tonal reference: [makunomashi.com](https://www.makunomashi.com/) — minimal wordmark, dark/light toggle, split headline, dual service pillars, numbered process, single strong CTA.

**Out of scope for v1:** blog, CMS, case-study detail pages, client portal, multi-language, analytics dashboards, e-commerce.

---

## 2. Company facts (single source of truth)

These live in `src/content/company.ts` and are imported everywhere — footer, About page, JSON-LD, contact page. Changing one is a one-line edit.

| Field | Value | Source |
|---|---|---|
| Legal name | TINWA (Pty) Ltd | COR14.3 / BEE affidavit |
| Registration number | 2019/154386/07 | COR14.3 |
| Tax number | 9371513194 | COR14.3 |
| Registration date | 26 March 2019 | COR14.3 |
| Enterprise type | Private Company, In Business | COR14.3 |
| Director | Tapiwanashe Shoshore | COR14.3 |
| Published address | 476 Felstead Avenue, Unit 52, Grand Rapids, Northriding, 2169 | BEE affidavit *(user-selected)* |
| Phone | +27 73 309 7462 | CV |
| Email | hello@tinwa.co.za | To be provisioned |
| Domain | tinwa.co.za | Decided; not yet registered |
| B-BBEE | EME, Level 4 contributor (100% procurement recognition) | BEE affidavit |
| B-BBEE affidavit validity | 17 July 2026 → 16 July 2027 | BEE affidavit |

### 2.1 Known data issues — deliberate decisions, not oversights

- **B-BBEE level is contradictory in the source document.** The affidavit's bullets declare the enterprise *100% black owned* (which maps to Level 1, 135% recognition), but the ticked box is *Less than 51% black owned → Level 4*. The site publishes **Level 4** to match the tick, because that is the enforceable claim on the signed affidavit. `company.ts` exposes `bbbeeLevel: 4` as a single constant; flip it to `1` once a corrected affidavit exists.
- **Three conflicting addresses exist across the source documents** — CIPC registered office (103 Sun Valley, Karin Avenue, Lambton Gardens, 1401), BEE affidavit enterprise address (476 Felstead Avenue), and the director's residential address (169 Hyperion Dr, Noordhang). The user selected the **BEE affidavit address** for publication. Note that this does not match the CIPC registered office a client would see when verifying the company on the CIPC register.
- **Logo wall uses third-party trademarks.** See §5.3. The risk was raised and the user directed that logos be sourced from official brand pages. Recorded here so the decision is traceable.

---

## 3. Positioning and voice

**Talent-led, delivery-second.** Primary CTA site-wide is *Hire a developer*; secondary is *Start a project*.

**Capacity framing — this is a constraint on all copy.** TINWA is the founder plus a small vetted associate network of contractors engaged per project. Copy may say *"a vetted network of senior engineers"*, *"our engineers"*, *"TINWA delivers"*. Copy may **not** claim permanent headcount, office locations, department structure, or a standing bench of employees. No fabricated headcount numbers, no invented team photos.

**Headline:** `Senior engineers, embedded. \ Software, delivered.`
**Sub:** "We place proven senior developers into your team — and build the systems when you'd rather hand the whole thing over."

Domain credibility comes from the founder's record: 11+ years across digital banking, telecoms, retail credit and sports betting; MSc Information Systems Management; AWS, Oracle OCA and HashiCorp Terraform certified.

---

## 4. Architecture

### 4.1 Stack

- Node 20 LTS · npm (matches the local toolchain: node v20.19.2, npm 10.8.2)
- Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4
- `next/font` for self-hosted Inter Tight, Inter, JetBrains Mono
- Resend for transactional email
- Zod for shared client/server validation
- Vitest + Testing Library (unit), Playwright (smoke)
- Hosted on Vercel; `main` → production, PRs → preview URLs

### 4.2 Layout

```
tinwa-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # shell: fonts, theme, nav, footer, skip link
│   │   ├── page.tsx                   # Home
│   │   ├── talent/page.tsx
│   │   ├── software/page.tsx
│   │   ├── about/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx
│   │   └── api/
│   │       ├── contact/route.ts
│   │       └── careers/route.ts
│   ├── components/
│   │   ├── layout/     Nav, Footer, ThemeToggle, SkipLink, Container
│   │   ├── ui/         Button, SectionLabel, Card, Field, Prose
│   │   └── sections/   Hero, LogoWall, PillarCards, ProcessSteps,
│   │                   SkillsGrid, CredentialsBlock, CtaBand, ContactForm,
│   │                   CareersForm
│   ├── content/
│   │   ├── company.ts      # all company facts (§2)
│   │   ├── nav.ts          # nav + footer link structure
│   │   ├── talent.ts       # engagement models, vetting, skills grid
│   │   ├── software.ts     # capabilities, domains, anonymised snapshots
│   │   ├── experience.ts   # logo wall entries
│   │   ├── process.ts      # 5 process steps
│   │   ├── careers.ts      # role criteria, what we offer
│   │   └── seo.ts          # per-route metadata
│   └── lib/
│       ├── schemas.ts      # Zod schemas, shared client + server
│       ├── env.ts          # validated env vars, throws at module load
│       ├── resend.ts       # mail client + templates
│       └── cn.ts
├── public/logos/           # brand assets + manifest.ts
├── e2e/                    # Playwright specs
└── .github/workflows/ci.yml
```

### 4.3 Boundaries

Three rules, each independently checkable:

1. **Components contain no copy.** Every user-visible string arrives via props from a content module. A component can be understood, tested and restyled without knowing what TINWA sells.
2. **Content modules contain no markup.** They export typed plain data. Editing copy cannot break a build in a way TypeScript won't catch.
3. **`lib/` never imports from `components/`.** Validation, env and mail are usable from route handlers with no React in the graph.

A page is therefore a thin composition: import content, feed components, render. This is what keeps individual files small enough to reason about, and it's why a change like "Level 4 → Level 1" touches exactly one line.

---

## 5. Pages

### 5.1 Home (`/`)

1. **Hero** — `01 — SOFTWARE CONSULTANCY`, headline, sub, CTAs *Hire a developer* (primary) / *Start a project* (ghost).
2. **Experience across** — logo wall (§5.3).
3. **Two ways to work with us** — Talent card (visually dominant) + Software card, each linking to its pillar page.
4. **Why TINWA** — three points: senior-only engineers; depth in regulated, high-volume systems (banking, telco, credit, betting); engineering standards that survive handover (ADRs, >90% test coverage, CI/CD, security scanning).
5. **How we work** — Listen → Scope → Deliver → Assure → Hand over.
6. **CTA band**.

### 5.2 Talent (`/talent`) — primary pillar

- **Engagement models:** *Embedded developer* (joins your squad, standups and codebase); *Team extension* (a small pod under your product owner); *Fractional tech lead* (architecture ownership and code review without a full-time hire).
- **What "senior" means here** and how associates are vetted.
- **Skills grid:** Backend & Languages · Frontend · Cloud & DevOps · Streaming & Data · Security & Compliance. Sourced from the founder's verified stack.
- **Availability:** based in South Africa; comfortable across UK and EU hours — evidenced by delivery for Brussels- and Cairo-based teams.
- CTA band.

### 5.3 Experience wall — shared component

Entries: BMW IT Hub, Bancon, Figjam, Econet Wireless, Abalobi, Vertice Med Tech, Uptime Crew, S-Mobile Belgium, LiveScore, Scrums, Old Mutual South Africa, Conclusion South Africa.

- **Framing (fixed, non-negotiable in copy):** heading *"Experience across"*, with a visible footnote: *"Companies our engineers have delivered for. Logos are the property of their respective owners."* The wall must never be labelled "Our clients" or "Trusted by", because most entries are prior employment rather than TINWA contracts.
- **Assets:** logos sourced from each company's official public brand/press kit where one exists. Where no public kit exists, or its terms forbid this use, that entry renders as a **text chip** in the same slot — visually consistent, no fabricated or lookalike marks.
- **Treatment:** greyscale at rest, full colour on hover, uniform chip height.
- **Data:** `content/experience.ts` + `public/logos/manifest.ts`; the component falls back to a text chip automatically when an asset is absent, so adding or removing a logo file never requires a code change.

### 5.4 Software (`/software`) — secondary pillar

- **Capabilities:** platform & microservices (Java/Kotlin/Spring Boot); event-driven systems (Kafka); cloud & serverless (AWS Lambda, Step Functions, EKS); modern frontends (React, Next.js, Angular); systems integration; security & compliance.
- **Domains:** digital banking, telecommunications, retail credit decisioning, sports betting.
- **Three anonymised engagement snapshots** — real metrics, no client named, e.g. *"Credit decisioning platform — 5 000+ retail stores across six SADC countries, 20 000+ applications per day"*. Anonymised specifically so nothing brushes an NDA.
- CTA band.

### 5.5 About (`/about`)

Founded 26 March 2019. The associate-network model stated plainly. Founder profile. **Credentials block:** registration number, tax number, B-BBEE EME Level 4 with validity date, published address, professional certifications (AWS, Oracle OCA, HashiCorp Terraform).

### 5.6 Careers (`/careers`)

Who we're looking for (senior, 5+ years, JVM / React / cloud). What working through TINWA means. Form: name, email, LinkedIn or CV URL, primary stack, years of experience, location. **No file uploads** — a URL field avoids storage cost, file validation and POPIA retention obligations entirely.

Carries the same POPIA processing notice as the contact form, linking to `/privacy` — this form collects personal information too.

### 5.7 Contact (`/contact`)

Form: name, company, work email, phone (optional), enquiry type (*Hire a developer* / *Start a project* / *Other*), message. Beside it a details panel: phone, email, published address, registration number. Short POPIA processing notice under the submit button, linking to `/privacy`.

### 5.8 Privacy (`/privacy`)

POPIA processing notice: what is collected (name, email, phone, message, CV link), why (responding to enquiries and applications), lawful basis, retention period, that submissions are transmitted via Resend, and how to request deletion.

---

## 6. Visual system — "Engineering Ink"

Near-black canvas, one electric accent, tight grotesk type, hairline rules, numbered section labels. Light/dark toggle, dark as default.

### 6.1 Tokens

**Dark:** bg `#0B0B0C` · surface `#141416` · border `#26262A` · muted `#9A9AA1` · text `#EDEDE9`
**Light:** bg `#FAFAF8` · surface `#FFFFFF` · border `#E3E3DE` · muted `#5C5C63` · text `#101012`
**Accent (both):** lime `#C9F24D`

**Accent contrast rule.** Lime is never used as text on light backgrounds — it fails contrast. On light it appears only as a filled chip or button with near-black text on top. On dark it may be used as text for section labels and small accents. Links on light are ink with an underline.

### 6.2 Type

- **Display:** Inter Tight — 600/700, letter-spacing −0.02 to −0.03em, line-height 1.05–1.12
- **Body:** Inter — 400/500, 16px, line-height 1.65
- **Labels:** JetBrains Mono — 11px, letter-spacing 0.18em, uppercase (`01 — SOFTWARE CONSULTANCY`)

Self-hosted via `next/font` — no external font request, no layout shift.

### 6.3 Logo

Wordmark only: `TINWA` in Inter Tight 700, letter-spacing 0.22em. No icon mark. Renders as text in the nav (not an image), so it stays crisp and themeable.

Two derived assets, since a wordmark alone doesn't work at 32px: the OG image draws the wordmark on ink via `opengraph-image.tsx`, and the favicon is a hand-authored `icon.svg` — a lime `#C9F24D` square with a near-black `T` — which is the only place a mark exists.

---

## 7. Forms and failure modes

**Flow.** Client component → Zod validate → `POST /api/{contact,careers}` → Zod validate again (same schema) → Resend → your inbox, with `reply-to` set to the submitter.

**Spam.** Hidden honeypot field plus a minimum time-to-submit check. Deliberately no rate-limiting dependency at launch; the upgrade path if spam appears is an Upstash rate-limit inside the route handler.

**Failure handling — the requirement that matters:** a failed submission must never silently lose a lead. On any error the form renders an inline message containing the email and phone directly: *"Something went wrong — email hello@tinwa.co.za or call +27 73 309 7462."*

**Env.** `lib/env.ts` validates `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL` at module load, so a misconfigured deploy fails at build time rather than at runtime.

**Error surfaces.** Styled `not-found.tsx` and `error.tsx` in the Ink system. Theme is applied by an inline script before first paint to prevent a flash.

---

## 8. SEO, accessibility, performance

- Per-route metadata from `content/seo.ts`; generated `sitemap.ts` and `robots.ts`
- Generated OG image (wordmark on ink) via `opengraph-image.tsx`
- JSON-LD `ProfessionalService`: legal name, registration number, address, phone, area served
- Skip-to-content link; visible focus rings; semantic landmarks; every field labelled; `prefers-reduced-motion` respected
- All text pairs meet WCAG AA in both themes
- All pages statically rendered; no client JS beyond the theme toggle and the two forms

---

## 9. Testing

**Unit (Vitest + Testing Library)**
- Zod schemas: accept valid payloads, reject each invalid case individually (missing field, malformed email, oversized message, honeypot filled)
- Content-module invariants: every service has title/label/body; every experience entry has a name
- `LogoWall` falls back to a text chip when an asset is missing
- `company.ts` shape is complete

**E2E (Playwright)**
- All 7 routes return 200 and render their `h1`
- Nav navigates; theme toggle persists across reload
- Contact form shows field-level validation errors
- Contact form happy path succeeds with Resend mocked
- Contact form failure path renders the fallback email and phone

**CI (GitHub Actions):** typecheck → lint → unit → build → Playwright, on every push and PR.

---

## 10. Deployment

- Vercel project linked to `tapsshore/tinwa-website`; `main` → production, PRs → previews
- Env vars set in Vercel: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`
- Custom domain `tinwa.co.za` attached once registered; Resend sending domain verified via DNS

**Blocked on the user, not on implementation** (the site builds and deploys to a Vercel URL without any of these):
1. Register `tinwa.co.za` and provision the `hello@` mailbox
2. Create a Resend account and supply `RESEND_API_KEY`
3. Confirm or correct the B-BBEE level (§2.1)

---

## 11. Success criteria

1. All 7 routes render correctly in both themes at 375px, 768px and 1440px
2. Lighthouse ≥ 95 across Performance, Accessibility, Best Practices, SEO
3. Both forms deliver to the configured inbox; both degrade to visible contact details on failure
4. No copy claims permanent employees, headcount, or that experience-wall companies are TINWA clients
5. Every company fact on the site traces to `company.ts`
6. CI green on `main`
