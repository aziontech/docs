import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const INDEXES = [
	{ name: 'azion-doc-en', lang: 'en' },
	{ name: 'azion-doc-ptbr', lang: 'pt-br' },
];
const PAGE_SIZE = 1000;
const HOSTS: Record<string, string> = {
	us: 'https://analytics.us.algolia.com',
	de: 'https://analytics.de.algolia.com',
};
const ERRORS: Record<number, string> = {
	402: 'Algolia Analytics is not enabled on this plan.',
	403: 'The API key does not have the analytics ACL.',
	404: 'Index not found.',
};

export interface Week {
	start: string;
	end: string;
}

export interface Row {
	index: string;
	lang: string;
	search: string;
	count: number;
	withFilterCount: number;
}

interface Config {
	appId: string;
	apiKey: string;
	host: string;
}

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

function addDays(date: Date, days: number) {
	const next = new Date(date);
	next.setUTCDate(next.getUTCDate() + days);
	return next;
}

export function lastCompleteWeek(today: Date): Week {
	const sinceMonday = (today.getUTCDay() + 6) % 7;
	const start = addDays(today, -sinceMonday - 7);
	return { start: isoDay(start), end: isoDay(addDays(start, 6)) };
}

export function weekFrom(start: string): Week {
	const date = new Date(`${start}T00:00:00Z`);
	if (Number.isNaN(date.getTime()) || isoDay(date) !== start) {
		throw new Error(`--week-start must be a date in YYYY-MM-DD format, got "${start}".`);
	}
	return { start, end: isoDay(addDays(date, 6)) };
}

export function csvField(value: string | number) {
	let text = String(value);
	if (typeof value === 'string' && /^[=+\-@]/.test(text)) text = `'${text}`;
	return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(week: Week, rows: Row[]) {
	const header = 'week_start,week_end,index,lang,query,count,with_filter_count';
	const lines = [...rows]
		.sort((a, b) => b.count - a.count)
		.map((row) =>
			[week.start, week.end, row.index, row.lang, row.search, row.count, row.withFilterCount]
				.map(csvField)
				.join(',')
		);
	return [header, ...lines].join('\n') + '\n';
}

export async function fetchZeroResults(
	config: Config,
	index: { name: string; lang: string },
	week: Week
): Promise<Row[]> {
	const rows: Row[] = [];
	for (let offset = 0; ; offset += PAGE_SIZE) {
		const params = new URLSearchParams({
			index: index.name,
			startDate: week.start,
			endDate: week.end,
			limit: String(PAGE_SIZE),
			offset: String(offset),
		});
		const response = await fetch(`${config.host}/2/searches/noResults?${params}`, {
			headers: {
				'x-algolia-application-id': config.appId,
				'x-algolia-api-key': config.apiKey,
				accept: 'application/json',
			},
		});
		if (!response.ok) {
			const body = (await response.json().catch(() => ({}))) as { message?: string };
			const reason =
				[ERRORS[response.status], body.message].filter(Boolean).join(' ') || response.statusText;
			throw new Error(`${index.name}: HTTP ${response.status}. ${reason}`);
		}
		const { searches } = (await response.json()) as {
			searches: { search: string; count: number; withFilterCount?: number }[];
		};
		for (const entry of searches) {
			rows.push({
				index: index.name,
				lang: index.lang,
				search: entry.search,
				count: entry.count,
				withFilterCount: entry.withFilterCount ?? 0,
			});
		}
		if (searches.length < PAGE_SIZE) return rows;
	}
}

export function weekStartArg(args: string[]): string | undefined {
	const at = args.findIndex((arg) => arg === '--week-start' || arg.startsWith('--week-start='));
	if (at === -1) return undefined;
	const value = args[at].includes('=') ? args[at].split('=')[1] : args[at + 1];
	if (!value) throw new Error('--week-start needs a date in YYYY-MM-DD format.');
	return value;
}

export function readConfig(env: NodeJS.ProcessEnv): Config {
	const apiKey = env.ALGOLIA_ANALYTICS_API_KEY;
	if (!apiKey) {
		throw new Error('Set ALGOLIA_ANALYTICS_API_KEY to an Algolia key with the analytics ACL.');
	}
	const region = env.ALGOLIA_ANALYTICS_REGION ?? 'us';
	const host = HOSTS[region];
	if (!host) throw new Error(`ALGOLIA_ANALYTICS_REGION must be "us" or "de", got "${region}".`);
	return { appId: env.ALGOLIA_APP_ID ?? 'PYJUZH6VNQ', apiKey, host };
}

async function main() {
	const config = readConfig(process.env);
	const start = weekStartArg(process.argv.slice(2));
	const week = start ? weekFrom(start) : lastCompleteWeek(new Date());

	const rows: Row[] = [];
	for (const index of INDEXES) rows.push(...(await fetchZeroResults(config, index, week)));

	const dir = fileURLToPath(new URL('../../../reports/algolia-zero-results/', import.meta.url));
	mkdirSync(dir, { recursive: true });
	const file = `${dir}zero-results-${week.start}_${week.end}.csv`;
	writeFileSync(file, toCsv(week, rows));
	console.log(`${rows.length} zero-result queries, ${week.start} to ${week.end}: ${file}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((error: Error) => {
		console.error(error.message);
		process.exit(1);
	});
}
