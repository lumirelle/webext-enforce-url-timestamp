import { onMessage } from 'webext-bridge/background'
import { isForbiddenUrl } from '~/env'
import { appendTimestamp, settings, settingsReady } from '~/logic/storage'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  void import('/@vite/client')
  // load latest content script
  void import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // oxlint-disable-next-line no-console
  console.log('Extension installed')
})

// 主框架导航前：命中域名正则则强制跳转到追加了 ?t={{时间戳}} 的 URL
browser.webNavigation.onBeforeNavigate.addListener(async ({ tabId, frameId, url }) => {
  if (frameId !== 0)
    return
  if (isForbiddenUrl(url))
    return
  // service worker 冷启动时 storage 是异步读取的，必须等配置就绪，
  // 否则首次导航会读到空的 patterns 而被跳过
  await settingsReady
  if (!settings.value.enabled)
    return
  const newUrl = appendTimestamp(url, settings.value.patterns)
  if (newUrl)
    void browser.tabs.update(tabId, { url: newUrl })
})

// 内容脚本的快捷键触发：切换总开关，返回切换后的状态
onMessage('toggle-enabled', async () => {
  settings.value = { ...settings.value, enabled: !settings.value.enabled }
  return settings.value.enabled
})
