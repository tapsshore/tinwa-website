import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'
import { company } from '@/content/company'

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
}

async function fillValidEnquiry(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name$/i), 'Thandi Mokoena')
  await user.type(screen.getByLabelText(/work email/i), 'thandi@acmebank.co.za')
  await user.selectOptions(screen.getByLabelText(/what do you need/i), 'hire')
  await user.type(
    screen.getByLabelText(/message/i),
    'We need a senior Kotlin engineer for a six month engagement.',
  )
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('submits the form values as JSON', async () => {
    const fetchMock = mockFetch(200, { ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/contact')
    const sent = JSON.parse((init as RequestInit).body as string)
    expect(sent.name).toBe('Thandi Mokoena')
    expect(sent.enquiryType).toBe('hire')
    expect(typeof sent.elapsedMs).toBe('number')
  })

  it('shows a confirmation after a successful submission', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { ok: true }))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i)
  })

  it('renders server-side field errors against their fields', async () => {
    vi.stubGlobal('fetch', mockFetch(400, { ok: false, errors: { email: 'Enter a valid email address' } }))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('shows the contact details when the request fails', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { ok: false }))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(company.email)
    expect(alert).toHaveTextContent(company.phone)
  })

  it('shows the contact details when the network throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidEnquiry(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(company.email)
  })

  it('keeps the honeypot out of the accessibility tree', () => {
    render(<ContactForm />)
    const honeypot = document.querySelector('input[name="company_website"]')
    expect(honeypot).not.toBeNull()
    expect(honeypot).toHaveAttribute('tabindex', '-1')
    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
  })
})
