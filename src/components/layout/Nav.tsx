import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ThemeToggle } from './ThemeToggle'
import { primaryNav } from '@/content/nav'
import { company } from '@/content/company'

export function Nav() {
  return (
    <header className="border-b border-border">
      <Container className="flex items-center justify-between gap-6 py-5">
        <Link
          href="/"
          className="font-display text-base font-bold tracking-[0.22em] text-ink"
        >
          {company.shortName}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-mono text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </Container>

      {/* On narrow viewports the primary links move below the wordmark rather
          than into a JS-driven drawer — five links fit, and it keeps the shell
          free of client-side state. */}
      <Container className="pb-4 md:hidden">
        <nav aria-label="Primary, mobile">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-mono text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
