'use client'

import { useState } from 'react'
import { Field, inputClasses } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useFormSubmit } from './useFormSubmit'
import { FormFallback } from './FormFallback'
import { contactSchema, fieldErrorsFrom } from '@/lib/schemas'

const ENQUIRY_OPTIONS = [
  { value: 'hire', label: 'Hire a developer' },
  { value: 'project', label: 'Start a project' },
  { value: 'other', label: 'Other' },
]

export function ContactForm() {
  const { state, errors, submit, honeypotName } = useFormSubmit('/api/contact')
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  const shown = { ...clientErrors, ...errors }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const values = {
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? '') || undefined,
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? '') || undefined,
      enquiryType: String(data.get('enquiryType') ?? ''),
      message: String(data.get('message') ?? ''),
    }

    // Validate with the same schema the server uses, so the visitor sees
    // problems before a round trip.
    const parsed = contactSchema.safeParse(values)
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
        <p className="font-display text-lg font-semibold text-ink">Thank you — message received.</p>
        <p className="mt-2 text-sm text-muted">
          We read every enquiry ourselves and come back within one working day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field id="name" label="Name" error={shown.name}>
        <input id="name" name="name" autoComplete="name" className={inputClasses} />
      </Field>

      <Field id="company" label="Company (optional)" error={shown.company}>
        <input id="company" name="company" autoComplete="organization" className={inputClasses} />
      </Field>

      <Field id="email" label="Work email" error={shown.email}>
        <input id="email" name="email" type="email" autoComplete="email" className={inputClasses} />
      </Field>

      <Field id="phone" label="Phone (optional)" error={shown.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
      </Field>

      <Field id="enquiryType" label="What do you need?" error={shown.enquiryType}>
        <select id="enquiryType" name="enquiryType" defaultValue="hire" className={inputClasses}>
          {ENQUIRY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message" error={shown.message}>
        <textarea id="message" name="message" rows={6} className={inputClasses} />
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
          {state === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  )
}
