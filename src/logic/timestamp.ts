/** Pure logic for URL timestamp rewriting (no browser API dependency, unit-testable) */

/** Validate whether a regex is legal */
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
 * If the URL matches any domain regex, return a new URL with the `t` parameter
 * reset to `now`; return null (no rewrite needed) when nothing matches, the
 * protocol is unsupported, or the URL is invalid.
 *
 * Note: this does **not** skip URLs that already carry a `t` parameter -- refresh,
 * back/forward and clicking a link again must write a new timestamp, otherwise the
 * cache left by the previous navigation would be hit. Avoiding redirect loops is
 * the caller's job (the per-tab guard in background), not a matter of leaving
 * already-parameterized URLs alone.
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
  // Overwrite the old value so every navigation gets a fresh cache key
  u.searchParams.set('t', String(now))
  return u.toString()
}
