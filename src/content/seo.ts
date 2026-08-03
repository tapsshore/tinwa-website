export type PageSeo = { title: string; description: string }

export const pageSeo: Record<string, PageSeo> = {
  '/': {
    title: 'TINWA — Senior engineers, embedded. Software, delivered.',
    description:
      'A South African software consultancy placing proven senior developers into your team, and building the systems when you would rather hand the whole thing over.',
  },
  '/talent': {
    title: 'Hire a senior developer — TINWA',
    description:
      'Embedded developers, team extension and fractional tech leads. Senior engineers with depth in banking, telecoms and high-volume systems.',
  },
  '/software': {
    title: 'Software delivery — TINWA',
    description:
      'Microservices, event-driven systems, cloud and serverless, modern frontends and systems integration for regulated, high-volume platforms.',
  },
  '/about': {
    title: 'About TINWA',
    description:
      'A South African software consultancy registered in 2019, working through a vetted network of senior engineers.',
  },
  '/careers': {
    title: 'Join the TINWA network',
    description:
      'We work with senior engineers on client engagements across South Africa, the UK and Europe. Tell us what you build.',
  },
  '/contact': {
    title: 'Contact TINWA',
    description:
      'Hire a developer or start a project. Reach TINWA by email, phone or the enquiry form.',
  },
  '/privacy': {
    title: 'Privacy notice — TINWA',
    description:
      'How TINWA collects, uses and retains personal information submitted through this website, in line with POPIA.',
  },
}
