import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CareersForm } from './CareersForm'
import { company } from '@/content/company'

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
}

async function fillValidApplication(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name$/i), 'Sipho Dlamini')
  await user.type(screen.getByLabelText(/email/i), 'sipho@example.com')
  await user.type(screen.getByLabelText(/linkedin or cv/i), 'https://www.linkedin.com/in/sipho')
  await user.type(screen.getByLabelText(/primary stack/i), 'Java, Spring Boot, Kafka')
  await user.type(screen.getByLabelText(/years/i), '8')
  await user.type(screen.getByLabelText(/location/i), 'Cape Town, South Africa')
}

describe('CareersForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts the application to the careers endpoint', async () => {
    const fetchMock = mockFetch(200, { ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    expect(fetchMock.mock.calls[0][0]).toBe('/api/careers')
  })

  it('rejects a profile link that is not a URL before hitting the network', async () => {
    const fetchMock = mockFetch(200, { ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.clear(screen.getByLabelText(/linkedin or cv/i))
    await user.type(screen.getByLabelText(/linkedin or cv/i), 'my linkedin')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText(/link to your linkedin profile or cv/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows a confirmation after a successful application', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { ok: true }))

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i)
  })

  it('shows the contact details when the request fails', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { ok: false }))

    const user = userEvent.setup()
    render(<CareersForm />)
    await fillValidApplication(user)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(company.email)
  })
})
