import { describe, expect, it } from 'vitest'
import { createRewriteGuard } from '../logic/rewriteGuard'

describe('createRewriteGuard', () => {
  it('only lets through the URL that was just written', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(true)
    expect(guard.consume(1, 'https://a.com/other')).toBe(false)
  })

  it('expires after one consume, so a user refresh is still rewritten', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(true)
    // The same URL appearing again (user presses F5) must not be skipped as a self-rewrite
    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(false)
  })

  it('tabs do not affect each other', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')

    expect(guard.consume(2, 'https://a.com/?t=1')).toBe(false)
    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(true)
  })

  it('remember overwrites the previous record for the same tab', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')
    guard.remember(1, 'https://a.com/?t=2')

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(false)
    expect(guard.consume(1, 'https://a.com/?t=2')).toBe(true)
  })

  it('forget clears the record', () => {
    const guard = createRewriteGuard()
    guard.remember(1, 'https://a.com/?t=1')
    guard.forget(1)

    expect(guard.consume(1, 'https://a.com/?t=1')).toBe(false)
  })
})
