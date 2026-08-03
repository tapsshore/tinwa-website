export type NavLink = { href: string; label: string }

export const primaryNav: NavLink[] = [
  { href: '/talent', label: 'Talent' },
  { href: '/software', label: 'Software' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
]

export const footerNav: NavLink[] = [...primaryNav, { href: '/privacy', label: 'Privacy' }]

export const routes = [
  '/',
  '/talent',
  '/software',
  '/about',
  '/careers',
  '/contact',
  '/privacy',
] as const
