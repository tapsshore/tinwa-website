import { test, expect } from '@playwright/test'

async function fillEnquiry(page: import('@playwright/test').Page) {
  await page.getByLabel('Name', { exact: true }).fill('Thandi Mokoena')
  await page.getByLabel('Work email').fill('thandi@acmebank.co.za')
  await page.getByLabel('What do you need?').selectOption('hire')
  await page
    .getByLabel('Message')
    .fill('We need a senior Kotlin engineer for a six month engagement starting in October.')
}

test('shows validation errors and does not submit an incomplete enquiry', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: /send enquiry/i }).click()

  await expect(page.getByText('Enter your name')).toBeVisible()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()
})

test('confirms a successful submission', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    await route.fulfill({ status: 200, json: { ok: true } })
  })

  await page.goto('/contact')
  await fillEnquiry(page)
  await page.getByRole('button', { name: /send enquiry/i }).click()

  await expect(page.getByRole('status')).toContainText(/thank you/i)
})

test('shows the email and phone when the submission fails', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    await route.fulfill({ status: 500, json: { ok: false } })
  })

  await page.goto('/contact')
  await fillEnquiry(page)
  await page.getByRole('button', { name: /send enquiry/i }).click()

  // Next.js's own route announcer also carries role="alert", so scope to the
  // form's fallback message rather than matching both.
  const alert = page.getByRole('alert').filter({ hasText: 'Something went wrong' })
  await expect(alert).toContainText('hello@tinwa.co.za')
  await expect(alert).toContainText('+27 73 309 7462')
})

test('the careers form rejects a profile link that is not a URL', async ({ page }) => {
  await page.goto('/careers')

  await page.getByLabel('Name', { exact: true }).fill('Sipho Dlamini')
  await page.getByLabel('Email').fill('sipho@example.com')
  await page.getByLabel(/linkedin or cv/i).fill('my linkedin')
  await page.getByLabel('Primary stack').fill('Java, Spring Boot')
  await page.getByLabel('Years of experience').fill('8')
  await page.getByLabel('Location').fill('Cape Town')
  await page.getByRole('button', { name: /send application/i }).click()

  await expect(page.getByText(/link to your linkedin profile or cv/i)).toBeVisible()
})
