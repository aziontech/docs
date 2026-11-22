import { describe, expect, it } from 'vitest';
import { prepareEntries, shapeErrors, SIZE_LIMIT_BYTES, sizeOf } from './validate.mjs';

const from = 'https://www.azion.com/en/documentation/old/';
const moved = 'https://www.azion.com/en/documentation/new/';

describe('prepareEntries', () => {
	it('rejects an entry with both "moved" and "found" instead of dropping one', () => {
		const result = prepareEntries('en/00.json', [{ from, moved, found: moved }]);
		expect(result.errors).toEqual(['en/00.json[0]: needs exactly one of "moved" / "found"']);
		expect(result.entries).toEqual([]);
	});

	it('rejects an entry with both "from" and "from_regex" instead of dropping one', () => {
		const result = prepareEntries('en/00.json', [{ from, from_regex: '^x$', moved }]);
		expect(result.errors).toEqual(['en/00.json[0]: needs exactly one of "from" / "from_regex"']);
	});

	it('rejects the same entries in the exact format', () => {
		const result = prepareEntries('en/00.json', [{ from, moved, found: moved }], { exact: true });
		expect(result.errors).toHaveLength(1);
	});

	it('rejects an empty file', () => {
		expect(prepareEntries('en/00.json', []).errors).toEqual([
			'en/00.json: expected a non-empty array of redirects',
		]);
	});

	it('converts a valid file and measures it as published', () => {
		const result = prepareEntries('en/00.json', [{ from, moved }]);
		expect(result.errors).toEqual([]);
		expect(result.entries[0]).toHaveProperty('from_regex');
		expect(result.bytes).toBe(Buffer.byteLength(JSON.stringify(result.entries)));
	});

	it('keeps the written entries in the exact format', () => {
		const written = [{ from, moved }];
		expect(prepareEntries('en/00.json', written, { exact: true }).entries).toBe(written);
	});

	it('reports a destination the conversion cannot carry', () => {
		const result = prepareEntries('en/00.json', [{ from, moved: `${moved}?a=1` }]);
		expect(result.errors).toHaveLength(1);
	});
});

describe('sizeOf', () => {
	it('rejects a file over 300 KB as published', () => {
		const big = [{ from, moved: `${moved}${'x'.repeat(SIZE_LIMIT_BYTES)}` }];
		expect(sizeOf('en/01.json', big).errors).toHaveLength(1);
		expect(sizeOf('en/01.json', [{ from, moved }]).errors).toEqual([]);
	});
});

describe('shapeErrors', () => {
	it('accepts every supported pair of fields', () => {
		expect(
			shapeErrors('en/00.json', [
				{ from, moved },
				{ from, found: moved },
				{ from_regex: '^x$', moved },
				{ from_regex: '^x$', found: moved },
			])
		).toEqual([]);
	});
});
