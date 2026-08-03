import { ImageResponse } from 'next/og'
import { company } from '@/content/company'

export const alt = `${company.shortName} — ${company.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0b0c',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 28, height: 28, background: '#c9f24d' }} />
          <div style={{ fontSize: 34, letterSpacing: 12, color: '#edede9', fontWeight: 700 }}>
            {company.shortName}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 76,
            lineHeight: 1.1,
            color: '#edede9',
            fontWeight: 700,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {company.tagline}
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#9a9aa1' }}>{company.domain}</div>
      </div>
    ),
    size,
  )
}
