import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { LogoWall } from '@/components/sections/LogoWall'
import { Section } from '@/components/sections/Section'
import { PillarCards } from '@/components/sections/PillarCards'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { CtaBand } from '@/components/sections/CtaBand'
import { hero, pillars, whyPoints, ctaBand } from '@/content/home'
import { processSteps } from '@/content/process'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/'].title,
  description: pageSeo['/'].description,
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero {...hero} />
      <LogoWall />

      <Section label="02 — Ways to work together" title="Two ways to work with us">
        <PillarCards pillars={pillars} />
      </Section>

      <Section
        label="03 — Why TINWA"
        title="Senior engineers who have run this in production"
        className="border-t border-border"
      >
        <FeatureGrid features={whyPoints} />
      </Section>

      <Section label="04 — How we work" title="Five steps, no surprises">
        <ProcessSteps steps={processSteps} />
      </Section>

      <CtaBand {...ctaBand} />
    </>
  )
}
