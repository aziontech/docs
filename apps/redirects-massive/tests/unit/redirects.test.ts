import { describe, it, expect } from 'vitest'
import {
  redirects,
  redirectMap,
  regexRules,
  redirectCount,
  normalizeUrl,
  applyTemplate,
  resolveRedirect,
  buildTable,
  type Redirect
} from '../../src/redirects'

const EN = 'https://www.azion.com/en/documentation'
const PT = 'https://www.azion.com/pt-br/documentacao'

describe('normalizeUrl', () => {
  it('reduces a URL to host + path', () => {
    expect(normalizeUrl(`${EN}/products/core-concepts/`)).toBe(
      'www.azion.com/en/documentation/products/core-concepts'
    )
  })

  it('removes a single trailing slash but keeps the rest of the path', () => {
    expect(normalizeUrl(`${EN}/products/core-concepts`)).toBe(
      'www.azion.com/en/documentation/products/core-concepts'
    )
    expect(normalizeUrl('https://www.azion.com/a/b/c/')).toBe('www.azion.com/a/b/c')
  })

  it('collapses the root path to just the host', () => {
    expect(normalizeUrl('https://www.azion.com/')).toBe('www.azion.com')
    expect(normalizeUrl('https://www.azion.com')).toBe('www.azion.com')
  })

  it('is case-insensitive (host and path)', () => {
    expect(normalizeUrl('https://WWW.Azion.com/EN/Documentation/Products/CLI/')).toBe(
      'www.azion.com/en/documentation/products/cli'
    )
  })

  it('ignores the scheme (http and https collapse)', () => {
    expect(normalizeUrl(`${EN}/`.replace('https', 'http'))).toBe(normalizeUrl(`${EN}/`))
  })

  it('ignores the query string and hash', () => {
    expect(normalizeUrl(`${EN}/products/core-concepts/?utm=x#frag`)).toBe(
      'www.azion.com/en/documentation/products/core-concepts'
    )
  })
})

describe('applyTemplate', () => {
  const exec = (re: RegExp, s: string) => re.exec(s) as RegExpExecArray

  it('substitutes %s with capture groups in order', () => {
    const m = exec(/www\.(azion)\.com/, 'www.azion.com')
    expect(applyTemplate('https://www.%s.com', m)).toBe('https://www.azion.com')
  })

  it('substitutes multiple %s sequentially', () => {
    const m = exec(/(a)-(b)/, 'a-b')
    expect(applyTemplate('%s/%s', m)).toBe('a/b')
  })

  it('substitutes %N$ with positional capture groups (any order)', () => {
    const m = exec(/\/t\/(\w+)\/(\w+)\/(\w+)\//, '/t/a/b/c/')
    expect(applyTemplate('/doc/%3$/%1$/%2$/', m)).toBe('/doc/c/a/b/')
  })

  it('substitutes a missing group with an empty string', () => {
    const m = exec(/(a)/, 'a')
    expect(applyTemplate('%2$', m)).toBe('')
  })

  it('leaves a template without placeholders unchanged', () => {
    const m = exec(/x/, 'x')
    expect(applyTemplate('/plain/path/', m)).toBe('/plain/path/')
  })
})

describe('resolveRedirect — exact matches', () => {
  it('resolves a permanent (moved -> 301) English redirect', () => {
    expect(resolveRedirect(`${EN}/products/core-concepts/`)).toEqual({
      to: `${EN}/fundamentals/how-it-works/`,
      status: 301
    })
  })

  it('resolves a permanent Portuguese redirect', () => {
    expect(resolveRedirect(`${PT}/produtos/conceitos-basicos/`)).toEqual({
      to: `${PT}/fundamentos/como-funciona/`,
      status: 301
    })
  })

  it('matches with and without a trailing slash', () => {
    const a = resolveRedirect(`${EN}/products/core-concepts/`)
    const b = resolveRedirect(`${EN}/products/core-concepts`)
    expect(a).not.toBeNull()
    expect(a).toEqual(b)
  })

  it('matches case-insensitively and leaves the target casing alone', () => {
    expect(
      resolveRedirect('https://www.azion.com/EN/Documentation/Products/CORE-CONCEPTS/')?.to
    ).toBe(`${EN}/fundamentals/how-it-works/`)
  })

  it('matches over http as well as https', () => {
    expect(resolveRedirect(`${EN}/products/core-concepts/`.replace('https', 'http'))?.status).toBe(
      301
    )
  })

  it('ignores the query string when matching', () => {
    expect(resolveRedirect(`${EN}/products/core-concepts/?utm_source=x`)?.to).toBe(
      `${EN}/fundamentals/how-it-works/`
    )
  })

  it('sends every hop of a former chain straight to the final destination', () => {
    // marketplace/bot-manager -> secure/edge-firewall/bot-manager -> ... -> platform/firewall
    expect(resolveRedirect(`${EN}/products/marketplace/bot-manager/`)?.to).toBe(
      `${EN}/platform/firewall/`
    )
    expect(resolveRedirect(`${EN}/products/secure/edge-firewall/bot-manager/`)?.to).toBe(
      `${EN}/platform/firewall/`
    )
  })

  it('returns null for unknown or already-current URLs', () => {
    expect(resolveRedirect(`${EN}/fundamentals/how-it-works/`)).toBeNull()
    expect(resolveRedirect(`${EN}/nonexistent-page/`)).toBeNull()
    expect(resolveRedirect('https://www.azion.com/en/solutions/')).toBeNull()
  })

  it('keeps the language files apart: an English path never resolves a Portuguese entry', () => {
    expect(resolveRedirect(`${EN}/produtos/conceitos-basicos/`)).toBeNull()
  })
})

describe('resolveRedirect — data decisions', () => {
  it('serves a single target for a source the old data listed twice with different targets', () => {
    expect(resolveRedirect(`${PT}/casos-de-uso/testes-ab/`)?.to).toBe(
      `${PT}/guias/desenvolvimento-de-aplicacoes/integracoes/ab-testing-marketplace/`
    )
    expect(resolveRedirect(`${PT}/casos-de-uso/nextjs-na-plataforma-azion/`)?.to).toBe(
      `${PT}/devtools/cli/primeiros-passos/`
    )
  })

  it('serves the pt-br target for an English source listed in pt-br/doc-00 (loaded last)', () => {
    expect(resolveRedirect(`${EN}/products/guides/nextjs-on-azion-platform/`)?.to).toBe(
      `${PT}/devtools/cli/primeiros-passos/`
    )
  })

  it('serves the entries that only the site data carried', () => {
    expect(resolveRedirect(`${EN}/products/guides/cloudflare-to-azion/`)?.to).toBe(
      `${EN}/guides/platform/migration/cloudflare-migration-guide/`
    )
    expect(resolveRedirect(`${PT}/produtos/secure/firewall/edge-functions/`)?.to).toBe(
      `${PT}/plataforma/firewall/functions/`
    )
    expect(resolveRedirect(`${PT}/produtos/guias/usar-bucket-como-origem/`)?.to).toBe(
      `${PT}/guias/desenvolvimento-de-aplicacoes/dados/bucket-como-connector/`
    )
  })

  it('redirects the Use Cases index pages to Guides', () => {
    expect(resolveRedirect(`${EN}/use-cases/`)?.to).toBe(`${EN}/guides/`)
    expect(resolveRedirect(`${PT}/casos-de-uso/`)?.to).toBe(`${PT}/guias/`)
  })

  it('resolves a source whose scheme was mistyped in the old data', () => {
    expect(
      resolveRedirect(`${PT}/produtos/guias/build/integrar-resend-email-edge-functions/`)?.to
    ).toBe(
      `${PT}/guias/desenvolvimento-de-aplicacoes/functions-e-runtime/integrar-resend-email-functions/`
    )
  })
})

describe('resolveRedirect — regex rules', () => {
  it('returns null for a URL no exact rule matches when the data has no regex rules', () => {
    expect(regexRules).toHaveLength(0)
    expect(resolveRedirect('http://www.azion.com/t/unmatched')).toBeNull()
  })
})

describe('buildTable (hermetic)', () => {
  it('flattens A -> B -> C to A -> C keeping the ENTRY status', () => {
    const { map } = buildTable([
      { from: 'https://x/a', moved: 'https://x/b' }, // 301
      { from: 'https://x/b', found: 'https://x/c' } //  302
    ] as Redirect[])
    // a is permanent (moved), keeps 301 even though it chains through a 302 hop
    expect(map.get('x/a')).toEqual({ to: 'https://x/c', status: 301 })
    expect(map.get('x/b')).toEqual({ to: 'https://x/c', status: 302 })
  })

  it('maps found to 302 and moved to 301', () => {
    const { map } = buildTable([
      { from: 'https://x/perm', moved: 'https://y/1' },
      { from: 'https://x/temp', found: 'https://y/2' }
    ] as Redirect[])
    expect(map.get('x/perm')?.status).toBe(301)
    expect(map.get('x/temp')?.status).toBe(302)
  })

  it('keeps the last entry on a conflicting duplicate source', () => {
    const { map } = buildTable([
      { from: 'https://x/a', moved: 'https://x/one' },
      { from: 'https://x/a/', moved: 'https://x/two' } // same normalized source
    ] as Redirect[])
    expect(map.get('x/a')?.to).toBe('https://x/two')
  })

  it('drops a self-redirect', () => {
    const { map } = buildTable([{ from: 'https://x/a', moved: 'https://x/a/' }] as Redirect[])
    expect(map.has('x/a')).toBe(false)
  })

  it('stops on a cycle instead of looping forever', () => {
    const { map } = buildTable([
      { from: 'https://x/a', moved: 'https://x/b' },
      { from: 'https://x/b', moved: 'https://x/a' }
    ] as Redirect[])
    expect(map.size).toBeLessThanOrEqual(2)
  })

  it('separates from_regex entries into ordered regex rules', () => {
    const { map, regex } = buildTable([
      { from_regex: '^https://x/(\\w+)$', moved: 'https://y/%s' }
    ] as Redirect[])
    expect(map.size).toBe(0)
    expect(regex).toHaveLength(1)
    expect(regex[0].re).toBeInstanceOf(RegExp)
  })
})

describe('data integrity', () => {
  it('redirectCount equals exact entries plus regex rules, and the table is non-empty', () => {
    expect(redirectCount).toBe(redirectMap.size + regexRules.length)
    expect(redirectMap.size).toBeGreaterThan(0)
  })

  it('every entry has exactly one source key and exactly one target key', () => {
    for (const r of redirects) {
      expect(Boolean(r.from) !== Boolean(r.from_regex)).toBe(true)
      expect(Boolean(r.moved) !== Boolean(r.found)).toBe(true)
    }
  })

  it('every exact source and target is an absolute URL', () => {
    for (const r of redirects) {
      if (!r.from) continue
      expect(() => new URL(r.from as string)).not.toThrow()
      expect(() => new URL((r.moved ?? r.found) as string)).not.toThrow()
    }
  })

  it('only serves 301 or 302', () => {
    for (const { status } of redirectMap.values()) expect([301, 302]).toContain(status)
    for (const { status } of regexRules) expect([301, 302]).toContain(status)
  })

  it('has no self-redirects and no unflattened chains', () => {
    for (const { to } of redirectMap.values()) {
      expect(redirectMap.has(normalizeUrl(to))).toBe(false)
    }
  })

  it('compiles every from_regex rule', () => {
    for (const rule of regexRules) expect(rule.re).toBeInstanceOf(RegExp)
  })

  it('serves the last-loaded target for a source listed in more than one file', () => {
    // en/doc-00 and en/doc-01 both list this source; doc-01 is loaded after doc-00.
    expect(resolveRedirect(`${EN}/products/store/edge-sql/`)?.to).toBe(
      `${EN}/platform/sql-database/`
    )
  })
})
