/**
 * @see {@link https://playwright.dev/docs/chrome-extensions Chrome extensions | Playwright}
 */
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  retries: 2,
  webServer: {
    command: 'mise run dev chromium',
    // start e2e test after the Vite server is fully prepared
    url: 'http://localhost:3303/popup/main.ts',
    reuseExistingServer: true,
    // `mise run dev` spawns Vite watchers; without this, teardown hangs on the
    // still-open stdio pipes after the tests finish.
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
})
