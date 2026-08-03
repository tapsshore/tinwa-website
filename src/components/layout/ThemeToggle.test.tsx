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
