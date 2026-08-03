import { cloneElement, isValidElement } from 'react'

type Props = {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}

export function Field({ id, label, error, hint, children }: Props) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  const control = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        'aria-invalid': error ? 'true' : 'false',
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      })
    : children

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-mono text-muted">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export const inputClasses =
  'w-full border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none'
