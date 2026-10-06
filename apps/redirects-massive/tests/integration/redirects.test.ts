import { describe, it, expect, vi, afterEach } from 'vitest'
import handler, { redirectMap, normalizeUrl } from '../../src/index'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.doUnmock('../../src/redirects')
  vi.resetModules()
})

const EN = 'https://www.azion.com/en/documentation'
const PT = 'https://www.azion.com/pt-br/documentacao'

describe('redirects handler', () => {
  const cases: Array<[string, string]> = [
    [`${EN}/products/core-concepts/`, `${EN}/products/azion-platform-overview/`],
    [`${PT}/produtos/conceitos-basicos/`, `${PT}/produtos/visao-geral-da-plataforma-da-azion/`],
    [`${EN}/products/changelog/`, `${EN}/products/release-notes/`]
  ]

  it.each(cases)('permanently (301) redirects %s -> %s', async (url, expected) => {
    const res = await handler(new Request(url))
    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe(expected)
  })

  it('redirects with or without a trailing slash', async () => {
    const withSlash = await handler(new Request(`${EN}/products/core-concepts/`))
    const without = await handler(new Request(`${EN}/products/core-concepts`))
    expect(withSlash.headers.get('Location')).toBe(without.headers.get('Location'))
    expect(without.status).toBe(301)
  })

  it('serves a flattened chain in a single hop (A -> C, never A -> B)', async () => {
    // marketplace/bot-manager -> secure/edge-firewall/bot-manager -> secure/firewall/bot-manager
    const res = await handler(new Request(`${EN}/products/marketplace/bot-manager/`))
    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe(`${EN}/products/secure/firewall/bot-manager/`)
  })

  it('caches permanent (301) redirects', async () => {
    const res = await handler(new Request(`${EN}/products/core-concepts/`))
    expect(res.headers.get('Cache-Control')).toContain('max-age=3600')
  })

  it('preserves the request query string across the redirect', async () => {
    const res = await handler(new Request(`${EN}/products/core-concepts/?utm_source=x&a=1`))
    expect(res.headers.get('Location')).toBe(
      `${EN}/products/azion-platform-overview/?utm_source=x&a=1`
    )
  })

  it('passes non-redirect URLs through to origin untouched', async () => {
    const passthrough = new Response('origin', { status: 200 })
    const fetchFn = vi.fn(async () => passthrough)
    vi.stubGlobal('fetch', fetchFn)

    const request = new Request(`${EN}/products/azion-platform-overview/`)
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

describe('redirects handler — temporary (302) redirects', () => {
  // The docs data has no `found` entries; a mocked table proves the handler's 302 branch.
  it('does NOT cache a 302 and still preserves the query string', async () => {
    vi.resetModules()
    vi.doMock('../../src/redirects', () => ({
      resolveRedirect: () => ({ to: 'https://www.azion.com/en/documentation/new/', status: 302 }),
      normalizeUrl: (url: string) => url,
      redirectMap: new Map(),
      redirectCount: 0
    }))
    const { default: mockedHandler } = await import('../../src/index')

    const res = await mockedHandler(new Request(`${EN}/old/?a=1`))
    expect(res.status).toBe(302)
    expect(res.headers.get('Location')).toBe('https://www.azion.com/en/documentation/new/?a=1')
    expect(res.headers.get('Cache-Control')).toBeNull()
  })
})
