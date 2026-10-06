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

/** Appends the request's query string to the target, unless it already has one. */
function withQuery(target: string, search: string): string {
  if (!search) return target
  return target.includes('?') ? target : target + search
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
