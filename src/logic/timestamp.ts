/** URL 时间戳改写的纯逻辑（无浏览器 API 依赖，可单测） */

/** 校验正则是否合法 */
export function isValidRegex(pattern: string): boolean {
  try {
    void new RegExp(pattern)
    return true
  }
  catch {
    return false
  }
}

/**
 * 若 URL 命中任一域名正则，返回把 `t` 参数重置为 `now` 的新 URL；
 * 未命中、协议不支持或 URL 非法时返回 null（不需要改写）。
 *
 * 注意：这里**不会**因为「已带 t 参数」而跳过——刷新、前进/后退、再次点击链接时
 * 必须写入新的时间戳，否则会命中上一次导航留下的缓存。防重定向循环由调用方
 * （background 的 per-tab 守卫）负责，而不是靠不碰已带参的 URL。
 */
export function appendTimestamp(url: string, patterns: string[], now: number = Date.now()): string | null {
  let u: URL
  try {
    u = new URL(url)
  }
  catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:')
    return null
  const hit = patterns.some((p) => {
    try {
      const re = new RegExp(p)
      return re.test(u.hostname)
    }
    catch {
      return false
    }
  })
  if (!hit)
    return null
  // 覆盖旧值，保证每次导航都是新的缓存键
  u.searchParams.set('t', String(now))
  return u.toString()
}
