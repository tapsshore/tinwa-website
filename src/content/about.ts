import type { Feature } from './types'

export const aboutIntro = {
  label: '01 — About',
  title: 'A small consultancy that places serious engineers',
  body: 'TINWA was registered in South Africa in 2019. We work through a vetted network of senior engineers, engaged per project — which is how a small consultancy can put a genuinely experienced person on your problem instead of whoever happens to be on the bench.',
}

export const story: Feature[] = [
  {
    title: 'Why we work this way',
    body: 'A network beats a payroll for the kind of work we take on. Engagements are specific — a Kafka migration, a credit integration, a team that needs one more senior hand for six months — and the right engineer for one is rarely the right engineer for the next.',
  },
  {
    title: 'What you actually get',
    body: 'Engineers who have carried production systems, working inside your process, leaving behind decision records and tests rather than a knowledge gap. We would rather turn down an engagement than staff it badly.',
  },
]

export const founder = {
  name: 'Tapiwanashe Shoshore',
  role: 'Founder and director',
  body: 'Eleven years building and running enterprise systems across digital banking, telecommunications, retail credit and sports betting — from event-driven core banking services on Kotlin and Kafka, to a serverless credit decisioning platform processing tens of thousands of applications a day, to USSD and agricultural services for a national mobile network. Hands-on with architecture and code, and the person who reviews every engineer before they reach a client.',
  credentials: [
    'MSc Information Systems Management, Midlands State University',
    'BSc (Hons) Information Systems, Midlands State University',
    'AWS Certified',
    'Oracle Certified Associate (OCA)',
    'HashiCorp Certified Terraform Associate',
  ],
}
