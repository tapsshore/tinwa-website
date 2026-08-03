import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import type { Cta } from '@/content/types'

export function Hero({
  label,
  headlineLead,
  headlineTail,
  sub,
  primaryCta,
  secondaryCta,
}: {
  label: string
  headlineLead: string
  headlineTail: string
  sub: string
  primaryCta: Cta
  secondaryCta: Cta
}) {
  return (
    <section className="py-20 sm:py-32">
      <Container className="flex max-w-4xl flex-col gap-7">
        <SectionLabel>{label}</SectionLabel>

        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
          {headlineLead}{' '}
          <span aria-hidden="true" className="text-muted">
            \
          </span>{' '}
          {headlineTail}
        </h1>

        <p className="max-w-2xl text-lg leading-[1.6] text-muted">{sub}</p>

        <div className="flex flex-wrap gap-3">
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          <Button href={secondaryCta.href} variant="ghost">
            {secondaryCta.label}
          </Button>
        </div>
      </Container>
    </section>
  )
}
