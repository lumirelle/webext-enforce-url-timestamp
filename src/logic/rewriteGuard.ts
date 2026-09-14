/**
 * Per-tab guard for "URLs written by this extension" (pure logic, unit-testable).
 *
 * Rewrites happen via `browser.tabs.update()`, which fires
 * `webNavigation.onBeforeNavigate` again. Without interception the same URL would
 * be rewritten over and over, creating a redirect loop. The guard only lets
 * through the case where "the URL about to be navigated to is exactly the one we
 * last wrote"; once consumed, a later user-initiated refresh or navigation to the
 * same URL still gets a fresh timestamp.
 */
export interface RewriteGuard {
  /** Record the URL we just navigated `tabId` to */
  remember: (tabId: number, url: string) => void
  /** Return true and clear the record if `tabId` is about to navigate to our written URL */
  consume: (tabId: number, url: string) => boolean
  /** Clear a tab's record (called when the tab closes) */
  forget: (tabId: number) => void
}

export function createRewriteGuard(): RewriteGuard {
  const pending = new Map<number, string>()
  return {
    remember(tabId, url) {
      pending.set(tabId, url)
    },
    consume(tabId, url) {
      if (pending.get(tabId) !== url)
        return false
      pending.delete(tabId)
      return true
    },
    forget(tabId) {
      pending.delete(tabId)
    },
  }
}
