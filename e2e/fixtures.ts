import type { BrowserContext } from '@playwright/test'
import type { Manifest } from 'webextension-polyfill'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { test as base, chromium } from '@playwright/test'
import fs from 'fs-extra'

const rootDir = path.join(import.meta.dirname, '..')

export const name = fs.readJsonSync(path.join(rootDir, 'package.json')).name as string
export const extensionPath = path.join(rootDir, 'extension')

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  context: async ({ headless }, use) => {
    // workaround for the Vite server has started but contentScript is not yet.
    await sleep(1000)
    const context = await chromium.launchPersistentContext('', {
      // the default headless shell does not support extensions; the
      // `chromium` channel runs new headless, which does.
      channel: 'chromium',
      headless,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    // for manifest v3:
    let [background] = context.serviceWorkers()
    if (!background)
      background = await context.waitForEvent('serviceworker')

    const extensionId = new URL(background.url()).host
    await use(extensionId)
  },
})

export const expect = test.expect

export function isDevArtifact() {
  const manifest: Manifest.WebExtensionManifest = fs.readJsonSync(path.resolve(extensionPath, 'manifest.json'))
  return Boolean(
    typeof manifest.content_security_policy === 'object'
    && manifest.content_security_policy.extension_pages?.includes('localhost'),
  )
}
