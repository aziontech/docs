#!/usr/bin/env node
// A count ratchet for checks whose debt is too large to fix before turning them on.
//
// Each check runs a command, extracts one number from its output, and compares that number
// with the frozen baseline in ci/baselines.json. The number may go down (the baseline is
// then stale, which is reported, never punished) but never up. It is the same idea as the
// webkit adoption baseline, applied to tools that have no baseline mechanism of their own.
//
//   node scripts/ci/ratchet.mjs <name>            check
//   node scripts/ci/ratchet.mjs <name> --update   re-snapshot the baseline
//   node scripts/ci/ratchet.mjs --all             check every entry

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';

const BASELINES = 'ci/baselines.json';

function run(command) {
	try {
		return strip(
			execSync(command, {
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'pipe'],
				maxBuffer: 256 * 1024 * 1024,
			})
		);
	} catch (error) {
		// These commands exit non-zero precisely because they found something. The output,
		// not the exit code, is the measurement.
		return strip(`${error.stdout ?? ''}${error.stderr ?? ''}`);
	}
}

// astro check and the link checker colour their output; the counts we match sit between
// escape sequences.
function strip(text) {
	// eslint-disable-next-line no-control-regex
	return text.replace(/\u001b\[[0-9;]*m/g, '');
}

function summary(line) {
	if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
}

function check(name, entry, update) {
	const output = run(entry.command);
	const match = output.match(new RegExp(entry.pattern));

	if (!match) {
		// A check that stops producing its own number is not "clean" — it is broken, and
		// silently passing would be the worst outcome. `lint:linkcheck` spent its whole life
		// matching a base URL that appears in no sitemap and reporting zero issues.
		console.error(`FAIL  ${name}: could not read a count from the output of \`${entry.command}\`.`);
		console.error(output.split('\n').slice(-25).join('\n'));
		return false;
	}

	// A pattern may match a "none found" phrasing with no digits — that is a real zero.
	// `count > undefined` is false, so a missing or mistyped baseline would silently
	// disable the check instead of failing it.
	if (typeof entry.baseline !== 'number' || !Number.isFinite(entry.baseline)) {
		console.error(`FAIL  ${name}: baseline is not a number (${JSON.stringify(entry.baseline)}).`);
		return false;
	}

	const count = match[1] === undefined ? 0 : Number(match[1]);

	if (update) {
		entry.baseline = count;
		console.log(`ok    ${name}: baseline set to ${count}`);
		return true;
	}

	if (count > entry.baseline) {
		// A baseline of zero is not frozen debt, it is "none tolerated" — saying the branch
		// "adds" all of them would be a lie.
		console.error(
			entry.baseline === 0
				? `FAIL  ${name}: ${count} ${entry.label}. The baseline is zero — none are tolerated.`
				: `FAIL  ${name}: ${count} ${entry.label} — the baseline is ${
						entry.baseline
				  }, so this branch adds ${count - entry.baseline}.`
		);
		console.error(output.split('\n').slice(-40).join('\n'));
		summary(`| ${name} | **${count}** | ${entry.baseline} | +${count - entry.baseline} |`);
		return false;
	}

	const delta = entry.baseline - count;
	console.log(
		`ok    ${name}: ${count} ${entry.label} (baseline ${entry.baseline}${
			delta ? `, ${delta} fewer` : ''
		})`
	);
	summary(`| ${name} | ${count} | ${entry.baseline} | ${delta ? `−${delta}` : '—'} |`);

	// The count went down and the baseline did not follow. Until it does, the check tolerates
	// `delta` regressions it should not — every fix that lands without moving the number is
	// slack the next PR can spend. Improvement is never punished, so this is an annotation on
	// the PR, not a failure, carrying the one command that closes the gap.
	if (delta && process.env.GITHUB_ACTIONS) {
		console.log(
			`::notice file=${BASELINES},title=Baseline behind the count::${name}: ${count} ${entry.label}, ` +
				`baseline ${entry.baseline}. Run \`pnpm ci:ratchet ${name} --update\` and commit ` +
				`${BASELINES} in this PR, so what it fixed stays fixed.`
		);
	}
	return true;
}

const args = process.argv.slice(2);
const update = args.includes('--update');
const names = args.filter((a) => !a.startsWith('--'));
const baselines = JSON.parse(readFileSync(BASELINES, 'utf8'));
const selected = names.length ? names : Object.keys(baselines);

for (const name of selected) {
	if (!baselines[name]) {
		console.error(`FAIL  unknown check "${name}". Known: ${Object.keys(baselines).join(', ')}`);
		process.exit(1);
	}
}

summary('| check | agora | baseline | delta |');
summary('|---|---|---|---|');

let failed = false;
for (const name of selected) {
	if (!check(name, baselines[name], update)) failed = true;
}

if (update) {
	writeFileSync(BASELINES, `${JSON.stringify(baselines, null, 2)}\n`);
	console.log(`\n${BASELINES} updated.`);
}

process.exit(failed ? 1 : 0);
