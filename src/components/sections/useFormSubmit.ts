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
        const body = (await response.json()) as { errors?: Record<string, string> }
        setErrors(body.errors ?? {})
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
