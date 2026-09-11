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
 * 若 URL 命中任一域名正则且尚未带 t 参数，返回追加了 ?t={{当前时间戳}} 的新 URL；
 * 否则返回 null（不需要改写）。
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
  // 已带 t 参数则跳过，避免重定向循环
  if (u.searchParams.has('t'))
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
  u.searchParams.set('t', String(now))
  return u.toString()
}
