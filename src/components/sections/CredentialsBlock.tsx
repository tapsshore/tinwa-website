import { company, formatAddress } from '@/content/company'
import { formatDate } from '@/lib/formatDate'

export function CredentialsBlock() {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Legal name', value: company.legalName },
    { label: 'Registration number', value: company.registrationNumber },
    { label: 'Tax number', value: company.taxNumber },
    { label: 'Enterprise type', value: company.enterpriseType },
    { label: 'Registered', value: formatDate(company.registrationDate) },
    { label: 'Director', value: company.director },
    {
      label: 'B-BBEE',
      value: `${company.bbbee.status}, Level ${company.bbbee.level} contributor — ${company.bbbee.recognition} procurement recognition, valid to ${formatDate(company.bbbee.validUntil)}`,
    },
    {
      label: 'Address',
      value: (
        <address className="not-italic">
          {formatAddress().map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ),
    },
  ]

  return (
    <dl className="grid gap-px border border-border bg-border sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-2 bg-surface p-5">
          <dt className="label-mono text-muted">{row.label}</dt>
          <dd className="text-sm leading-relaxed text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
