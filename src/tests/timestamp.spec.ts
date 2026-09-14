import { describe, expect, it } from 'vitest'
import { appendTimestamp, isValidRegex } from '../logic/timestamp'

const PATTERNS = ['^api\\.example\\.com$', '.*\\.test\\.org']

describe('appendTimestamp', () => {
  it('appends the t parameter when the regex matches', () => {
    const out = appendTimestamp('https://api.example.com/v1/users', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1/users?t=1700000000000')
  })

  it('appends with & when query parameters already exist', () => {
    const out = appendTimestamp('https://api.example.com/v1?a=1', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1?a=1&t=1700000000000')
  })

  it('returns null when the regex does not match, even if t is already present', () => {
    expect(appendTimestamp('https://other.com/path', PATTERNS, 1)).toBeNull()
    expect(appendTimestamp('https://other.com/path?t=123', PATTERNS, 1)).toBeNull()
  })

  it('overwrites t with a fresh timestamp when it is already present (refresh / re-navigation)', () => {
    const out = appendTimestamp('https://api.example.com/v1?t=123', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1?t=1700000000000')
  })

  it('keeps other query parameters and overwrites t', () => {
    const out = appendTimestamp('https://api.example.com/v1?a=1&t=123&b=2', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1?a=1&t=1700000000000&b=2')
  })

  it('matches subdomains with a wildcard regex', () => {
    const out = appendTimestamp('https://a.b.test.org/x', PATTERNS, 1700000000000)
    expect(out).toBe('https://a.b.test.org/x?t=1700000000000')
  })

  it('returns null for non-http(s) protocols', () => {
    expect(appendTimestamp('ftp://api.example.com/file', PATTERNS, 1)).toBeNull()
    expect(appendTimestamp('chrome-extension://abc/x', PATTERNS, 1)).toBeNull()
  })

  it('returns null for an invalid URL', () => {
    expect(appendTimestamp('not a url', PATTERNS, 1)).toBeNull()
  })

  it('skips invalid regexes without throwing', () => {
    expect(appendTimestamp('https://api.example.com/x', ['([bad'], 1)).toBeNull()
  })
})

describe('isValidRegex', () => {
  it('valid and invalid regexes', () => {
    expect(isValidRegex('^a.*b$')).toBe(true)
    expect(isValidRegex('([bad')).toBe(false)
  })
})
