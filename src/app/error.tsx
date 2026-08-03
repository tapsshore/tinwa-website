'use client'

import { useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import { company } from '@/content/company'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[app] unhandled error', error)
  }, [error])

  return (
    <section className="py-28">
      <Container className="flex max-w-2xl flex-col gap-6">
        <SectionLabel>Error — Something went wrong</SectionLabel>
        <h1 className="font-display text-4xl font-bold tracking-[-0.03em] text-ink">
          Something went wrong on our side
        </h1>
        <p className="text-base leading-[1.65] text-muted">
          Try again, or reach us directly at{' '}
          <a href={company.emailHref} className="text-ink underline">
            {company.email}
          </a>{' '}
          or{' '}
          <a href={company.phoneHref} className="text-ink underline">
            {company.phone}
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-accent px-5 py-3 font-display text-sm font-semibold tracking-tight text-[#0b0b0c] hover:opacity-90"
          >
            Try again
          </button>
          <Button href="/" variant="ghost">
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  )
}
