import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ContactForm } from '@/components/sections/ContactForm'
import { company, formatAddress } from '@/content/company'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/contact'].title,
  description: pageSeo['/contact'].description,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>01 — Contact</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Tell us what you need
          </h1>
          <p className="text-lg leading-[1.6] text-muted">
            A developer for your team, a build to hand over, or a second opinion on an architecture.
            We answer every enquiry ourselves.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <ContactForm />
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted">
              We use these details only to respond to your enquiry, and we keep them for up to 24
              months. See our{' '}
              <Link href="/privacy" className="text-ink underline">
                privacy notice
              </Link>
              .
            </p>
          </div>

          <aside className="flex h-fit flex-col gap-6 border border-border bg-surface p-6">
            <div className="flex flex-col gap-2">
              <span className="label-mono text-muted">Email</span>
              <a href={company.emailHref} className="text-sm text-ink hover:underline">
                {company.email}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="label-mono text-muted">Phone</span>
              <a href={company.phoneHref} className="text-sm text-ink hover:underline">
                {company.phone}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="label-mono text-muted">Address</span>
              <address className="text-sm not-italic leading-relaxed text-muted">
                {formatAddress().map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-6">
              <span className="label-mono text-muted">Registration</span>
              <p className="text-sm text-muted">
                {company.legalName}
                <br />
                {company.registrationNumber}
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
