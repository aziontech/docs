import { appendFileSync } from 'node:fs';
import process from 'node:process';
import { en00, en01, ptbr00, ptbr01 } from '../../redirects/index.js';

const MASSIVE_REDIRECT_FUNCTION_ID = 12;
const SIZE_LIMIT_BYTES = 300 * 1024;
const REQUEST_TIMEOUT_MS = 60_000;
const MAX_ATTEMPTS = 4;

const TARGETS = [
	{ instanceId: 8728, name: 'Doc | en | Massive 301 Redirect', file: 'en/00.json', entries: en00 },
	{
		instanceId: 50612,
		name: 'Doc | en | Massive 301 Redirect 02',
		file: 'en/01.json',
		entries: en01,
	},
	{
		instanceId: 15172,
		name: 'Doc | pt-br | Massive 301 Redirect',
		file: 'pt-br/00.json',
		entries: ptbr00,
	},
	{
		instanceId: 50611,
		name: 'Doc | pt-br | Massive 301 Redirect 02',
		file: 'pt-br/01.json',
		entries: ptbr01,
	},
];

const dryRun = process.argv.includes('--dry-run');
const apiUrl = (process.env.AZION_API_URL || 'https://api.azionapi.net').replace(/\/$/, '');
const token = process.env.AZION_TOKEN;
const applicationId = process.env.AZION_APPLICATION_ID;

const fail = (message) => {
	console.error(`::error::${message}`);
	process.exit(1);
};

const canonical = (value) =>
	JSON.stringify(value, (_key, v) =>
		v && typeof v === 'object' && !Array.isArray(v)
			? Object.fromEntries(
					Object.keys(v)
						.sort()
						.map((k) => [k, v[k]])
			  )
			: v
	);

const sourceOf = (entry) => entry.from ?? `regex:${entry.from_regex}`;

function validateRedirects(location, entries) {
	const errors = [];
	const bytes = Buffer.byteLength(JSON.stringify(entries));
	if (bytes > SIZE_LIMIT_BYTES) {
		errors.push(
			`${location} is ${(bytes / 1024).toFixed(1)} KB, over the 300 KB Massive Redirect limit`
		);
	}

	if (!Array.isArray(entries) || entries.length === 0) {
		return { errors: [`${location}: expected a non-empty array of redirects`], bytes };
	}

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

	return { errors, bytes };
}

async function request(method, path, body) {
	const url = `${apiUrl}/edge_applications/${applicationId}/functions_instances/${path}`;
	for (let attempt = 1; ; attempt++) {
		let response;
		try {
			response = await fetch(url, {
				method,
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json; version=3',
					'Content-Type': 'application/json',
				},
				body: body === undefined ? undefined : JSON.stringify(body),
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
		} catch (err) {
			if (attempt >= MAX_ATTEMPTS)
				throw new Error(`${method} ${path}: ${err.message}`, { cause: err });
			await retryDelay(attempt, `${method} ${path}: ${err.message}`);
			continue;
		}

		if (response.ok) return (await response.json()).results;

		const text = await response.text();
		// PATCH sets the whole args value, so repeating it is safe.
		const retryable = response.status === 429 || response.status >= 500;
		if (!retryable || attempt >= MAX_ATTEMPTS) {
			throw new Error(`${method} ${path}: HTTP ${response.status} ${text.slice(0, 500)}`);
		}
		await retryDelay(attempt, `${method} ${path}: HTTP ${response.status}`);
	}
}

function retryDelay(attempt, reason) {
	const ms = 2 ** attempt * 1000;
	console.log(`${reason}; retrying in ${ms / 1000}s (attempt ${attempt + 1}/${MAX_ATTEMPTS})`);
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function describeChange(current, next) {
	const before = new Set((Array.isArray(current) ? current : []).map(sourceOf));
	const after = new Set(next.map(sourceOf));
	const added = [...after].filter((s) => !before.has(s)).length;
	const removed = [...before].filter((s) => !after.has(s)).length;
	return { before: before.size, after: after.size, added, removed };
}

async function main() {
	if (!token)
		fail('AZION_TOKEN is not set: pass the token of the account that owns the application');
	if (!/^\d+$/.test(applicationId ?? ''))
		fail('AZION_APPLICATION_ID is not set or not numeric: pass the ID of the application');

	// 1. Validate every file and every instance before writing anything.
	const plan = [];
	const errors = [];
	for (const target of TARGETS) {
		const validated = validateRedirects(target.file, target.entries);
		errors.push(...validated.errors);

		let instance;
		try {
			instance = await request('GET', target.instanceId);
		} catch (err) {
			errors.push(err.message);
			continue;
		}
		if (instance.name !== target.name) {
			errors.push(
				`instance ${target.instanceId} is named "${instance.name}", expected "${target.name}"`
			);
		}
		if (instance.edge_function_id !== MASSIVE_REDIRECT_FUNCTION_ID) {
			errors.push(
				`instance ${target.instanceId} runs function ${instance.edge_function_id}, expected Massive Redirect (${MASSIVE_REDIRECT_FUNCTION_ID})`
			);
		}
		plan.push({ ...target, bytes: validated.bytes, current: instance.args });
	}

	if (errors.length) {
		for (const error of errors) console.error(`::error::${error}`);
		fail(`${errors.length} problem(s) found; no function instance was changed`);
	}

	// 2 + 3. Update what differs, then read it back.
	const rows = [];
	for (const item of plan) {
		const change = describeChange(item.current, item.entries);
		const summary = `${change.before} -> ${change.after} unique sources (+${change.added} / -${
			change.removed
		}), ${(item.bytes / 1024).toFixed(1)} KB`;

		if (canonical(item.current) === canonical(item.entries)) {
			console.log(`= ${item.name} (${item.instanceId}): already up to date`);
			rows.push([item.name, item.instanceId, item.file, 'unchanged', summary]);
			continue;
		}
		if (dryRun) {
			console.log(`~ ${item.name} (${item.instanceId}): would update, ${summary}`);
			rows.push([item.name, item.instanceId, item.file, 'would update', summary]);
			continue;
		}

		await request('PATCH', item.instanceId, { args: item.entries });
		const stored = await request('GET', item.instanceId);
		if (canonical(stored.args) !== canonical(item.entries)) {
			fail(
				`${item.name} (${item.instanceId}): the API accepted the update but returns different args`
			);
		}
		console.log(`✓ ${item.name} (${item.instanceId}): updated, ${summary}`);
		rows.push([item.name, item.instanceId, item.file, 'updated', summary]);
	}

	if (process.env.GITHUB_STEP_SUMMARY) {
		const lines = [
			`### Massive Redirect function instances${dryRun ? ' (dry run)' : ''}`,
			'',
			'| Instance | ID | File | Result | Change |',
			'| --- | --- | --- | --- | --- |',
			...rows.map(
				([name, id, file, result, change]) =>
					`| ${name} | ${id} | \`${file}\` | ${result} | ${change} |`
			),
			'',
		];
		appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
	}
}

main().catch((err) => fail(err.message));
