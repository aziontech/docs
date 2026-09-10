#!/usr/bin/env node
// Aggregates an ESLint JSON report into a design-system adoption report.
//
// Reads only `webkit/*` rule results — everything else in the ESLint output belongs to
// other concerns. Markdown goes to stdout so the caller can redirect it straight into
// $GITHUB_STEP_SUMMARY; progress and warnings go to stderr.
//
//   node scripts/webkit-adoption-report.mjs .eslint-report.json [--format markdown|json]
//
// This is a stopgap: the design system is building a `webkit report` command that will
// own this measurement for every consumer. When it lands, the CI step calls that instead
// and this file goes away.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** Extensions the design system governs — the denominator of the adoption score. */
const UI_EXTENSIONS = new Set(['vue', 'astro']);

const RULE_PURPOSE = {
	'webkit/valid-import-path': 'import path that does not exist in the installed version',
	'webkit/no-deep-internal-import': 'reaches into `@aziontech/webkit/src/` internals',
	'webkit/no-barrel-import': 'bare-package barrel import (the package has no barrel)',
	'webkit/no-whole-icon-set-import': 'pulls the whole icon set instead of one icon',
	'webkit/no-hardcoded-color': 'hardcoded colour, palette class or raw text size',
	'webkit/no-hardcoded-motion': 'literal duration/easing, or motion without `motion-reduce:`',
	'webkit/prefer-tree-shakeable-root': 'compound entry imported where the root would do',
	'webkit/no-deprecated-component': 'component marked deprecated in the catalog',
	'webkit/prefer-webkit-component': 'foreign UI library where webkit has an equivalent',
	'webkit/prefer-define-model': 'hand-rolled `modelValue` + `update:modelValue` pair',
	'webkit/no-style-override': '`class`/`style` on a webkit component — restyling it',
	'webkit/authoring-standards': 'shared authoring standards (typed slots, comments, …)',
};

function parseArgs(argv) {
	const args = argv.slice(2);
	const file = args.find((a) => !a.startsWith('--'));
	const formatIndex = args.indexOf('--format');
	const format = formatIndex === -1 ? 'markdown' : args[formatIndex + 1];
	if (!file) {
		process.stderr.write(
			'usage: node scripts/webkit-adoption-report.mjs <eslint-report.json> [--format markdown|json]\n',
		);
		process.exit(1);
	}
	if (format !== 'markdown' && format !== 'json') {
		process.stderr.write(`unknown --format "${format}" (expected markdown or json)\n`);
		process.exit(1);
	}
	return { file, format };
}

/** The installed catalog is what the rules validate against — name the version we measured. */
function readCatalog() {
	try {
		const path = require.resolve('@aziontech/webkit/catalog.json');
		const catalog = JSON.parse(readFileSync(path, 'utf-8'));
		return { available: true, version: catalog.webkitVersion ?? null };
	} catch {
		return { available: false, version: null };
	}
}

function extensionOf(filePath) {
	const base = filePath.split('/').pop() ?? '';
	const dot = base.lastIndexOf('.');
	return dot === -1 ? '' : base.slice(dot + 1);
}

function collect(results, cwd) {
	const byRule = new Map();
	const byFile = new Map();
	const byExtension = new Map();
	const uiFiles = new Set();
	let total = 0;

	for (const result of results) {
		const relative = result.filePath.startsWith(cwd)
			? result.filePath.slice(cwd.length + 1)
			: result.filePath;
		const extension = extensionOf(relative);
		if (UI_EXTENSIONS.has(extension)) uiFiles.add(relative);

		for (const message of result.messages) {
			if (!message.ruleId?.startsWith('webkit/')) continue;
			total += 1;
			byRule.set(message.ruleId, (byRule.get(message.ruleId) ?? 0) + 1);
			byExtension.set(extension, (byExtension.get(extension) ?? 0) + 1);
			const entry = byFile.get(relative) ?? { count: 0, rules: new Set() };
			entry.count += 1;
			entry.rules.add(message.ruleId);
			byFile.set(relative, entry);
		}
	}

	const dirtyUiFiles = [...byFile.keys()].filter((f) => UI_EXTENSIONS.has(extensionOf(f)));
	// Same shape as the architecture report in azion-console-kit: share of files that are
	// clean, not of violations. One file with 20 findings weighs the same as one with 1.
	const score =
		uiFiles.size === 0 ? 100 : Math.round((1 - dirtyUiFiles.length / uiFiles.size) * 100);

	return {
		total,
		filesAffected: byFile.size,
		uiFilesTotal: uiFiles.size,
		uiFilesClean: uiFiles.size - dirtyUiFiles.length,
		score,
		byRule: [...byRule.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
		byExtension: [...byExtension.entries()].sort((a, b) => b[1] - a[1]),
		byFile: [...byFile.entries()]
			.map(([file, entry]) => ({ file, count: entry.count, rules: [...entry.rules].sort() }))
			.sort((a, b) => b.count - a.count || a.file.localeCompare(b.file)),
	};
}

function statusFor(score) {
	if (score === 100) return 'every UI file clean';
	if (score >= 90) return 'close';
	if (score >= 75) return 'needs work';
	return 'far from it';
}

function renderMarkdown(report, catalog) {
	const lines = [];
	const push = (line = '') => lines.push(line);

	push('## Webkit adoption');
	push();

	if (!catalog.available) {
		push(
			'> **The webkit catalog could not be resolved, so 8 of the 12 rules silently did nothing.** ' +
				'This report is not a clean bill of health — install `@aziontech/webkit` or set ' +
				'`WEBKIT_CATALOG_PATH`, then run it again.',
		);
		push();
	}

	const version = catalog.version ? `\`@aziontech/webkit@${catalog.version}\`` : 'unknown version';
	push(`Measured against ${version}.`);
	push();
	push('| | |');
	push('|---|---|');
	push(`| Violations | **${report.total}** |`);
	push(`| Files affected | ${report.filesAffected} |`);
	push(
		`| UI files clean | ${report.uiFilesClean} of ${report.uiFilesTotal} — **${report.score}%** (${statusFor(report.score)}) |`,
	);
	push();

	if (report.total === 0) {
		push('No `webkit/*` violations. Read the coverage note below before celebrating.');
	} else {
		push('### By rule');
		push();
		push('| Rule | Count | What it catches |');
		push('|---|---:|---|');
		for (const [rule, count] of report.byRule) {
			const purpose = RULE_PURPOSE[rule] ?? '—';
			push(`| \`${rule.replace('webkit/', '')}\` | ${count} | ${purpose} |`);
		}
		push();

		push('### By file');
		push();
		push('| File | Count | Rules |');
		push('|---|---:|---|');
		const shown = report.byFile.slice(0, 15);
		for (const { file, count, rules } of shown) {
			const ruleList = rules.map((r) => `\`${r.replace('webkit/', '')}\``).join(', ');
			push(`| \`${file}\` | ${count} | ${ruleList} |`);
		}
		if (report.byFile.length > shown.length) {
			push();
			push(`_${report.byFile.length - shown.length} more file(s) not shown._`);
		}
		push();
	}

	push('### Coverage — what this did and did not look at');
	push();
	const extensions = report.byExtension.length
		? report.byExtension.map(([ext, n]) => `\`.${ext}\` (${n})`).join(', ')
		: 'none';
	push(`- Violations found in: ${extensions}.`);
	push(
		`- The adoption score counts ${[...UI_EXTENSIONS].map((e) => `\`.${e}\``).join(' and ')} files only — ` +
			'those are the ones the design system governs.',
	);
	push(
		'- `no-style-override` does **not** run on `.astro`: it needs vue-eslint-parser\'s template ' +
			'visitor, which astro-eslint-parser does not provide. Restyled webkit components inside ' +
			'Astro files are invisible here.',
	);
	push(
		'- Raw HTML where a webkit component exists (`<button>`, `<input>`, a hand-rolled modal) is ' +
			'caught by **no rule at all** — `prefer-webkit-component` only matches imports from a ' +
			'foreign package. That gap is tracked in the design system.',
	);
	push();
	push('This check never fails the build. It measures.');

	return lines.join('\n') + '\n';
}

function main() {
	const { file, format } = parseArgs(process.argv);
	const catalog = readCatalog();

	process.stderr.write(`Reading ${file}…\n`);
	let results;
	try {
		results = JSON.parse(readFileSync(file, 'utf-8'));
	} catch (error) {
		process.stderr.write(`Could not read the ESLint report at ${file}: ${error.message}\n`);
		process.stderr.write('Run `pnpm lint:webkit` first — it writes the JSON this script reads.\n');
		process.exit(1);
	}
	if (!Array.isArray(results)) {
		process.stderr.write(`${file} is not an ESLint JSON report (expected an array).\n`);
		process.exit(1);
	}

	if (!catalog.available) {
		process.stderr.write(
			'WARNING: could not resolve @aziontech/webkit/catalog.json — the catalog-backed rules ' +
				'were disabled during the lint, so this report undercounts.\n',
		);
	}

	const report = collect(results, process.cwd());
	process.stderr.write(
		`${report.total} webkit/* violation(s) in ${report.filesAffected} file(s); adoption ${report.score}%.\n`,
	);

	process.stdout.write(
		format === 'json'
			? JSON.stringify({ webkitVersion: catalog.version, ...report }, null, 2) + '\n'
			: renderMarkdown(report, catalog),
	);
}

main();
