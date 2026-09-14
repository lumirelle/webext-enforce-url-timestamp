import { expect, test } from './fixtures'

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/popup/index.html`)

  await expect(page.locator('h1')).toHaveText('TimeSeal')
  await expect(page.getByRole('button', { name: 'Open Settings' })).toBeVisible()
})

test('options page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options/index.html`)

  await expect(page.locator('h1')).toHaveText('TimeSeal')
  await expect(page.getByRole('switch')).toBeVisible()
  await expect(page.getByPlaceholder(/Enter a new domain regex/)).toBeVisible()
})
