import { afterEach, describe, expect, test, vi } from 'vitest';

import {
	csvField,
	fetchZeroResults,
	lastCompleteWeek,
	readConfig,
	toCsv,
	weekFrom,
	weekStartArg,
} from './algolia-zero-results';

const config = { appId: 'APP', apiKey: 'KEY', host: 'https://analytics.us.algolia.com' };
const index = { name: 'azion-doc-en', lang: 'en' };
const week = { start: '2026-11-02', end: '2026-11-08' };

function mockFetch(...responses: { status: number; body: unknown }[]) {
	const fetchMock = vi.fn();
	for (const { status, body } of responses) {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(body), {
				status,
				headers: { 'content-type': 'application/json' },
			})
		);
	}
	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe('lastCompleteWeek', () => {
	test.each([
		['2026-11-09T12:00:00Z', 'Monday'],
		['2026-11-12T23:59:00Z', 'Thursday'],
		['2026-11-15T00:00:00Z', 'Sunday'],
	])('%s (%s) gives the Monday to Sunday week before it', (today) => {
		expect(lastCompleteWeek(new Date(today))).toEqual(week);
	});
});

describe('weekFrom', () => {
	test('spans seven days across a month boundary', () => {
		expect(weekFrom('2026-10-26')).toEqual({ start: '2026-10-26', end: '2026-11-01' });
	});

	test.each(['2026-13-01', '2026-02-30', '26-11-02', ''])('rejects %j', (value) => {
		expect(() => weekFrom(value)).toThrow(/YYYY-MM-DD/);
	});
});

describe('csvField', () => {
	test.each([
		['kv store', 'kv store'],
		['cache, purge', '"cache, purge"'],
		['say "hi"', '"say ""hi"""'],
		['line\nbreak', '"line\nbreak"'],
		['=HYPERLINK("x")', `"'=HYPERLINK(""x"")"`],
		['+1', "'+1"],
		['-rf', "'-rf"],
		['@sum', "'@sum"],
		[42, '42'],
	])('%j becomes %j', (input, expected) => {
		expect(csvField(input)).toBe(expected);
	});
});

describe('toCsv', () => {
	test('sorts by count, highest first, under the header', () => {
		const rows = [
			{ index: 'azion-doc-en', lang: 'en', search: 'low', count: 1, withFilterCount: 0 },
			{ index: 'azion-doc-ptbr', lang: 'pt-br', search: 'high', count: 9, withFilterCount: 2 },
		];
		expect(toCsv(week, rows)).toBe(
			'week_start,week_end,index,lang,query,count,with_filter_count\n' +
				'2026-11-02,2026-11-08,azion-doc-ptbr,pt-br,high,9,2\n' +
				'2026-11-02,2026-11-08,azion-doc-en,en,low,1,0\n'
		);
	});
});

describe('fetchZeroResults', () => {
	test('pages with offset until a short page comes back', async () => {
		const full = Array.from({ length: 1000 }, (_, i) => ({
			search: `q${i}`,
			count: 1,
			withFilterCount: 0,
		}));
		const fetchMock = mockFetch(
			{ status: 200, body: { searches: full } },
			{ status: 200, body: { searches: [{ search: 'last', count: 3 }] } }
		);

		const rows = await fetchZeroResults(config, index, week);

		expect(rows).toHaveLength(1001);
		expect(rows.at(-1)).toEqual({
			index: 'azion-doc-en',
			lang: 'en',
			search: 'last',
			count: 3,
			withFilterCount: 0,
		});
		const urls = fetchMock.mock.calls.map(([url]) => new URL(url as string));
		expect(urls.map((url) => url.searchParams.get('offset'))).toEqual(['0', '1000']);
		expect(urls[0].pathname).toBe('/2/searches/noResults');
		expect(Object.fromEntries(urls[0].searchParams)).toMatchObject({
			index: 'azion-doc-en',
			startDate: '2026-11-02',
			endDate: '2026-11-08',
			limit: '1000',
		});
		expect(fetchMock.mock.calls[0][1].headers).toMatchObject({
			'x-algolia-application-id': 'APP',
			'x-algolia-api-key': 'KEY',
		});
	});

	test.each([
		[402, /not enabled/],
		[403, /analytics ACL/],
		[404, /Index not found/],
	])('explains HTTP %i', async (status, message) => {
		mockFetch({ status, body: { message: 'upstream' } });
		const failure = fetchZeroResults(config, index, week);
		await expect(failure).rejects.toThrow(message);
		await expect(failure).rejects.toThrow(/upstream$/);
	});

	test('falls back to the API message for other statuses', async () => {
		mockFetch({ status: 400, body: { message: 'Bad date' } });
		await expect(fetchZeroResults(config, index, week)).rejects.toThrow('HTTP 400. Bad date');
	});
});

describe('weekStartArg', () => {
	test.each([
		[['--week-start=2026-11-02'], '2026-11-02'],
		[['--week-start', '2026-11-02'], '2026-11-02'],
		[[], undefined],
	])('%j gives %j', (args, expected) => {
		expect(weekStartArg(args)).toBe(expected);
	});

	test.each([[['--week-start']], [['--week-start=']]])('%j without a date throws', (args) => {
		expect(() => weekStartArg(args)).toThrow(/needs a date/);
	});
});

describe('readConfig', () => {
	test('requires the analytics key', () => {
		expect(() => readConfig({})).toThrow(/ALGOLIA_ANALYTICS_API_KEY/);
	});

	test('defaults the app id and the US host', () => {
		expect(readConfig({ ALGOLIA_ANALYTICS_API_KEY: 'k' })).toEqual({
			appId: 'PYJUZH6VNQ',
			apiKey: 'k',
			host: 'https://analytics.us.algolia.com',
		});
	});

	test('switches to the DE host and rejects unknown regions', () => {
		expect(
			readConfig({ ALGOLIA_ANALYTICS_API_KEY: 'k', ALGOLIA_ANALYTICS_REGION: 'de' }).host
		).toBe('https://analytics.de.algolia.com');
		expect(() =>
			readConfig({ ALGOLIA_ANALYTICS_API_KEY: 'k', ALGOLIA_ANALYTICS_REGION: 'eu' })
		).toThrow(/"us" or "de"/);
	});
});
