/**
 * 「由本扩展写入的 URL」的每标签页守卫（纯逻辑，可单测）。
 *
 * 改写靠 `browser.tabs.update()` 完成，而它会再次触发
 * `webNavigation.onBeforeNavigate`。若不拦截，同一个 URL 会被反复改写，
 * 形成重定向死循环。守卫只放行「即将导航的 URL 恰好等于我们上一次写入的
 * URL」这一种情况；一旦被消费，用户后续主动刷新或再次导航到同一个 URL
 * 时仍会写入新的时间戳。
 */
export interface RewriteGuard {
  /** 记录我们刚刚让 `tabId` 导航到的 URL */
  remember: (tabId: number, url: string) => void
  /** 若 `tabId` 即将导航的正是我们写入的 URL，返回 true 并清除记录 */
  consume: (tabId: number, url: string) => boolean
  /** 清除某个标签页的记录（标签关闭时调用） */
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
