#!/usr/bin/env node
// Counts high + critical advisories from `pnpm audit --json` and prints one line the
// ratchet can read. Parsing the JSON metadata beats a regex over the table: the table
// omits severities with a count of zero, so a pattern for "critical" would stop matching
// on the day the last critical is fixed — and a ratchet that stops matching fails.

import { execSync } from 'node:child_process';

let raw;
try {
	raw = execSync('pnpm audit --json', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (error) {
	// `pnpm audit` exits non-zero when it finds anything; the report is still on stdout.
	raw = `${error.stdout ?? ''}`;
}

let counts;
try {
	counts = JSON.parse(raw).metadata.vulnerabilities;
} catch {
	console.error('Could not parse `pnpm audit --json`.');
	console.error(raw.slice(0, 2000));
	process.exit(1);
}

const blocking = (counts.high ?? 0) + (counts.critical ?? 0);
const other = (counts.moderate ?? 0) + (counts.low ?? 0) + (counts.info ?? 0);

console.log(`high+critical: ${blocking}`);
console.log(`(moderate/low/info: ${other})`);
