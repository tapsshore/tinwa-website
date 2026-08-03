import { company } from '@/content/company'

/**
 * ProfessionalService JSON-LD. This is what makes a search for "TINWA" surface
 * the right company with the right registration number and contact details.
 */
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.legalName,
    alternateName: company.shortName,
    description: company.tagline,
    url: company.siteUrl,
    telephone: company.phone,
    email: company.email,
    foundingDate: company.registrationDate,
    identifier: company.registrationNumber,
    taxID: company.taxNumber,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${company.address.line1}, ${company.address.line2}`,
      addressLocality: company.address.city,
      addressRegion: company.address.province,
      postalCode: company.address.postalCode,
      addressCountry: 'ZA',
    },
    founder: { '@type': 'Person', name: company.director },
    areaServed: ['South Africa', 'United Kingdom', 'European Union'],
    knowsAbout: [
      'Software development',
      'Software consulting',
      'Java',
      'Kotlin',
      'Spring Boot',
      'React',
      'Apache Kafka',
      'Amazon Web Services',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
