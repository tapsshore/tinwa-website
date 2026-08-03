import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { cn } from '@/lib/cn'

export function Section({
  label,
  title,
  intro,
  className,
  children,
}: {
  label?: string
  title?: string
  intro?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section className={cn('py-16 sm:py-24', className)}>
      <Container className="flex flex-col gap-8">
        {label || title || intro ? (
          <div className="flex max-w-3xl flex-col gap-4">
            {label ? <SectionLabel>{label}</SectionLabel> : null}
            {title ? (
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {intro ? <p className="text-base leading-[1.65] text-muted">{intro}</p> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  )
}
