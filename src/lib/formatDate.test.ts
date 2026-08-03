import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats an ISO date as day month year', () => {
    expect(formatDate('2019-03-26')).toBe('26 March 2019')
  })

  it('formats another ISO date correctly', () => {
    expect(formatDate('2027-07-16')).toBe('16 July 2027')
  })

  it('does not pad a single-digit day', () => {
    expect(formatDate('2019-03-06')).toBe('6 March 2019')
  })
})
