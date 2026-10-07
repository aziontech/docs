/**
 * Single edge function that serves every permanent/temporary redirect for Azion,
 * consolidating what used to be several separate redirect functions/rules.
 *
 * The redirect table lives in `src/redirects/` (one file per group, per
 * language), authored in Azion's Massive Redirect schema: `moved` = 301
 * (permanent), `found` = 302 (temporary). Matching is by host + path, so both
 * locale path redirects and cross-domain host redirects are supported.
 *
 * The rule runs this function for every request; a non-matching request is
 * passed through to origin via `fetch(request)`. IMPORTANT: the edge
 * application must have an origin configured that is NOT this same function,
 * otherwise the passthrough would re-enter the function. See azion.config.ts.
 */
import { resolveRedirect } from './redirects'

export { resolveRedirect, normalizeUrl, redirectMap, redirectCount } from './redirects'

/**
 * Appends the request's query string to the target. It goes before the target's
 * #fragment (a fragment is the last part of a URL), and joins with an existing
 * query string using `&` instead of replacing it.
 */
export function withQuery(target: string, search: string): string {
  const extra = search.replace(/^\?/, '')
  if (!extra) return target

  const hashAt = target.indexOf('#')
  const base = hashAt === -1 ? target : target.slice(0, hashAt)
  const hash = hashAt === -1 ? '' : target.slice(hashAt)

  if (!base.includes('?')) return `${base}?${extra}${hash}`
  const separator = /[?&]$/.test(base) ? '' : '&'
  return `${base}${separator}${extra}${hash}`
}

export default async function handler(request: Request): Promise<Response> {
  const redirect = resolveRedirect(request.url)

  // Not a known redirect source: pass through to origin untouched.
  if (!redirect) {
    return fetch(request)
  }

  // `to` is an absolute URL. Preserve the incoming query string (analytics/UTMs)
  // so it is not lost across the redirect.
  const location = withQuery(redirect.to, new URL(request.url).search)

  const headers: Record<string, string> = { Location: location }
  // Only cache permanent (301) redirects. A 302 is temporary by definition, so
  // it must not be cached as if it were stable.
  if (redirect.status === 301) {
    headers['Cache-Control'] = 'public, max-age=3600'
  }

  return new Response(null, { status: redirect.status, headers })
}
