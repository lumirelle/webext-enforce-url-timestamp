import { expect, test } from './fixtures'

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/popup/index.html`)

  await expect(page.locator('h1')).toHaveText('时印 TimeSeal')
  await expect(page.getByRole('button', { name: '打开设置' })).toBeVisible()
})

test('options page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options/index.html`)

  await expect(page.locator('h1')).toHaveText('时印 TimeSeal')
  await expect(page.getByRole('switch')).toBeVisible()
  await expect(page.getByPlaceholder(/输入新的域名正则/)).toBeVisible()
})
