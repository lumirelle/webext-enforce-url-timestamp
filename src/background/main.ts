import { onMessage } from 'webext-bridge/background'
import { isForbiddenUrl } from '~/env'
import { createRewriteGuard } from '~/logic/rewriteGuard'
import { appendTimestamp, settings, settingsReady } from '~/logic/storage'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  void import('/@vite/client')
  // load latest content script
  void import('./contentScriptHMR')
}

// Track the last URL this extension wrote for each tab, to break redirect loops
const selfRewrites = createRewriteGuard()

browser.runtime.onInstalled.addListener((): void => {
  // oxlint-disable-next-line no-console
  console.log('Extension installed')
})

browser.tabs.onRemoved.addListener((tabId) => {
  selfRewrites.forget(tabId)
})

// Before a main-frame navigation: if the domain matches a regex, force a jump to
// the URL carrying the freshest `?t=` timestamp. Refresh (F5), back/forward and
// clicking a link again all pass through here, so the timestamp is always new.
browser.webNavigation.onBeforeNavigate.addListener(async ({ tabId, frameId, url }) => {
  if (frameId !== 0)
    return
  // Consume the guard synchronously: this navigation is the result of our own
  // previous tabs.update, so let it through to avoid an infinite loop. It must be
  // consumed before any await so concurrent navigations can't steal the guard.
  if (selfRewrites.consume(tabId, url))
    return
  if (isForbiddenUrl(url))
    return
  // On a cold service-worker start storage is read asynchronously, so wait until
  // the config is ready, otherwise the first navigation sees empty patterns and
  // is skipped
  await settingsReady
  if (!settings.value.enabled)
    return
  const newUrl = appendTimestamp(url, settings.value.patterns)
  if (!newUrl)
    return
  selfRewrites.remember(tabId, newUrl)
  try {
    await browser.tabs.update(tabId, { url: newUrl })
  }
  catch {
    // The tab may be closed, or the URL can't be navigated; drop the guard so it
    // doesn't affect the next navigation
    selfRewrites.forget(tabId)
  }
})

// Shortcut trigger from the content script: toggle the master switch, return the new state
onMessage('toggle-enabled', async () => {
  settings.value = { ...settings.value, enabled: !settings.value.enabled }
  return settings.value.enabled
})
