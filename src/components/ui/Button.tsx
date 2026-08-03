import Link from 'next/link'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ghost'

const base =
  'inline-flex items-center justify-center font-display text-sm font-semibold tracking-tight px-5 py-3 transition-colors disabled:opacity-60 disabled:pointer-events-none'

// The accent is a background here and never a text colour, which is what keeps
// the light theme within contrast. `text-bg` resolves to near-black in dark and
// off-white in light, so the ghost variant needs its own explicit colours.
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-[#0b0b0c] hover:opacity-90',
  ghost: 'border border-border text-ink hover:border-ink',
}

type Props = {
  children: React.ReactNode
  href?: string
  variant?: Variant
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  href,
  variant = 'primary',
  type = 'button',
  disabled,
  className,
}: Props) {
  const classes = cn(base, variants[variant], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
