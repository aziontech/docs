#!/usr/bin/env node
// Validates every Terraform sample in the docs against the real Azion provider.
//
// Each ```hcl / ```terraform / ```tf fence in apps/docs/src/content/docs is written to its own
// directory and checked with `terraform fmt -check` and `terraform validate`. A sample that
// omits the boilerplate gets it stubbed in: the `terraform { required_providers }` block with
// the pinned provider version, an empty `provider "azion"` block, and a `variable` for every
// `var.x` it reads. Anything else a sample references (another resource, a module) must be
// declared in the sample itself, so what a reader copies is what was validated.
//
// A sample that pins `aziontech/azion` must pin PROVIDER_VERSION, so every page tells the
// reader to install the same release.
//
// Opt out a fence that is wrong on purpose (a v1 "before" block in a migration guide) with an
// MDX comment on the line right above it:
//
//   {/* terraform-validate: skip */}
//
// A fence with no top-level blocks (a terraform.tfvars excerpt) only gets `terraform fmt`.
//
//   node scripts/ci/terraform-validate.mjs            check every page
//   node scripts/ci/terraform-validate.mjs <file...>  check only these pages
//
// TERRAFORM_BIN overrides the terraform binary (default: `terraform` on PATH).

import { spawn } from 'node:child_process';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	symlinkSync,
	copyFileSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir, availableParallelism } from 'node:os';
import { join, relative } from 'node:path';

const PROVIDER_VERSION = '2.10.0';
const CONTENT_ROOT = 'apps/docs/src/content/docs';
const TERRAFORM = process.env.TERRAFORM_BIN || 'terraform';
const FENCE_OPEN = /^(\s*)```(hcl|terraform|tf)\b.*$/;
const SKIP_MARKER = /terraform-validate:\s*skip/;
const TOP_LEVEL_BLOCK =
	/^(terraform|provider|resource|data|variable|output|locals|module|import|moved|removed|check)\b/m;
const PROVIDER_PIN =
	/source\s*=\s*"(?:registry\.terraform\.io\/)?aziontech\/azion"[^}]*?version\s*=\s*"([^"]+)"/s;

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return walk(path);
		return entry.name.endsWith('.mdx') || entry.name.endsWith('.md') ? [path] : [];
	});
}

function extractSamples(file) {
	const lines = readFileSync(file, 'utf8').split('\n');
	const samples = [];
	// A fence of four or more backticks shows a document (a module README), not code to run:
	// the ```hcl fences inside it are part of that document, so they are not samples.
	let outer = null;
	for (let i = 0; i < lines.length; i++) {
		if (outer) {
			if (lines[i].trim() === outer) outer = null;
			continue;
		}
		const wide = lines[i].match(/^\s*(`{4,})/);
		if (wide) {
			outer = wide[1];
			continue;
		}
		const open = lines[i].match(FENCE_OPEN);
		if (!open) continue;
		const indent = open[1].length;
		const start = i;
		const body = [];
		for (i++; i < lines.length && !/^\s*```\s*$/.test(lines[i]); i++)
			body.push(lines[i].slice(indent));
		let prev = start - 1;
		while (prev >= 0 && lines[prev].trim() === '') prev--;
		samples.push({
			file,
			line: start + 1,
			code: body.join('\n') + '\n',
			skip: prev >= 0 && SKIP_MARKER.test(lines[prev]),
		});
	}
	return samples;
}

function run(args, cwd) {
	return new Promise((resolve) => {
		const child = spawn(TERRAFORM, args, {
			cwd,
			env: { ...process.env, TF_IN_AUTOMATION: '1', CHECKPOINT_DISABLE: '1' },
		});
		let stdout = '';
		let stderr = '';
		child.stdout.on('data', (chunk) => (stdout += chunk));
		child.stderr.on('data', (chunk) => (stderr += chunk));
		child.on('error', (error) => resolve({ code: 127, stdout, stderr: String(error) }));
		child.on('close', (code) => resolve({ code, stdout, stderr }));
	});
}

function stubs(code) {
	let out = '';
	if (!/required_providers/.test(code)) {
		out += `terraform {\n  required_providers {\n    azion = {\n      source  = "aziontech/azion"\n      version = "${PROVIDER_VERSION}"\n    }\n  }\n}\n\n`;
	}
	if (!/provider\s+"azion"/.test(code)) out += 'provider "azion" {}\n\n';
	const declared = new Set([...code.matchAll(/^\s*variable\s+"([^"]+)"/gm)].map((m) => m[1]));
	const used = new Set([...code.matchAll(/\bvar\.([A-Za-z_][A-Za-z0-9_-]*)/g)].map((m) => m[1]));
	for (const name of used) if (!declared.has(name)) out += `variable "${name}" {}\n`;
	return out;
}

async function prepareSeed(root) {
	const seed = join(root, '_seed');
	mkdirSync(seed);
	writeFileSync(join(seed, 'main.tf'), stubs(''));
	const init = await run(['init', '-backend=false', '-input=false', '-no-color'], seed);
	if (init.code !== 0) {
		throw new Error(
			`terraform init failed for aziontech/azion ${PROVIDER_VERSION}:\n${init.stdout}${init.stderr}`
		);
	}
	return seed;
}

async function check(sample, dir, seed) {
	const where = `${relative(process.cwd(), sample.file)}:${sample.line}`;
	const problems = [];
	mkdirSync(dir);
	writeFileSync(join(dir, 'sample.tf'), sample.code);

	const fmt = await run(['fmt', '-check', '-diff', '-no-color', 'sample.tf'], dir);
	if (fmt.code !== 0)
		problems.push(`not formatted (terraform fmt):\n${(fmt.stdout + fmt.stderr).trim()}`);

	if (!TOP_LEVEL_BLOCK.test(sample.code)) return { where, problems };

	const pin = sample.code.match(PROVIDER_PIN);
	if (pin && pin[1] !== PROVIDER_VERSION) {
		problems.push(`pins aziontech/azion ${pin[1]}; every page pins ${PROVIDER_VERSION}`);
		return { where, problems };
	}

	writeFileSync(join(dir, '_stubs.tf'), stubs(sample.code));
	copyFileSync(join(seed, '.terraform.lock.hcl'), join(dir, '.terraform.lock.hcl'));
	symlinkSync(join(seed, '.terraform'), join(dir, '.terraform'), 'dir');

	const validate = await run(['validate', '-json', '-no-color'], dir);
	let report;
	try {
		report = JSON.parse(validate.stdout);
	} catch {
		problems.push(`terraform validate crashed:\n${validate.stdout}${validate.stderr}`);
		return { where, problems };
	}
	const warnings = [];
	for (const d of report.diagnostics ?? []) {
		const inSample = d.range?.filename === 'sample.tf';
		const at = inSample ? ` (page line ${sample.line + d.range.start.line})` : '';
		const detail = d.detail ? `\n    ${d.detail.replace(/\n/g, '\n    ')}` : '';
		(d.severity === 'error' ? problems : warnings).push(
			`${d.severity}: ${d.summary}${at}${detail}`
		);
	}
	return { where, problems, warnings };
}

async function pool(items, size, worker) {
	const results = new Array(items.length);
	let next = 0;
	await Promise.all(
		Array.from({ length: size }, async () => {
			while (next < items.length) {
				const index = next++;
				results[index] = await worker(items[index], index);
			}
		})
	);
	return results;
}

const files = process.argv.length > 2 ? process.argv.slice(2) : walk(CONTENT_ROOT);
const samples = files.flatMap(extractSamples);
const toCheck = samples.filter((s) => !s.skip);

const version = await run(['version'], process.cwd());
if (version.code !== 0) {
	console.error(
		`Cannot run "${TERRAFORM}". Install Terraform or set TERRAFORM_BIN.\n${version.stderr}`
	);
	process.exit(1);
}

const root = mkdtempSync(join(tmpdir(), 'tf-samples-'));
let failed = 0;
let fatal = null;
try {
	const seed = await prepareSeed(root);
	const results = await pool(
		toCheck,
		Math.max(2, Math.min(8, availableParallelism())),
		(sample, index) => check(sample, join(root, String(index)), seed)
	);
	for (const { where, problems, warnings = [] } of results) {
		for (const w of warnings) console.warn(`${where}  ${w}`);
		if (problems.length === 0) continue;
		failed++;
		console.error(`\n✗ ${where}`);
		for (const p of problems) console.error(`  ${p.replace(/\n/g, '\n  ')}`);
	}
} catch (error) {
	fatal = error;
} finally {
	if (existsSync(root)) rmSync(root, { recursive: true, force: true });
}

if (fatal) {
	console.error(fatal.message);
	process.exit(1);
}

const skipped = samples.length - toCheck.length;
console.log(
	`\nTerraform samples: ${toCheck.length - failed}/${
		toCheck.length
	} valid against aziontech/azion ${PROVIDER_VERSION}` +
		(skipped ? `, ${skipped} skipped by marker` : '') +
		'.'
);
process.exit(failed ? 1 : 0);
