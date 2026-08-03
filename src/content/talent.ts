import type { Feature } from './types'

export const engagementModels: Feature[] = [
  {
    title: 'Embedded developer',
    body: 'One senior engineer joins your squad, your standups and your codebase. They report into your product owner and work your process — the simplest way to add capacity without adding headcount.',
  },
  {
    title: 'Team extension',
    body: 'A small pod of engineers takes a workstream off your roadmap while your permanent team stays on core product. Useful when a migration or integration would otherwise stall everything else.',
  },
  {
    title: 'Fractional tech lead',
    body: 'Architecture ownership, decision records and code review from someone who has built the thing before — without committing to a full-time principal engineer.',
  },
]

export const vetting: Feature[] = [
  {
    title: 'Production track record',
    body: 'We place engineers who have run systems in production under real load, not just built them. Every engineer in the network has shipped and operated services that people depended on.',
  },
  {
    title: 'Technical interview by an engineer',
    body: 'Candidates are assessed on architecture and code by someone who works in the same stack, not screened on keywords by a recruiter.',
  },
  {
    title: 'Reference-checked delivery',
    body: 'We verify what someone actually delivered on their last engagement before we put them in front of you.',
  },
]

export const skillGroups = [
  {
    title: 'Backend and languages',
    items: ['Java 8–21', 'Kotlin', 'Spring Boot 2.x / 3.x', 'Python', 'FastAPI', 'REST and SOAP APIs'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Angular', 'Vue.js', 'Tailwind CSS'],
  },
  {
    title: 'Cloud and DevOps',
    items: ['AWS Lambda, API Gateway, EKS, DynamoDB, S3, Step Functions', 'Docker', 'Kubernetes', 'Terraform', 'ArgoCD', 'GitLab CI/CD'],
  },
  {
    title: 'Streaming and data',
    items: ['Apache Kafka', 'Confluent', 'RabbitMQ', 'Protobuf and Avro', 'PostgreSQL', 'Oracle', 'Redis'],
  },
  {
    title: 'Security and compliance',
    items: ['Spring Security', 'Keycloak', 'OAuth2 and JWT', 'RBAC', 'OWASP practice', 'SonarQube and Checkmarx'],
  },
]

export const availability = {
  label: '04 — Availability',
  title: 'South Africa, working across UK and European hours',
  body: 'Our engineers are based in South Africa and routinely deliver for teams in Europe and the UK — a two-hour offset from Central European Time and one from the UK in summer, which means a full overlapping working day rather than a handover window.',
}
