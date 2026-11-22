import process from 'node:process';
import { en, pt } from '../../redirects/index.js';

const ATTEMPTS = Number(process.env.SMOKE_ATTEMPTS ?? 10);
const WAIT_MS = 30_000;
const CANDIDATES = 25;

async function head(url) {
	const response = await fetch(url, {
		method: 'HEAD',
		redirect: 'manual',
		signal: AbortSignal.timeout(30_000),
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
	for (const { from, moved } of candidates) {
		const plain = await head(from).catch(() => null);
		if (plain?.status === 301 && plain.location === moved) return { from, moved };
	}
	throw new Error(`none of the first ${CANDIDATES} redirects answers 301 without a query`);
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

async function main() {
	let targets;
	try {
		targets = [
			await pick([en['00'], en['01']], 'https://www.azion.com/en/documentation/'),
			await pick([pt['00'], pt['01']], 'https://www.azion.com/pt-br/documentacao/'),
		];
	} catch (err) {
		console.error(`::error::${err.message}`);
		process.exit(1);
	}
	for (const target of targets) {
		for (let attempt = 1; ; attempt++) {
			const result = await check(target).catch((err) => ({
				ok: false,
				detail: err.message,
				url: target.from,
			}));
			if (result.ok) {
				console.log(`✓ ${result.url} -> ${result.detail}`);
				break;
			}
			if (attempt >= ATTEMPTS) {
				console.error(
					`::error::${result.url} should answer 301 to ${target.moved} with its query; got ${result.detail}`
				);
				process.exit(1);
			}
			console.log(`Attempt ${attempt}: ${result.detail}; retrying in ${WAIT_MS / 1000}s`);
			await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
		}
	}
}

main();
