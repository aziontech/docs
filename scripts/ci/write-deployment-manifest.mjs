/**
 * Writes deployments/production.json — the record of what is deployed to
 * production. Ported from aziontech/azion-console-kit (ADR-0002 there).
 *
 * There is no stage equivalent. `main` is protected by a ruleset (pull request
 * with code owner review, no bypass), so no workflow can commit to it; stage is
 * recorded through the GitHub Deployments API instead. This file only ever reaches `main` inside a promotion pull
 * request, which a human approves — the one write path the ruleset allows.
 *
 * `deploy.previousVersion` is carried over from the file being replaced, so a
 * rollback records what it rolled back FROM without having to look it up.
 *
 * Reads its inputs from the environment:
 *
 *   DEPLOY_TRIGGER        release | rollback | manual
 *   DEPLOY_REQUESTED_BY   actor that asked for this deploy
 *   DEPLOY_REASON         required when trigger=rollback, empty otherwise
 *   RELEASE_VERSION       X.Y.Z
 *   RELEASE_GIT_TAG       docs-vX.Y.Z
 *   RELEASE_SOURCE_COMMIT full 40-char sha the tag points at
 *   BUILD_NODE_VERSION    node major used by the build (.nvmrc)
 *   BUILD_CLI_VERSION     Azion CLI version used by the build
 *   GITHUB_*              run context, set by Actions
 *
 * Plus the stage deployment being vouched for, read by the caller from
 * GET /repos/{repo}/deployments?environment=stage&ref=<tag>:
 *
 *   STAGE_DEPLOYMENT_ID, STAGE_GIT_TAG, STAGE_SOURCE_COMMIT,
 *   STAGE_STATE, STAGE_LOG_URL, STAGE_DEPLOYED_AT
 *
 * The result is validated before it is written: a malformed manifest fails the
 * job instead of reaching a pull request.
 */
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const deploymentsDir = join(repoRoot, 'deployments');
const manifestPath = join(deploymentsDir, 'production.json');

// Release tags carry the release-please component: docs-vX.Y.Z.
const TAG_PREFIX = 'docs-v';

const fail = (message) => {
	console.error(`::error::${message}`);
	process.exit(1);
};

const env = (name) => process.env[name]?.trim() || '';

const requireEnv = (name) => {
	const value = env(name);
	if (!value) fail(`${name} is required`);
	return value;
};

if (env('DEPLOY_ENVIRONMENT') && env('DEPLOY_ENVIRONMENT') !== 'production') {
	fail(
		`DEPLOY_ENVIRONMENT="${env('DEPLOY_ENVIRONMENT')}": this script only writes production. ` +
			'Stage is recorded with the GitHub Deployments API — see deployments/README.md.'
	);
}

const trigger = requireEnv('DEPLOY_TRIGGER');
if (!['release', 'rollback', 'manual'].includes(trigger)) {
	fail(`DEPLOY_TRIGGER must be release, rollback or manual, got "${trigger}"`);
}

// Which moment is being recorded. A promotion pull request is written before
// anything is deployed, so it is "ready"; only the job that ran the deploy may
// write "deployed". Hardcoding the latter made every promotion PR assert a
// deploy that had not happened. No default: the caller has to be explicit.
const state = requireEnv('DEPLOY_STATE');
if (!['ready', 'deployed'].includes(state)) {
	fail(`DEPLOY_STATE must be ready or deployed, got "${state}"`);
}
const isDeployed = state === 'deployed';

const version = requireEnv('RELEASE_VERSION');
if (!/^\d+\.\d+\.\d+$/.test(version)) {
	fail(`RELEASE_VERSION must be plain SemVer, got "${version}"`);
}

const gitTag = requireEnv('RELEASE_GIT_TAG');
if (gitTag !== `${TAG_PREFIX}${version}`) {
	fail(`RELEASE_GIT_TAG "${gitTag}" does not match RELEASE_VERSION "${version}"`);
}

const sourceCommit = requireEnv('RELEASE_SOURCE_COMMIT');
if (!/^[0-9a-f]{40}$/.test(sourceCommit)) {
	fail(`RELEASE_SOURCE_COMMIT must be a full 40-char sha, got "${sourceCommit}"`);
}

const reason = env('DEPLOY_REASON');
if (trigger === 'rollback' && !reason) fail('DEPLOY_REASON is required on a rollback');

const serverUrl = env('GITHUB_SERVER_URL') || 'https://github.com';
const repository = requireEnv('GITHUB_REPOSITORY');
const runId = isDeployed ? requireEnv('GITHUB_RUN_ID') : null;
const runAttempt = isDeployed ? env('GITHUB_RUN_ATTEMPT') || '1' : null;

const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf-8')) : null;

const manifest = {
	schemaVersion: 1,
	environment: 'production',
	state,
	release: {
		version,
		gitTag,
		sourceCommit,
		githubReleaseUrl: `${serverUrl}/${repository}/releases/tag/${gitTag}`,
	},
	build: {
		nodeVersion: requireEnv('BUILD_NODE_VERSION'),
		cliVersion: requireEnv('BUILD_CLI_VERSION'),
		configDir: 'apps/docs/azion/production',
	},
	deploy: {
		trigger,
		requestedBy: requireEnv('DEPLOY_REQUESTED_BY'),
		previousVersion: previous?.release?.version ?? null,
		reason: reason || null,
		workflowRunId: isDeployed ? Number(runId) : null,
		workflowRunAttempt: isDeployed ? Number(runAttempt) : null,
		workflowRunUrl: isDeployed ? `${serverUrl}/${repository}/actions/runs/${runId}` : null,
		deployedAt: isDeployed ? new Date().toISOString() : null,
	},
	stage: {
		deploymentId: Number(requireEnv('STAGE_DEPLOYMENT_ID')),
		gitTag: requireEnv('STAGE_GIT_TAG'),
		sourceCommit: requireEnv('STAGE_SOURCE_COMMIT'),
		state: requireEnv('STAGE_STATE'),
		logUrl: requireEnv('STAGE_LOG_URL'),
		deployedAt: requireEnv('STAGE_DEPLOYED_AT'),
	},
	approval: {
		mechanism:
			'GitHub pull request — main ruleset: 1 approval, code owner review, no bypass actors',
		instructions:
			'Production deploys run from main when this file changes. Change it through a promotion pull request, never by pushing to main.',
	},
};

mkdirSync(deploymentsDir, { recursive: true });
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

// Fail closed: never leave a manifest on disk that the contract rejects. The
// validator is what enforces that stage.gitTag matches the release being
// promoted and that the stage deployment was green.
try {
	execFileSync(
		process.execPath,
		[join(repoRoot, 'scripts', 'ci', 'validate-deployment-manifest.mjs'), manifestPath],
		{ stdio: 'inherit' }
	);
} catch {
	// The validator already printed what is wrong; a Node stack trace on top of
	// it only buries the message. The invalid file stays on disk on purpose —
	// the job fails, so nothing reaches a pull request, and it can be inspected.
	process.exit(1);
}

const summary = [
	isDeployed ? '### Production deploy recorded' : '### Production promotion prepared',
	'',
	'| | |',
	'| --- | --- |',
	`| Version | \`${version}\` (${gitTag}) |`,
	`| Source commit | \`${sourceCommit}\` |`,
	`| Previous version | ${
		manifest.deploy.previousVersion ? `\`${manifest.deploy.previousVersion}\`` : '_none recorded_'
	} |`,
	`| Trigger | ${trigger}${reason ? ` — ${reason}` : ''} |`,
	`| Requested by | ${manifest.deploy.requestedBy} |`,
	`| Build | node ${manifest.build.nodeVersion}, azion CLI ${manifest.build.cliVersion}, \`${manifest.build.configDir}\` |`,
	`| Stage deployment | [${manifest.stage.deploymentId}](${manifest.stage.logUrl}) — ${manifest.stage.state}, ${manifest.stage.deployedAt} |`,
	'',
].join('\n');

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
	appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}
