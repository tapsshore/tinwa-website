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
