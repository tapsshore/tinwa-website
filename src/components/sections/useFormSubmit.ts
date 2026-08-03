'use client'

import { useRef, useState } from 'react'
import { HONEYPOT_FIELD } from '@/lib/schemas'

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<SubmitState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const mountedAt = useRef(Date.now())

  async function submit(values: Record<string, unknown>): Promise<void> {
    setState('submitting')
    setErrors({})

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })

      if (response.status === 400) {
        const body = (await response.json()) as { errors?: unknown }
        const errors =
          typeof body.errors === 'object' && body.errors !== null
            ? (body.errors as Record<string, string>)
            : {}

        // A 400 is only actionable for the visitor if it names fields they can
        // fix. Anything else — rate limiting, an unexpected body shape, a bug —
        // must surface the fallback rather than resolve to a silent no-op.
        if (Object.keys(errors).length === 0) {
          setState('error')
          return
        }

        setErrors(errors)
        setState('idle')
        return
      }

      if (!response.ok) {
        setState('error')
        return
      }

      setState('success')
    } catch {
      // Network failure, offline, or a blocked request — same outcome for the
      // visitor, so it gets the same fallback.
      setState('error')
    }
  }

  return { state, errors, submit, honeypotName: HONEYPOT_FIELD }
}
