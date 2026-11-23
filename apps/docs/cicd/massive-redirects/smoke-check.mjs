import process from 'node:process';
import { en, pt } from '../../redirects/index.js';

const BUDGET_MS = 10 * 60_000;
const REQUEST_TIMEOUT_MS = 15_000;
const WAIT_MS = 20_000;
const CANDIDATES = 25;
const ROLLBACK =
	'The converted args are already live. To roll back, publish the previous format: MASSIVE_REDIRECT_FORMAT=exact pnpm --filter docs redirects:publish';

const deadline = Date.now() + BUDGET_MS;
const timeLeft = () => deadline - Date.now();

function attemptsFromEnv() {
	const raw = process.env.SMOKE_ATTEMPTS ?? '10';
	const value = Number(raw);
	if (!Number.isInteger(value) || value < 1) {
		console.error(`::error::SMOKE_ATTEMPTS must be a positive integer, got "${raw}"`);
		process.exit(1);
	}
	return value;
}

const ATTEMPTS = attemptsFromEnv();

const wait = () =>
	new Promise((resolve) => setTimeout(resolve, Math.max(0, Math.min(WAIT_MS, timeLeft()))));

async function head(url) {
	const response = await fetch(url, {
		method: 'HEAD',
		redirect: 'manual',
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});
	return { status: response.status, location: response.headers.get('location') };
}

async function pick(files, prefix) {
	const sources = new Set(files.flat().map((entry) => entry.from));
	const candidates = files
		.at(-1)
		.filter(
			({ from, moved }) =>
				from.startsWith(prefix) &&
				moved &&
				!moved.includes('#') &&
				!sources.has(moved) &&
				!from.includes('?')
		)
		.slice(0, CANDIDATES);

	for (let attempt = 1; attempt <= ATTEMPTS && timeLeft() > 0; attempt++) {
		for (const { from, moved } of candidates) {
			if (timeLeft() <= 0) break;
			const plain = await head(from).catch(() => null);
			if (plain?.status === 301 && plain.location === moved) return { from, moved };
		}
		console.log(
			`Attempt ${attempt}: no ${prefix} redirect answered 301 without a query; retrying in ${WAIT_MS / 1000}s`
		);
		await wait();
	}
	throw new Error(
		`none of the first ${CANDIDATES} ${prefix} redirects answers 301 without a query, so the query check cannot run. ${ROLLBACK}`
	);
}

async function check({ from, moved }) {
	const query = `?utm_source=chatgpt.com&deploy_check=${Date.now()}`;
	const { status, location } = await head(`${from}${query}`);
	return {
		ok: status === 301 && location === `${moved}${query}`,
		detail: `HTTP ${status}, location ${location ?? '(none)'}`,
		url: `${from}${query}`,
	};
}

async function verify(target) {
	let result;
	for (let attempt = 1; attempt <= ATTEMPTS && timeLeft() > 0; attempt++) {
		result = await check(target).catch((err) => ({
			ok: false,
			detail: err.message,
			url: target.from,
		}));
		if (result.ok) {
			console.log(`✓ ${result.url} -> ${result.detail}`);
			return;
		}
		console.log(`Attempt ${attempt}: ${result.detail}; retrying in ${WAIT_MS / 1000}s`);
		await wait();
	}
	throw new Error(
		`${result?.url ?? target.from} should answer 301 to ${target.moved} with its query; got ${
			result?.detail ?? 'no answer before the time budget ran out'
		}. ${ROLLBACK}`
	);
}

async function main() {
	const languages = [
		[[en['00'], en['01']], 'https://www.azion.com/en/documentation/'],
		[[pt['00'], pt['01']], 'https://www.azion.com/pt-br/documentacao/'],
	];
	for (const [files, prefix] of languages) {
		await verify(await pick(files, prefix));
	}
}

main().catch((err) => {
	console.error(`::error::${err.message}`);
	process.exit(1);
});
