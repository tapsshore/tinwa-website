import type { Cta, Feature } from './types'

export const hero = {
  label: '01 — Software consultancy',
  headlineLead: 'Senior engineers, embedded.',
  headlineTail: 'Software, delivered.',
  sub: 'We place proven senior developers into your team — and build the systems when you would rather hand the whole thing over.',
  primaryCta: { label: 'Hire a developer', href: '/contact' } satisfies Cta,
  secondaryCta: { label: 'Start a project', href: '/software' } satisfies Cta,
}

export const whyPoints: Feature[] = [
  {
    title: 'Senior only',
    body: 'Every engineer we place has shipped production systems for a decade or thereabouts. You are not paying senior rates to train someone.',
  },
  {
    title: 'Regulated and high volume',
    body: 'Digital banking, telecommunications, retail credit decisioning and sports betting — domains where correctness, auditability and throughput are not negotiable.',
  },
  {
    title: 'Standards that survive handover',
    body: 'Architecture decision records, test coverage above ninety percent, CI/CD pipelines and security scanning. What we leave behind is maintainable by your team.',
  },
]

export const pillars = [
  {
    label: 'Talent',
    title: 'Embed a senior developer',
    body: 'A proven engineer joins your squad, your standups and your codebase — under your product owner, on your process.',
    cta: 'Explore talent',
    href: '/talent',
  },
  {
    label: 'Software',
    title: 'Hand us the build',
    body: 'We take a scoped problem end to end: architecture, delivery, assurance and a documented handover.',
    cta: 'Explore delivery',
    href: '/software',
  },
]
