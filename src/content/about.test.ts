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
    for (const topic of ['collect', 'use', 'retain', 'share', 'processed', 'rights']) {
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
