import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/', heading: /senior engineers, embedded/i },
  { path: '/talent', heading: /add a senior engineer/i },
  { path: '/software', heading: /hand us the build/i },
  { path: '/about', heading: /a small consultancy/i },
  { path: '/careers', heading: /join the tinwa network/i },
  { path: '/contact', heading: /tell us what you need/i },
  { path: '/privacy', heading: /privacy notice/i },
]

for (const page of PAGES) {
  test(`${page.path} responds 200 and renders exactly one h1`, async ({ page: browserPage }) => {
    const response = await browserPage.goto(page.path)
    expect(response?.status()).toBe(200)

    const headings = browserPage.locator('h1')
    await expect(headings).toHaveCount(1)
    await expect(headings.first()).toHaveText(page.heading)
  })
}

test('an unknown path renders the 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/does not exist/i)
})

test('the experience wall never claims these are clients', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Experience across')).toBeVisible()

  const body = (await page.locator('body').innerText()).toLowerCase()
  expect(body).not.toContain('our clients')
  expect(body).not.toContain('trusted by')
})

test('the skip link moves focus to the main landmark', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: /skip to content/i })
  await expect(skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeVisible()
})

test('primary navigation reaches every page', async ({ page }) => {
  await page.goto('/')

  for (const label of ['Talent', 'Software', 'About', 'Careers', 'Contact']) {
    await page.getByRole('link', { name: label }).first().click()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // Next.js client-side transitions are still settling right after the
    // heading appears; racing a hard `goto` against that in-flight
    // navigation aborts it. Let the router finish before navigating away.
    await page.waitForLoadState('networkidle')
    await page.goto('/')
  }
})
