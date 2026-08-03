import { test, expect } from '@playwright/test'

test.use({ colorScheme: 'dark' })

test('the theme toggle switches themes and survives a reload', async ({ page }) => {
  await page.goto('/')

  const html = page.locator('html')
  await expect(html).not.toHaveAttribute('data-theme', 'light')

  await page.getByRole('button', { name: /switch to light theme/i }).click()
  await expect(html).toHaveAttribute('data-theme', 'light')

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'light')
})

test('the stored theme is applied before first paint', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /switch to light theme/i }).click()
  await page.reload()

  // If the attribute were applied after hydration there would be a frame of
  // dark. Reading it immediately after DOMContentLoaded proves the inline
  // script ran first.
  const themeAtLoad = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  expect(themeAtLoad).toBe('light')
})

test.describe('with a light system preference and no stored theme', () => {
  test.use({ colorScheme: 'light' })

  test('a fresh visit lands in light mode', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })
})
