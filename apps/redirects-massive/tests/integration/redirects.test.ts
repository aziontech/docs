import { describe, it, expect, vi, afterEach } from 'vitest'
import handler, { redirectMap, normalizeUrl } from '../../src/index'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('redirects handler', () => {
  const cases: Array<[string, string]> = [
    ['https://www.azion.com/en/build/', 'https://www.azion.com/en/solutions/web-apps/'],
    ['https://www.azion.com/pt-br/secure/', 'https://www.azion.com/pt-br/solucoes/seguranca/'],
    ['https://www.azion.com/en/products/edge-caching/', 'https://www.azion.com/en/products/cache/']
  ]

  it.each(cases)('permanently (301) redirects %s -> %s', async (url, expected) => {
    const res = await handler(new Request(url))
    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe(expected)
  })

  it('redirects locale paths with or without a trailing slash', async () => {
    const withSlash = await handler(new Request('https://www.azion.com/en/build/'))
    const without = await handler(new Request('https://www.azion.com/en/build'))
    expect(withSlash.headers.get('Location')).toBe(without.headers.get('Location'))
    expect(without.status).toBe(301)
  })

  it('serves a flattened chain in a single hop (A -> C, never A -> B)', async () => {
    // en/products.json: edge-caching -> edge-cache -> cache
    const res = await handler(new Request('https://www.azion.com/en/products/edge-caching/'))
    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe('https://www.azion.com/en/products/cache/')
  })

  it('caches permanent (301) redirects', async () => {
    const res = await handler(new Request('https://www.azion.com/en/build/'))
    expect(res.headers.get('Cache-Control')).toContain('max-age=3600')
  })

  it('does NOT cache temporary (302) redirects', async () => {
    const res = await handler(new Request('https://www.azion.com.br/'))
    expect(res.status).toBe(302)
    expect(res.headers.get('Location')).toBe('http://www.azion.com')
    expect(res.headers.get('Cache-Control')).toBeNull()
  })

  it('matches a from_regex rule and substitutes backrefs', async () => {
    const res = await handler(new Request('http://www.azion.com/t/other/aaa/bbb/ccc/'))
    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe('http://www.azion.com.br/doc/ccc/aaa/bbb/')
  })

  it('preserves the request query string across the redirect', async () => {
    const res = await handler(new Request('https://www.azion.com/en/build/?utm_source=x&a=1'))
    expect(res.headers.get('Location')).toBe(
      'https://www.azion.com/en/solutions/web-apps/?utm_source=x&a=1'
    )
  })

  it('passes non-redirect URLs through to origin untouched', async () => {
    const passthrough = new Response('origin', { status: 200 })
    const fetchFn = vi.fn(async () => passthrough)
    vi.stubGlobal('fetch', fetchFn)

    const request = new Request('https://www.azion.com/en/solutions/web-apps/')
    const res = await handler(request)

    expect(fetchFn).toHaveBeenCalledWith(request)
    expect(res).toBe(passthrough)
  })

  it('never emits a redirect that lands on another redirect source', async () => {
    for (const { to } of redirectMap.values()) {
      expect(redirectMap.has(normalizeUrl(to))).toBe(false)
    }
  })
})
