import { describe, expect, it } from 'vitest'
import { appendTimestamp, isValidRegex } from '../logic/timestamp'

const PATTERNS = ['^api\\.example\\.com$', '.*\\.test\\.org']

describe('appendTimestamp', () => {
  it('命中正则时追加 t 参数', () => {
    const out = appendTimestamp('https://api.example.com/v1/users', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1/users?t=1700000000000')
  })

  it('已有查询参数时用 & 追加', () => {
    const out = appendTimestamp('https://api.example.com/v1?a=1', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1?a=1&t=1700000000000')
  })

  it('未命中正则返回 null，即使已带 t', () => {
    expect(appendTimestamp('https://other.com/path', PATTERNS, 1)).toBeNull()
    expect(appendTimestamp('https://other.com/path?t=123', PATTERNS, 1)).toBeNull()
  })

  it('已带 t 参数时用新时间戳覆盖（刷新 / 再次导航）', () => {
    const out = appendTimestamp('https://api.example.com/v1?t=123', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1?t=1700000000000')
  })

  it('保留其它查询参数并覆盖 t', () => {
    const out = appendTimestamp('https://api.example.com/v1?a=1&t=123&b=2', PATTERNS, 1700000000000)
    expect(out).toBe('https://api.example.com/v1?a=1&t=1700000000000&b=2')
  })

  it('子域名通配正则命中', () => {
    const out = appendTimestamp('https://a.b.test.org/x', PATTERNS, 1700000000000)
    expect(out).toBe('https://a.b.test.org/x?t=1700000000000')
  })

  it('非 http(s) 协议返回 null', () => {
    expect(appendTimestamp('ftp://api.example.com/file', PATTERNS, 1)).toBeNull()
    expect(appendTimestamp('chrome-extension://abc/x', PATTERNS, 1)).toBeNull()
  })

  it('非法 URL 返回 null', () => {
    expect(appendTimestamp('not a url', PATTERNS, 1)).toBeNull()
  })

  it('无效正则被跳过，不抛异常', () => {
    expect(appendTimestamp('https://api.example.com/x', ['([bad'], 1)).toBeNull()
  })
})

describe('isValidRegex', () => {
  it('合法与非法正则', () => {
    expect(isValidRegex('^a.*b$')).toBe(true)
    expect(isValidRegex('([bad')).toBe(false)
  })
})
