import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMail = vi.fn()

vi.mock('@/lib/resend', () => ({
  sendMail: (...args: unknown[]) => sendMail(...args),
  formatCareersEmail: (input: unknown) => ({
    subject: 'test',
    replyTo: 'test@example.com',
    text: JSON.stringify(input),
  }),
}))

import { POST } from './route'

const validBody = {
  name: 'Sipho Dlamini',
  email: 'sipho@example.com',
  profileUrl: 'https://www.linkedin.com/in/sipho',
  primaryStack: 'Java, Spring Boot, Kafka',
  years: 8,
  location: 'Cape Town, South Africa',
  company_website: '',
  elapsedMs: 12000,
}

function request(body: unknown): Request {
  return new Request('http://localhost/api/careers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/careers', () => {
  beforeEach(() => {
    sendMail.mockReset()
    sendMail.mockResolvedValue(undefined)
  })

  it('sends the mail and returns ok for a valid application', async () => {
    const response = await POST(request(validBody))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMail).toHaveBeenCalledOnce()
  })

  it('returns field errors for a malformed profile link', async () => {
    const response = await POST(request({ ...validBody, profileUrl: 'my linkedin' }))
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.errors.profileUrl).toBeTruthy()
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('silently accepts a filled honeypot without sending', async () => {
    const response = await POST(request({ ...validBody, company_website: 'http://spam.example' }))
    expect(response.status).toBe(200)
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('returns 500 when the mail layer throws', async () => {
    sendMail.mockRejectedValue(new Error('Resend is down'))
    const response = await POST(request(validBody))
    expect(response.status).toBe(500)
  })

  it('returns 400 for a body that is not JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/careers', { method: 'POST', body: 'not json' }),
    )
    expect(response.status).toBe(400)
  })
})
