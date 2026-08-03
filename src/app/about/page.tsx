import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { CredentialsBlock } from '@/components/sections/CredentialsBlock'
import { CtaBand } from '@/components/sections/CtaBand'
import { aboutIntro, story, founder } from '@/content/about'
import { ctaBand } from '@/content/home'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/about'].title,
  description: pageSeo['/about'].description,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>{aboutIntro.label}</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            {aboutIntro.title}
          </h1>
          <p className="text-lg leading-[1.6] text-muted">{aboutIntro.body}</p>
        </Container>
      </section>

      <Section
        label="02 — How we operate"
        title="How we operate"
        className="border-t border-border"
      >
        <FeatureGrid features={story} columns={2} />
      </Section>

      <Section label="03 — Who runs it" title={founder.name}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="label-mono text-muted">{founder.role}</p>
            <p className="mt-4 text-base leading-[1.65] text-muted">{founder.body}</p>
          </div>
          <ul className="flex flex-col gap-2 border border-border bg-surface p-6">
            {founder.credentials.map((credential) => (
              <li key={credential} className="text-sm text-ink">
                {credential}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        label="04 — Company details"
        title="Registered and verifiable"
        className="border-t border-border"
      >
        <CredentialsBlock />
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
