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

  it('keeps snapshots free of client-identifying specifics', () => {
    const text = snapshots.map((s) => `${s.title} ${s.body} ${s.metric}`).join(' ').toLowerCase()
    for (const phrase of ['five thousand', '5 000', '5,000', 'six southern african', 'ussd', 'agricultural']) {
      expect(text, `snapshot contains an identifying specific: "${phrase}"`).not.toContain(phrase)
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
