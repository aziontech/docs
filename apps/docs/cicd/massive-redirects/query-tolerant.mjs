const REGEX_SPECIALS = /[\\^$.|?*+()[\]{}]/g;
const QUERY_GROUP = '(\\?.*|)';
const PLACEHOLDER = '%1$';

export const escapeRegex = (value) => value.replace(REGEX_SPECIALS, '\\$&');

const escapeFormat = (value) => value.replace(/%/g, '%%');

function withQueryPlaceholder(destination) {
	const hash = destination.indexOf('#');
	const base = hash === -1 ? destination : destination.slice(0, hash);
	const fragment = hash === -1 ? '' : destination.slice(hash);
	return `${escapeFormat(base)}${PLACEHOLDER}${escapeFormat(fragment)}`;
}

export function toQueryTolerant(entry) {
	if (typeof entry?.from !== 'string' || entry.from.includes('?')) return entry;

	const key = ['moved', 'found'].find((k) => typeof entry[k] === 'string');
	if (!key) return entry;

	return {
		from_regex: `^${escapeRegex(entry.from)}${QUERY_GROUP}$`,
		[key]: withQueryPlaceholder(entry[key]),
	};
}

export const toQueryTolerantEntries = (entries) => entries.map(toQueryTolerant);

const CONVERTED = /^\^(.*)\(\\\?\.\*\|\)\$$/;

export function sourceOf(entry) {
	if (typeof entry?.from === 'string') return entry.from;
	const converted = CONVERTED.exec(entry?.from_regex ?? '');
	return converted ? converted[1].replace(/\\(.)/g, '$1') : `regex:${entry?.from_regex}`;
}

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
