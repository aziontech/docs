import { conversionErrors, toQueryTolerantEntries } from './query-tolerant.mjs';

export const SIZE_LIMIT_BYTES = 300 * 1024;

export function shapeErrors(location, entries) {
	if (!Array.isArray(entries) || entries.length === 0) {
		return [`${location}: expected a non-empty array of redirects`];
	}
	const errors = [];
	entries.forEach((entry, index) => {
		const hasFrom = typeof entry?.from === 'string';
		const hasRegex = typeof entry?.from_regex === 'string';
		const hasMoved = typeof entry?.moved === 'string';
		const hasFound = typeof entry?.found === 'string';
		if (hasFrom === hasRegex)
			errors.push(`${location}[${index}]: needs exactly one of "from" / "from_regex"`);
		if (hasMoved === hasFound)
			errors.push(`${location}[${index}]: needs exactly one of "moved" / "found"`);
	});
	return errors;
}

export function sizeOf(location, entries) {
	const bytes = Buffer.byteLength(JSON.stringify(entries));
	const errors =
		bytes > SIZE_LIMIT_BYTES
			? [
					`${location} is ${(bytes / 1024).toFixed(1)} KB as published, over the 300 KB Massive Redirect limit`,
				]
			: [];
	return { bytes, errors };
}

export function prepareEntries(location, written, { exact = false } = {}) {
	const shape = shapeErrors(location, written);
	if (shape.length) return { entries: [], bytes: 0, errors: shape };

	const entries = exact ? written : toQueryTolerantEntries(written);
	const size = sizeOf(location, entries);
	const errors = [...(exact ? [] : conversionErrors(location, written)), ...size.errors];
	return { entries, bytes: size.bytes, errors };
}
