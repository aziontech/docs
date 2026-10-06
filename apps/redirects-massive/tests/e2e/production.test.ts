import { describe, it, expect } from 'vitest'
import { redirects, normalizeUrl, type Redirect } from '../../src/redirects'

/**
 * Real-environment E2E. For each redirect entry we hit the live old URL,
 * FOLLOW the redirect chain to the end, and assert:
 *   1. it lands on the expected target (host + path — chain-safe, since our
 *      table flattens A->B->C to A->C while prod may still hop A->B->C), and
 *   2. the final destination actually loads (status < 400).
 *
 * We follow to the final URL rather than checking the first-hop `Location`
 * because (a) our function flattens chains and (b) our function is not what's
 * live on production — so this cross-checks our data against prod's real
 * destinations. Point REDIRECTS_BASE_URL at a deployed edge domain
 * (https://<id>.map.azionedge.net) to test THIS function's own behavior instead.
 * By default a representative sample runs; set E2E_ALL=1 to test every entry.
 */
const BASE = (process.env.REDIRECTS_BASE_URL || 'https://www.azion.com').replace(/\/$/, '')
const ALL = process.env.E2E_ALL === '1'
const SITE = 'https://www.azion.com'

/** Rewrites a www.azion.com URL onto the configured BASE (leaves other hosts). */
function onBase(url: string): string {
  if (BASE === SITE) return url
  return url.startsWith(SITE) ? BASE + url.slice(SITE.length) : url
}

function targetOf(r: Redirect): { url: string; status: 301 | 302 } | null {
  if (r.moved) return { url: r.moved, status: 301 }
  if (r.found) return { url: r.found, status: 302 }
  return null
}

// Only exact-`from` entries can be probed directly (regex rules need a concrete
// URL). Keep pages/host up front, then sample the rest evenly.
const exact = redirects.filter((r): r is Redirect & { from: string } => Boolean(r.from))
const sample = ALL
  ? exact
  : exact.filter((_, i) => i % Math.max(1, Math.ceil(exact.length / 40)) === 0)

const UA = { 'user-agent': 'azion-redirects-e2e' }

describe(`redirects against ${BASE} (${sample.length}/${exact.length} entries)`, () => {
  it.concurrent.each(sample.map((r) => [r.from, r] as const))(
    '%s lands on the expected target',
    async (_from, r) => {
      const target = targetOf(r)!
      // Follow the whole chain to the final URL (chain-safe) and check it loads.
      const res = await fetch(onBase(r.from), { redirect: 'follow', headers: UA })
      expect(normalizeUrl(res.url)).toBe(normalizeUrl(onBase(target.url)))
      expect(res.status, `destination ${target.url} returned ${res.status}`).toBeLessThan(400)
    }
  )
})
