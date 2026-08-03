import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMail = vi.fn()

vi.mock('@/lib/resend', () => ({
  sendMail: (...args: unknown[]) => sendMail(...args),
  formatContactEmail: (input: unknown) => ({
    subject: 'test',
    replyTo: 'test@example.com',
    text: JSON.stringify(input),
  }),
}))

import { POST } from './route'

const validBody = {
  name: 'Thandi Mokoena',
  company: 'Acme Bank',
  email: 'thandi@acmebank.co.za',
  phone: '+27 11 555 0100',
  enquiryType: 'hire',
  message: 'We need a senior Kotlin engineer for a six month engagement starting in October.',
  company_website: '',
  elapsedMs: 12000,
}

function request(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMail.mockReset()
    sendMail.mockResolvedValue(undefined)
  })

  it('sends the mail and returns ok for a valid submission', async () => {
    const response = await POST(request(validBody))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMail).toHaveBeenCalledOnce()
  })

  it('returns field errors and does not send for an invalid submission', async () => {
    const response = await POST(request({ ...validBody, email: 'nope', message: 'hi' }))
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.ok).toBe(false)
    expect(body.errors.email).toBeTruthy()
    expect(body.errors.message).toBeTruthy()
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('silently accepts a filled honeypot without sending', async () => {
    const response = await POST(request({ ...validBody, company_website: 'http://spam.example' }))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('silently accepts a too-fast submission without sending', async () => {
    const response = await POST(request({ ...validBody, elapsedMs: 100 }))
    expect(response.status).toBe(200)
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('returns 500 when the mail layer throws', async () => {
    sendMail.mockRejectedValue(new Error('Resend is down'))
    const response = await POST(request(validBody))
    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ ok: false })
  })

  it('returns 400 for a body that is not JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/contact', { method: 'POST', body: 'not json' }),
    )
    expect(response.status).toBe(400)
  })
})
