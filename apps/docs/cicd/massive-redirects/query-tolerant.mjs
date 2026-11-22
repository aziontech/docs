// The Massive Redirect function (Marketplace, Lua) builds the request URL as
// scheme://host + uri, where uri carries the query string, and compares it with
// `from` by plain string equality. An old URL with ?utm_source=... (or any query)
// therefore never matches and falls through to the origin, which answers 404.
//
// The function also accepts `from_regex`: it runs ngx.re.match(url, from_regex, "io")
// and builds the destination with string.format, where %1$ is the first capture.
// So every exact `from` is published as an anchored regex that accepts an optional
// query, and the captured query is appended to the destination before its #fragment.
//
// The group is `(\?.*|)` on purpose, not `(\?.*)?`: an optional group that does not
// participate comes back as `false` from ngx.re.match, and string.format would write
// the word "false" into the Location header. `(\?.*|)` always matches, at worst the
// empty string.

const REGEX_SPECIALS = /[\\^$.|?*+()[\]{}]/g;
const QUERY_GROUP = '(\\?.*|)';
const PLACEHOLDER = '%1$';

export const escapeRegex = (value) => value.replace(REGEX_SPECIALS, '\\$&');

// string.format reads `%` as a directive, so a literal one is written `%%`.
const escapeFormat = (value) => value.replace(/%/g, '%%');

function withQueryPlaceholder(destination) {
	const hash = destination.indexOf('#');
	const base = hash === -1 ? destination : destination.slice(0, hash);
	const fragment = hash === -1 ? '' : destination.slice(hash);
	return `${escapeFormat(base)}${PLACEHOLDER}${escapeFormat(fragment)}`;
}

/**
 * Turns one `{ from, moved | found }` entry into its query-tolerant form.
 * Entries that are already `from_regex`, or whose `from` carries its own query,
 * are left exactly as written.
 */
export function toQueryTolerant(entry) {
	if (typeof entry?.from !== 'string' || entry.from.includes('?')) return entry;

	// Leave a malformed entry as written: validateRedirects names it with its index.
	const key = ['moved', 'found'].find((k) => typeof entry[k] === 'string');
	if (!key) return entry;

	return {
		from_regex: `^${escapeRegex(entry.from)}${QUERY_GROUP}$`,
		[key]: withQueryPlaceholder(entry[key]),
	};
}

export const toQueryTolerantEntries = (entries) => entries.map(toQueryTolerant);

const CONVERTED = /^\^(.*)\(\\\?\.\*\|\)\$$/;

/** The plain source URL of an entry, whether it is published as `from` or converted. */
export function sourceOf(entry) {
	if (typeof entry?.from === 'string') return entry.from;
	const converted = CONVERTED.exec(entry?.from_regex ?? '');
	return converted ? converted[1].replace(/\\(.)/g, '$1') : `regex:${entry?.from_regex}`;
}

/**
 * Problems the conversion cannot fix on its own. A destination that already holds a
 * `%N$` sequence would be read by the function as a capture reference, and one with
 * its own query would get a second `?` appended.
 */
export function conversionErrors(location, entries) {
	const errors = [];
	entries.forEach((entry, index) => {
		if (typeof entry?.from !== 'string' || entry.from.includes('?')) return;
		const destination = entry.moved ?? entry.found ?? '';
		if (/%\d+\$/.test(destination)) {
			errors.push(
				`${location}[${index}]: the destination contains a "%N$" sequence, which Massive Redirect reads as a capture`
			);
		}
		if (destination.split('#')[0].includes('?')) {
			errors.push(
				`${location}[${index}]: the destination has its own query string, so the request query cannot be appended to it`
			);
		}
	});
	return errors;
}
