import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="py-28">
      <Container className="flex max-w-2xl flex-col gap-6">
        <SectionLabel>404 — Not found</SectionLabel>
        <h1 className="font-display text-4xl font-bold tracking-[-0.03em] text-ink">
          That page does not exist
        </h1>
        <p className="text-base leading-[1.65] text-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="ghost">
            Contact us
          </Button>
        </div>
      </Container>
    </section>
  )
}
