/**
 * Validates the production deployment manifest (deployments/production.json)
 * against deployments/schema.json. Ported from aziontech/azion-console-kit
 * (ADR-0002 there); the docs tag is docs-vX.Y.Z.
 *
 * There is no stage manifest: `main` is protected by a ruleset, so CI cannot
 * write to it, and stage is recorded through the GitHub Deployments API instead.
 *
 * Two layers, on purpose:
 *
 *   1. Structure, from schema.json. A deliberately small JSON Schema subset is
 *      implemented here (type, const, enum, pattern, required, properties,
 *      additionalProperties) instead of pulling ajv in: the schema is the
 *      published contract for editors and reviewers, and CI must not depend on
 *      a runtime dep to read its own contract. Anything outside the subset in
 *      schema.json fails loudly rather than passing silently.
 *
 *   2. Rules the subset cannot express, in code below (checkSemantics):
 *      which blocks belong to which environment, and what "state" implies
 *      about the fields being filled in. Nulls are legal in the schema only so
 *      the bootstrap manifests (state: unknown) can exist before any pipeline
 *      run has written one — every other state requires real values.
 *
 * Usage: node scripts/ci/validate-deployment-manifest.mjs <file...>
 *   With no arguments, validates every deployments/*.json except schema.json.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const deploymentsDir = join(repoRoot, 'deployments');
const schemaPath = join(deploymentsDir, 'schema.json');

// Release tags carry the release-please component: docs-vX.Y.Z.
const TAG_PREFIX = 'docs-v';

const SUPPORTED_KEYWORDS = new Set([
	'$schema',
	'$id',
	'title',
	'description',
	'type',
	'const',
	'enum',
	'pattern',
	'required',
	'properties',
	'additionalProperties',
]);

const typeOf = (value) => {
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'array';
	if (Number.isInteger(value)) return 'integer';
	if (typeof value === 'number') return 'number';
	return typeof value;
};

const matchesType = (value, expected) => {
	const actual = typeOf(value);
	if (expected === 'number') return actual === 'number' || actual === 'integer';
	return actual === expected;
};

const validateAgainstSchema = (value, schema, path, errors) => {
	for (const keyword of Object.keys(schema)) {
		if (!SUPPORTED_KEYWORDS.has(keyword)) {
			errors.push(
				`${path}: schema.json uses "${keyword}", which this validator does not implement — ` +
					`extend scripts/ci/validate-deployment-manifest.mjs or drop the keyword`
			);
		}
	}

	if (schema.type !== undefined) {
		const expected = Array.isArray(schema.type) ? schema.type : [schema.type];
		if (!expected.some((candidate) => matchesType(value, candidate))) {
			errors.push(`${path}: expected ${expected.join(' | ')}, got ${typeOf(value)}`);
			return;
		}
	}

	if (schema.const !== undefined && value !== schema.const) {
		errors.push(`${path}: expected ${JSON.stringify(schema.const)}, got ${JSON.stringify(value)}`);
	}

	if (schema.enum !== undefined && !schema.enum.includes(value)) {
		const allowed = schema.enum.map((option) => JSON.stringify(option)).join(' | ');
		errors.push(`${path}: expected one of ${allowed}, got ${JSON.stringify(value)}`);
	}

	// Per JSON Schema, pattern only constrains strings — that is what lets a
	// nullable field carry a format without blocking the bootstrap nulls.
	if (schema.pattern !== undefined && typeof value === 'string') {
		if (!new RegExp(schema.pattern).test(value)) {
			errors.push(`${path}: ${JSON.stringify(value)} does not match /${schema.pattern}/`);
		}
	}

	if (typeOf(value) !== 'object') return;

	for (const key of schema.required ?? []) {
		if (!(key in value)) errors.push(`${path}: missing required property "${key}"`);
	}

	if (schema.additionalProperties === false && schema.properties) {
		for (const key of Object.keys(value)) {
			if (!(key in schema.properties)) errors.push(`${path}: unknown property "${key}"`);
		}
	}

	for (const [key, subSchema] of Object.entries(schema.properties ?? {})) {
		if (key in value) validateAgainstSchema(value[key], subSchema, `${path}.${key}`, errors);
	}
};

const resolve = (manifest, pathExpression) =>
	pathExpression.split('.').reduce((node, key) => node?.[key], manifest);

const required = (manifest, pathExpression, errors) => {
	const value = resolve(manifest, pathExpression);
	if (value === null || value === undefined || value === '') {
		errors.push(`${pathExpression}: required when state is "${manifest.state}"`);
	}
};

// The mirror of `required`: a field that must NOT be filled in yet. Without
// this, "ready" would be indistinguishable from "deployed" minus a few fields,
// and a manifest could claim a workflow run that never happened.
const mustBeNull = (manifest, pathExpression, errors) => {
	const value = resolve(manifest, pathExpression);
	if (value !== null && value !== undefined) {
		errors.push(
			`${pathExpression}: must be null when state is "${manifest.state}" — ` +
				`the production deploy has not run yet`
		);
	}
};

const checkSemantics = (manifest, fileName, errors) => {
	if (fileName !== 'production.json') {
		errors.push(
			`${fileName}: the only manifest here is production.json — stage is recorded ` +
				`through the GitHub Deployments API, not in git`
		);
	}

	if (manifest.release?.version && manifest.release?.gitTag) {
		if (manifest.release.gitTag !== `${TAG_PREFIX}${manifest.release.version}`) {
			errors.push(
				`release.gitTag: "${manifest.release.gitTag}" is not "${TAG_PREFIX}${manifest.release.version}" — ` +
					`tag and version must describe the same release`
			);
		}
	}

	if (manifest.state === 'unknown') {
		if (manifest.deploy?.trigger !== 'bootstrap') {
			errors.push('deploy.trigger: state "unknown" is only for bootstrap manifests');
		}
		return;
	}

	for (const field of [
		'release.version',
		'release.gitTag',
		'release.sourceCommit',
		'release.githubReleaseUrl',
		'build.nodeVersion',
		'build.cliVersion',
		'build.configDir',
		'deploy.trigger',
		'deploy.requestedBy',
		'stage.deploymentId',
		'stage.gitTag',
		'stage.sourceCommit',
		'stage.state',
		'stage.logUrl',
		'stage.deployedAt',
	]) {
		required(manifest, field, errors);
	}

	// Everything that only exists once the production deploy has actually run.
	// "ready" is the promotion-approved-deploy-pending state, so these cannot be
	// filled in yet; "deployed" means a green run wrote this file, so they must.
	const deployTimeFields = [
		'deploy.workflowRunId',
		'deploy.workflowRunAttempt',
		'deploy.workflowRunUrl',
		'deploy.deployedAt',
	];

	for (const field of deployTimeFields) {
		if (manifest.state === 'deployed') required(manifest, field, errors);
		else mustBeNull(manifest, field, errors);
	}

	// The promotion gate, restated as data: the stage deployment being cited has
	// to be of THIS release, and it has to have gone green. Anything else means
	// production is about to get a version stage never validated.
	if (manifest.stage?.gitTag && manifest.release?.gitTag) {
		if (manifest.stage.gitTag !== manifest.release.gitTag) {
			errors.push(
				`stage.gitTag: "${manifest.stage.gitTag}" does not match release.gitTag ` +
					`"${manifest.release.gitTag}" — this cites a stage deployment of a different version`
			);
		}
	}

	if (manifest.stage?.sourceCommit && manifest.release?.sourceCommit) {
		if (manifest.stage.sourceCommit !== manifest.release.sourceCommit) {
			errors.push(
				'stage.sourceCommit: does not match release.sourceCommit — the tag moved between ' +
					'the stage deploy and this promotion'
			);
		}
	}

	if (manifest.stage?.state && manifest.stage.state !== 'success') {
		errors.push(
			`stage.state: "${manifest.stage.state}" — only a green stage deployment can be promoted`
		);
	}

	if (manifest.deploy?.trigger === 'bootstrap') {
		errors.push('deploy.trigger: "bootstrap" is only valid with state "unknown"');
	}

	if (manifest.deploy?.trigger === 'rollback') {
		required(manifest, 'deploy.reason', errors);
	} else if (manifest.deploy?.reason) {
		errors.push('deploy.reason: only a rollback carries a reason');
	}
};

const validateFile = (file) => {
	const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
	const errors = [];

	let manifest;
	try {
		manifest = JSON.parse(readFileSync(file, 'utf-8'));
	} catch (error) {
		return [`${file}: not valid JSON — ${error.message}`];
	}

	validateAgainstSchema(manifest, schema, '$', errors);
	if (errors.length === 0) checkSemantics(manifest, basename(file), errors);

	return errors.map((message) => `${file}: ${message}`);
};

const files =
	process.argv.slice(2).length > 0
		? process.argv.slice(2)
		: readdirSync(deploymentsDir)
				.filter((name) => name.endsWith('.json') && name !== 'schema.json')
				.map((name) => join(deploymentsDir, name));

if (files.length === 0) {
	console.error('No deployment manifests found in deployments/');
	process.exit(1);
}

const failures = files.flatMap(validateFile);

for (const failure of failures) {
	console.error(`::error::${failure}`);
}

if (failures.length > 0) {
	console.error(`\n${failures.length} problem(s) in ${files.length} manifest(s)`);
	process.exit(1);
}

console.log(
	`${files.length} deployment manifest(s) valid: ${files.map((f) => basename(f)).join(', ')}`
);
