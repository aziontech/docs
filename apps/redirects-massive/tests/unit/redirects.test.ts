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

describe('normalizeUrl', () => {
  it('reduces a URL to host + path', () => {
    expect(normalizeUrl('https://www.azion.com/en/build/')).toBe('www.azion.com/en/build')
  })

  it('removes a single trailing slash but keeps the rest of the path', () => {
    expect(normalizeUrl('https://www.azion.com/en/build')).toBe('www.azion.com/en/build')
    expect(normalizeUrl('https://www.azion.com/a/b/c/')).toBe('www.azion.com/a/b/c')
  })

  it('collapses the root path to just the host', () => {
    expect(normalizeUrl('https://www.azion.com/')).toBe('www.azion.com')
    expect(normalizeUrl('https://www.azion.com')).toBe('www.azion.com')
  })

  it('is case-insensitive (host and path)', () => {
    expect(normalizeUrl('https://WWW.Azion.com/EN/Build/')).toBe('www.azion.com/en/build')
  })

  it('ignores the scheme (http and https collapse)', () => {
    expect(normalizeUrl('http://www.azion.com.br')).toBe(normalizeUrl('https://www.azion.com.br'))
  })

  it('ignores the query string and hash', () => {
    expect(normalizeUrl('https://www.azion.com/en/build/?utm=x#frag')).toBe(
      'www.azion.com/en/build'
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
  it('resolves a permanent (moved -> 301) redirect', () => {
    expect(resolveRedirect('https://www.azion.com/en/build/')).toEqual({
      to: 'https://www.azion.com/en/solutions/web-apps/',
      status: 301
    })
  })

  it('matches with and without a trailing slash', () => {
    const a = resolveRedirect('https://www.azion.com/en/build/')
    const b = resolveRedirect('https://www.azion.com/en/build')
    expect(a).toEqual(b)
  })

  it('matches case-insensitively', () => {
    expect(resolveRedirect('https://www.azion.com/EN/BUILD/')?.to).toBe(
      'https://www.azion.com/en/solutions/web-apps/'
    )
  })

  it('ignores the query string when matching', () => {
    expect(resolveRedirect('https://www.azion.com/en/build/?utm_source=x')?.to).toBe(
      'https://www.azion.com/en/solutions/web-apps/'
    )
  })

  it('resolves a temporary (found -> 302) host redirect regardless of scheme', () => {
    expect(resolveRedirect('http://www.azion.com.br')).toEqual({
      to: 'http://www.azion.com',
      status: 302
    })
    expect(resolveRedirect('https://www.azion.com.br/')).toEqual({
      to: 'http://www.azion.com',
      status: 302
    })
  })

  it('flattens a multi-hop chain to the final destination', () => {
    // en/products.json: edge-caching -> edge-cache -> cache
    expect(resolveRedirect('https://www.azion.com/en/products/edge-caching/')?.to).toBe(
      'https://www.azion.com/en/products/cache/'
    )
    expect(resolveRedirect('https://www.azion.com/en/products/edge-cache/')?.to).toBe(
      'https://www.azion.com/en/products/cache/'
    )
  })

  it('returns null for unknown or already-current URLs', () => {
    expect(resolveRedirect('https://www.azion.com/en/products/cache/')).toBeNull()
    expect(resolveRedirect('https://www.azion.com/en/solutions/web-apps/')).toBeNull()
    expect(resolveRedirect('https://www.azion.com/en/nonexistent-page/')).toBeNull()
  })
})

describe('resolveRedirect — regex rules', () => {
  it('falls back to a from_regex rule and substitutes backrefs', () => {
    expect(resolveRedirect('http://www.azion.com/t/other/aaa/bbb/ccc/')).toEqual({
      to: 'http://www.azion.com.br/doc/ccc/aaa/bbb/',
      status: 301
    })
  })

  it('returns null when neither an exact nor a regex rule matches', () => {
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

  it('compiles at least the known from_regex rules', () => {
    expect(regexRules.length).toBeGreaterThanOrEqual(2)
    for (const rule of regexRules) expect(rule.re).toBeInstanceOf(RegExp)
  })
})
