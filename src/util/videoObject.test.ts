import { describe, expect, test } from 'vitest';
import { getVideoObjectSchema, normalizeUploadDate } from './videoObject';

describe('normalizeUploadDate', () => {
	test('date-only gains midnight UTC offset', () => {
		expect(normalizeUploadDate('2024-05-15')).toBe('2024-05-15T00:00:00+00:00');
	});
	test('datetime without offset gains Z', () => {
		expect(normalizeUploadDate('2024-05-15T18:00:00')).toBe('2024-05-15T18:00:00Z');
	});
	test('datetime already in UTC is kept', () => {
		expect(normalizeUploadDate('2024-05-15T18:00:00Z')).toBe('2024-05-15T18:00:00Z');
	});
	test('datetime with explicit offset is kept', () => {
		expect(normalizeUploadDate('2024-05-15T18:00:00-03:00')).toBe('2024-05-15T18:00:00-03:00');
	});
	test('empty/undefined returns undefined', () => {
		expect(normalizeUploadDate(undefined)).toBeUndefined();
		expect(normalizeUploadDate('')).toBeUndefined();
		expect(normalizeUploadDate('   ')).toBeUndefined();
	});
});

describe('getVideoObjectSchema', () => {
	const base = {
		src: 'https://www.youtube.com/embed/KB4f4bSyHgI?autoplay=1',
		title: 'How to look up DNS servers with Dig command',
	};

	test('emits embedUrl and a derived YouTube thumbnail (never contentUrl)', () => {
		const schema = getVideoObjectSchema(base);
		expect(schema.embedUrl).toBe(base.src);
		expect(schema.thumbnailUrl).toBe('https://i.ytimg.com/vi/KB4f4bSyHgI/hqdefault.jpg');
		expect(schema).not.toHaveProperty('contentUrl');
	});

	test('description falls back to the title when absent', () => {
		expect(getVideoObjectSchema(base).description).toBe(base.title);
	});

	test('description is used when provided', () => {
		const schema = getVideoObjectSchema({ ...base, description: 'A real description.' });
		expect(schema.description).toBe('A real description.');
	});

	test('uploadDate is normalized to ISO 8601 with timezone', () => {
		const schema = getVideoObjectSchema({ ...base, uploadDate: '2023-07-03' });
		expect(schema.uploadDate).toBe('2023-07-03T00:00:00+00:00');
	});

	test('omits uploadDate and duration when not provided', () => {
		const schema = getVideoObjectSchema(base);
		expect(schema).not.toHaveProperty('uploadDate');
		expect(schema).not.toHaveProperty('duration');
	});
});
