export type ExperienceEntry = { name: string; slug: string }

/**
 * Framing is fixed by the design spec (§5.3) and enforced by tests. This wall
 * describes where our engineers have worked; it is not a client list, and it
 * must never be relabelled "Our clients" or "Trusted by".
 */
export const EXPERIENCE_HEADING = 'Experience across'
export const EXPERIENCE_FOOTNOTE =
  'Companies our engineers have delivered for. Logos are the property of their respective owners.'

export const experienceEntries: ExperienceEntry[] = [
  { name: 'BMW IT Hub', slug: 'bmw-it-hub' },
  { name: 'Bancon', slug: 'bancon' },
  { name: 'Econet Wireless', slug: 'econet-wireless' },
  { name: 'Old Mutual South Africa', slug: 'old-mutual' },
  { name: 'LiveScore', slug: 'livescore' },
  { name: 'S-Mobile Belgium', slug: 's-mobile' },
  { name: 'Abalobi', slug: 'abalobi' },
  { name: 'Vertice Med Tech', slug: 'vertice-med-tech' },
  { name: 'Uptime Crew', slug: 'uptime-crew' },
  { name: 'Figjam', slug: 'figjam' },
  { name: 'Scrums', slug: 'scrums' },
  { name: 'Conclusion South Africa', slug: 'conclusion' },
]
