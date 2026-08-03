/**
 * Formats an ISO date (YYYY-MM-DD) as "26 March 2019" for display.
 *
 * Parsed as UTC deliberately: `new Date('2019-03-26')` is UTC midnight, and
 * formatting that in a negative-offset timezone would render the previous day.
 */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
