/**
 * Redirect engine.
 *
 * Redirects are authored directly in Azion's Massive Redirect JSON schema, one file
 * per language and group:
 *
 *   en/doc-00.json, en/doc-01.json        /en/documentation/...
 *   pt-br/doc-00.json, pt-br/doc-01.json  /pt-br/documentacao/...
 *
 * Each entry is either an EXACT match on `from`, or a pattern match on
 * `from_regex`, paired with a target that chooses the HTTP status:
 *   { "from": "<old-url>",        "moved": "<new-url>" }   -> 301 permanent
 *   { "from": "<old-url>",        "found": "<new-url>" }   -> 302 temporary
 *   { "from_regex": "<pattern>",  "moved": "<template>" }  -> 301, with %s / %N$ backrefs
 * This is the same schema Azion's "Massive Redirect [Global]" function accepts.
 * Docs: https://www.azion.com/en/documentation/products/guides/massive-redirect-integration/
 *
 * To EDIT: open the matching file and change/add an entry (full URLs). To ADD A
 * NEW FILE: create it and add it to the imports + `FILES` list below.
 * `pnpm -F redirects-massive validate` checks the data is consistent.
 */
import enDoc00 from './en/doc-00.json'
import enDoc01 from './en/doc-01.json'
import ptbrDoc00 from './pt-br/doc-00.json'
import ptbrDoc01 from './pt-br/doc-01.json'

/** A raw entry as authored in the JSON files (Azion Massive Redirect schema). */
export type Redirect = {
  /** Exact source URL. */
  from?: string
  /** Pattern source (regex). Supports `%s` and `%N$` backrefs in the target. */
  from_regex?: string
  /** Permanent redirect target (301). */
  moved?: string
  /** Temporary redirect target (302). */
  found?: string
}

/** A resolved redirect: final destination and the HTTP status to answer with. */
export type ResolvedRedirect = { to: string; status: 301 | 302 }

type RegexRule = { re: RegExp; template: string; status: 301 | 302 }

// Every redirect file. Add a new file here after creating it.
const FILES: Redirect[][] = [enDoc00, enDoc01, ptbrDoc00, ptbrDoc01]

export const redirects: Redirect[] = FILES.flat() as Redirect[]

/**
 * Normalizes a URL for exact lookup: `host + path`, lower-cased, without a
 * trailing slash. Scheme and query string are ignored so `http`/`https` and
 * tracking params never break a match.
 *
 * Lower-casing makes matching case-INSENSITIVE. This is intentional: the site's
 * slugs are lower-case, and being lenient means a legacy URL still redirects
 * even if it was linked with odd casing. Only the lookup key is lower-cased —
 * the `moved`/`found` target is emitted verbatim, preserving its real casing.
 */
export function normalizeUrl(url: string): string {
  const parsed = new URL(url)
  const path = parsed.pathname.replace(/\/$/, '')
  return (parsed.host + path).toLowerCase()
}

/** The compiled lookup structures: exact matches plus ordered regex rules. */
type RedirectTable = { map: Map<string, ResolvedRedirect>; regex: RegexRule[] }

const warn = (message: string): void => console.warn(`[redirects] ${message}`)

/** Resolves an entry's target + HTTP status: `moved` -> 301, `found` -> 302. */
function targetOf(entry: Redirect): ResolvedRedirect | null {
  if (entry.moved) return { to: entry.moved, status: 301 }
  if (entry.found) return { to: entry.found, status: 302 }
  return null
}

/**
 * Substitutes Azion backrefs in a `from_regex` target template:
 *   `%N$` -> the Nth capture group (1-indexed)
 *   `%s`  -> the next capture group, in order
 */
export function applyTemplate(template: string, match: RegExpExecArray): string {
  let nextGroup = 0
  return template
    .replace(/%(\d+)\$/g, (_whole: string, index: string) => match[Number(index)] ?? '')
    .replace(/%s/g, () => match[++nextGroup] ?? '')
}

/**
 * Parse + validate: partitions raw entries into an exact lookup (keyed by
 * normalized URL) and ordered regex rules. Entries missing a target, or exact
 * entries missing a source, are skipped. Duplicate exact sources keep the last
 * one; a conflicting duplicate (different target) is warned about.
 */
function indexEntries(entries: Redirect[]): {
  exact: Map<string, ResolvedRedirect>
  regex: RegexRule[]
} {
  const exact = new Map<string, ResolvedRedirect>()
  const regex: RegexRule[] = []

  for (const entry of entries) {
    const target = targetOf(entry)
    if (!target) {
      warn(`entry without moved/found ignored: ${JSON.stringify(entry)}`)
      continue
    }
    if (entry.from_regex) {
      regex.push({ re: new RegExp(entry.from_regex), template: target.to, status: target.status })
      continue
    }
    if (!entry.from) {
      warn(`entry without from/from_regex ignored: ${JSON.stringify(entry)}`)
      continue
    }
    const key = normalizeUrl(entry.from)
    const existing = exact.get(key)
    if (existing && normalizeUrl(existing.to) !== normalizeUrl(target.to)) {
      warn(`conflicting duplicate for ${key}: ${existing.to} vs ${target.to} (keeping last)`)
    }
    exact.set(key, target)
  }

  return { exact, regex }
}

/**
 * Follows a chain of exact redirects from `sourceKey` to its final destination,
 * stopping on a cycle. Returns the last `to` URL reached.
 */
function finalTargetOf(sourceKey: string, exact: Map<string, ResolvedRedirect>): string {
  let target = (exact.get(sourceKey) as ResolvedRedirect).to
  const visited = new Set<string>([sourceKey])
  for (let nextKey = normalizeUrl(target); exact.has(nextKey) && !visited.has(nextKey); ) {
    visited.add(nextKey)
    target = (exact.get(nextKey) as ResolvedRedirect).to
    nextKey = normalizeUrl(target)
  }
  return target
}

/**
 * Transform: collapses chains `A -> B -> C` into `A -> C`, keeping each entry's
 * OWN status (a `moved`/301 that chains through a `found`/302 stays 301 — the
 * author declared how *this* URL moved, regardless of later hops). A source that
 * resolves back to itself is dropped.
 */
function flattenChains(exact: Map<string, ResolvedRedirect>): Map<string, ResolvedRedirect> {
  const flattened = new Map<string, ResolvedRedirect>()
  for (const [sourceKey, entry] of exact) {
    const to = finalTargetOf(sourceKey, exact)
    if (normalizeUrl(to) === sourceKey) {
      warn(`self-redirect dropped: ${sourceKey}`)
      continue
    }
    flattened.set(sourceKey, { to, status: entry.status })
  }
  return flattened
}

/**
 * Builds the lookup structures from raw entries. Pure and exported so the
 * parse/flatten/status logic can be unit-tested with synthetic input — see
 * `indexEntries` (parse + validate) and `flattenChains` (transform).
 */
export function buildTable(entries: Redirect[]): RedirectTable {
  const { exact, regex } = indexEntries(entries)
  return { map: flattenChains(exact), regex }
}

const { map, regex } = buildTable(redirects)

/** Exact lookup table, keyed by normalized `from`. */
export const redirectMap: Map<string, ResolvedRedirect> = map

/** Pattern rules from `from_regex` entries, tried in order after an exact miss. */
export const regexRules: RegexRule[] = regex

/** Total number of active redirects served (exact + regex). */
export const redirectCount = redirectMap.size + regexRules.length

/**
 * Returns the resolved redirect (destination + status) for a request URL, or
 * `null` when it is not a known redirect source. Exact matches win; regex rules
 * are tried in order only on an exact miss.
 */
export function resolveRedirect(requestUrl: string): ResolvedRedirect | null {
  const exact = redirectMap.get(normalizeUrl(requestUrl))
  if (exact) return exact
  for (const rule of regexRules) {
    const match = rule.re.exec(requestUrl)
    if (match) return { to: applyTemplate(rule.template, match), status: rule.status }
  }
  return null
}
