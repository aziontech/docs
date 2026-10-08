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
    [`${EN}/products/core-concepts/`, `${EN}/fundamentals/how-it-works/`],
    [`${PT}/produtos/conceitos-basicos/`, `${PT}/fundamentos/como-funciona/`],
    [`${EN}/products/changelog/`, `${EN}/changelog/`]
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

  it('serves a former chain in a single hop (A -> C, never A -> B)', async () => {
    // marketplace/bot-manager -> secure/edge-firewall/bot-manager -> ... -> platform/firewall
    const res = await handler(new Request(`${EN}/products/marketplace/bot-manager/`))
    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe(`${EN}/platform/firewall/`)
  })

  it('caches permanent (301) redirects', async () => {
    const res = await handler(new Request(`${EN}/products/core-concepts/`))
    expect(res.headers.get('Cache-Control')).toContain('max-age=3600')
  })

  it('preserves the request query string across the redirect', async () => {
    const res = await handler(new Request(`${EN}/products/core-concepts/?utm_source=x&a=1`))
    expect(res.headers.get('Location')).toBe(`${EN}/fundamentals/how-it-works/?utm_source=x&a=1`)
  })

  it('passes non-redirect URLs through to origin untouched', async () => {
    const passthrough = new Response('origin', { status: 200 })
    const fetchFn = vi.fn(async () => passthrough)
    vi.stubGlobal('fetch', fetchFn)

    const request = new Request(`${EN}/fundamentals/how-it-works/`)
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

describe('redirects handler — targets with a #fragment', () => {
  // The docs data has no anchored target; a mocked table proves the handler keeps the fragment.
  async function anchoredHandler() {
    vi.resetModules()
    vi.doMock('../../src/redirects', () => ({
      resolveRedirect: () => ({ to: `${PT}/devtools/cli/recursos/#domains`, status: 301 }),
      normalizeUrl: (url: string) => url,
      redirectMap: new Map(),
      redirectCount: 0
    }))
    return (await import('../../src/index')).default
  }

  it('puts the query string before the fragment of a target that has one', async () => {
    const res = await (
      await anchoredHandler()
    )(new Request(`${PT}/produtos/cli/domains/?utm_source=x`))
    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe(`${PT}/devtools/cli/recursos/?utm_source=x#domains`)
  })

  it('keeps the fragment of a target when the request has no query string', async () => {
    const res = await (await anchoredHandler())(new Request(`${PT}/produtos/cli/domains/`))
    expect(res.headers.get('Location')).toBe(`${PT}/devtools/cli/recursos/#domains`)
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
