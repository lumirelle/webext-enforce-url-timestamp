import { describe, expect, it } from 'vitest'
import { createRewriteGuard } from '../logic/rewriteGuard'

describe('createRewriteGuard', () => {
  it('只放行刚刚写入的那个 URL', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(true)
    expect(guard.consume(1, 'https://a.com/other')).toBe(false)
  })

  it('消费一次后失效，用户再次刷新仍会被改写', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(true)
    // 同一个 URL 再次出现（用户按 F5）时不应被当作自我改写而跳过
    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(false)
  })

  it('各标签页互不影响', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')

    expect(guard.consume(2, 'https://a.com/?t=1')).toBe(false)
    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(true)
  })

  it('remember 会覆盖同一标签页的旧记录', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')
    guard.remember(1, 'https://a.com/?t=2')

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(false)
    expect(guard.consume(1, 'https://a.com/?t=2')).toBe(true)
  })

  it('forget 清除记录', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')
    guard.forget(1)

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(false)
  })
})
