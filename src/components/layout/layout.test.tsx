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
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0)
    }
  })
})

describe('Footer', () => {
  it('publishes the company facts from the company module', () => {
    render(<Footer />)
    // The legal name sits inside a <p> alongside registration/tax text as
    // sibling text nodes, so an exact-string getByText (which requires a
    // single element's full text to equal the string) never matches. Use a
    // regex, same as the registration number below, which partial-matches.
    expect(
      screen.getByText(new RegExp(company.legalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))),
    ).toBeInTheDocument()
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
