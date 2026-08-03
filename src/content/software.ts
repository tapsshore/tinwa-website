import type { Feature } from './types'

export const capabilities: Feature[] = [
  {
    title: 'Platform and microservices',
    body: 'Java and Kotlin services on Spring Boot, designed around clear domain boundaries so teams can deploy independently instead of coordinating releases.',
  },
  {
    title: 'Event-driven systems',
    body: 'Apache Kafka for real-time processing, inter-service communication and audit logging — with schema management and monitoring, not just a topic and hope.',
  },
  {
    title: 'Cloud and serverless',
    body: 'AWS Lambda, API Gateway, Step Functions, DynamoDB and EKS, provisioned as infrastructure as code so environments are reproducible.',
  },
  {
    title: 'Modern frontends',
    body: 'React, Next.js and Angular applications with real state management, accessibility and test coverage — built against API contracts agreed up front.',
  },
  {
    title: 'Systems integration',
    body: 'Connecting core banking, ERP, credit bureau and payment systems, including the protocol translation and reconciliation work that integration projects actually consist of.',
  },
  {
    title: 'Security and compliance',
    body: 'OAuth2, Keycloak, role-based access control and static analysis wired into the pipeline, so a security finding blocks a merge rather than surfacing in an audit.',
  },
]

export const domains: string[] = [
  'Digital banking',
  'Telecommunications',
  'Retail credit decisioning',
  'Sports betting and gaming',
]

/**
 * Anonymised on purpose. Metrics are real; no client is named, so nothing here
 * brushes an NDA. Tests assert that no client name appears in this data.
 */
export const snapshots = [
  {
    metric: '20,000+ applications a day',
    title: 'Credit decisioning at retail scale',
    body: 'A customer onboarding and credit decisioning platform serving a large retail footprint across southern Africa, integrating multiple credit bureaux and a machine-learning decisioning engine on a serverless architecture.',
  },
  {
    metric: 'Millions of subscribers',
    title: 'Telecoms transaction processing',
    body: 'Event-driven services handling high-concurrency subscriber transactions for a mobile network operator, built on Spring Boot and Kafka for throughput across a distributed estate.',
  },
  {
    metric: 'Zero-downtime releases',
    title: 'Regulated document platform',
    body: 'A document management system with qualified digital signing and regulated retention, migrated from Spring Boot 2 to 3 and deployed continuously on Kubernetes with GitOps.',
  },
]
