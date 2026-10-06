import { describe, it, expect } from 'vitest'
import { withQuery } from '../../src/index'

const PAGE = 'https://www.azion.com/en/documentation/platform/connectors/'

describe('withQuery', () => {
  it('returns the target untouched when the request has no query string', () => {
    expect(withQuery(PAGE, '')).toBe(PAGE)
    expect(withQuery(`${PAGE}#load-balancer`, '')).toBe(`${PAGE}#load-balancer`)
  })

  it('treats a bare "?" as no query string', () => {
    expect(withQuery(PAGE, '?')).toBe(PAGE)
    expect(withQuery(`${PAGE}#load-balancer`, '?')).toBe(`${PAGE}#load-balancer`)
  })

  it('appends the query string to a plain target', () => {
    expect(withQuery(PAGE, '?utm_source=x&a=1')).toBe(`${PAGE}?utm_source=x&a=1`)
  })

  it('puts the query string before the fragment', () => {
    expect(withQuery(`${PAGE}#load-balancer`, '?utm_source=x')).toBe(
      `${PAGE}?utm_source=x#load-balancer`
    )
  })

  it('keeps a target fragment that has no request query string', () => {
    expect(withQuery(`${PAGE}#load-balancer`, '')).toBe(`${PAGE}#load-balancer`)
  })

  it('joins an existing query string with "&" and keeps both', () => {
    expect(withQuery(`${PAGE}?tab=overview`, '?utm_source=x')).toBe(
      `${PAGE}?tab=overview&utm_source=x`
    )
  })

  it('joins an existing query string before the fragment', () => {
    expect(withQuery(`${PAGE}?tab=overview#load-balancer`, '?utm_source=x')).toBe(
      `${PAGE}?tab=overview&utm_source=x#load-balancer`
    )
  })

  it('does not double the separator after a trailing "?" or "&"', () => {
    expect(withQuery(`${PAGE}?`, '?a=1')).toBe(`${PAGE}?a=1`)
    expect(withQuery(`${PAGE}?tab=overview&`, '?a=1')).toBe(`${PAGE}?tab=overview&a=1`)
  })

  it('does not mistake a "?" inside the fragment for a query string', () => {
    expect(withQuery(`${PAGE}#what?`, '?a=1')).toBe(`${PAGE}?a=1#what?`)
  })

  it('keeps an empty fragment', () => {
    expect(withQuery(`${PAGE}#`, '?a=1')).toBe(`${PAGE}?a=1#`)
  })
})
