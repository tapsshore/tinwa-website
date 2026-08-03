'use client'

import { useState } from 'react'
import { Field, inputClasses } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useFormSubmit } from './useFormSubmit'
import { FormFallback } from './FormFallback'
import { careersSchema, fieldErrorsFrom } from '@/lib/schemas'

export function CareersForm() {
  const { state, errors, submit, honeypotName } = useFormSubmit('/api/careers')
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  const shown = { ...clientErrors, ...errors }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      profileUrl: String(data.get('profileUrl') ?? ''),
      primaryStack: String(data.get('primaryStack') ?? ''),
      years: String(data.get('years') ?? ''),
      location: String(data.get('location') ?? ''),
    }

    // Validate with the same schema the server uses, so the applicant sees
    // problems before a round trip.
    const parsed = careersSchema.safeParse(values)
    if (!parsed.success) {
      setClientErrors(fieldErrorsFrom(parsed.error))
      return
    }

    setClientErrors({})
    await submit({ ...parsed.data, [honeypotName]: String(data.get(honeypotName) ?? '') })
  }

  if (state === 'success') {
    return (
      <div role="status" className="border border-border bg-surface p-6">
        <p className="font-display text-lg font-semibold text-ink">Thank you — application received.</p>
        <p className="mt-2 text-sm text-muted">
          We review every application ourselves. If there is a fit we will be in touch about current
          and upcoming engagements.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field id="name" label="Name" error={shown.name}>
        <input id="name" name="name" autoComplete="name" className={inputClasses} />
      </Field>

      <Field id="email" label="Email" error={shown.email}>
        <input id="email" name="email" type="email" autoComplete="email" className={inputClasses} />
      </Field>

      <Field
        id="profileUrl"
        label="LinkedIn or CV link"
        hint="A public link works best — LinkedIn, a personal site, or a CV in cloud storage. We do not accept file uploads."
        error={shown.profileUrl}
      >
        <input
          id="profileUrl"
          name="profileUrl"
          type="url"
          inputMode="url"
          placeholder="https://"
          className={inputClasses}
        />
      </Field>

      <Field id="primaryStack" label="Primary stack" error={shown.primaryStack}>
        <input
          id="primaryStack"
          name="primaryStack"
          placeholder="Java, Spring Boot, Kafka"
          className={inputClasses}
        />
      </Field>

      <Field id="years" label="Years of experience" error={shown.years}>
        <input id="years" name="years" type="number" min={0} max={60} className={inputClasses} />
      </Field>

      <Field id="location" label="Location" error={shown.location}>
        <input
          id="location"
          name="location"
          autoComplete="address-level2"
          className={inputClasses}
        />
      </Field>

      {/* Honeypot: hidden from sight, from the tab order and from assistive
          technology. A human never fills it; a naive bot fills everything. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={honeypotName}>Company website</label>
        <input
          id={honeypotName}
          name={honeypotName}
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
        />
      </div>

      {state === 'error' ? <FormFallback /> : null}

      <div>
        <Button type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Sending…' : 'Send application'}
        </Button>
      </div>
    </form>
  )
}
