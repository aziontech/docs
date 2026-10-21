/** Redirect engine over the Azion Massive Redirect files (`from`/`from_regex` + `moved` 301 / `found` 302). */
import enDoc00 from './en/00.json';
import enDoc01 from './en/01.json';
import ptbrDoc00 from './pt-br/00.json';
import ptbrDoc01 from './pt-br/01.json';

/** A raw entry as authored in the JSON files (Azion Massive Redirect schema). */
export type Redirect = {
	/** Exact source URL. */
	from?: string;
	/** Pattern source (regex). Supports `%s` and `%N$` backrefs in the target. */
	from_regex?: string;
	/** Permanent redirect target (301). */
	moved?: string;
	/** Temporary redirect target (302). */
	found?: string;
};

/** A resolved redirect: final destination and the HTTP status to answer with. */
export type ResolvedRedirect = { to: string; status: 301 | 302 };

type RegexRule = { re: RegExp; template: string; status: 301 | 302 };

// Every redirect file. Add a new file here after creating it.
const FILES: Redirect[][] = [enDoc00, enDoc01, ptbrDoc00, ptbrDoc01];

export const redirects: Redirect[] = FILES.flat() as Redirect[];

/** Lookup key: lower-cased `host + path` without trailing slash; scheme and query are ignored. */
export function normalizeUrl(url: string): string {
	const parsed = new URL(url);
	const path = parsed.pathname.replace(/\/$/, '');
	return (parsed.host + path).toLowerCase();
}

/** The compiled lookup structures: exact matches plus ordered regex rules. */
type RedirectTable = { map: Map<string, ResolvedRedirect>; regex: RegexRule[] };

const warn = (message: string): void => console.warn(`[redirects] ${message}`);

/** Resolves an entry's target + HTTP status: `moved` -> 301, `found` -> 302. */
function targetOf(entry: Redirect): ResolvedRedirect | null {
	if (entry.moved) return { to: entry.moved, status: 301 };
	if (entry.found) return { to: entry.found, status: 302 };
	return null;
}

/** Substitutes Azion backrefs: `%N$` is capture group N, `%s` the next group in order. */
export function applyTemplate(template: string, match: RegExpExecArray): string {
	let nextGroup = 0;
	return template
		.replace(/%(\d+)\$/g, (_whole: string, index: string) => match[Number(index)] ?? '')
		.replace(/%s/g, () => match[++nextGroup] ?? '');
}

/** Splits entries into an exact lookup and ordered regex rules; a duplicate source keeps the last. */
function indexEntries(entries: Redirect[]): {
	exact: Map<string, ResolvedRedirect>;
	regex: RegexRule[];
} {
	const exact = new Map<string, ResolvedRedirect>();
	const regex: RegexRule[] = [];

	for (const entry of entries) {
		const target = targetOf(entry);
		if (!target) {
			warn(`entry without moved/found ignored: ${JSON.stringify(entry)}`);
			continue;
		}
		if (entry.from_regex) {
			regex.push({ re: new RegExp(entry.from_regex), template: target.to, status: target.status });
			continue;
		}
		if (!entry.from) {
			warn(`entry without from/from_regex ignored: ${JSON.stringify(entry)}`);
			continue;
		}
		const key = normalizeUrl(entry.from);
		const existing = exact.get(key);
		if (existing && normalizeUrl(existing.to) !== normalizeUrl(target.to)) {
			warn(`conflicting duplicate for ${key}: ${existing.to} vs ${target.to} (keeping last)`);
		}
		exact.set(key, target);
	}

	return { exact, regex };
}

/** Follows exact redirects from `sourceKey` to the final target, stopping on a cycle. */
function finalTargetOf(sourceKey: string, exact: Map<string, ResolvedRedirect>): string {
	let target = (exact.get(sourceKey) as ResolvedRedirect).to;
	const visited = new Set<string>([sourceKey]);
	for (let nextKey = normalizeUrl(target); exact.has(nextKey) && !visited.has(nextKey); ) {
		visited.add(nextKey);
		target = (exact.get(nextKey) as ResolvedRedirect).to;
		nextKey = normalizeUrl(target);
	}
	return target;
}

/** Collapses `A -> B -> C` into `A -> C`, keeping each entry's own status; drops self-redirects. */
function flattenChains(exact: Map<string, ResolvedRedirect>): Map<string, ResolvedRedirect> {
	const flattened = new Map<string, ResolvedRedirect>();
	for (const [sourceKey, entry] of exact) {
		const to = finalTargetOf(sourceKey, exact);
		if (normalizeUrl(to) === sourceKey) {
			warn(`self-redirect dropped: ${sourceKey}`);
			continue;
		}
		flattened.set(sourceKey, { to, status: entry.status });
	}
	return flattened;
}

/** Builds the lookup structures from raw entries (pure, for tests). */
export function buildTable(entries: Redirect[]): RedirectTable {
	const { exact, regex } = indexEntries(entries);
	return { map: flattenChains(exact), regex };
}

const { map, regex } = buildTable(redirects);

/** Exact lookup table, keyed by normalized `from`. */
export const redirectMap: Map<string, ResolvedRedirect> = map;

/** Pattern rules from `from_regex` entries, tried in order after an exact miss. */
export const regexRules: RegexRule[] = regex;

/** Total number of active redirects served (exact + regex). */
export const redirectCount = redirectMap.size + regexRules.length;

/** Resolves a request URL: an exact match wins, then regex rules in order; `null` when unknown. */
export function resolveRedirect(requestUrl: string): ResolvedRedirect | null {
	const exact = redirectMap.get(normalizeUrl(requestUrl));
	if (exact) return exact;
	for (const rule of regexRules) {
		const match = rule.re.exec(requestUrl);
		if (match) return { to: applyTemplate(rule.template, match), status: rule.status };
	}
	return null;
}
