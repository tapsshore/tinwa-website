import { describe, it, expect } from 'vitest'
import {
  contactSchema,
  careersSchema,
  isLikelySpam,
  fieldErrorsFrom,
  HONEYPOT_FIELD,
  MIN_SUBMIT_MS,
} from './schemas'

const validContact = {
  name: 'Thandi Mokoena',
  company: 'Acme Bank',
  email: 'thandi@acmebank.co.za',
  phone: '+27 11 555 0100',
  enquiryType: 'hire' as const,
  message: 'We need a senior Kotlin engineer for a six month engagement starting in October.',
}

const validCareers = {
  name: 'Sipho Dlamini',
  email: 'sipho@example.com',
  profileUrl: 'https://www.linkedin.com/in/sipho',
  primaryStack: 'Java, Spring Boot, Kafka',
  years: 8,
  location: 'Cape Town, South Africa',
}

describe('contactSchema', () => {
  it('accepts a complete valid enquiry', () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true)
  })

  it('accepts an enquiry with the optional fields omitted', () => {
    const { company: _c, phone: _p, ...rest } = validContact
    expect(contactSchema.safeParse(rest).success).toBe(true)
  })

  it('rejects a name that is too short', () => {
    const result = contactSchema.safeParse({ ...validContact, name: 'T' })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed email address', () => {
    const result = contactSchema.safeParse({ ...validContact, email: 'thandi@' })
    expect(result.success).toBe(false)
  })

  it('rejects a message that is too short to act on', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'call me' })
    expect(result.success).toBe(false)
  })

  it('rejects a message beyond the length limit', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'a'.repeat(4001) })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown enquiry type', () => {
    const result = contactSchema.safeParse({ ...validContact, enquiryType: 'partnership' })
    expect(result.success).toBe(false)
  })
})

describe('careersSchema', () => {
  it('accepts a complete valid application', () => {
    expect(careersSchema.safeParse(validCareers).success).toBe(true)
  })

  it('rejects a profile link that is not a URL', () => {
    const result = careersSchema.safeParse({ ...validCareers, profileUrl: 'my linkedin' })
    expect(result.success).toBe(false)
  })

  it('coerces a numeric string for years', () => {
    const result = careersSchema.safeParse({ ...validCareers, years: '8' })
    expect(result.success).toBe(true)
  })

  it('rejects an implausible number of years', () => {
    expect(careersSchema.safeParse({ ...validCareers, years: 80 }).success).toBe(false)
    expect(careersSchema.safeParse({ ...validCareers, years: -1 }).success).toBe(false)
  })
})

describe('isLikelySpam', () => {
  it('flags a filled honeypot', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: 'http://spam.example', elapsedMs: 9000 })).toBe(true)
  })

  it('flags a submission faster than a human can type', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: '', elapsedMs: MIN_SUBMIT_MS - 1 })).toBe(true)
  })

  it('flags a payload with no timing information at all', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: '' })).toBe(true)
  })

  it('passes a genuine submission', () => {
    expect(isLikelySpam({ [HONEYPOT_FIELD]: '', elapsedMs: 12000 })).toBe(false)
  })
})

describe('fieldErrorsFrom', () => {
  it('returns one message per invalid field', () => {
    const result = contactSchema.safeParse({ ...validContact, email: 'nope', name: '' })
    expect(result.success).toBe(false)
    if (result.success) return

    const errors = fieldErrorsFrom(result.error)
    expect(errors.email).toBeTruthy()
    expect(errors.name).toBeTruthy()
    expect(errors.message).toBeUndefined()
  })
})
