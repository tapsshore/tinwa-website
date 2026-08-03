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
import { formatDate } from '@/lib/formatDate'

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

  it('formats registration and B-BBEE dates from the source constants, not literals', () => {
    render(<CredentialsBlock />)
    expect(screen.getByText(formatDate(company.registrationDate))).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(formatDate(company.bbbee.validUntil))),
    ).toBeInTheDocument()
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
