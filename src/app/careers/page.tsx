import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { CareersForm } from '@/components/sections/CareersForm'
import { careersIntro, lookingFor, whatWeOffer } from '@/content/careers'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/careers'].title,
  description: pageSeo['/careers'].description,
  alternates: { canonical: '/careers' },
}

export default function CareersPage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>{careersIntro.label}</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            {careersIntro.title}
          </h1>
          <p className="text-lg leading-[1.6] text-muted">{careersIntro.body}</p>
        </Container>
      </section>

      <Section
        label="02 — Who we are looking for"
        title="What we need to see"
        className="border-t border-border"
      >
        <FeatureGrid features={lookingFor} />
      </Section>

      <Section label="03 — What we offer" title="What you get from us">
        <FeatureGrid features={whatWeOffer} />
      </Section>

      <Section
        label="04 — Apply"
        title="Tell us what you build"
        className="border-t border-border"
      >
        <div className="max-w-xl">
          <CareersForm />
          <p className="mt-6 text-xs leading-relaxed text-muted">
            We use these details only to assess a fit for current and upcoming engagements, and we
            keep them for up to 24 months. See our{' '}
            <Link href="/privacy" className="text-ink underline">
              privacy notice
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  )
}
