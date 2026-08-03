import { cn } from '@/lib/cn'

const SEPARATOR = ' — '

/**
 * Renders labels of the form "01 — Software consultancy".
 *
 * The leading number becomes a lime chip with near-black text. This is
 * deliberate: the accent must never be used as a text colour, because lime on
 * the light theme's paper background fails contrast.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const index = children.indexOf(SEPARATOR)
  const hasNumber = index > -1
  const number = hasNumber ? children.slice(0, index) : null
  const text = hasNumber ? children.slice(index + SEPARATOR.length) : children

  return (
    <p className={cn('label-mono flex items-center gap-2 text-muted', className)}>
      {number ? <span className="bg-accent px-1.5 py-0.5 text-[#0b0b0c]">{number}</span> : null}
      <span>{text}</span>
    </p>
  )
}
