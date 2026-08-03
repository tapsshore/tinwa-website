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
