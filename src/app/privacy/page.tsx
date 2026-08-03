import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Prose } from '@/components/ui/Prose'
import { privacyIntro, privacySections } from '@/content/privacy'
import { pageSeo } from '@/content/seo'

export const metadata: Metadata = {
  title: pageSeo['/privacy'].title,
  description: pageSeo['/privacy'].description,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="flex max-w-3xl flex-col gap-8">
        <SectionLabel>{`Last updated — ${privacyIntro.updated}`}</SectionLabel>

        <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink">
          {privacyIntro.title}
        </h1>

        <Prose>
          <p>{privacyIntro.body}</p>

          {privacySections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </Prose>
      </Container>
    </section>
  )
}
