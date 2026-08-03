import { cn } from '@/lib/cn'

export function Card({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: 'div' | 'li' | 'article'
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag className={cn('border border-border bg-surface p-6 sm:p-8', className)}>{children}</Tag>
  )
}
