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
