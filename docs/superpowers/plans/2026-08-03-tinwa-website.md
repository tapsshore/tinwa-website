# TINWA Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the TINWA (Pty) Ltd marketing website — seven statically rendered pages, talent-led positioning, two Resend-backed forms — from the approved spec at `docs/superpowers/specs/2026-08-03-tinwa-website-design.md`.

**Architecture:** Next.js 15 App Router with all pages statically rendered. Copy lives in typed content modules under `src/content/`; components receive it as props and contain no strings of their own. Two route handlers validate submissions with the same Zod schemas the client uses, then send mail via Resend. Theming is CSS custom properties switched by a `data-theme` attribute on `<html>`, set by an inline script before first paint.

**Tech Stack:** Node 20 LTS, npm, Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, Zod, Resend, Vitest + Testing Library, Playwright, GitHub Actions, Vercel.

## Global Constraints

Every task's requirements implicitly include this section.

- **Node 20 LTS, npm.** Local toolchain is node v20.19.2, npm 10.8.2.
- **TypeScript strict mode on.** No `any`, no non-null assertions on values that can genuinely be absent.
- **Components contain no copy.** Every user-visible string arrives via props from a module in `src/content/`. Violating this fails review.
- **Content modules contain no markup.** They export typed plain data only — no JSX, no HTML strings.
- **`src/lib/` never imports from `src/components/`.** Validation, env and mail must be usable from route handlers with no React in the module graph.
- **Colour tokens.** Dark: bg `#0B0B0C`, surface `#141416`, border `#26262A`, muted `#9A9AA1`, ink `#EDEDE9`. Light: bg `#FAFAF8`, surface `#FFFFFF`, border `#E3E3DE`, muted `#5C5C63`, ink `#101012`. Accent both themes: lime `#C9F24D`.
- **Accent contrast rule.** `--accent` is never used as a text colour in the light theme — it fails contrast. In light theme it appears only as a background with `--ink` text on top. In dark theme it may be text.
- **Dark is the default theme.** `:root` holds the dark tokens; `[data-theme="light"]` overrides them.
- **Typography.** Display: Inter Tight (600/700, tracking −0.02 to −0.03em). Body: Inter (400/500, 16px, line-height 1.65). Labels: JetBrains Mono (11px, tracking 0.18em, uppercase). All self-hosted via `next/font/google`.
- **Copy may not claim permanent employees, headcount, offices, or departments.** Permitted framings: "a vetted network of senior engineers", "our engineers", "TINWA delivers". This is a factual constraint, not a stylistic one.
- **The experience wall is never labelled "Our clients" or "Trusted by".** Its heading is exactly `Experience across`, and it always renders the footnote `Companies our engineers have delivered for. Logos are the property of their respective owners.`
- **Every company fact traces to `src/content/company.ts`.** No company fact may be hardcoded in a component or page.
- **B-BBEE level is `4`.** Published from `company.bbbee.level`, a single constant. Do not hardcode the number anywhere else.
- **Commit after every task.** Conventional Commits format (`feat:`, `test:`, `chore:`, `docs:`).

### Deviation from the spec, recorded

The spec (§7) says env vars are validated "at module load, so a misconfigured deploy fails loudly at build". Next.js compiles route handlers at build but does not execute them, so module-load validation alone cannot fail a build. This plan implements the intent in two parts: `src/lib/env.ts` validates at module load of the route handler (first request fails loudly with a descriptive error, and the form shows its fallback), **and** a `npm run check:env` script runs in CI before deploy. Same guarantee, actually enforceable.

---

## File Structure

**Foundation**
- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` — project config
- `vitest.config.ts`, `vitest.setup.ts` — unit test config
- `playwright.config.ts` — E2E config
- `.github/workflows/ci.yml` — typecheck → lint → unit → build → E2E
- `scripts/check-env.mjs` — pre-deploy env validation

**Styling & shell**
- `src/app/globals.css` — Tailwind import, `@theme inline` token mapping, light/dark custom properties
- `src/app/layout.tsx` — fonts, no-flash theme script, skip link, nav, footer
- `src/components/layout/` — `Nav.tsx`, `Footer.tsx`, `ThemeToggle.tsx`, `SkipLink.tsx`, `Container.tsx`

**Content (data only)**
- `src/content/company.ts` — every company fact; imported by footer, About, Contact, JSON-LD
- `src/content/nav.ts` — nav and footer link structure
- `src/content/seo.ts` — per-route title/description
- `src/content/talent.ts` — engagement models, vetting, skills grid, availability
- `src/content/software.ts` — capabilities, domains, anonymised snapshots
- `src/content/experience.ts` — experience-wall entries
- `src/content/process.ts` — the five process steps
- `src/content/careers.ts` — role criteria, what we offer
- `src/content/home.ts` — hero copy, "why TINWA" points, pillar cards

**UI primitives (no copy)**
- `src/components/ui/` — `Button.tsx`, `SectionLabel.tsx`, `Card.tsx`, `Field.tsx`, `Prose.tsx`

**Sections (no copy)**
- `src/components/sections/` — `Hero.tsx`, `LogoWall.tsx`, `PillarCards.tsx`, `ProcessSteps.tsx`, `SkillsGrid.tsx`, `CredentialsBlock.tsx`, `CtaBand.tsx`, `ContactForm.tsx`, `CareersForm.tsx`

**Server-only lib**
- `src/lib/env.ts` — validated env, throws with a descriptive message
- `src/lib/schemas.ts` — Zod schemas shared by client and server
- `src/lib/resend.ts` — mail client and message templates
- `src/lib/cn.ts` — class merge helper

**Routes**
- `src/app/page.tsx`, `talent/`, `software/`, `about/`, `careers/`, `contact/`, `privacy/`
- `src/app/not-found.tsx`, `src/app/error.tsx`
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/icon.svg`
- `src/app/api/contact/route.ts`, `src/app/api/careers/route.ts`

**Assets**
- `public/logos/` — sourced brand assets
- `src/content/logoManifest.ts` — maps experience entries to asset filenames

---

## Task List

1. Scaffold project, tooling and CI
2. Engineering Ink styling foundation and theme switching
3. `company.ts` and content-module invariant tests
4. Remaining content modules
5. UI primitives
6. Layout shell — nav, footer, skip link
7. LogoWall with text-chip fallback
8. Section components
9. Form infrastructure — env, schemas, mail
10. Contact form and `/api/contact`
11. Careers form and `/api/careers`
12. Pages — Home, Talent, Software
13. Pages — About, Careers, Contact, Privacy, and error surfaces
14. SEO — sitemap, robots, JSON-LD, OG image, favicon
15. Playwright E2E suite, README and deployment

---

### Task 1: Scaffold project, tooling and CI

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `.github/workflows/ci.yml`, `src/lib/cn.ts`
- Test: `src/lib/cn.test.ts`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: `cn(...inputs: ClassValue[]): string` from `src/lib/cn.ts` — used by every component from Task 5 onward. npm scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `check:env`. Path alias `@/*` → `src/*`.

- [ ] **Step 1: Create the Next.js project in place**

The working directory already contains `.git`, `.gitignore` and `docs/`. Scaffold into it without clobbering those:

```bash
cd /Users/shoshoret/Documents/projects/personal/tinwa
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack --use-npm --yes
```

If it refuses because the directory is non-empty, answer yes to proceed — it does not delete `docs/` or `.git/`.

- [ ] **Step 2: Install the remaining dependencies**

```bash
npm install zod resend clsx tailwind-merge
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: Add npm scripts**

Replace the `scripts` block in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check:env": "node scripts/check-env.mjs"
  }
}
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Write the failing test for the class helper**

Create `src/lib/cn.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })

  it('lets a later Tailwind class win over an earlier conflicting one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
```

- [ ] **Step 6: Run it and confirm it fails**

Run: `npm test -- src/lib/cn.test.ts`
Expected: FAIL — `Failed to resolve import "./cn"`.

- [ ] **Step 7: Implement the helper**

Create `src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 8: Run it and confirm it passes**

Run: `npm test -- src/lib/cn.test.ts`
Expected: PASS — 3 tests.

- [ ] **Step 9: Add the env-check script**

Create `scripts/check-env.mjs`:

```js
const required = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'NEXT_PUBLIC_SITE_URL']
const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('All required environment variables are present.')
```

- [ ] **Step 10: Enforce the module boundary with lint**

Global Constraints require that `src/lib/` never imports from `src/components/`. Make that a lint error rather than a convention people remember. Append to the config array in `eslint.config.mjs`:

```js
  {
    files: ['src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/components/*', '../components/*', './components/*'],
              message:
                'src/lib must not import from src/components — validation, env and mail have to work in route handlers with no React in the module graph.',
            },
          ],
        },
      ],
    },
  },
```

Verify the rule actually fires: temporarily add `import { Button } from '@/components/ui/Button'` to `src/lib/cn.ts`, run `npm run lint`, confirm it errors with that message, then remove the import.

- [ ] **Step 11: Add the CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    env:
      RESEND_API_KEY: test-key
      CONTACT_TO_EMAIL: ci@example.com
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run check:env
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

Playwright has no specs until Task 15; it exits 0 on an empty suite, so CI stays green until then.

- [ ] **Step 12: Verify the whole pipeline locally**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all four succeed. The build renders the default `create-next-app` page — that is correct at this stage.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project, test tooling and CI"
```

---

### Task 2: Engineering Ink styling foundation and theme switching

**Files:**
- Create: `src/components/layout/ThemeToggle.tsx`, `src/components/layout/ThemeToggle.test.tsx`
- Modify: `src/app/globals.css` (replace entirely), `src/app/layout.tsx` (replace entirely)

**Interfaces:**
- Consumes: `cn` from Task 1
- Produces: Tailwind utility names available to every later task — `bg-bg`, `bg-surface`, `border-border`, `text-muted`, `text-ink`, `bg-accent`, `text-accent`, `font-display`, `font-body`, `font-mono`. Component `<ThemeToggle />`, no props. The `<html>` element carries `data-theme="light"` in light mode and no attribute in dark mode. localStorage key is exactly `tinwa-theme`.

- [ ] **Step 1: Replace the stylesheet with the Ink token system**

Replace the entire contents of `src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-muted: var(--muted);
  --color-ink: var(--ink);
  --color-accent: var(--accent);

  --font-display: var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

/* Dark is the default theme: :root holds the dark tokens. */
:root {
  --bg: #0b0b0c;
  --surface: #141416;
  --border: #26262a;
  --muted: #9a9aa1;
  --ink: #edede9;
  --accent: #c9f24d;
  color-scheme: dark;
}

[data-theme="light"] {
  --bg: #fafaf8;
  --surface: #ffffff;
  --border: #e3e3de;
  --muted: #5c5c63;
  --ink: #101012;
  --accent: #c9f24d;
  color-scheme: light;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

/* Section labels: JetBrains Mono, 11px, 0.18em tracking, uppercase. */
.label-mono {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Write the failing test for the theme toggle**

Create `src/components/layout/ThemeToggle.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('switches to light and records the choice', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('tinwa-theme')).toBe('light')
  })

  it('switches back to dark by removing the attribute', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    await userEvent.click(button)
    await userEvent.click(button)

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    expect(localStorage.getItem('tinwa-theme')).toBe('dark')
  })

  it('exposes an accessible name', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAccessibleName(/theme/i)
  })
})
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `npm test -- src/components/layout/ThemeToggle.test.tsx`
Expected: FAIL — `Failed to resolve import "./ThemeToggle"`.

- [ ] **Step 4: Implement the toggle**

Create `src/components/layout/ThemeToggle.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'tinwa-theme'

function apply(theme: Theme): void {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')
  }, [])

  function toggle(): void {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    apply(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable (private mode); the toggle still works for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="label-mono border border-border px-3 py-1.5 text-muted transition-colors hover:text-ink"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
```

- [ ] **Step 5: Run it and confirm it passes**

Run: `npm test -- src/components/layout/ThemeToggle.test.tsx`
Expected: PASS — 3 tests.

- [ ] **Step 6: Wire fonts and the no-flash script into the root layout**

Replace the entire contents of `src/app/layout.tsx`. Nav and Footer arrive in Task 6; this version renders children only.

```tsx
import type { Metadata } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TINWA',
  description: 'Senior engineers, embedded. Software, delivered.',
}

// Runs before first paint so the stored theme never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem('tinwa-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Verify the tokens render**

Run: `npm run build`
Expected: build succeeds.

Then run `npm run dev` and load `http://localhost:3000`. Expected: near-black `#0b0b0c` background with off-white text. Toggling `prefers-color-scheme` in devtools and reloading gives the paper background with no flash of the wrong theme.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Engineering Ink token system, fonts and theme switching"
```

---

### Task 3: `company.ts` and content-module invariant tests

**Files:**
- Create: `src/content/company.ts`, `src/content/company.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `company` — a `const` object consumed by Footer (Task 6), CredentialsBlock (Task 8), the About/Contact/Privacy pages (Task 13) and JSON-LD (Task 14). Exact shape:

```ts
{
  legalName: string; shortName: string; tagline: string
  registrationNumber: string; taxNumber: string; registrationDate: string
  enterpriseType: string; director: string
  address: { line1: string; line2: string; postalCode: string; city: string; province: string; country: string }
  phone: string; phoneHref: string; email: string; emailHref: string
  domain: string; siteUrl: string
  bbbee: { status: string; level: number; recognition: string; validUntil: string }
}
```

Also exports `formatAddress(): string[]` returning the address as display lines.

- [ ] **Step 1: Write the failing test**

Create `src/content/company.test.ts`. These assertions encode the Global Constraints — they are what stops a later task from drifting a company fact:

```ts
import { describe, it, expect } from 'vitest'
import { company, formatAddress } from './company'

describe('company', () => {
  it('carries the CIPC registration facts verbatim', () => {
    expect(company.legalName).toBe('TINWA (Pty) Ltd')
    expect(company.registrationNumber).toBe('2019/154386/07')
    expect(company.taxNumber).toBe('9371513194')
    expect(company.registrationDate).toBe('2019-03-26')
    expect(company.director).toBe('Tapiwanashe Shoshore')
  })

  it('publishes the address selected in the spec, not the CIPC registered office', () => {
    expect(company.address.line1).toBe('476 Felstead Avenue, Unit 52')
    expect(company.address.line2).toBe('Grand Rapids, Northriding')
    expect(company.address.postalCode).toBe('2169')
  })

  it('publishes B-BBEE level 4 per the ticked box on the affidavit', () => {
    expect(company.bbbee.level).toBe(4)
    expect(company.bbbee.status).toBe('EME')
    expect(company.bbbee.validUntil).toBe('2027-07-16')
  })

  it('derives tel: and mailto: hrefs that match the display values', () => {
    expect(company.phone).toBe('+27 73 309 7462')
    expect(company.phoneHref).toBe('tel:+27733097462')
    expect(company.email).toBe('hello@tinwa.co.za')
    expect(company.emailHref).toBe('mailto:hello@tinwa.co.za')
  })

  it('builds the site URL from the domain', () => {
    expect(company.domain).toBe('tinwa.co.za')
    expect(company.siteUrl).toBe('https://tinwa.co.za')
  })

  it('formats the address as non-empty display lines', () => {
    const lines = formatAddress()
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.every((line) => line.trim().length > 0)).toBe(true)
    expect(lines.join(' ')).toContain('2169')
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/content/company.test.ts`
Expected: FAIL — `Failed to resolve import "./company"`.

- [ ] **Step 3: Implement the module**

Create `src/content/company.ts`:

```ts
/**
 * Single source of truth for every TINWA company fact.
 *
 * Two values here are deliberate decisions recorded in the design spec (§2.1):
 *
 * 1. `address` is the enterprise address from the B-BBEE affidavit, NOT the
 *    CIPC registered office (103 Sun Valley, Karin Avenue, Lambton Gardens,
 *    1401). A client verifying TINWA on the CIPC register will see a different
 *    address.
 * 2. `bbbee.level` is 4, matching the ticked box on the affidavit. The
 *    affidavit's bullets separately declare 100% black ownership, which would
 *    map to level 1. Change this one value once a corrected affidavit exists.
 */
export const company = {
  legalName: 'TINWA (Pty) Ltd',
  shortName: 'TINWA',
  tagline: 'Senior engineers, embedded. Software, delivered.',

  registrationNumber: '2019/154386/07',
  taxNumber: '9371513194',
  registrationDate: '2019-03-26',
  enterpriseType: 'Private Company',
  director: 'Tapiwanashe Shoshore',

  address: {
    line1: '476 Felstead Avenue, Unit 52',
    line2: 'Grand Rapids, Northriding',
    postalCode: '2169',
    city: 'Johannesburg',
    province: 'Gauteng',
    country: 'South Africa',
  },

  phone: '+27 73 309 7462',
  phoneHref: 'tel:+27733097462',
  email: 'hello@tinwa.co.za',
  emailHref: 'mailto:hello@tinwa.co.za',

  domain: 'tinwa.co.za',
  siteUrl: 'https://tinwa.co.za',

  bbbee: {
    status: 'EME',
    level: 4,
    recognition: '100%',
    validUntil: '2027-07-16',
  },
} as const

export function formatAddress(): string[] {
  const { line1, line2, city, province, postalCode, country } = company.address
  return [line1, line2, `${city}, ${province}, ${postalCode}`, country]
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `npm test -- src/content/company.test.ts`
Expected: PASS — 6 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add company content module as single source of truth"
```

---

### Task 4: Remaining content modules

**Files:**
- Create: `src/content/nav.ts`, `src/content/seo.ts`, `src/content/home.ts`, `src/content/process.ts`, `src/content/experience.ts`, `src/content/talent.ts`, `src/content/software.ts`, `src/content/careers.ts`, `src/content/content.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `nav.ts` → `type NavLink = { href: string; label: string }`, `primaryNav: NavLink[]`, `footerNav: NavLink[]`, `routes: readonly string[]`
  - `seo.ts` → `type PageSeo = { title: string; description: string }`, `pageSeo: Record<string, PageSeo>` keyed by route
  - `home.ts` → `hero: { label, headlineLead, headlineTail, sub, primaryCta, secondaryCta }`, `whyPoints: Feature[]`, `pillars: Pillar[]`
  - `process.ts` → `processSteps: { n: string; title: string; body: string }[]` (exactly 5)
  - `experience.ts` → `type ExperienceEntry = { name: string; slug: string }`, `experienceEntries: ExperienceEntry[]`, `EXPERIENCE_HEADING`, `EXPERIENCE_FOOTNOTE`
  - `talent.ts` → `engagementModels: Feature[]`, `vetting: Feature[]`, `skillGroups: { title: string; items: string[] }[]`, `availability: { label, title, body }`
  - `software.ts` → `capabilities: Feature[]`, `domains: string[]`, `snapshots: { metric: string; title: string; body: string }[]`
  - `careers.ts` → `lookingFor: Feature[]`, `whatWeOffer: Feature[]`, `careersIntro: { label, title, body }`
  - Shared type `Feature = { title: string; body: string }`, exported from `src/content/types.ts`

- [ ] **Step 1: Write the failing invariant test**

Create `src/content/content.test.ts`. These tests are deliberately about *shape and constraint compliance*, not about exact prose — copy should be editable without breaking tests, but the Global Constraints must not be editable away:

```ts
import { describe, it, expect } from 'vitest'
import { primaryNav, footerNav, routes } from './nav'
import { pageSeo } from './seo'
import { hero, whyPoints, pillars } from './home'
import { processSteps } from './process'
import { experienceEntries, EXPERIENCE_HEADING, EXPERIENCE_FOOTNOTE } from './experience'
import { engagementModels, vetting, skillGroups, availability } from './talent'
import { capabilities, domains, snapshots } from './software'
import { lookingFor, whatWeOffer, careersIntro } from './careers'
import type { Feature } from './types'

function expectFeatures(features: readonly Feature[], min: number) {
  expect(features.length).toBeGreaterThanOrEqual(min)
  for (const feature of features) {
    expect(feature.title.trim().length).toBeGreaterThan(0)
    expect(feature.body.trim().length).toBeGreaterThan(0)
  }
}

describe('nav', () => {
  it('lists the five primary pages', () => {
    expect(primaryNav.map((l) => l.href)).toEqual([
      '/talent',
      '/software',
      '/about',
      '/careers',
      '/contact',
    ])
  })

  it('adds privacy to the footer only', () => {
    expect(footerNav.some((l) => l.href === '/privacy')).toBe(true)
    expect(primaryNav.some((l) => l.href === '/privacy')).toBe(false)
  })

  it('enumerates all seven routes', () => {
    expect([...routes].sort()).toEqual(
      ['/', '/about', '/careers', '/contact', '/privacy', '/software', '/talent'].sort(),
    )
  })
})

describe('seo', () => {
  it('has an entry for every route', () => {
    for (const route of routes) {
      expect(pageSeo[route], `missing seo for ${route}`).toBeDefined()
    }
  })

  it('gives every page a non-empty title and description', () => {
    for (const route of routes) {
      expect(pageSeo[route].title.trim().length).toBeGreaterThan(0)
      expect(pageSeo[route].description.trim().length).toBeGreaterThan(0)
    }
  })

  it('keeps descriptions short enough not to be truncated in search results', () => {
    for (const route of routes) {
      expect(pageSeo[route].description.length, `${route} description too long`).toBeLessThanOrEqual(160)
    }
  })
})

describe('home', () => {
  it('splits the headline into a lead and a tail so the separator can be styled', () => {
    expect(hero.headlineLead).toBe('Senior engineers, embedded.')
    expect(hero.headlineTail).toBe('Software, delivered.')
  })

  it('leads with the talent CTA', () => {
    expect(hero.primaryCta.label).toBe('Hire a developer')
    expect(hero.primaryCta.href).toBe('/contact')
    expect(hero.secondaryCta.label).toBe('Start a project')
  })

  it('has three why-TINWA points and two pillars', () => {
    expectFeatures(whyPoints, 3)
    expect(pillars).toHaveLength(2)
    expect(pillars[0].href).toBe('/talent')
    expect(pillars[1].href).toBe('/software')
  })
})

describe('process', () => {
  it('has the five named steps in order', () => {
    expect(processSteps.map((s) => s.title)).toEqual([
      'Listen',
      'Scope',
      'Deliver',
      'Assure',
      'Hand over',
    ])
  })

  it('numbers each step', () => {
    expect(processSteps.map((s) => s.n)).toEqual(['01', '02', '03', '04', '05'])
  })
})

describe('experience', () => {
  it('is framed as experience, never as clients', () => {
    expect(EXPERIENCE_HEADING).toBe('Experience across')
    expect(EXPERIENCE_FOOTNOTE).toBe(
      'Companies our engineers have delivered for. Logos are the property of their respective owners.',
    )
  })

  it('never uses client or trusted-by language', () => {
    const text = `${EXPERIENCE_HEADING} ${EXPERIENCE_FOOTNOTE}`.toLowerCase()
    expect(text).not.toContain('our clients')
    expect(text).not.toContain('trusted by')
  })

  it('lists every company with a unique slug', () => {
    expect(experienceEntries.length).toBeGreaterThanOrEqual(12)
    const slugs = experienceEntries.map((e) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const entry of experienceEntries) {
      expect(entry.name.trim().length).toBeGreaterThan(0)
      expect(entry.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })
})

describe('talent', () => {
  it('offers three engagement models', () => {
    expect(engagementModels.map((m) => m.title)).toEqual([
      'Embedded developer',
      'Team extension',
      'Fractional tech lead',
    ])
  })

  it('describes vetting and availability', () => {
    expectFeatures(vetting, 3)
    expect(availability.body.trim().length).toBeGreaterThan(0)
  })

  it('groups skills with at least one item each', () => {
    expect(skillGroups.length).toBeGreaterThanOrEqual(5)
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThan(0)
    }
  })
})

describe('software', () => {
  it('lists capabilities and domains', () => {
    expectFeatures(capabilities, 6)
    expect(domains.length).toBeGreaterThanOrEqual(4)
  })

  it('keeps engagement snapshots anonymised', () => {
    expect(snapshots).toHaveLength(3)
    const named = ['pepkor', 's-mobile', 'smobile', 'bancon', 'econet', 'livescore', 'sovtech']
    for (const snapshot of snapshots) {
      const text = `${snapshot.title} ${snapshot.body} ${snapshot.metric}`.toLowerCase()
      for (const name of named) {
        expect(text, `snapshot names a client: ${name}`).not.toContain(name)
      }
    }
  })
})

describe('careers', () => {
  it('describes who we want and what we offer', () => {
    expectFeatures(lookingFor, 3)
    expectFeatures(whatWeOffer, 3)
    expect(careersIntro.title.trim().length).toBeGreaterThan(0)
  })
})

describe('capacity claims', () => {
  it('never claims permanent employees or headcount anywhere in the copy', () => {
    const allCopy = [
      hero.sub,
      ...whyPoints.flatMap((f) => [f.title, f.body]),
      ...pillars.flatMap((p) => [p.title, p.body]),
      ...engagementModels.flatMap((f) => [f.title, f.body]),
      ...vetting.flatMap((f) => [f.title, f.body]),
      ...capabilities.flatMap((f) => [f.title, f.body]),
      ...lookingFor.flatMap((f) => [f.title, f.body]),
      ...whatWeOffer.flatMap((f) => [f.title, f.body]),
      availability.body,
      careersIntro.body,
    ]
      .join(' ')
      .toLowerCase()

    for (const phrase of ['our employees', 'full-time staff', 'our offices', 'our team of']) {
      expect(allCopy, `copy claims capacity: "${phrase}"`).not.toContain(phrase)
    }
    expect(allCopy).not.toMatch(/\b\d+\+?\s+(employees|staff|developers on staff)\b/)
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/content/content.test.ts`
Expected: FAIL — unresolved imports for every content module.

- [ ] **Step 3: Create the shared type**

Create `src/content/types.ts`:

```ts
export type Feature = { title: string; body: string }
export type Cta = { label: string; href: string }
```

- [ ] **Step 4: Create the navigation and SEO modules**

Create `src/content/nav.ts`:

```ts
export type NavLink = { href: string; label: string }

export const primaryNav: NavLink[] = [
  { href: '/talent', label: 'Talent' },
  { href: '/software', label: 'Software' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
]

export const footerNav: NavLink[] = [...primaryNav, { href: '/privacy', label: 'Privacy' }]

export const routes = [
  '/',
  '/talent',
  '/software',
  '/about',
  '/careers',
  '/contact',
  '/privacy',
] as const
```

Create `src/content/seo.ts`:

```ts
export type PageSeo = { title: string; description: string }

export const pageSeo: Record<string, PageSeo> = {
  '/': {
    title: 'TINWA — Senior engineers, embedded. Software, delivered.',
    description:
      'A South African software consultancy placing proven senior developers into your team, and building the systems when you would rather hand the whole thing over.',
  },
  '/talent': {
    title: 'Hire a senior developer — TINWA',
    description:
      'Embedded developers, team extension and fractional tech leads. Senior engineers with depth in banking, telecoms and high-volume systems.',
  },
  '/software': {
    title: 'Software delivery — TINWA',
    description:
      'Microservices, event-driven systems, cloud and serverless, modern frontends and systems integration for regulated, high-volume platforms.',
  },
  '/about': {
    title: 'About TINWA',
    description:
      'A South African software consultancy registered in 2019, working through a vetted network of senior engineers.',
  },
  '/careers': {
    title: 'Join the TINWA network',
    description:
      'We work with senior engineers on client engagements across South Africa, the UK and Europe. Tell us what you build.',
  },
  '/contact': {
    title: 'Contact TINWA',
    description:
      'Hire a developer or start a project. Reach TINWA by email, phone or the enquiry form.',
  },
  '/privacy': {
    title: 'Privacy notice — TINWA',
    description:
      'How TINWA collects, uses and retains personal information submitted through this website, in line with POPIA.',
  },
}
```

- [ ] **Step 5: Create the home, process and experience modules**

Create `src/content/home.ts`:

```ts
import type { Cta, Feature } from './types'

export const hero = {
  label: '01 — Software consultancy',
  headlineLead: 'Senior engineers, embedded.',
  headlineTail: 'Software, delivered.',
  sub: 'We place proven senior developers into your team — and build the systems when you would rather hand the whole thing over.',
  primaryCta: { label: 'Hire a developer', href: '/contact' } satisfies Cta,
  secondaryCta: { label: 'Start a project', href: '/software' } satisfies Cta,
}

export const whyPoints: Feature[] = [
  {
    title: 'Senior only',
    body: 'Every engineer we place has shipped production systems for a decade or thereabouts. You are not paying senior rates to train someone.',
  },
  {
    title: 'Regulated and high volume',
    body: 'Digital banking, telecommunications, retail credit decisioning and sports betting — domains where correctness, auditability and throughput are not negotiable.',
  },
  {
    title: 'Standards that survive handover',
    body: 'Architecture decision records, test coverage above ninety percent, CI/CD pipelines and security scanning. What we leave behind is maintainable by your team.',
  },
]

export const pillars = [
  {
    label: 'Talent',
    title: 'Embed a senior developer',
    body: 'A proven engineer joins your squad, your standups and your codebase — under your product owner, on your process.',
    cta: 'Explore talent',
    href: '/talent',
  },
  {
    label: 'Software',
    title: 'Hand us the build',
    body: 'We take a scoped problem end to end: architecture, delivery, assurance and a documented handover.',
    cta: 'Explore delivery',
    href: '/software',
  },
]
```

Create `src/content/process.ts`:

```ts
export const processSteps = [
  {
    n: '01',
    title: 'Listen',
    body: 'We start with the constraint you are actually up against — a deadline, a migration, a team that is one senior engineer short.',
  },
  {
    n: '02',
    title: 'Scope',
    body: 'We agree what is in, what is out, and what done looks like. For talent engagements this is the role, the stack and the overlap hours.',
  },
  {
    n: '03',
    title: 'Deliver',
    body: 'Work happens in your process and your repository, in the open. Weekly demos, no surprises at the end of a sprint.',
  },
  {
    n: '04',
    title: 'Assure',
    body: 'Automated tests, code review, static analysis and security scanning run on every change before it reaches your main branch.',
  },
  {
    n: '05',
    title: 'Hand over',
    body: 'Architecture decision records, runbooks and a walkthrough with your team. You should not need us to keep the system running.',
  },
]
```

Create `src/content/experience.ts`:

```ts
export type ExperienceEntry = { name: string; slug: string }

/**
 * Framing is fixed by the design spec (§5.3) and enforced by tests. This wall
 * describes where our engineers have worked; it is not a client list, and it
 * must never be relabelled "Our clients" or "Trusted by".
 */
export const EXPERIENCE_HEADING = 'Experience across'
export const EXPERIENCE_FOOTNOTE =
  'Companies our engineers have delivered for. Logos are the property of their respective owners.'

export const experienceEntries: ExperienceEntry[] = [
  { name: 'BMW IT Hub', slug: 'bmw-it-hub' },
  { name: 'Bancon', slug: 'bancon' },
  { name: 'Econet Wireless', slug: 'econet-wireless' },
  { name: 'Old Mutual South Africa', slug: 'old-mutual' },
  { name: 'LiveScore', slug: 'livescore' },
  { name: 'S-Mobile Belgium', slug: 's-mobile' },
  { name: 'Abalobi', slug: 'abalobi' },
  { name: 'Vertice Med Tech', slug: 'vertice-med-tech' },
  { name: 'Uptime Crew', slug: 'uptime-crew' },
  { name: 'Figjam', slug: 'figjam' },
  { name: 'Scrums', slug: 'scrums' },
  { name: 'Conclusion South Africa', slug: 'conclusion' },
]
```

- [ ] **Step 6: Create the talent, software and careers modules**

Create `src/content/talent.ts`:

```ts
import type { Feature } from './types'

export const engagementModels: Feature[] = [
  {
    title: 'Embedded developer',
    body: 'One senior engineer joins your squad, your standups and your codebase. They report into your product owner and work your process — the simplest way to add capacity without adding headcount.',
  },
  {
    title: 'Team extension',
    body: 'A small pod of engineers takes a workstream off your roadmap while your permanent team stays on core product. Useful when a migration or integration would otherwise stall everything else.',
  },
  {
    title: 'Fractional tech lead',
    body: 'Architecture ownership, decision records and code review from someone who has built the thing before — without committing to a full-time principal engineer.',
  },
]

export const vetting: Feature[] = [
  {
    title: 'Production track record',
    body: 'We place engineers who have run systems in production under real load, not just built them. Every engineer in the network has shipped and operated services that people depended on.',
  },
  {
    title: 'Technical interview by an engineer',
    body: 'Candidates are assessed on architecture and code by someone who works in the same stack, not screened on keywords by a recruiter.',
  },
  {
    title: 'Reference-checked delivery',
    body: 'We verify what someone actually delivered on their last engagement before we put them in front of you.',
  },
]

export const skillGroups = [
  {
    title: 'Backend and languages',
    items: ['Java 8–21', 'Kotlin', 'Spring Boot 2.x / 3.x', 'Python', 'FastAPI', 'REST and SOAP APIs'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Angular', 'Vue.js', 'Tailwind CSS'],
  },
  {
    title: 'Cloud and DevOps',
    items: ['AWS Lambda, API Gateway, EKS, DynamoDB, S3, Step Functions', 'Docker', 'Kubernetes', 'Terraform', 'ArgoCD', 'GitLab CI/CD'],
  },
  {
    title: 'Streaming and data',
    items: ['Apache Kafka', 'Confluent', 'RabbitMQ', 'Protobuf and Avro', 'PostgreSQL', 'Oracle', 'Redis'],
  },
  {
    title: 'Security and compliance',
    items: ['Spring Security', 'Keycloak', 'OAuth2 and JWT', 'RBAC', 'OWASP practice', 'SonarQube and Checkmarx'],
  },
]

export const availability = {
  label: '04 — Availability',
  title: 'South Africa, working across UK and European hours',
  body: 'Our engineers are based in South Africa and routinely deliver for teams in Europe and the UK — a two-hour offset from Central European Time and one from the UK in summer, which means a full overlapping working day rather than a handover window.',
}
```

Create `src/content/software.ts`:

```ts
import type { Feature } from './types'

export const capabilities: Feature[] = [
  {
    title: 'Platform and microservices',
    body: 'Java and Kotlin services on Spring Boot, designed around clear domain boundaries so teams can deploy independently instead of coordinating releases.',
  },
  {
    title: 'Event-driven systems',
    body: 'Apache Kafka for real-time processing, inter-service communication and audit logging — with schema management and monitoring, not just a topic and hope.',
  },
  {
    title: 'Cloud and serverless',
    body: 'AWS Lambda, API Gateway, Step Functions, DynamoDB and EKS, provisioned as infrastructure as code so environments are reproducible.',
  },
  {
    title: 'Modern frontends',
    body: 'React, Next.js and Angular applications with real state management, accessibility and test coverage — built against API contracts agreed up front.',
  },
  {
    title: 'Systems integration',
    body: 'Connecting core banking, ERP, credit bureau and payment systems, including the protocol translation and reconciliation work that integration projects actually consist of.',
  },
  {
    title: 'Security and compliance',
    body: 'OAuth2, Keycloak, role-based access control and static analysis wired into the pipeline, so a security finding blocks a merge rather than surfacing in an audit.',
  },
]

export const domains: string[] = [
  'Digital banking',
  'Telecommunications',
  'Retail credit decisioning',
  'Sports betting and gaming',
]

/**
 * Anonymised on purpose. Metrics are real; no client is named, so nothing here
 * brushes an NDA. Tests assert that no client name appears in this data.
 */
export const snapshots = [
  {
    metric: '20,000+ applications a day',
    title: 'Credit decisioning at retail scale',
    body: 'A customer onboarding and credit decisioning platform serving more than five thousand retail stores across six southern African countries, integrating four credit bureaux and a machine-learning decisioning engine on a serverless architecture.',
  },
  {
    metric: 'Millions of subscribers',
    title: 'Telecoms transaction processing',
    body: 'Event-driven services handling USSD and agricultural-services traffic for a national mobile network, built on Spring Boot and Kafka for high concurrency across a distributed estate.',
  },
  {
    metric: 'Zero-downtime releases',
    title: 'Regulated document platform',
    body: 'A document management system with qualified digital signing and regulated retention, migrated from Spring Boot 2 to 3 and deployed continuously on Kubernetes with GitOps.',
  },
]
```

Create `src/content/careers.ts`:

```ts
import type { Feature } from './types'

export const careersIntro = {
  label: '01 — Careers',
  title: 'Join the TINWA network',
  body: 'We work with a small, vetted network of senior engineers on client engagements. If you have shipped and operated production systems and you want interesting work without giving up your independence, tell us what you build.',
}

export const lookingFor: Feature[] = [
  {
    title: 'Five years or more, in production',
    body: 'You have built systems that real users depended on, and you have been on the hook when they broke.',
  },
  {
    title: 'Depth in the JVM, React or cloud',
    body: 'Java or Kotlin with Spring Boot, React or Angular on the front end, or AWS and Kubernetes on the platform side. Depth in one beats a list of twenty.',
  },
  {
    title: 'Able to work inside a client team',
    body: 'Most engagements are embedded. You will be in someone else’s standup, codebase and review process, and you need to be effective there from the first week.',
  },
]

export const whatWeOffer: Feature[] = [
  {
    title: 'Work that is worth doing',
    body: 'Banking platforms, telecoms infrastructure and credit systems at real scale — not brochureware.',
  },
  {
    title: 'Straight rates, paid on time',
    body: 'You know the rate before the engagement starts and there are no deductions you did not agree to.',
  },
  {
    title: 'Engineering backup',
    body: 'Architecture review and a second opinion from engineers who have solved the same problem, so you are embedded but not alone.',
  },
]
```

- [ ] **Step 7: Run the tests and confirm they pass**

Run: `npm test -- src/content/content.test.ts`
Expected: PASS — all suites green, including the capacity-claim and anonymisation guards.

- [ ] **Step 8: Run the full unit suite and typecheck**

Run: `npm test && npm run typecheck`
Expected: both pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add content modules for nav, seo, home, process, experience, talent, software and careers"
```

---

### Task 5: UI primitives

**Files:**
- Create: `src/components/ui/Container.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/SectionLabel.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Field.tsx`, `src/components/ui/Prose.tsx`, `src/components/ui/ui.test.tsx`

**Interfaces:**
- Consumes: `cn` (Task 1); Tailwind token utilities (Task 2)
- Produces:
  - `<Container className?>` — `max-w-6xl` centred wrapper with responsive padding
  - `<Button href? variant?='primary'|'ghost' type?>` — renders a Next `<Link>` when `href` is given, otherwise a `<button>`
  - `<SectionLabel>{'01 — Software consultancy'}</SectionLabel>` — splits on the first `' — '`, renders the leading number as a lime chip with near-black text and the remainder in muted mono. **This chip treatment is how the accent-contrast rule is satisfied: `--accent` is only ever a background here, never a text colour.**
  - `<Card as?='div'|'li'|'article' className?>` — surface panel with a hairline border
  - `<Field id label error? hint? children>` — label + control slot + error message; wires `aria-describedby` and `aria-invalid`
  - `<Prose>` — long-form text wrapper used by the Privacy page

- [ ] **Step 1: Write the failing tests**

Create `src/components/ui/ui.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'
import { SectionLabel } from './SectionLabel'
import { Field } from './Field'

describe('Button', () => {
  it('renders a link when given an href', () => {
    render(<Button href="/contact">Hire a developer</Button>)
    expect(screen.getByRole('link', { name: 'Hire a developer' })).toHaveAttribute('href', '/contact')
  })

  it('renders a button when given no href', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
  })

  it('uses the accent only as a background, never as text', () => {
    render(<Button href="/contact">Hire a developer</Button>)
    const className = screen.getByRole('link').className
    expect(className).toContain('bg-accent')
    expect(className).not.toContain('text-accent')
  })
})

describe('SectionLabel', () => {
  it('splits the leading number away from the label text', () => {
    render(<SectionLabel>01 — Software consultancy</SectionLabel>)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Software consultancy')).toBeInTheDocument()
  })

  it('renders the number as an accent chip, not accent text', () => {
    render(<SectionLabel>02 — How we work</SectionLabel>)
    const chip = screen.getByText('02')
    expect(chip.className).toContain('bg-accent')
    expect(chip.className).not.toContain('text-accent')
  })

  it('renders a label with no number without crashing', () => {
    render(<SectionLabel>Careers</SectionLabel>)
    expect(screen.getByText('Careers')).toBeInTheDocument()
  })
})

describe('Field', () => {
  it('associates the label with the control', () => {
    render(
      <Field id="email" label="Work email">
        <input id="email" />
      </Field>,
    )
    expect(screen.getByLabelText('Work email')).toBeInTheDocument()
  })

  it('exposes the error to assistive technology', () => {
    render(
      <Field id="email" label="Work email" error="Enter a valid email address">
        <input id="email" />
      </Field>,
    )
    const input = screen.getByLabelText('Work email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(/valid email address/)
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address')
  })

  it('marks the control valid when there is no error', () => {
    render(
      <Field id="name" label="Name">
        <input id="name" />
      </Field>,
    )
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'false')
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- src/components/ui/ui.test.tsx`
Expected: FAIL — unresolved imports for `./Button`, `./SectionLabel`, `./Field`.

- [ ] **Step 3: Implement Container and Card**

Create `src/components/ui/Container.tsx`:

```tsx
import { cn } from '@/lib/cn'

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>
}
```

Create `src/components/ui/Card.tsx`:

```tsx
import { cn } from '@/lib/cn'

export function Card({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: 'div' | 'li' | 'article'
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag className={cn('border border-border bg-surface p-6 sm:p-8', className)}>{children}</Tag>
  )
}
```

- [ ] **Step 4: Implement Button**

Create `src/components/ui/Button.tsx`:

```tsx
import Link from 'next/link'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ghost'

const base =
  'inline-flex items-center justify-center font-display text-sm font-semibold tracking-tight px-5 py-3 transition-colors disabled:opacity-60 disabled:pointer-events-none'

// The accent is a background here and never a text colour, which is what keeps
// the light theme within contrast. `text-bg` resolves to near-black in dark and
// off-white in light, so the ghost variant needs its own explicit colours.
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-[#0b0b0c] hover:opacity-90',
  ghost: 'border border-border text-ink hover:border-ink',
}

type Props = {
  children: React.ReactNode
  href?: string
  variant?: Variant
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  href,
  variant = 'primary',
  type = 'button',
  disabled,
  className,
}: Props) {
  const classes = cn(base, variants[variant], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
```

- [ ] **Step 5: Implement SectionLabel**

Create `src/components/ui/SectionLabel.tsx`:

```tsx
import { cn } from '@/lib/cn'

const SEPARATOR = ' — '

/**
 * Renders labels of the form "01 — Software consultancy".
 *
 * The leading number becomes a lime chip with near-black text. This is
 * deliberate: the accent must never be used as a text colour, because lime on
 * the light theme's paper background fails contrast.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const index = children.indexOf(SEPARATOR)
  const hasNumber = index > -1
  const number = hasNumber ? children.slice(0, index) : null
  const text = hasNumber ? children.slice(index + SEPARATOR.length) : children

  return (
    <p className={cn('label-mono flex items-center gap-2 text-muted', className)}>
      {number ? <span className="bg-accent px-1.5 py-0.5 text-[#0b0b0c]">{number}</span> : null}
      <span>{text}</span>
    </p>
  )
}
```

- [ ] **Step 6: Implement Field and Prose**

Create `src/components/ui/Field.tsx`:

```tsx
import { cloneElement, isValidElement } from 'react'

type Props = {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}

export function Field({ id, label, error, hint, children }: Props) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  const control = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        'aria-invalid': error ? 'true' : 'false',
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      })
    : children

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-mono text-muted">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export const inputClasses =
  'w-full border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none'
```

Create `src/components/ui/Prose.tsx`:

```tsx
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-2xl flex-col gap-6 text-base leading-[1.65] text-muted [&_a]:text-ink [&_a]:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
      {children}
    </div>
  )
}
```

- [ ] **Step 7: Run the tests and confirm they pass**

Run: `npm test -- src/components/ui/ui.test.tsx`
Expected: PASS — 9 tests.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add UI primitives with accent-contrast and accessibility guarantees"
```

---

### Task 6: Layout shell — nav, footer, skip link

**Files:**
- Create: `src/components/layout/SkipLink.tsx`, `src/components/layout/Nav.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/layout.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `company`, `formatAddress` (Task 3); `primaryNav`, `footerNav` (Task 4); `Container`, `Button` (Task 5); `ThemeToggle` (Task 2)
- Produces: `<SkipLink />`, `<Nav />`, `<Footer />`. The root layout wraps children in `<main id="main-content">`, which the skip link targets and Task 15's E2E suite relies on.

- [ ] **Step 1: Write the failing tests**

Create `src/components/layout/layout.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { SkipLink } from './SkipLink'
import { company } from '@/content/company'

describe('SkipLink', () => {
  it('targets the main landmark', () => {
    render(<SkipLink />)
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute(
      'href',
      '#main-content',
    )
  })
})

describe('Nav', () => {
  it('renders the wordmark as text linking home', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'TINWA' })).toHaveAttribute('href', '/')
  })

  it('links every primary page', () => {
    render(<Nav />)
    for (const label of ['Talent', 'Software', 'About', 'Careers', 'Contact']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })
})

describe('Footer', () => {
  it('publishes the company facts from the company module', () => {
    render(<Footer />)
    expect(screen.getByText(company.legalName)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(company.registrationNumber.replace(/\//g, '\\/')))).toBeInTheDocument()
    expect(screen.getByRole('link', { name: company.email })).toHaveAttribute(
      'href',
      company.emailHref,
    )
    expect(screen.getByRole('link', { name: company.phone })).toHaveAttribute(
      'href',
      company.phoneHref,
    )
  })

  it('states the B-BBEE level from the single constant', () => {
    render(<Footer />)
    expect(screen.getByText(new RegExp(`Level ${company.bbbee.level}`))).toBeInTheDocument()
  })

  it('links the privacy notice', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- src/components/layout/layout.test.tsx`
Expected: FAIL — unresolved imports for `./Nav`, `./Footer`, `./SkipLink`.

- [ ] **Step 3: Implement SkipLink**

Create `src/components/layout/SkipLink.tsx`:

```tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-semibold focus:text-[#0b0b0c]"
    >
      Skip to content
    </a>
  )
}
```

- [ ] **Step 4: Implement Nav**

Create `src/components/layout/Nav.tsx`:

```tsx
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ThemeToggle } from './ThemeToggle'
import { primaryNav } from '@/content/nav'
import { company } from '@/content/company'

export function Nav() {
  return (
    <header className="border-b border-border">
      <Container className="flex items-center justify-between gap-6 py-5">
        <Link
          href="/"
          className="font-display text-base font-bold tracking-[0.22em] text-ink"
        >
          {company.shortName}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-mono text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </Container>

      {/* On narrow viewports the primary links move below the wordmark rather
          than into a JS-driven drawer — five links fit, and it keeps the shell
          free of client-side state. */}
      <Container className="pb-4 md:hidden">
        <nav aria-label="Primary, mobile">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-mono text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
```

Note: `Nav` renders the primary links twice, once per breakpoint. The unit test above uses `getByRole('link', { name })`, which fails on duplicates — so in the test, assert with `getAllByRole` instead. Update the "links every primary page" test body to:

```tsx
  it('links every primary page', () => {
    render(<Nav />)
    for (const label of ['Talent', 'Software', 'About', 'Careers', 'Contact']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0)
    }
  })
```

- [ ] **Step 5: Implement Footer**

Create `src/components/layout/Footer.tsx`:

```tsx
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { footerNav } from '@/content/nav'
import { company, formatAddress } from '@/content/company'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="font-display text-base font-bold tracking-[0.22em] text-ink">
            {company.shortName}
          </span>
          <p className="text-sm leading-relaxed text-muted">{company.tagline}</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-muted">Contact</span>
          <a href={company.emailHref} className="text-sm text-ink hover:underline">
            {company.email}
          </a>
          <a href={company.phoneHref} className="text-sm text-ink hover:underline">
            {company.phone}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-muted">Registered office</span>
          <address className="text-sm not-italic leading-relaxed text-muted">
            {formatAddress().map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-muted">Navigate</span>
          <ul className="flex flex-col gap-2">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {company.legalName} — Registration {company.registrationNumber} — VAT/Tax{' '}
          {company.taxNumber}
        </p>
        <p>
          B-BBEE {company.bbbee.status}, Level {company.bbbee.level} contributor (
          {company.bbbee.recognition} procurement recognition)
        </p>
      </Container>
    </footer>
  )
}
```

- [ ] **Step 6: Wire the shell into the root layout**

In `src/app/layout.tsx`, add the imports and replace the `<body>` contents:

```tsx
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
```

```tsx
      <body className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <SkipLink />
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
```

- [ ] **Step 7: Run the tests and confirm they pass**

Run: `npm test -- src/components/layout/`
Expected: PASS — SkipLink, Nav, Footer and ThemeToggle suites all green.

- [ ] **Step 8: Verify in the browser**

Run: `npm run dev`, load `http://localhost:3000`.
Expected: wordmark and nav on a hairline-bordered header, footer showing the address, registration number and "Level 4 contributor". Press Tab from a fresh page load — the skip link should appear as a lime chip in the top-left.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add layout shell with nav, footer and skip link"
```

---

### Task 7: LogoWall with text-chip fallback

**Files:**
- Create: `src/content/logoManifest.ts`, `src/components/sections/LogoWall.tsx`, `src/components/sections/LogoWall.test.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: `experienceEntries`, `EXPERIENCE_HEADING`, `EXPERIENCE_FOOTNOTE` (Task 4); `Container` (Task 5)
- Produces: `<LogoWall />` (no props — reads its own content module); `logoManifest: Record<string, LogoAsset>` where `LogoAsset = { src: string; width: number; height: number }`, keyed by `ExperienceEntry.slug`

**Why this is its own task:** the wall is the highest-risk component on the site (third-party trademarks, and a framing that must never drift to "Our clients"). It gets its own test file and its own review gate. The fallback design also means asset sourcing can lag the code without blocking anything.

- [ ] **Step 1: Write the failing tests**

Create `src/components/sections/LogoWall.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogoWall } from './LogoWall'
import { experienceEntries, EXPERIENCE_FOOTNOTE } from '@/content/experience'

vi.mock('@/content/logoManifest', () => ({
  logoManifest: {
    'bmw-it-hub': { src: '/logos/bmw-it-hub.svg', width: 120, height: 40 },
  },
}))

describe('LogoWall', () => {
  it('renders the fixed heading and footnote', () => {
    render(<LogoWall />)
    expect(screen.getByText('Experience across')).toBeInTheDocument()
    expect(screen.getByText(EXPERIENCE_FOOTNOTE)).toBeInTheDocument()
  })

  it('renders an image for an entry that has an asset', () => {
    render(<LogoWall />)
    expect(screen.getByAltText('BMW IT Hub')).toBeInTheDocument()
  })

  it('falls back to a text chip for every entry with no asset', () => {
    render(<LogoWall />)
    const withoutAssets = experienceEntries.filter((e) => e.slug !== 'bmw-it-hub')
    for (const entry of withoutAssets) {
      expect(screen.getByText(entry.name)).toBeInTheDocument()
    }
  })

  it('renders one slot per experience entry', () => {
    render(<LogoWall />)
    expect(screen.getAllByRole('listitem')).toHaveLength(experienceEntries.length)
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- src/components/sections/LogoWall.test.tsx`
Expected: FAIL — `Failed to resolve import "./LogoWall"`.

- [ ] **Step 3: Create the manifest, initially empty**

Create `src/content/logoManifest.ts`:

```ts
export type LogoAsset = { src: string; width: number; height: number }

/**
 * Maps an ExperienceEntry slug to a logo asset in /public/logos.
 *
 * Entries are added only for companies with a public brand or press kit whose
 * terms permit this use. Any slug absent from this map renders as a text chip
 * instead — that fallback is the intended state, not a missing asset. Adding a
 * logo is a data change here plus a file in /public/logos; no component changes.
 */
export const logoManifest: Record<string, LogoAsset> = {}
```

- [ ] **Step 4: Allow SVG assets in next/image**

In `next.config.ts`, add the images block:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Logos are local, trusted SVG and PNG files under /public/logos.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
```

- [ ] **Step 5: Implement LogoWall**

Create `src/components/sections/LogoWall.tsx`:

```tsx
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import {
  experienceEntries,
  EXPERIENCE_HEADING,
  EXPERIENCE_FOOTNOTE,
} from '@/content/experience'
import { logoManifest } from '@/content/logoManifest'

export function LogoWall() {
  return (
    <section className="border-y border-border py-16">
      <Container className="flex flex-col gap-8">
        <SectionLabel>{EXPERIENCE_HEADING}</SectionLabel>

        <ul className="flex flex-wrap items-center gap-3">
          {experienceEntries.map((entry) => {
            const asset = logoManifest[entry.slug]

            return (
              <li
                key={entry.slug}
                className="flex h-12 items-center border border-border bg-surface px-4"
              >
                {asset ? (
                  <Image
                    src={asset.src}
                    alt={entry.name}
                    width={asset.width}
                    height={asset.height}
                    unoptimized
                    className="h-6 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="font-display text-sm text-muted">{entry.name}</span>
                )}
              </li>
            )
          })}
        </ul>

        <p className="max-w-2xl text-xs leading-relaxed text-muted">{EXPERIENCE_FOOTNOTE}</p>
      </Container>
    </section>
  )
}
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npm test -- src/components/sections/LogoWall.test.tsx`
Expected: PASS — 4 tests.

- [ ] **Step 7: Source the logo assets**

For each entry in `experienceEntries`, look for an official brand or press kit (search `"<company name>" brand assets` or check `/press`, `/media`, `/brand` on the company's own domain).

- If a kit exists **and its terms permit this use**: download the primary mark to `public/logos/<slug>.svg` (or `.png`), then add an entry to `logoManifest` with the asset's intrinsic width and height.
- If no public kit exists, **or the terms restrict use to the company's own materials, partners, or press coverage**: add nothing. The entry renders as a text chip, which is the designed fallback.

Do not recreate, redraw, or approximate a mark that is not available. A text chip is correct; a lookalike is not.

Record what you did in the commit body: which slugs got assets, and which were left as text chips and why.

- [ ] **Step 8: Verify the wall renders both states**

Run: `npm run dev`, load `http://localhost:3000` once Task 12 adds the Home page — or temporarily render `<LogoWall />` in `src/app/page.tsx` to check it now.
Expected: a single flowing row of uniform-height chips, mixing images and text without the row height jumping.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add experience wall with text-chip fallback for missing logo assets"
```

---

### Task 8: Section components

**Files:**
- Create: `src/components/sections/Section.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/FeatureGrid.tsx`, `src/components/sections/PillarCards.tsx`, `src/components/sections/ProcessSteps.tsx`, `src/components/sections/SkillsGrid.tsx`, `src/components/sections/CredentialsBlock.tsx`, `src/components/sections/CtaBand.tsx`, `src/components/sections/sections.test.tsx`
- Modify: `src/content/home.ts` (add the `ctaBand` export), `src/content/content.test.ts` (add its assertions)

**Interfaces:**
- Consumes: `Container`, `Card`, `Button`, `SectionLabel` (Task 5); `company`, `formatAddress` (Task 3); types from `src/content/types.ts` (Task 4)
- Produces:
  - `<Section label? title? intro? children className?>` — the standard section wrapper every page composes from
  - `<Hero {...hero} />` — takes the `hero` object from `home.ts`
  - `<FeatureGrid features columns?=3 />` — renders `Feature[]`; used by why-points, vetting, capabilities, lookingFor, whatWeOffer
  - `<PillarCards pillars />`
  - `<ProcessSteps steps />`
  - `<SkillsGrid groups />`
  - `<CredentialsBlock />` — no props, reads `company`
  - `<CtaBand {...ctaBand} />`
- Also produces `ctaBand` in `src/content/home.ts`: `{ label, title, body, primaryCta: Cta, secondaryCta: Cta }`

- [ ] **Step 1: Write the failing tests**

Create `src/components/sections/sections.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { FeatureGrid } from './FeatureGrid'
import { ProcessSteps } from './ProcessSteps'
import { CredentialsBlock } from './CredentialsBlock'
import { CtaBand } from './CtaBand'
import { hero, ctaBand } from '@/content/home'
import { processSteps } from '@/content/process'
import { company } from '@/content/company'

describe('Hero', () => {
  it('renders both halves of the headline in a single h1', () => {
    render(<Hero {...hero} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Senior engineers, embedded.')
    expect(heading).toHaveTextContent('Software, delivered.')
  })

  it('renders both calls to action as links', () => {
    render(<Hero {...hero} />)
    expect(screen.getByRole('link', { name: hero.primaryCta.label })).toHaveAttribute(
      'href',
      hero.primaryCta.href,
    )
    expect(screen.getByRole('link', { name: hero.secondaryCta.label })).toHaveAttribute(
      'href',
      hero.secondaryCta.href,
    )
  })
})

describe('FeatureGrid', () => {
  it('renders each feature as a list item with a heading', () => {
    render(
      <FeatureGrid
        features={[
          { title: 'One', body: 'First body' },
          { title: 'Two', body: 'Second body' },
        ]}
      />,
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'One' })).toBeInTheDocument()
    expect(screen.getByText('Second body')).toBeInTheDocument()
  })
})

describe('ProcessSteps', () => {
  it('renders all five steps with their numbers', () => {
    render(<ProcessSteps steps={processSteps} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByText('Hand over')).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
  })
})

describe('CredentialsBlock', () => {
  it('publishes registration, tax and B-BBEE facts from the company module', () => {
    render(<CredentialsBlock />)
    expect(screen.getByText(company.registrationNumber)).toBeInTheDocument()
    expect(screen.getByText(company.taxNumber)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`Level ${company.bbbee.level}`))).toBeInTheDocument()
  })
})

describe('CtaBand', () => {
  it('renders the heading and both calls to action', () => {
    render(<CtaBand {...ctaBand} />)
    expect(screen.getByRole('heading', { name: ctaBand.title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: ctaBand.primaryCta.label })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: ctaBand.secondaryCta.label })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- src/components/sections/sections.test.tsx`
Expected: FAIL — unresolved imports, and `ctaBand` is not exported from `@/content/home`.

- [ ] **Step 3: Add the `ctaBand` content**

Append to `src/content/home.ts`:

```ts
export const ctaBand = {
  label: 'Next step',
  title: 'Tell us what you are short of.',
  body: 'A developer, a delivery team, or a second opinion on an architecture. We will tell you honestly whether we are the right fit.',
  primaryCta: { label: 'Hire a developer', href: '/contact' } satisfies Cta,
  secondaryCta: { label: 'Start a project', href: '/contact' } satisfies Cta,
}
```

Append to the `describe('home', ...)` block in `src/content/content.test.ts`:

```ts
  it('has a CTA band with two actions', () => {
    expect(ctaBand.title.trim().length).toBeGreaterThan(0)
    expect(ctaBand.primaryCta.href).toBe('/contact')
    expect(ctaBand.secondaryCta.href).toBe('/contact')
  })
```

and extend that file's import: `import { hero, whyPoints, pillars, ctaBand } from './home'`

- [ ] **Step 4: Implement Section, Hero and FeatureGrid**

Create `src/components/sections/Section.tsx`:

```tsx
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { cn } from '@/lib/cn'

export function Section({
  label,
  title,
  intro,
  className,
  children,
}: {
  label?: string
  title?: string
  intro?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section className={cn('py-16 sm:py-24', className)}>
      <Container className="flex flex-col gap-8">
        {label || title || intro ? (
          <div className="flex max-w-3xl flex-col gap-4">
            {label ? <SectionLabel>{label}</SectionLabel> : null}
            {title ? (
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {intro ? <p className="text-base leading-[1.65] text-muted">{intro}</p> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  )
}
```

Create `src/components/sections/Hero.tsx`:

```tsx
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import type { Cta } from '@/content/types'

export function Hero({
  label,
  headlineLead,
  headlineTail,
  sub,
  primaryCta,
  secondaryCta,
}: {
  label: string
  headlineLead: string
  headlineTail: string
  sub: string
  primaryCta: Cta
  secondaryCta: Cta
}) {
  return (
    <section className="py-20 sm:py-32">
      <Container className="flex max-w-4xl flex-col gap-7">
        <SectionLabel>{label}</SectionLabel>

        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
          {headlineLead}{' '}
          <span aria-hidden="true" className="text-muted">
            \
          </span>{' '}
          {headlineTail}
        </h1>

        <p className="max-w-2xl text-lg leading-[1.6] text-muted">{sub}</p>

        <div className="flex flex-wrap gap-3">
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          <Button href={secondaryCta.href} variant="ghost">
            {secondaryCta.label}
          </Button>
        </div>
      </Container>
    </section>
  )
}
```

Create `src/components/sections/FeatureGrid.tsx`:

```tsx
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { Feature } from '@/content/types'

export function FeatureGrid({
  features,
  columns = 3,
}: {
  features: readonly Feature[]
  columns?: 2 | 3
}) {
  return (
    <ul
      className={cn(
        'grid gap-4',
        columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {features.map((feature) => (
        <Card as="li" key={feature.title} className="flex flex-col gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            {feature.title}
          </h3>
          <p className="text-sm leading-[1.65] text-muted">{feature.body}</p>
        </Card>
      ))}
    </ul>
  )
}
```

- [ ] **Step 5: Implement PillarCards, ProcessSteps and SkillsGrid**

Create `src/components/sections/PillarCards.tsx`:

```tsx
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

type Pillar = {
  label: string
  title: string
  body: string
  cta: string
  href: string
}

export function PillarCards({ pillars }: { pillars: readonly Pillar[] }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {pillars.map((pillar, index) => (
        <Card as="li" key={pillar.href} className="flex flex-col gap-4">
          <span
            className={
              index === 0
                ? 'label-mono w-fit bg-accent px-1.5 py-0.5 text-[#0b0b0c]'
                : 'label-mono w-fit text-muted'
            }
          >
            {pillar.label}
          </span>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {pillar.title}
          </h3>
          <p className="text-sm leading-[1.65] text-muted">{pillar.body}</p>
          <Link href={pillar.href} className="label-mono mt-2 text-ink hover:underline">
            {pillar.cta} →
          </Link>
        </Card>
      ))}
    </ul>
  )
}
```

Create `src/components/sections/ProcessSteps.tsx`:

```tsx
type Step = { n: string; title: string; body: string }

export function ProcessSteps({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step) => (
        <li key={step.n} className="flex flex-col gap-3 bg-surface p-6">
          <span className="label-mono w-fit bg-accent px-1.5 py-0.5 text-[#0b0b0c]">{step.n}</span>
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            {step.title}
          </h3>
          <p className="text-sm leading-[1.6] text-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  )
}
```

Create `src/components/sections/SkillsGrid.tsx`:

```tsx
type SkillGroup = { title: string; items: readonly string[] }

export function SkillsGrid({ groups }: { groups: readonly SkillGroup[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <li key={group.title} className="flex flex-col gap-3 border border-border bg-surface p-6">
          <h3 className="label-mono text-muted">{group.title}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item} className="border border-border px-2 py-1 text-xs text-ink">
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 6: Implement CredentialsBlock and CtaBand**

Create `src/components/sections/CredentialsBlock.tsx`:

```tsx
import { company, formatAddress } from '@/content/company'

export function CredentialsBlock() {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Legal name', value: company.legalName },
    { label: 'Registration number', value: company.registrationNumber },
    { label: 'Tax number', value: company.taxNumber },
    { label: 'Enterprise type', value: company.enterpriseType },
    { label: 'Registered', value: '26 March 2019' },
    { label: 'Director', value: company.director },
    {
      label: 'B-BBEE',
      value: `${company.bbbee.status}, Level ${company.bbbee.level} contributor — ${company.bbbee.recognition} procurement recognition, valid to 16 July 2027`,
    },
    {
      label: 'Address',
      value: (
        <address className="not-italic">
          {formatAddress().map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ),
    },
  ]

  return (
    <dl className="grid gap-px border border-border bg-border sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-2 bg-surface p-5">
          <dt className="label-mono text-muted">{row.label}</dt>
          <dd className="text-sm leading-relaxed text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
```

Create `src/components/sections/CtaBand.tsx`:

```tsx
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import type { Cta } from '@/content/types'

export function CtaBand({
  label,
  title,
  body,
  primaryCta,
  secondaryCta,
}: {
  label: string
  title: string
  body: string
  primaryCta: Cta
  secondaryCta: Cta
}) {
  return (
    <section className="border-t border-border py-20">
      <Container className="flex max-w-3xl flex-col gap-6">
        <SectionLabel>{label}</SectionLabel>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-[1.65] text-muted">{body}</p>
        <div className="flex flex-wrap gap-3">
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          <Button href={secondaryCta.href} variant="ghost">
            {secondaryCta.label}
          </Button>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 7: Run the tests and confirm they pass**

Run: `npm test`
Expected: PASS — every suite, including the updated `content.test.ts`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add section components for hero, features, pillars, process, skills, credentials and CTA"
```

---

### Task 9: Form infrastructure — env, schemas, mail

**Files:**
- Create: `src/lib/env.ts`, `src/lib/env.test.ts`, `src/lib/schemas.ts`, `src/lib/schemas.test.ts`, `src/lib/resend.ts`, `.env.example`
- Modify: `.gitignore` is already correct (`.env*.local` ignored) — no change needed

**Interfaces:**
- Consumes: `company` (Task 3)
- Produces:
  - `serverEnv(): ServerEnv` — throws a descriptive `Error` when any of `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL` is missing or malformed. Cached after first success.
  - `contactSchema`, `careersSchema` (Zod), plus inferred types `ContactInput`, `CareersInput`
  - `HONEYPOT_FIELD: 'company_website'`, `MIN_SUBMIT_MS: 2000`, `isLikelySpam(payload: unknown): boolean`
  - `fieldErrorsFrom(error: z.ZodError): Record<string, string>` — flattens Zod issues into one message per field, which is exactly what both forms render
  - `sendMail(message: MailMessage): Promise<void>` where `MailMessage = { subject: string; replyTo: string; text: string }`
  - `formatContactEmail(input: ContactInput): MailMessage`, `formatCareersEmail(input: CareersInput): MailMessage`

- [ ] **Step 1: Confirm which Zod major version is installed**

Run: `npm ls zod`

Zod 4 renamed the top-level string formats. Use the form matching your installed major throughout this task:

| Validation | Zod 3 | Zod 4 |
|---|---|---|
| Email | `z.string().email()` | `z.email()` |
| URL | `z.string().url()` | `z.url()` |
| Flatten issues | `error.flatten().fieldErrors` | `error.flatten().fieldErrors` |

The code below is written for **Zod 4**. If `npm ls zod` reports 3.x, either run `npm install zod@^4` or substitute the Zod 3 column — do not leave a mix.

- [ ] **Step 2: Write the failing tests for env**

Create `src/lib/env.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const VALID = {
  RESEND_API_KEY: 're_test_key',
  CONTACT_TO_EMAIL: 'hello@tinwa.co.za',
  NEXT_PUBLIC_SITE_URL: 'https://tinwa.co.za',
}

describe('serverEnv', () => {
  const original = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    process.env = { ...original }
  })

  it('returns the parsed values when all are present', async () => {
    Object.assign(process.env, VALID)
    const { serverEnv } = await import('./env')
    expect(serverEnv().CONTACT_TO_EMAIL).toBe('hello@tinwa.co.za')
  })

  it('names the missing variable in the error', async () => {
    Object.assign(process.env, VALID)
    delete process.env.RESEND_API_KEY
    const { serverEnv } = await import('./env')
    expect(() => serverEnv()).toThrow(/RESEND_API_KEY/)
  })

  it('rejects a malformed contact address', async () => {
    Object.assign(process.env, VALID, { CONTACT_TO_EMAIL: 'not-an-email' })
    const { serverEnv } = await import('./env')
    expect(() => serverEnv()).toThrow(/CONTACT_TO_EMAIL/)
  })

  it('tells the operator where to set the variables', async () => {
    Object.assign(process.env, VALID)
    delete process.env.CONTACT_TO_EMAIL
    const { serverEnv } = await import('./env')
    expect(() => serverEnv()).toThrow(/\.env\.local/)
  })
})
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `npm test -- src/lib/env.test.ts`
Expected: FAIL — `Failed to resolve import "./env"`.

- [ ] **Step 4: Implement env**

Create `src/lib/env.ts`:

```ts
import { z } from 'zod'

const schema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_TO_EMAIL: z.email(),
  NEXT_PUBLIC_SITE_URL: z.url(),
})

export type ServerEnv = z.infer<typeof schema>

let cached: ServerEnv | null = null

/**
 * Validates the server environment on first call.
 *
 * Route handlers import this at module scope, so a misconfigured deploy fails
 * loudly on the first request with a message naming the offending variable,
 * and the form renders its fallback contact details. `npm run check:env` runs
 * the same requirement in CI before a deploy can happen at all.
 */
export function serverEnv(): ServerEnv {
  if (cached) return cached

  const parsed = schema.safeParse(process.env)

  if (!parsed.success) {
    const names = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
    throw new Error(
      `Invalid or missing environment variables: ${names.join(', ')}. ` +
        `Set them in .env.local for local development, and in the Vercel project settings for deploys.`,
    )
  }

  cached = parsed.data
  return cached
}
```

- [ ] **Step 5: Run it and confirm it passes**

Run: `npm test -- src/lib/env.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 6: Write the failing tests for the schemas**

Create `src/lib/schemas.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  contactSchema,
  careersSchema,
  isLikelySpam,
  fieldErrorsFrom,
  HONEYPOT_FIELD,
  MIN_SUBMIT_MS,
} from './schemas'

const validContact = {
  name: 'Thandi Mokoena',
  company: 'Acme Bank',
  email: 'thandi@acmebank.co.za',
  phone: '+27 11 555 0100',
  enquiryType: 'hire' as const,
  message: 'We need a senior Kotlin engineer for a six month engagement starting in October.',
}

const validCareers = {
  name: 'Sipho Dlamini',
  email: 'sipho@example.com',
  profileUrl: 'https://www.linkedin.com/in/sipho',
  primaryStack: 'Java, Spring Boot, Kafka',
  years: 8,
  location: 'Cape Town, South Africa',
}

describe('contactSchema', () => {
  it('accepts a complete valid enquiry', () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true)
  })

  it('accepts an enquiry with the optional fields omitted', () => {
    const { company: _c, phone: _p, ...rest } = validContact
    expect(contactSchema.safeParse(rest).success).toBe(true)
  })

  it('rejects a name that is too short', () => {
    const result = contactSchema.safeParse({ ...validContact, name: 'T' })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed email address', () => {
    const result = contactSchema.safeParse({ ...validContact, email: 'thandi@' })
    expect(result.success).toBe(false)
  })

  it('rejects a message that is too short to act on', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'call me' })
    expect(result.success).toBe(false)
  })

  it('rejects a message beyond the length limit', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'a'.repeat(4001) })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown enquiry type', () => {
    const result = contactSchema.safeParse({ ...validContact, enquiryType: 'partnership' })
    expect(result.success).toBe(false)
  })
})

describe('careersSchema', () => {
  it('accepts a complete valid application', () => {
    expect(careersSchema.safeParse(validCareers).success).toBe(true)
  })

  it('rejects a profile link that is not a URL', () => {
    const result = careersSchema.safeParse({ ...validCareers, profileUrl: 'my linkedin' })
    expect(result.success).toBe(false)
  })

  it('coerces a numeric string for years', () => {
    const result = careersSchema.safeParse({ ...validCareers, years: '8' })
    expect(result.success).toBe(true)
  })

  it('rejects an implausible number of years', () => {
    expect(careersSchema.safeParse({ ...validCareers, years: 80 }).success).toBe(false)
    expect(careersSchema.safeParse({ ...validCareers, years: -1 }).success).toBe(false)
  })
})

describe('isLikelySpam', () => {
  it('flags a filled honeypot', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: 'http://spam.example', elapsedMs: 9000 })).toBe(true)
  })

  it('flags a submission faster than a human can type', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: '', elapsedMs: MIN_SUBMIT_MS - 1 })).toBe(true)
  })

  it('flags a payload with no timing information at all', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: '' })).toBe(true)
  })

  it('passes a genuine submission', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: '', elapsedMs: 12000 })).toBe(false)
  })
})

describe('fieldErrorsFrom', () => {
  it('returns one message per invalid field', () => {
    const result = contactSchema.safeParse({ ...validContact, email: 'nope', name: '' })
    expect(result.success).toBe(false)
    if (result.success) return

    const errors = fieldErrorsFrom(result.error)
    expect(errors.email).toBeTruthy()
    expect(errors.name).toBeTruthy()
    expect(errors.message).toBeUndefined()
  })
})
```

- [ ] **Step 7: Run it and confirm it fails**

Run: `npm test -- src/lib/schemas.test.ts`
Expected: FAIL — `Failed to resolve import "./schemas"`.

- [ ] **Step 8: Implement the schemas**

Create `src/lib/schemas.ts`:

```ts
import { z } from 'zod'

/**
 * Shared by the client components and the route handlers. Validating with the
 * same schema on both sides is what stops the browser and the server from
 * disagreeing about what a valid submission is.
 */

export const HONEYPOT_FIELD = 'company_website'
export const MIN_SUBMIT_MS = 2000

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Name is too long'),
  company: z.string().trim().max(120, 'Company name is too long').optional(),
  email: z.email('Enter a valid email address'),
  phone: z.string().trim().max(40, 'Phone number is too long').optional(),
  enquiryType: z.enum(['hire', 'project', 'other']),
  message: z
    .string()
    .trim()
    .min(20, 'Tell us a little more — at least 20 characters')
    .max(4000, 'Message is too long'),
})

export const careersSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Name is too long'),
  email: z.email('Enter a valid email address'),
  profileUrl: z.url('Enter a link to your LinkedIn profile or CV'),
  primaryStack: z
    .string()
    .trim()
    .min(2, 'Tell us your primary stack')
    .max(200, 'Keep this under 200 characters'),
  years: z.coerce
    .number()
    .int('Enter a whole number of years')
    .min(0, 'Years cannot be negative')
    .max(60, 'Enter a plausible number of years'),
  location: z.string().trim().min(2, 'Where are you based?').max(120, 'Location is too long'),
})

export type ContactInput = z.infer<typeof contactSchema>
export type CareersInput = z.infer<typeof careersSchema>

/**
 * Two cheap signals, no third-party dependency:
 *  - a hidden field a human never sees and never fills
 *  - a submission that arrived faster than a person could have typed it
 *
 * A missing `elapsedMs` counts as spam: a real submission from our own form
 * always includes it, so its absence means the request did not come from the form.
 */
export function isLikelySpam(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return true

  const record = payload as Record<string, unknown>
  const honeypot = record[HONEYPOT_FIELD]
  if (typeof honeypot === 'string' && honeypot.length > 0) return true

  const elapsed = record.elapsedMs
  if (typeof elapsed !== 'number' || Number.isNaN(elapsed)) return true

  return elapsed < MIN_SUBMIT_MS
}

export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const flattened = error.flatten().fieldErrors
  const result: Record<string, string> = {}

  for (const [field, messages] of Object.entries(flattened)) {
    if (messages && messages.length > 0) result[field] = messages[0]
  }

  return result
}
```

- [ ] **Step 9: Run it and confirm it passes**

Run: `npm test -- src/lib/schemas.test.ts`
Expected: PASS — 16 tests.

- [ ] **Step 10: Implement the mail layer**

Create `src/lib/resend.ts`:

```ts
import { Resend } from 'resend'
import { serverEnv } from './env'
import { company } from '@/content/company'
import type { CareersInput, ContactInput } from './schemas'

export type MailMessage = { subject: string; replyTo: string; text: string }

const ENQUIRY_LABELS: Record<ContactInput['enquiryType'], string> = {
  hire: 'Hire a developer',
  project: 'Start a project',
  other: 'Other',
}

export function formatContactEmail(input: ContactInput): MailMessage {
  return {
    subject: `[${company.shortName}] ${ENQUIRY_LABELS[input.enquiryType]} — ${input.name}`,
    replyTo: input.email,
    text: [
      `Enquiry type: ${ENQUIRY_LABELS[input.enquiryType]}`,
      `Name: ${input.name}`,
      `Company: ${input.company ?? '—'}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone ?? '—'}`,
      '',
      input.message,
    ].join('\n'),
  }
}

export function formatCareersEmail(input: CareersInput): MailMessage {
  return {
    subject: `[${company.shortName}] Application — ${input.name} (${input.years} yrs)`,
    replyTo: input.email,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Profile / CV: ${input.profileUrl}`,
      `Primary stack: ${input.primaryStack}`,
      `Years of experience: ${input.years}`,
      `Location: ${input.location}`,
    ].join('\n'),
  }
}

export async function sendMail(message: MailMessage): Promise<void> {
  const env = serverEnv()
  const resend = new Resend(env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: `${company.shortName} website <website@${company.domain}>`,
    to: env.CONTACT_TO_EMAIL,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
  })

  if (error) {
    throw new Error(`Resend rejected the message: ${error.message}`)
  }
}
```

- [ ] **Step 11: Document the environment variables**

Create `.env.example`:

```bash
# Resend API key — https://resend.com/api-keys
RESEND_API_KEY=re_your_key_here

# Inbox that receives contact and careers submissions
CONTACT_TO_EMAIL=hello@tinwa.co.za

# Canonical site URL, used for metadata, sitemap and Open Graph
NEXT_PUBLIC_SITE_URL=https://tinwa.co.za
```

Then create your own `.env.local` from it (already gitignored):

```bash
cp .env.example .env.local
```

- [ ] **Step 12: Run the full suite and typecheck**

Run: `npm test && npm run typecheck`
Expected: both pass.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add validated env, shared Zod schemas, spam checks and Resend mail layer"
```

---

### Task 10: Contact form and `/api/contact`

**Files:**
- Create: `src/components/sections/useFormSubmit.ts`, `src/components/sections/FormFallback.tsx`, `src/components/sections/ContactForm.tsx`, `src/components/sections/ContactForm.test.tsx`, `src/app/api/contact/route.ts`, `src/app/api/contact/route.test.ts`

**Interfaces:**
- Consumes: `contactSchema`, `fieldErrorsFrom`, `isLikelySpam`, `HONEYPOT_FIELD` (Task 9); `sendMail`, `formatContactEmail` (Task 9); `Field`, `inputClasses`, `Button` (Task 5); `company` (Task 3)
- Produces:
  - `useFormSubmit(endpoint: string)` → `{ state: 'idle'|'submitting'|'success'|'error', errors: Record<string,string>, submit(values: Record<string, unknown>): Promise<void>, honeypotName: string }`. The hook stamps `elapsedMs` itself; the caller passes the honeypot value through `submit` under `honeypotName`. Reused verbatim by Task 11.
  - `<FormFallback />` — the error state showing email and phone. Reused by Task 11.
  - `<ContactForm />`
  - `POST /api/contact` → `200 {ok:true}` on success **and on detected spam**; `400 {ok:false, errors}` on validation failure; `500 {ok:false}` on send failure

**The requirement that drives this task:** a failed submission must never silently lose a lead. Every non-validation failure renders `<FormFallback />`, which contains the email and phone as live links.

- [ ] **Step 1: Write the failing route handler tests**

Create `src/app/api/contact/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMail = vi.fn()

vi.mock('@/lib/resend', () => ({
  sendMail: (...args: unknown[]) => sendMail(...args),
  formatContactEmail: (input: unknown) => ({
    subject: 'test',
    replyTo: 'test@example.com',
    text: JSON.stringify(input),
  }),
}))

import { POST } from './route'

const validBody = {
  name: 'Thandi Mokoena',
  company: 'Acme Bank',
  email: 'thandi@acmebank.co.za',
  phone: '+27 11 555 0100',
  enquiryType: 'hire',
  message: 'We need a senior Kotlin engineer for a six month engagement starting in October.',
  company_website: '',
  elapsedMs: 12000,
}

function request(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMail.mockReset()
    sendMail.mockResolvedValue(undefined)
  })

  it('sends the mail and returns ok for a valid submission', async () => {
    const response = await POST(request(validBody))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMail).toHaveBeenCalledOnce()
  })

  it('returns field errors and does not send for an invalid submission', async () => {
    const response = await POST(request({ ...validBody, email: 'nope', message: 'hi' }))
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.ok).toBe(false)
    expect(body.errors.email).toBeTruthy()
    expect(body.errors.message).toBeTruthy()
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('silently accepts a filled honeypot without sending', async () => {
    const response = await POST(request({ ...validBody, company_website: 'http://spam.example' }))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('silently accepts a too-fast submission without sending', async () => {
    const response = await POST(request({ ...validBody, elapsedMs: 100 }))
    expect(response.status).toBe(200)
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('returns 500 when the mail layer throws', async () => {
    sendMail.mockRejectedValue(new Error('Resend is down'))
    const response = await POST(request(validBody))
    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ ok: false })
  })

  it('returns 400 for a body that is not JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/contact', { method: 'POST', body: 'not json' }),
    )
    expect(response.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/app/api/contact/route.test.ts`
Expected: FAIL — `Failed to resolve import "./route"`.

- [ ] **Step 3: Implement the route handler**

Create `src/app/api/contact/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { contactSchema, fieldErrorsFrom, isLikelySpam } from '@/lib/schemas'
import { formatContactEmail, sendMail } from '@/lib/resend'

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, errors: {} }, { status: 400 })
  }

  // Spam gets a 200 with no mail sent. Returning an error would just tell the
  // bot which signal caught it.
  if (isLikelySpam(payload)) {
    return NextResponse.json({ ok: true })
  }

  const parsed = contactSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrorsFrom(parsed.error) }, { status: 400 })
  }

  try {
    await sendMail(formatContactEmail(parsed.data))
  } catch (error) {
    console.error('[contact] failed to send enquiry', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `npm test -- src/app/api/contact/route.test.ts`
Expected: PASS — 6 tests.

- [ ] **Step 5: Implement the shared submit hook and fallback**

Create `src/components/sections/useFormSubmit.ts`:

```ts
'use client'

import { useRef, useState } from 'react'
import { HONEYPOT_FIELD } from '@/lib/schemas'

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<SubmitState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const mountedAt = useRef(Date.now())

  async function submit(values: Record<string, unknown>): Promise<void> {
    setState('submitting')
    setErrors({})

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })

      if (response.status === 400) {
        const body = (await response.json()) as { errors?: Record<string, string> }
        setErrors(body.errors ?? {})
        setState('idle')
        return
      }

      if (!response.ok) {
        setState('error')
        return
      }

      setState('success')
    } catch {
      // Network failure, offline, or a blocked request — same outcome for the
      // visitor, so it gets the same fallback.
      setState('error')
    }
  }

  return { state, errors, submit, honeypotName: HONEYPOT_FIELD }
}
```

Create `src/components/sections/FormFallback.tsx`:

```tsx
import { company } from '@/content/company'

/**
 * Shown whenever a submission fails for any reason other than validation.
 * A visitor who reaches this must still be able to reach TINWA, so the address
 * and number are rendered here as live links rather than referred to in prose.
 */
export function FormFallback() {
  return (
    <div role="alert" className="border border-border bg-surface p-5 text-sm leading-relaxed">
      <p className="text-ink">Something went wrong sending your message.</p>
      <p className="mt-2 text-muted">
        Please email{' '}
        <a href={company.emailHref} className="text-ink underline">
          {company.email}
        </a>{' '}
        or call{' '}
        <a href={company.phoneHref} className="text-ink underline">
          {company.phone}
        </a>{' '}
        — we will come back to you either way.
      </p>
    </div>
  )
}
```

- [ ] **Step 6: Write the failing component tests**

Create `src/components/sections/ContactForm.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'
import { company } from '@/content/company'

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
}

async function fillValidEnquiry(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name$/i), 'Thandi Mokoena')
  await user.type(screen.getByLabelText(/work email/i), 'thandi@acmebank.co.za')
  await user.selectOptions(screen.getByLabelText(/what do you need/i), 'hire')
  await user.type(
    screen.getByLabelText(/message/i),
    'We need a senior Kotlin engineer for a six month engagement.',
  )
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('submits the form values as JSON', async () => {
    const fetchMock = mockFetch(200, { ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/contact')
    const sent = JSON.parse((init as RequestInit).body as string)
    expect(sent.name).toBe('Thandi Mokoena')
    expect(sent.enquiryType).toBe('hire')
    expect(typeof sent.elapsedMs).toBe('number')
  })

  it('shows a confirmation after a successful submission', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { ok: true }))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i)
  })

  it('renders server-side field errors against their fields', async () => {
    vi.stubGlobal('fetch', mockFetch(400, { ok: false, errors: { email: 'Enter a valid email address' } }))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('shows the contact details when the request fails', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { ok: false }))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(company.email)
    expect(alert).toHaveTextContent(company.phone)
  })

  it('shows the contact details when the network throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(company.email)
  })

  it('keeps the honeypot out of the accessibility tree', () => {
    render(<ContactForm />)
    const honeypot = document.querySelector('input[name="company_website"]')
    expect(honeypot).not.toBeNull()
    expect(honeypot).toHaveAttribute('tabindex', '-1')
    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 7: Run it and confirm it fails**

Run: `npm test -- src/components/sections/ContactForm.test.tsx`
Expected: FAIL — `Failed to resolve import "./ContactForm"`.

- [ ] **Step 8: Implement ContactForm**

Create `src/components/sections/ContactForm.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Field, inputClasses } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useFormSubmit } from './useFormSubmit'
import { FormFallback } from './FormFallback'
import { contactSchema, fieldErrorsFrom } from '@/lib/schemas'

const ENQUIRY_OPTIONS = [
  { value: 'hire', label: 'Hire a developer' },
  { value: 'project', label: 'Start a project' },
  { value: 'other', label: 'Other' },
]

export function ContactForm() {
  const { state, errors, submit, honeypotName } = useFormSubmit('/api/contact')
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  const shown = { ...clientErrors, ...errors }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const values = {
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? '') || undefined,
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? '') || undefined,
      enquiryType: String(data.get('enquiryType') ?? ''),
      message: String(data.get('message') ?? ''),
    }

    // Validate with the same schema the server uses, so the visitor sees
    // problems before a round trip.
    const parsed = contactSchema.safeParse(values)
    if (!parsed.success) {
      setClientErrors(fieldErrorsFrom(parsed.error))
      return
    }

    setClientErrors({})
    await submit({ ...parsed.data, [honeypotName]: String(data.get(honeypotName) ?? '') })
  }

  if (state === 'success') {
    return (
      <div role="status" className="border border-border bg-surface p-6">
        <p className="font-display text-lg font-semibold text-ink">Thank you — message received.</p>
        <p className="mt-2 text-sm text-muted">
          We read every enquiry ourselves and come back within one working day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field id="name" label="Name" error={shown.name}>
        <input id="name" name="name" autoComplete="name" className={inputClasses} />
      </Field>

      <Field id="company" label="Company (optional)" error={shown.company}>
        <input id="company" name="company" autoComplete="organization" className={inputClasses} />
      </Field>

      <Field id="email" label="Work email" error={shown.email}>
        <input id="email" name="email" type="email" autoComplete="email" className={inputClasses} />
      </Field>

      <Field id="phone" label="Phone (optional)" error={shown.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
      </Field>

      <Field id="enquiryType" label="What do you need?" error={shown.enquiryType}>
        <select id="enquiryType" name="enquiryType" defaultValue="hire" className={inputClasses}>
          {ENQUIRY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message" error={shown.message}>
        <textarea id="message" name="message" rows={6} className={inputClasses} />
      </Field>

      {/* Honeypot: hidden from sight, from the tab order and from assistive
          technology. A human never fills it; a naive bot fills everything. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={honeypotName}>Company website</label>
        <input id={honeypotName} name={honeypotName} tabIndex={-1} autoComplete="off" />
      </div>

      {state === 'error' ? <FormFallback /> : null}

      <div>
        <Button type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  )
}
```

Note: the honeypot `<input>` sits inside a container with `aria-hidden="true"`, but the test asserts the attribute on the input itself. Add `aria-hidden="true"` to the input as well as the wrapper — belt and braces, and it makes the test's intent explicit at the element that matters.

- [ ] **Step 9: Run it and confirm it passes**

Run: `npm test -- src/components/sections/ContactForm.test.tsx`
Expected: PASS — 6 tests.

- [ ] **Step 10: Run the full suite**

Run: `npm test && npm run typecheck && npm run lint`
Expected: all pass.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add contact form and route handler with fallback contact details on failure"
```

---

### Task 11: Careers form and `/api/careers`

**Files:**
- Create: `src/components/sections/CareersForm.tsx`, `src/components/sections/CareersForm.test.tsx`, `src/app/api/careers/route.ts`, `src/app/api/careers/route.test.ts`

**Interfaces:**
- Consumes: `careersSchema`, `fieldErrorsFrom`, `isLikelySpam` (Task 9); `formatCareersEmail`, `sendMail` (Task 9); `useFormSubmit`, `FormFallback` (Task 10); `Field`, `inputClasses`, `Button` (Task 5)
- Produces: `<CareersForm />`; `POST /api/careers` with the same response contract as `/api/contact` — `200 {ok:true}` on success and on detected spam, `400 {ok:false, errors}` on validation failure, `500 {ok:false}` on send failure

- [ ] **Step 1: Write the failing route handler tests**

Create `src/app/api/careers/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMail = vi.fn()

vi.mock('@/lib/resend', () => ({
  sendMail: (...args: unknown[]) => sendMail(...args),
  formatCareersEmail: (input: unknown) => ({
    subject: 'test',
    replyTo: 'test@example.com',
    text: JSON.stringify(input),
  }),
}))

import { POST } from './route'

const validBody = {
  name: 'Sipho Dlamini',
  email: 'sipho@example.com',
  profileUrl: 'https://www.linkedin.com/in/sipho',
  primaryStack: 'Java, Spring Boot, Kafka',
  years: 8,
  location: 'Cape Town, South Africa',
  company_website: '',
  elapsedMs: 12000,
}

function request(body: unknown): Request {
  return new Request('http://localhost/api/careers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/careers', () => {
  beforeEach(() => {
    sendMail.mockReset()
    sendMail.mockResolvedValue(undefined)
  })

  it('sends the mail and returns ok for a valid application', async () => {
    const response = await POST(request(validBody))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMail).toHaveBeenCalledOnce()
  })

  it('returns field errors for a malformed profile link', async () => {
    const response = await POST(request({ ...validBody, profileUrl: 'my linkedin' }))
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.errors.profileUrl).toBeTruthy()
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('silently accepts a filled honeypot without sending', async () => {
    const response = await POST(request({ ...validBody, company_website: 'http://spam.example' }))
    expect(response.status).toBe(200)
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('returns 500 when the mail layer throws', async () => {
    sendMail.mockRejectedValue(new Error('Resend is down'))
    const response = await POST(request(validBody))
    expect(response.status).toBe(500)
  })

  it('returns 400 for a body that is not JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/careers', { method: 'POST', body: 'not json' }),
    )
    expect(response.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/app/api/careers/route.test.ts`
Expected: FAIL — `Failed to resolve import "./route"`.

- [ ] **Step 3: Implement the route handler**

Create `src/app/api/careers/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { careersSchema, fieldErrorsFrom, isLikelySpam } from '@/lib/schemas'
import { formatCareersEmail, sendMail } from '@/lib/resend'

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, errors: {} }, { status: 400 })
  }

  if (isLikelySpam(payload)) {
    return NextResponse.json({ ok: true })
  }

  const parsed = careersSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrorsFrom(parsed.error) }, { status: 400 })
  }

  try {
    await sendMail(formatCareersEmail(parsed.data))
  } catch (error) {
    console.error('[careers] failed to send application', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `npm test -- src/app/api/careers/route.test.ts`
Expected: PASS — 5 tests.

- [ ] **Step 5: Write the failing component tests**

Create `src/components/sections/CareersForm.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CareersForm } from './CareersForm'
import { company } from '@/content/company'

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
}

async function fillValidApplication(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name$/i), 'Sipho Dlamini')
  await user.type(screen.getByLabelText(/email/i), 'sipho@example.com')
  await user.type(screen.getByLabelText(/linkedin or cv/i), 'https://www.linkedin.com/in/sipho')
  await user.type(screen.getByLabelText(/primary stack/i), 'Java, Spring Boot, Kafka')
  await user.type(screen.getByLabelText(/years/i), '8')
  await user.type(screen.getByLabelText(/location/i), 'Cape Town, South Africa')
}

describe('CareersForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts the application to the careers endpoint', async () => {
    const fetchMock = mockFetch(200, { ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    expect(fetchMock.mock.calls[0][0]).toBe('/api/careers')
  })

  it('rejects a profile link that is not a URL before hitting the network', async () => {
    const fetchMock = mockFetch(200, { ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.clear(screen.getByLabelText(/linkedin or cv/i))
    await user.type(screen.getByLabelText(/linkedin or cv/i), 'my linkedin')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText(/link to your linkedin profile or cv/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows a confirmation after a successful application', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { ok: true }))

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i)
  })

  it('shows the contact details when the request fails', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { ok: false }))

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(company.email)
  })
})
```

- [ ] **Step 6: Run it and confirm it fails**

Run: `npm test -- src/components/sections/CareersForm.test.tsx`
Expected: FAIL — `Failed to resolve import "./CareersForm"`.

- [ ] **Step 7: Implement CareersForm**

Create `src/components/sections/CareersForm.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Field, inputClasses } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useFormSubmit } from './useFormSubmit'
import { FormFallback } from './FormFallback'
import { careersSchema, fieldErrorsFrom } from '@/lib/schemas'

export function CareersForm() {
  const { state, errors, submit, honeypotName } = useFormSubmit('/api/careers')
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  const shown = { ...clientErrors, ...errors }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      profileUrl: String(data.get('profileUrl') ?? ''),
      primaryStack: String(data.get('primaryStack') ?? ''),
      years: String(data.get('years') ?? ''),
      location: String(data.get('location') ?? ''),
    }

    const parsed = careersSchema.safeParse(values)
    if (!parsed.success) {
      setClientErrors(fieldErrorsFrom(parsed.error))
      return
    }

    setClientErrors({})
    await submit({ ...parsed.data, [honeypotName]: String(data.get(honeypotName) ?? '') })
  }

  if (state === 'success') {
    return (
      <div role="status" className="border border-border bg-surface p-6">
        <p className="font-display text-lg font-semibold text-ink">Thank you — application received.</p>
        <p className="mt-2 text-sm text-muted">
          We review every application ourselves. If there is a fit we will be in touch about current
          and upcoming engagements.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field id="name" label="Name" error={shown.name}>
        <input id="name" name="name" autoComplete="name" className={inputClasses} />
      </Field>

      <Field id="email" label="Email" error={shown.email}>
        <input id="email" name="email" type="email" autoComplete="email" className={inputClasses} />
      </Field>

      <Field
        id="profileUrl"
        label="LinkedIn or CV link"
        hint="A public link works best — LinkedIn, a personal site, or a CV in cloud storage. We do not accept file uploads."
        error={shown.profileUrl}
      >
        <input
          id="profileUrl"
          name="profileUrl"
          type="url"
          inputMode="url"
          placeholder="https://"
          className={inputClasses}
        />
      </Field>

      <Field id="primaryStack" label="Primary stack" error={shown.primaryStack}>
        <input
          id="primaryStack"
          name="primaryStack"
          placeholder="Java, Spring Boot, Kafka"
          className={inputClasses}
        />
      </Field>

      <Field id="years" label="Years of experience" error={shown.years}>
        <input id="years" name="years" type="number" min={0} max={60} className={inputClasses} />
      </Field>

      <Field id="location" label="Location" error={shown.location}>
        <input
          id="location"
          name="location"
          autoComplete="address-level2"
          className={inputClasses}
        />
      </Field>

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={honeypotName}>Company website</label>
        <input
          id={honeypotName}
          name={honeypotName}
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
        />
      </div>

      {state === 'error' ? <FormFallback /> : null}

      <div>
        <Button type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Sending…' : 'Send application'}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 8: Run it and confirm it passes**

Run: `npm test -- src/components/sections/CareersForm.test.tsx`
Expected: PASS — 4 tests.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add careers form and route handler"
```

---

### Task 12: Pages — Home, Talent, Software

**Files:**
- Create: `src/app/talent/page.tsx`, `src/app/software/page.tsx`
- Modify: `src/app/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: every section component (Tasks 7–8) and every content module (Task 4)
- Produces: three routes. Each exports `metadata` derived from `pageSeo`. Each renders exactly one `<h1>` — Task 15's E2E suite asserts this.

- [ ] **Step 1: Replace the Home page**

Replace the entire contents of `src/app/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { LogoWall } from '@/components/sections/LogoWall'
import { Section } from '@/components/sections/Section'
import { PillarCards } from '@/components/sections/PillarCards'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { CtaBand } from '@/components/sections/CtaBand'
import { hero, pillars, whyPoints, ctaBand } from '@/content/home'
import { processSteps } from '@/content/process'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/'].title,
  description: pageSeo['/'].description,
}

export default function HomePage() {
  return (
    <>
      <Hero {...hero} />
      <LogoWall />

      <Section label="02 — Ways to work together" title="Two ways to work with us">
        <PillarCards pillars={pillars} />
      </Section>

      <Section
        label="03 — Why TINWA"
        title="Senior engineers who have run this in production"
        className="border-t border-border"
      >
        <FeatureGrid features={whyPoints} />
      </Section>

      <Section label="04 — How we work" title="Five steps, no surprises">
        <ProcessSteps steps={processSteps} />
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
```

- [ ] **Step 2: Create the Talent page**

Create `src/app/talent/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { SkillsGrid } from '@/components/sections/SkillsGrid'
import { CtaBand } from '@/components/sections/CtaBand'
import { engagementModels, vetting, skillGroups, availability } from '@/content/talent'
import { ctaBand } from '@/content/home'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/talent'].title,
  description: pageSeo['/talent'].description,
}

export default function TalentPage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>01 — Talent</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Add a senior engineer without adding headcount
          </h1>
          <p className="text-lg leading-[1.6] text-muted">
            We place engineers from a vetted network into client teams. You get the seniority you
            need for the engagement, on your process, without a permanent hire.
          </p>
        </Container>
      </section>

      <Section
        label="02 — Engagement models"
        title="Three ways to bring us in"
        className="border-t border-border"
      >
        <FeatureGrid features={engagementModels} />
      </Section>

      <Section
        label="03 — Vetting"
        title="What senior means here"
        intro="Seniority is a claim anyone can make on a CV. This is how we check it before an engineer reaches you."
      >
        <FeatureGrid features={vetting} />
      </Section>

      <Section label={availability.label} title={availability.title} intro={availability.body} />

      <Section
        label="05 — Skills"
        title="Where our engineers are deep"
        className="border-t border-border"
      >
        <SkillsGrid groups={skillGroups} />
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
```

- [ ] **Step 3: Create the Software page**

Create `src/app/software/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { CtaBand } from '@/components/sections/CtaBand'
import { capabilities, domains, snapshots } from '@/content/software'
import { ctaBand } from '@/content/home'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/software'].title,
  description: pageSeo['/software'].description,
}

export default function SoftwarePage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>01 — Software</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Hand us the build, get back something maintainable
          </h1>
          <p className="text-lg leading-[1.6] text-muted">
            Scoped delivery for platforms that have to be correct under load — with the tests,
            pipelines and decision records that let your team take it over afterwards.
          </p>
        </Container>
      </section>

      <Section
        label="02 — Capabilities"
        title="What we build"
        className="border-t border-border"
      >
        <FeatureGrid features={capabilities} />
      </Section>

      <Section label="03 — Domains" title="Where we have done this before">
        <ul className="flex flex-wrap gap-3">
          {domains.map((domain) => (
            <li
              key={domain}
              className="border border-border bg-surface px-4 py-2 font-display text-sm text-ink"
            >
              {domain}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        label="04 — Selected work"
        title="Engagement snapshots"
        intro="Client names are withheld. The numbers are real."
        className="border-t border-border"
      >
        <ul className="grid gap-4 lg:grid-cols-3">
          {snapshots.map((snapshot) => (
            <li
              key={snapshot.title}
              className="flex flex-col gap-3 border border-border bg-surface p-6"
            >
              <span className="label-mono w-fit bg-accent px-1.5 py-0.5 text-[#0b0b0c]">
                {snapshot.metric}
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {snapshot.title}
              </h3>
              <p className="text-sm leading-[1.65] text-muted">{snapshot.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
```

- [ ] **Step 4: Verify the three pages build and render**

Run: `npm run build`
Expected: succeeds, with `/`, `/talent` and `/software` listed as static (`○`) routes.

Run `npm run dev` and walk all three pages in both themes.
Expected: one `<h1>` per page, section numbering reads in order, the experience wall renders on Home, and nothing overflows horizontally at 375px.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add home, talent and software pages"
```

---

### Task 13: Pages — About, Careers, Contact, Privacy, and error surfaces

**Files:**
- Create: `src/content/about.ts`, `src/content/privacy.ts`, `src/content/about.test.ts`, `src/app/about/page.tsx`, `src/app/careers/page.tsx`, `src/app/contact/page.tsx`, `src/app/privacy/page.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`

**Interfaces:**
- Consumes: `CredentialsBlock`, `FeatureGrid`, `Section`, `CtaBand` (Task 8); `ContactForm` (Task 10); `CareersForm` (Task 11); `Prose` (Task 5); `company`, `formatAddress` (Task 3)
- Produces:
  - `about.ts` → `aboutIntro: { label, title, body }`, `story: Feature[]`, `founder: { name, role, body, credentials: string[] }`
  - `privacy.ts` → `privacyIntro: { title, updated, body }`, `privacySections: { heading: string; body: string[] }[]`
  - Four routes plus `not-found` and `error`

- [ ] **Step 1: Write the failing content test**

Create `src/content/about.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { aboutIntro, story, founder } from './about'
import { privacyIntro, privacySections } from './privacy'

describe('about', () => {
  it('describes the network model rather than claiming employees', () => {
    const text = `${aboutIntro.body} ${story.map((s) => s.body).join(' ')}`.toLowerCase()
    expect(text).toContain('network')
    expect(text).not.toContain('our employees')
    expect(text).not.toContain('our team of')
  })

  it('names the founder and lists credentials', () => {
    expect(founder.name).toBe('Tapiwanashe Shoshore')
    expect(founder.credentials.length).toBeGreaterThanOrEqual(3)
    expect(founder.body.trim().length).toBeGreaterThan(0)
  })

  it('gives every story point a title and body', () => {
    expect(story.length).toBeGreaterThanOrEqual(2)
    for (const point of story) {
      expect(point.title.trim().length).toBeGreaterThan(0)
      expect(point.body.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('privacy', () => {
  it('covers the POPIA disclosures a processing notice needs', () => {
    const headings = privacySections.map((s) => s.heading.toLowerCase()).join(' ')
    for (const topic of ['collect', 'use', 'retain', 'share', 'rights']) {
      expect(headings, `privacy notice is missing a section about "${topic}"`).toContain(topic)
    }
  })

  it('gives every section at least one paragraph', () => {
    for (const section of privacySections) {
      expect(section.body.length).toBeGreaterThan(0)
      for (const paragraph of section.body) {
        expect(paragraph.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('states when it was last updated', () => {
    expect(privacyIntro.updated).toMatch(/^\d{1,2} \w+ \d{4}$/)
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/content/about.test.ts`
Expected: FAIL — unresolved imports for `./about` and `./privacy`.

- [ ] **Step 3: Create the about content**

Create `src/content/about.ts`:

```ts
import type { Feature } from './types'

export const aboutIntro = {
  label: '01 — About',
  title: 'A small consultancy that places serious engineers',
  body: 'TINWA was registered in South Africa in 2019. We work through a vetted network of senior engineers, engaged per project — which is how a small consultancy can put a genuinely experienced person on your problem instead of whoever happens to be on the bench.',
}

export const story: Feature[] = [
  {
    title: 'Why we work this way',
    body: 'A network beats a payroll for the kind of work we take on. Engagements are specific — a Kafka migration, a credit integration, a team that needs one more senior hand for six months — and the right engineer for one is rarely the right engineer for the next.',
  },
  {
    title: 'What you actually get',
    body: 'Engineers who have carried production systems, working inside your process, leaving behind decision records and tests rather than a knowledge gap. We would rather turn down an engagement than staff it badly.',
  },
]

export const founder = {
  name: 'Tapiwanashe Shoshore',
  role: 'Founder and director',
  body: 'Eleven years building and running enterprise systems across digital banking, telecommunications, retail credit and sports betting — from event-driven core banking services on Kotlin and Kafka, to a serverless credit decisioning platform processing tens of thousands of applications a day, to USSD and agricultural services for a national mobile network. Hands-on with architecture and code, and the person who reviews every engineer before they reach a client.',
  credentials: [
    'MSc Information Systems Management, Midlands State University',
    'BSc (Hons) Information Systems, Midlands State University',
    'AWS Certified',
    'Oracle Certified Associate (OCA)',
    'HashiCorp Certified Terraform Associate',
  ],
}
```

- [ ] **Step 4: Create the privacy content**

Create `src/content/privacy.ts`:

```ts
import { company } from './company'

export const privacyIntro = {
  title: 'Privacy notice',
  updated: '3 August 2026',
  body: `This notice explains how ${company.legalName} collects, uses and retains personal information submitted through this website, in line with the Protection of Personal Information Act, 2013 (POPIA).`,
}

export const privacySections: { heading: string; body: string[] }[] = [
  {
    heading: 'What we collect',
    body: [
      'From the contact form: your name, company name, email address, phone number, the type of enquiry and the message you write.',
      'From the careers form: your name, email address, a link to your LinkedIn profile or CV, your primary technology stack, your years of experience and your location.',
      'We do not accept file uploads, and we do not use advertising or analytics cookies on this site. The only value stored in your browser is your light or dark theme preference.',
    ],
  },
  {
    heading: 'Why we use it',
    body: [
      'Contact form submissions are used solely to respond to your enquiry and, if it leads somewhere, to carry on that conversation.',
      'Careers form submissions are used to assess whether there is a fit for current or upcoming engagements, and to contact you about them.',
      'We do not sell your information, and we do not add you to a mailing list.',
    ],
  },
  {
    heading: 'Who we share it with',
    body: [
      `Submissions are transmitted by Resend, an email delivery provider acting as an operator on our behalf, and delivered to a mailbox controlled by ${company.legalName}.`,
      'This website is hosted by Vercel. Where a submission concerns a specific client engagement, we may share relevant details with that client only with your knowledge.',
    ],
  },
  {
    heading: 'How long we retain it',
    body: [
      'Enquiries are retained for up to 24 months from your last contact with us, so we can pick up a conversation where it left off.',
      'Applications are retained for up to 24 months so we can come back to you when a suitable engagement appears. Tell us at any time if you would rather we did not.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      `You may ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. Email ${company.email} and we will action the request.`,
      'If you are not satisfied with how we have handled your information, you may lodge a complaint with the Information Regulator of South Africa.',
    ],
  },
  {
    heading: 'Contacting us',
    body: [
      `${company.legalName}, registration ${company.registrationNumber}.`,
      `Email ${company.email} or call ${company.phone}.`,
    ],
  },
]
```

- [ ] **Step 5: Run the content test and confirm it passes**

Run: `npm test -- src/content/about.test.ts`
Expected: PASS — 6 tests.

- [ ] **Step 6: Create the About page**

Create `src/app/about/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { CredentialsBlock } from '@/components/sections/CredentialsBlock'
import { CtaBand } from '@/components/sections/CtaBand'
import { aboutIntro, story, founder } from '@/content/about'
import { ctaBand } from '@/content/home'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/about'].title,
  description: pageSeo['/about'].description,
}

export default function AboutPage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>{aboutIntro.label}</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            {aboutIntro.title}
          </h1>
          <p className="text-lg leading-[1.6] text-muted">{aboutIntro.body}</p>
        </Container>
      </section>

      <Section label="02 — How we operate" className="border-t border-border">
        <FeatureGrid features={story} columns={2} />
      </Section>

      <Section label="03 — Who runs it" title={founder.name}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="label-mono text-muted">{founder.role}</p>
            <p className="mt-4 text-base leading-[1.65] text-muted">{founder.body}</p>
          </div>
          <ul className="flex flex-col gap-2 border border-border bg-surface p-6">
            {founder.credentials.map((credential) => (
              <li key={credential} className="text-sm text-ink">
                {credential}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        label="04 — Company details"
        title="Registered and verifiable"
        className="border-t border-border"
      >
        <CredentialsBlock />
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
```

- [ ] **Step 7: Create the Careers page**

Create `src/app/careers/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { CareersForm } from '@/components/sections/CareersForm'
import { careersIntro, lookingFor, whatWeOffer } from '@/content/careers'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/careers'].title,
  description: pageSeo['/careers'].description,
}

export default function CareersPage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>{careersIntro.label}</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            {careersIntro.title}
          </h1>
          <p className="text-lg leading-[1.6] text-muted">{careersIntro.body}</p>
        </Container>
      </section>

      <Section
        label="02 — Who we are looking for"
        title="What we need to see"
        className="border-t border-border"
      >
        <FeatureGrid features={lookingFor} />
      </Section>

      <Section label="03 — What we offer" title="What you get from us">
        <FeatureGrid features={whatWeOffer} />
      </Section>

      <Section
        label="04 — Apply"
        title="Tell us what you build"
        className="border-t border-border"
      >
        <div className="max-w-xl">
          <CareersForm />
          <p className="mt-6 text-xs leading-relaxed text-muted">
            We use these details only to assess a fit for current and upcoming engagements, and we
            keep them for up to 24 months. See our{' '}
            <Link href="/privacy" className="text-ink underline">
              privacy notice
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 8: Create the Contact page**

Create `src/app/contact/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ContactForm } from '@/components/sections/ContactForm'
import { company, formatAddress } from '@/content/company'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/contact'].title,
  description: pageSeo['/contact'].description,
}

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>01 — Contact</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Tell us what you need
          </h1>
          <p className="text-lg leading-[1.6] text-muted">
            A developer for your team, a build to hand over, or a second opinion on an architecture.
            We answer every enquiry ourselves.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <ContactForm />
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted">
              We use these details only to respond to your enquiry, and we keep them for up to 24
              months. See our{' '}
              <Link href="/privacy" className="text-ink underline">
                privacy notice
              </Link>
              .
            </p>
          </div>

          <aside className="flex h-fit flex-col gap-6 border border-border bg-surface p-6">
            <div className="flex flex-col gap-2">
              <span className="label-mono text-muted">Email</span>
              <a href={company.emailHref} className="text-sm text-ink hover:underline">
                {company.email}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="label-mono text-muted">Phone</span>
              <a href={company.phoneHref} className="text-sm text-ink hover:underline">
                {company.phone}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="label-mono text-muted">Address</span>
              <address className="text-sm not-italic leading-relaxed text-muted">
                {formatAddress().map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-6">
              <span className="label-mono text-muted">Registration</span>
              <p className="text-sm text-muted">
                {company.legalName}
                <br />
                {company.registrationNumber}
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 9: Create the Privacy page**

Create `src/app/privacy/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Prose } from '@/components/ui/Prose'
import { privacyIntro, privacySections } from '@/content/privacy'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/privacy'].title,
  description: pageSeo['/privacy'].description,
}

export default function PrivacyPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="flex max-w-3xl flex-col gap-8">
        <SectionLabel>{`Last updated — ${privacyIntro.updated}`}</SectionLabel>

        <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink">
          {privacyIntro.title}
        </h1>

        <Prose>
          <p>{privacyIntro.body}</p>

          {privacySections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </Prose>
      </Container>
    </section>
  )
}
```

- [ ] **Step 10: Create the error surfaces**

Create `src/app/not-found.tsx`:

```tsx
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="py-28">
      <Container className="flex max-w-2xl flex-col gap-6">
        <SectionLabel>404 — Not found</SectionLabel>
        <h1 className="font-display text-4xl font-bold tracking-[-0.03em] text-ink">
          That page does not exist
        </h1>
        <p className="text-base leading-[1.65] text-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="ghost">
            Contact us
          </Button>
        </div>
      </Container>
    </section>
  )
}
```

Create `src/app/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import { company } from '@/content/company'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[app] unhandled error', error)
  }, [error])

  return (
    <section className="py-28">
      <Container className="flex max-w-2xl flex-col gap-6">
        <SectionLabel>Error — Something went wrong</SectionLabel>
        <h1 className="font-display text-4xl font-bold tracking-[-0.03em] text-ink">
          Something went wrong on our side
        </h1>
        <p className="text-base leading-[1.65] text-muted">
          Try again, or reach us directly at{' '}
          <a href={company.emailHref} className="text-ink underline">
            {company.email}
          </a>{' '}
          or{' '}
          <a href={company.phoneHref} className="text-ink underline">
            {company.phone}
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-accent px-5 py-3 font-display text-sm font-semibold tracking-tight text-[#0b0b0c] hover:opacity-90"
          >
            Try again
          </button>
          <Button href="/" variant="ghost">
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 11: Build and verify**

Run: `npm test && npm run typecheck && npm run lint && npm run build`
Expected: all pass; the build lists all seven page routes plus two API routes.

Then run `npm run dev` and check `/about`, `/careers`, `/contact`, `/privacy` and a deliberate 404 like `/nope`, in both themes at 375px and 1440px.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add about, careers, contact and privacy pages plus error surfaces"
```

---

### Task 14: SEO — sitemap, robots, JSON-LD, OG image, favicon

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/icon.svg`, `src/components/layout/StructuredData.tsx`, `src/app/seo.test.ts`
- Modify: `src/app/layout.tsx` (add `metadataBase`, template title, and the structured data)

**Interfaces:**
- Consumes: `company` (Task 3); `routes` (Task 4)
- Produces: `sitemap()`, `robots()`, `<StructuredData />` emitting a `ProfessionalService` JSON-LD block, a generated OG image at `/opengraph-image`, and a favicon at `/icon.svg`

- [ ] **Step 1: Write the failing tests**

Create `src/app/seo.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import sitemap from './sitemap'
import robots from './robots'
import { routes } from '@/content/nav'
import { company } from '@/content/company'

describe('sitemap', () => {
  it('includes every public route exactly once', () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toHaveLength(routes.length)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('builds absolute URLs from the site URL', () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith('http')).toBe(true)
    }
  })

  it('ranks the home page highest', () => {
    const home = sitemap().find((entry) => entry.url.replace(/\/$/, '').endsWith(company.domain))
    expect(home?.priority).toBe(1)
  })
})

describe('robots', () => {
  it('allows crawling of pages but not the API', () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules
    expect(rules?.allow).toBe('/')
    expect(rules?.disallow).toBe('/api/')
  })

  it('points at the sitemap', () => {
    expect(String(robots().sitemap)).toContain('sitemap.xml')
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- src/app/seo.test.ts`
Expected: FAIL — unresolved imports for `./sitemap` and `./robots`.

- [ ] **Step 3: Implement sitemap and robots**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { routes } from '@/content/nav'
import { company } from '@/content/company'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? company.siteUrl

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: route === '/' ? baseUrl : `${baseUrl}${route}`,
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.7,
  }))
}
```

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'
import { company } from '@/content/company'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? company.siteUrl

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `npm test -- src/app/seo.test.ts`
Expected: PASS — 5 tests.

- [ ] **Step 5: Add structured data**

Create `src/components/layout/StructuredData.tsx`:

```tsx
import { company } from '@/content/company'

/**
 * ProfessionalService JSON-LD. This is what makes a search for "TINWA" surface
 * the right company with the right registration number and contact details.
 */
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.legalName,
    alternateName: company.shortName,
    description: company.tagline,
    url: company.siteUrl,
    telephone: company.phone,
    email: company.email,
    foundingDate: company.registrationDate,
    identifier: company.registrationNumber,
    vatID: company.taxNumber,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${company.address.line1}, ${company.address.line2}`,
      addressLocality: company.address.city,
      addressRegion: company.address.province,
      postalCode: company.address.postalCode,
      addressCountry: 'ZA',
    },
    founder: { '@type': 'Person', name: company.director },
    areaServed: ['South Africa', 'United Kingdom', 'European Union'],
    knowsAbout: [
      'Software development',
      'Software consulting',
      'Java',
      'Kotlin',
      'Spring Boot',
      'React',
      'Apache Kafka',
      'Amazon Web Services',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

- [ ] **Step 6: Add the OG image and favicon**

Create `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { company } from '@/content/company'

export const alt = `${company.shortName} — ${company.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0b0c',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 28, height: 28, background: '#c9f24d' }} />
          <div style={{ fontSize: 34, letterSpacing: 12, color: '#edede9', fontWeight: 700 }}>
            {company.shortName}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 76,
            lineHeight: 1.1,
            color: '#edede9',
            fontWeight: 700,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {company.tagline}
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#9a9aa1' }}>{company.domain}</div>
      </div>
    ),
    size,
  )
}
```

Create `src/app/icon.svg` — a wordmark is illegible at 32px, so the favicon is the only place a mark exists:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#C9F24D"/>
  <path d="M7 9h18v4.2h-6.6V25h-4.8V13.2H7z" fill="#0B0B0C"/>
</svg>
```

- [ ] **Step 7: Wire metadata into the root layout**

In `src/app/layout.tsx`, import the structured data and replace the `metadata` export:

```tsx
import { StructuredData } from '@/components/layout/StructuredData'
import { company } from '@/content/company'
import { pageSeo } from '@/content/seo'
```

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? company.siteUrl),
  title: {
    default: pageSeo['/'].title,
    template: `%s`,
  },
  description: pageSeo['/'].description,
  openGraph: {
    type: 'website',
    siteName: company.shortName,
    locale: 'en_ZA',
    url: company.siteUrl,
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
}
```

Then render `<StructuredData />` inside `<head>`, immediately after the theme script.

- [ ] **Step 8: Verify the generated assets**

Run: `npm run build && npm run start`

Check:
- `http://localhost:3000/sitemap.xml` — lists all seven URLs
- `http://localhost:3000/robots.txt` — allows `/`, disallows `/api/`, references the sitemap
- `http://localhost:3000/opengraph-image` — renders the lime square, wordmark, tagline and domain on ink
- The browser tab shows the lime favicon
- View source on `/` and confirm one `application/ld+json` block containing the registration number

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots, JSON-LD, generated OG image and favicon"
```

---

### Task 15: Playwright E2E suite, README and deployment

**Files:**
- Create: `playwright.config.ts`, `e2e/routes.spec.ts`, `e2e/theme.spec.ts`, `e2e/contact.spec.ts`, `README.md`
- Modify: `.gitignore` (add Playwright output — already covered by `test-results/` and `playwright-report/`; verify)

**Interfaces:**
- Consumes: every route from Tasks 12–14; `#main-content` from Task 6
- Produces: `npm run test:e2e` covering all seven routes, navigation, theme persistence and all three contact-form outcomes

- [ ] **Step 1: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ?? 'test-key',
      CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL ?? 'ci@example.com',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? baseURL,
    },
  },
})
```

- [ ] **Step 2: Write the route coverage spec**

Create `e2e/routes.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/', heading: /senior engineers, embedded/i },
  { path: '/talent', heading: /add a senior engineer/i },
  { path: '/software', heading: /hand us the build/i },
  { path: '/about', heading: /a small consultancy/i },
  { path: '/careers', heading: /join the tinwa network/i },
  { path: '/contact', heading: /tell us what you need/i },
  { path: '/privacy', heading: /privacy notice/i },
]

for (const page of PAGES) {
  test(`${page.path} responds 200 and renders exactly one h1`, async ({ page: browserPage }) => {
    const response = await browserPage.goto(page.path)
    expect(response?.status()).toBe(200)

    const headings = browserPage.locator('h1')
    await expect(headings).toHaveCount(1)
    await expect(headings.first()).toHaveText(page.heading)
  })
}

test('an unknown path renders the 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/does not exist/i)
})

test('the experience wall never claims these are clients', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Experience across')).toBeVisible()

  const body = (await page.locator('body').innerText()).toLowerCase()
  expect(body).not.toContain('our clients')
  expect(body).not.toContain('trusted by')
})

test('the skip link moves focus to the main landmark', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: /skip to content/i })
  await expect(skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeVisible()
})

test('primary navigation reaches every page', async ({ page }) => {
  await page.goto('/')

  for (const label of ['Talent', 'Software', 'About', 'Careers', 'Contact']) {
    await page.getByRole('link', { name: label }).first().click()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.goto('/')
  }
})
```

- [ ] **Step 3: Write the theme spec**

Create `e2e/theme.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('the theme toggle switches themes and survives a reload', async ({ page }) => {
  await page.goto('/')

  const html = page.locator('html')
  await expect(html).not.toHaveAttribute('data-theme', 'light')

  await page.getByRole('button', { name: /switch to light theme/i }).click()
  await expect(html).toHaveAttribute('data-theme', 'light')

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'light')
})

test('the stored theme is applied before first paint', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /switch to light theme/i }).click()
  await page.reload()

  // If the attribute were applied after hydration there would be a frame of
  // dark. Reading it immediately after DOMContentLoaded proves the inline
  // script ran first.
  const themeAtLoad = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  expect(themeAtLoad).toBe('light')
})
```

- [ ] **Step 4: Write the contact form spec**

Create `e2e/contact.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

async function fillEnquiry(page: import('@playwright/test').Page) {
  await page.getByLabel('Name', { exact: true }).fill('Thandi Mokoena')
  await page.getByLabel('Work email').fill('thandi@acmebank.co.za')
  await page.getByLabel('What do you need?').selectOption('hire')
  await page
    .getByLabel('Message')
    .fill('We need a senior Kotlin engineer for a six month engagement starting in October.')
}

test('shows validation errors and does not submit an incomplete enquiry', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: /send enquiry/i }).click()

  await expect(page.getByText('Enter your name')).toBeVisible()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()
})

test('confirms a successful submission', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    await route.fulfill({ status: 200, json: { ok: true } })
  })

  await page.goto('/contact')
  await fillEnquiry(page)
  await page.getByRole('button', { name: /send enquiry/i }).click()

  await expect(page.getByRole('status')).toContainText(/thank you/i)
})

test('shows the email and phone when the submission fails', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    await route.fulfill({ status: 500, json: { ok: false } })
  })

  await page.goto('/contact')
  await fillEnquiry(page)
  await page.getByRole('button', { name: /send enquiry/i }).click()

  const alert = page.getByRole('alert')
  await expect(alert).toContainText('hello@tinwa.co.za')
  await expect(alert).toContainText('+27 73 309 7462')
})

test('the careers form rejects a profile link that is not a URL', async ({ page }) => {
  await page.goto('/careers')

  await page.getByLabel('Name', { exact: true }).fill('Sipho Dlamini')
  await page.getByLabel('Email').fill('sipho@example.com')
  await page.getByLabel(/linkedin or cv/i).fill('my linkedin')
  await page.getByLabel('Primary stack').fill('Java, Spring Boot')
  await page.getByLabel('Years of experience').fill('8')
  await page.getByLabel('Location').fill('Cape Town')
  await page.getByRole('button', { name: /send application/i }).click()

  await expect(page.getByText(/link to your linkedin profile or cv/i)).toBeVisible()
})
```

- [ ] **Step 5: Run the E2E suite**

Run: `npm run test:e2e`
Expected: PASS — 14 tests. The first run builds the app, so allow a couple of minutes.

If a heading regex fails, fix the **spec** to match the shipped copy rather than changing the copy — these assertions exist to catch a page that stopped rendering, not to freeze wording.

- [ ] **Step 6: Write the README**

Create `README.md`:

````markdown
# TINWA website

Marketing website for TINWA (Pty) Ltd — a South African software consultancy.

Live: https://tinwa.co.za

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

Pushes to `main` deploy to production on Vercel. Pull requests get preview URLs.
````

- [ ] **Step 7: Push the repository**

```bash
git add -A
git commit -m "test: add Playwright end-to-end suite and project README"
git push -u origin main
```

- [ ] **Step 8: Confirm CI is green**

Run: `gh run watch`
Expected: the `verify` job passes every step. If Playwright fails in CI but passes locally, check that the workflow's env block still supplies the three variables.

- [ ] **Step 9: Deploy to Vercel**

This step needs the user's Vercel account. Either they run it, or they authorise you to:

```bash
npx vercel link
npx vercel env add RESEND_API_KEY production
npx vercel env add CONTACT_TO_EMAIL production
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel --prod
```

Then in the Vercel dashboard: connect the GitHub repo so `main` auto-deploys and PRs get previews.

- [ ] **Step 10: Verify the deployment**

On the deployed URL, check:
- All seven routes load in both themes at 375px, 768px and 1440px
- `sitemap.xml` and `robots.txt` return the deployed origin, not `localhost`
- A real contact submission arrives in `CONTACT_TO_EMAIL` with `reply-to` set to the sender

Run Lighthouse on `/` and `/contact`.
Expected: ≥95 on Performance, Accessibility, Best Practices and SEO. If Accessibility falls short, the usual cause is a contrast pair — check it against the accent-contrast rule in the Global Constraints before changing any token.

- [ ] **Step 11: Attach the custom domain**

Blocked until `tinwa.co.za` is registered. When it is:
1. Add the domain in Vercel and set the DNS records it specifies
2. Verify the Resend sending domain with its DKIM and SPF records
3. Set `NEXT_PUBLIC_SITE_URL=https://tinwa.co.za` in Vercel and redeploy

- [ ] **Step 12: Commit any deployment fixes**

```bash
git add -A
git commit -m "chore: deployment configuration fixes"
git push
```

---

## Post-implementation checklist

Verify against the spec's success criteria (§11) before calling this done:

- [ ] All seven routes render correctly in both themes at 375px, 768px and 1440px
- [ ] Lighthouse ≥95 on Performance, Accessibility, Best Practices, SEO
- [ ] Both forms deliver to the configured inbox
- [ ] Both forms show the email and phone when submission fails
- [ ] No copy claims permanent employees, headcount or that experience-wall companies are clients
- [ ] Every company fact traces to `src/content/company.ts`
- [ ] CI green on `main`

## Open items for the user

None of these block implementation — the site builds and deploys to a Vercel URL without them.

1. **Register `tinwa.co.za`** and provision the `hello@` mailbox
2. **Create a Resend account**, verify the sending domain, and supply `RESEND_API_KEY`
3. **Confirm the B-BBEE level.** The affidavit ticks Level 4 but its bullets declare 100% black ownership, which would be Level 1 — a 35-point difference in procurement recognition. The site publishes Level 4; changing it is one line in `company.ts` plus its test.
4. **Review the experience wall** once logos are sourced, and confirm you are comfortable with each mark that appears.

