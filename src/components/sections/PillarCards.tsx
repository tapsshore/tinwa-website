import Link from 'next/link'
import { Card } from '@/components/ui/Card'

type Pillar = {
  label: string
  title: string
  body: string
  cta: string
  href: string
}

export function PillarCards({ pillars }: { pillars: readonly Pillar[] }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {pillars.map((pillar, index) => (
        <Card as="li" key={pillar.href} className="flex flex-col gap-4">
          <span
            className={
              index === 0
                ? 'label-mono w-fit bg-accent px-1.5 py-0.5 text-[#0b0b0c]'
                : 'label-mono w-fit text-muted'
            }
          >
            {pillar.label}
          </span>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {pillar.title}
          </h3>
          <p className="text-sm leading-[1.65] text-muted">{pillar.body}</p>
          <Link href={pillar.href} className="label-mono mt-2 text-ink hover:underline">
            {pillar.cta} →
          </Link>
        </Card>
      ))}
    </ul>
  )
}
