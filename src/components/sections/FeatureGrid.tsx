import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { Feature } from '@/content/types'

export function FeatureGrid({
  features,
  columns = 3,
}: {
  features: readonly Feature[]
  columns?: 2 | 3
}) {
  return (
    <ul
      className={cn(
        'grid gap-4',
        columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {features.map((feature) => (
        <Card as="li" key={feature.title} className="flex flex-col gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            {feature.title}
          </h3>
          <p className="text-sm leading-[1.65] text-muted">{feature.body}</p>
        </Card>
      ))}
    </ul>
  )
}
