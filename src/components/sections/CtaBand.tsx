import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import type { Cta } from '@/content/types'

export function CtaBand({
  label,
  title,
  body,
  primaryCta,
  secondaryCta,
}: {
  label: string
  title: string
  body: string
  primaryCta: Cta
  secondaryCta: Cta
}) {
  return (
    <section className="border-t border-border py-20">
      <Container className="flex max-w-3xl flex-col gap-6">
        <SectionLabel>{label}</SectionLabel>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-[1.65] text-muted">{body}</p>
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
