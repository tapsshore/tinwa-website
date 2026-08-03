import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import {
  experienceEntries,
  EXPERIENCE_HEADING,
  EXPERIENCE_FOOTNOTE,
} from '@/content/experience'
import { logoManifest } from '@/content/logoManifest'

export function LogoWall() {
  return (
    <section className="border-y border-border py-16">
      <Container className="flex flex-col gap-8">
        <SectionLabel>{EXPERIENCE_HEADING}</SectionLabel>

        <ul className="flex flex-wrap items-center gap-3">
          {experienceEntries.map((entry) => {
            const asset = logoManifest[entry.slug]

            return (
              <li
                key={entry.slug}
                className="flex h-12 items-center border border-border bg-surface px-4"
              >
                {asset ? (
                  <Image
                    src={asset.src}
                    alt={entry.name}
                    width={asset.width}
                    height={asset.height}
                    unoptimized
                    className="h-6 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="font-display text-sm text-muted">{entry.name}</span>
                )}
              </li>
            )
          })}
        </ul>

        <p className="max-w-2xl text-xs leading-relaxed text-muted">{EXPERIENCE_FOOTNOTE}</p>
      </Container>
    </section>
  )
}
