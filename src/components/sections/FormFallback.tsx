import { company } from '@/content/company'

/**
 * Shown whenever a submission fails for any reason other than validation.
 * A visitor who reaches this must still be able to reach TINWA, so the address
 * and number are rendered here as live links rather than referred to in prose.
 */
export function FormFallback() {
  return (
    <div role="alert" className="border border-border bg-surface p-5 text-sm leading-relaxed">
      <p className="text-ink">Something went wrong sending your message.</p>
      <p className="mt-2 text-muted">
        Please email{' '}
        <a href={company.emailHref} className="text-ink underline">
          {company.email}
        </a>{' '}
        or call{' '}
        <a href={company.phoneHref} className="text-ink underline">
          {company.phone}
        </a>{' '}
        — we will come back to you either way.
      </p>
    </div>
  )
}
