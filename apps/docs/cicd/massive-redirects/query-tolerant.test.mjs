import { describe, expect, it } from 'vitest';
import { en, pt } from '../../redirects/index.js';
import {
	conversionErrors,
	escapeRegex,
	sourceOf,
	toQueryTolerant,
	toQueryTolerantEntries,
} from './query-tolerant.mjs';

const SIZE_LIMIT_BYTES = 300 * 1024;
const QUERY = '?utm_source=chatgpt.com';

// Mirrors massive_redirect() in the Lua function: the URL it compares carries the
// query string; `from` is compared by equality, `from_regex` with ngx.re.match(url, re,
// "io"); the destination goes through order_values_to_unpack + string.format.
function luaFormat(template, captures) {
	const order = [];
	const format = template.replace(/%(\d+)\$/g, (_m, i) => {
		order.push(captures[Number(i) - 1]);
		return '%s';
	});
	const args = order.length ? order : captures;
	let next = 0;
	return format.replace(/%(%|s)/g, (_m, d) => (d === '%' ? '%' : String(args[next++])));
}

function massiveRedirect(url, entries) {
	for (const entry of entries) {
		const destination = entry.moved ?? entry.found;
		if (entry.from !== undefined && url === entry.from) return destination;
		if (entry.from_regex !== undefined) {
			const m = url.match(new RegExp(entry.from_regex, 'i'));
			// ngx.re.match returns `false` for a group that did not participate.
			if (m)
				return luaFormat(
					destination,
					m.slice(1).map((c) => c ?? false)
				);
		}
	}
	return null;
}

const redirect = (from, moved) => toQueryTolerantEntries([{ from, moved }]);

describe('toQueryTolerant', () => {
	const from = 'https://www.azion.com/en/documentation/products/secure/automate/integrate-siems/';
	const moved =
		'https://www.azion.com/en/documentation/guides/application-security/firewall-and-waf/integrate-siems/';

	it('redirects the URL from the ticket with ?utm_source=chatgpt.com and keeps the query', () => {
		expect(massiveRedirect(`${from}${QUERY}`, redirect(from, moved))).toBe(`${moved}${QUERY}`);
	});

	it('redirects pt-br with ?utm_source=chatgpt.com and keeps the query', () => {
		const ptFrom = 'https://www.azion.com/pt-br/documentacao/produtos/accounts/creating-account/';
		const ptMoved = 'https://www.azion.com/pt-br/documentacao/fundamentos/criar-uma-conta/';
		expect(massiveRedirect(`${ptFrom}${QUERY}`, redirect(ptFrom, ptMoved))).toBe(
			`${ptMoved}${QUERY}`
		);
	});

	it('keeps the redirect without a query exactly as before', () => {
		expect(massiveRedirect(from, redirect(from, moved))).toBe(moved);
	});

	it('keeps every parameter of a longer query', () => {
		const query = '?utm_source=x&utm_medium=y&utm_campaign=z';
		expect(massiveRedirect(`${from}${query}`, redirect(from, moved))).toBe(`${moved}${query}`);
	});

	it('never writes "false" when there is no query', () => {
		expect(massiveRedirect(from, redirect(from, moved))).not.toContain('false');
	});

	it('puts the query before the fragment of the destination', () => {
		const anchored = `${moved}#siem`;
		expect(massiveRedirect(`${from}${QUERY}`, redirect(from, anchored))).toBe(
			`${moved}${QUERY}#siem`
		);
	});

	it('does not catch a different path that starts the same way', () => {
		const entries = redirect(from, moved);
		expect(massiveRedirect(`${from}child/`, entries)).toBeNull();
		expect(massiveRedirect(`${from}child/${QUERY}`, entries)).toBeNull();
		expect(massiveRedirect(from.slice(0, -1), entries)).toBeNull();
	});

	it('treats the dots of the URL as literal characters', () => {
		expect(
			massiveRedirect(from.replace('www.azion.com', 'wwwXazionXcom'), redirect(from, moved))
		).toBeNull();
	});

	it('keeps a literal percent sign in the destination', () => {
		const encoded = 'https://www.azion.com/pt-br/documentacao/a%C3%A7%C3%A3o/';
		expect(massiveRedirect(`${from}${QUERY}`, redirect(from, encoded))).toBe(`${encoded}${QUERY}`);
	});

	it('converts "found" entries the same way', () => {
		const [entry] = toQueryTolerantEntries([{ from, found: moved }]);
		expect(entry).toEqual({ from_regex: `^${escapeRegex(from)}(\\?.*|)$`, found: `${moved}%1$` });
	});

	it('leaves from_regex entries and from entries with their own query untouched', () => {
		const regex = {
			from_regex: '^https://www\\.azion\\.com/x/(.*)$',
			moved: 'https://www.azion.com/y/%1$',
		};
		const withQuery = { from: `${from}?lang=en`, moved };
		expect(toQueryTolerant(regex)).toBe(regex);
		expect(toQueryTolerant(withQuery)).toBe(withQuery);
	});

	it('reports a destination that already holds a capture reference', () => {
		expect(conversionErrors('en/00.json', [{ from, moved: `${moved}%1$` }])).toHaveLength(1);
		expect(conversionErrors('en/00.json', [{ from, moved }])).toHaveLength(0);
	});

	it('reports a destination with its own query string', () => {
		expect(conversionErrors('en/00.json', [{ from, moved: `${moved}?a=1` }])).toHaveLength(1);
		expect(conversionErrors('en/00.json', [{ from, moved: `${moved}#a?b` }])).toHaveLength(0);
	});

	it('leaves an entry with no destination for the validation to report', () => {
		const broken = { from };
		expect(toQueryTolerant(broken)).toBe(broken);
	});

	it('recovers the plain source from a converted entry', () => {
		const [converted] = redirect(from, moved);
		expect(sourceOf(converted)).toBe(from);
		expect(sourceOf({ from, moved })).toBe(from);
		expect(sourceOf({ from_regex: '^x(.*)$', moved })).toBe('regex:^x(.*)$');
	});
});

describe.each([
	['en/00.json', en['00']],
	['en/01.json', en['01']],
	['pt-br/00.json', pt['00']],
	['pt-br/01.json', pt['01']],
])('%s as published', (file, entries) => {
	it('fits the 300 KB Massive Redirect limit', () => {
		const published = toQueryTolerantEntries(entries);
		expect(Buffer.byteLength(JSON.stringify(published))).toBeLessThanOrEqual(SIZE_LIMIT_BYTES);
	});

	it('has no destination the conversion cannot carry', () => {
		expect(conversionErrors(file, entries)).toEqual([]);
	});
});

// Each language runs two rules in a row (00, then 01); when both match, the later one
// sets the Location. A visitor then follows the Location until nothing matches. The
// regex is case-insensitive (the function's "i" flag), so a hop can be skipped, but
// the page a visitor lands on must not change.
const HOPS = 10;

function land(url, instances) {
	let current = url;
	for (let hop = 0; hop < HOPS; hop++) {
		let next = null;
		for (const entries of instances) next = massiveRedirect(current, entries) ?? next;
		if (next === null) return current;
		if (next === current) throw new Error(`${url} redirects to itself at ${current}`);
		current = next;
	}
	throw new Error(`${url} still redirects after ${HOPS} hops (a loop?)`);
}

const stripQuery = (url) => url.replace(/\?[^#]*/, '');

describe.each([
	['en', [en['00'], en['01']]],
	['pt-br', [pt['00'], pt['01']]],
])('%s redirects as published', (_lang, today) => {
	const published = today.map(toQueryTolerantEntries);
	const sources = [...new Set(today.flat().map((entry) => entry.from))];

	it('lands every source without a query on the page it lands on today', () => {
		const changed = sources.filter((from) => land(from, published) !== land(from, today));
		expect(changed).toEqual([]);
	});

	it('lands every source with ?utm_source=chatgpt.com on that page, keeping the query', () => {
		const wrong = sources.filter((from) => {
			const landed = land(`${from}${QUERY}`, published);
			return stripQuery(landed) !== land(from, today) || !landed.includes(QUERY);
		});
		expect(wrong).toEqual([]);
	});
});
