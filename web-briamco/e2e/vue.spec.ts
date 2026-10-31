import { test, expect } from '@playwright/test'

test('navbar opens pages instead of scrolling to homepage sections', async ({ page }) => {
  await page.goto('/')
  const navbar = page.locator('.navbar')
  await expect(navbar).not.toContainText('Testimonials')
  await navbar.locator('a[href="/about"]').first().click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.locator('h1')).toHaveText('About BRIAMCO')
  await expect(page.locator('#home')).toHaveCount(0)
})

test('service dropdown links to a published service page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open services menu', exact: true }).click()
  await page.locator('#desktop-services-menu').getByRole('link', { name: 'Corporate Strategy', exact: true }).click()
  await expect(page).toHaveURL(/\/services\/corporate-strategy$/)
  await expect(page.locator('h1')).toHaveText('Corporate Strategy')
  await expect(page.locator('.rich-content')).toContainText('Understanding your priorities')
})

test('Blog and News have working Read More links and refreshable slug pages', async ({ page }) => {
  for (const type of ['blog', 'news']) {
    await page.goto(`/insight/${type}`)
    const card = page.locator('.blog-card').first()
    const title = await card.locator('.blog-card__title').innerText()
    await card.getByRole('link', { name: 'Read More', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/insight/${type}/[^/]+$`))
    await expect(page.locator('h1')).toHaveText(title)
    await expect(page.locator('.rich-content')).not.toBeEmpty()
    await page.reload()
    await expect(page.locator('h1')).toHaveText(title)
  }
})
