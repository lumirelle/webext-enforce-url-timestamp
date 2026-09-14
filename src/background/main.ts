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

// 记录每个标签页最近一次由本扩展写入的 URL，用于打断重定向循环
const selfRewrites = createRewriteGuard()

browser.runtime.onInstalled.addListener((): void => {
  // oxlint-disable-next-line no-console
  console.log('Extension installed')
})

browser.tabs.onRemoved.addListener((tabId) => {
  selfRewrites.forget(tabId)
})

// 主框架导航前：命中域名正则则强制跳转到带最新 `?t=` 时间戳的 URL。
// 刷新（F5）、前进/后退、再次点击链接都会重新经过这里，因此时间戳始终是新的。
browser.webNavigation.onBeforeNavigate.addListener(async ({ tabId, frameId, url }) => {
  if (frameId !== 0)
    return
  // 同步消费守卫：这次导航正是我们上一次 tabs.update 的结果，放行以免死循环。
  // 必须在任何 await 之前消费，避免并发导航时把守卫让给别的 URL。
  if (selfRewrites.consume(tabId, url))
    return
  if (isForbiddenUrl(url))
    return
  // service worker 冷启动时 storage 是异步读取的，必须等配置就绪，
  // 否则首次导航会读到空的 patterns 而被跳过
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
    // 标签页可能已关闭，或该 URL 无法导航；清掉守卫避免误伤下一次导航
    selfRewrites.forget(tabId)
  }
})

// 内容脚本的快捷键触发：切换总开关，返回切换后的状态
onMessage('toggle-enabled', async () => {
  settings.value = { ...settings.value, enabled: !settings.value.enabled }
  return settings.value.enabled
})
