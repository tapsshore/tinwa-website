import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const VALID = {
  RESEND_API_KEY: 're_test_key',
  CONTACT_TO_EMAIL: 'hello@tinwa.co.za',
  NEXT_PUBLIC_SITE_URL: 'https://tinwa.co.za',
}

describe('serverEnv', () => {
  const original = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    process.env = { ...original }
  })

  it('returns the parsed values when all are present', async () => {
    Object.assign(process.env, VALID)
    const { serverEnv } = await import('./env')
    expect(serverEnv().CONTACT_TO_EMAIL).toBe('hello@tinwa.co.za')
  })

  it('names the missing variable in the error', async () => {
    Object.assign(process.env, VALID)
    delete process.env.RESEND_API_KEY
    const { serverEnv } = await import('./env')
    expect(() => serverEnv()).toThrow(/RESEND_API_KEY/)
  })

  it('rejects a malformed contact address', async () => {
    Object.assign(process.env, VALID, { CONTACT_TO_EMAIL: 'not-an-email' })
    const { serverEnv } = await import('./env')
    expect(() => serverEnv()).toThrow(/CONTACT_TO_EMAIL/)
  })

  it('tells the operator where to set the variables', async () => {
    Object.assign(process.env, VALID)
    delete process.env.CONTACT_TO_EMAIL
    const { serverEnv } = await import('./env')
    expect(() => serverEnv()).toThrow(/\.env\.local/)
  })
})
