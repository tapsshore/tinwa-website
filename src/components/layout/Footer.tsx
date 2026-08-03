import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { footerNav } from '@/content/nav'
import { company, formatAddress } from '@/content/company'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="font-display text-base font-bold tracking-[0.22em] text-ink">
            {company.shortName}
          </span>
          <p className="text-sm leading-relaxed text-muted">{company.tagline}</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-muted">Contact</span>
          <a href={company.emailHref} className="text-sm text-ink hover:underline">
            {company.email}
          </a>
          <a href={company.phoneHref} className="text-sm text-ink hover:underline">
            {company.phone}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-muted">Registered office</span>
          <address className="text-sm not-italic leading-relaxed text-muted">
            {formatAddress().map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-muted">Navigate</span>
          <ul className="flex flex-col gap-2">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {company.legalName} — Registration {company.registrationNumber} — VAT/Tax{' '}
          {company.taxNumber}
        </p>
        <p>
          B-BBEE {company.bbbee.status}, Level {company.bbbee.level} contributor (
          {company.bbbee.recognition} procurement recognition)
        </p>
      </Container>
    </footer>
  )
}
