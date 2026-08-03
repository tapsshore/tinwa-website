import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { CtaBand } from '@/components/sections/CtaBand'
import { capabilities, domains, snapshots } from '@/content/software'
import { ctaBand } from '@/content/home'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/software'].title,
  description: pageSeo['/software'].description,
  alternates: { canonical: '/software' },
}

export default function SoftwarePage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>01 — Software</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Hand us the build, get back something maintainable
          </h1>
          <p className="text-lg leading-[1.6] text-muted">
            Scoped delivery for platforms that have to be correct under load — with the tests,
            pipelines and decision records that let your team take it over afterwards.
          </p>
        </Container>
      </section>

      <Section
        label="02 — Capabilities"
        title="What we build"
        className="border-t border-border"
      >
        <FeatureGrid features={capabilities} />
      </Section>

      <Section label="03 — Domains" title="Where we have done this before">
        <ul className="flex flex-wrap gap-3">
          {domains.map((domain) => (
            <li
              key={domain}
              className="border border-border bg-surface px-4 py-2 font-display text-sm text-ink"
            >
              {domain}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        label="04 — Selected work"
        title="Engagement snapshots"
        intro="Client names are withheld. The numbers are real."
        className="border-t border-border"
      >
        <ul className="grid gap-4 lg:grid-cols-3">
          {snapshots.map((snapshot) => (
            <li
              key={snapshot.title}
              className="flex flex-col gap-3 border border-border bg-surface p-6"
            >
              <span className="label-mono w-fit bg-accent px-1.5 py-0.5 text-[#0b0b0c]">
                {snapshot.metric}
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {snapshot.title}
              </h3>
              <p className="text-sm leading-[1.65] text-muted">{snapshot.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
