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
