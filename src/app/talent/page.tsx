import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/sections/Section'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { SkillsGrid } from '@/components/sections/SkillsGrid'
import { CtaBand } from '@/components/sections/CtaBand'
import { engagementModels, vetting, skillGroups, availability } from '@/content/talent'
import { ctaBand } from '@/content/home'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/talent'].title,
  description: pageSeo['/talent'].description,
  alternates: { canonical: '/talent' },
}

export default function TalentPage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>01 — Talent</SectionLabel>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Add a senior engineer without adding headcount
          </h1>
          <p className="text-lg leading-[1.6] text-muted">
            We place engineers from a vetted network into client teams. You get the seniority you
            need for the engagement, on your process, without a permanent hire.
          </p>
        </Container>
      </section>

      <Section
        label="02 — Engagement models"
        title="Three ways to bring us in"
        className="border-t border-border"
      >
        <FeatureGrid features={engagementModels} />
      </Section>

      <Section
        label="03 — Vetting"
        title="What senior means here"
        intro="Seniority is a claim anyone can make on a CV. This is how we check it before an engineer reaches you."
      >
        <FeatureGrid features={vetting} />
      </Section>

      <Section label={availability.label} title={availability.title} intro={availability.body} />

      <Section
        label="05 — Skills"
        title="Where our engineers are deep"
        className="border-t border-border"
      >
        <SkillsGrid groups={skillGroups} />
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
