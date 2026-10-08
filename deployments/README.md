# Deployments

This directory answers one question without opening the Actions UI: **which version of the
docs is running in production, and where did it come from?**

| File | What it is | Who writes it |
| --- | --- | --- |
| `production.json` | What is deployed to production | A promotion pull request, opened by `docs-deploy-stage.yml` |
| `schema.json` | The contract the manifest must satisfy | People, in a reviewed PR |

The pipeline is ported from `aziontech/azion-console-kit` (its ADR-0002 has the full rationale).

## The flow

1. A conventional commit that touches `apps/docs/` merges to `main`. `release-please.yml`
   keeps the Release PR up to date (`apps/docs/package.json` + `apps/docs/CHANGELOG.md`).
2. Merging the Release PR tags `docs-vX.Y.Z` and dispatches `docs-deploy-stage.yml` for that tag.
3. `docs-deploy-stage.yml` deploys the tag to the `docs-stage` Azion application, records a GitHub
   deployment (`environment=stage`, `ref=<tag>`) and opens the PR
   `promote/production-docs-vX.Y.Z`, which changes only this directory's `production.json`.
4. Merging the promotion PR **is** the production deploy: `docs-deploy-production.yml` runs on the
   push to `main` that touches `production.json`, re-checks the stage evidence, deploys the same
   tag to `docs-prod` and records a production deployment.

## Stage is not here

There is no `stage.json`. `main` is protected by a ruleset (pull request, code owner review, no
bypass), so no workflow can commit to it. Stage is recorded with the **GitHub Deployments API**
instead:

```bash
gh api "repos/aziontech/docs/deployments?environment=stage&per_page=1" \
  --jq '.[0] | "\(.ref)  \(.created_at)  \(.payload.sourceCommit)"'
```

A job with `environment: stage` also makes GitHub create a deployment on its own, with the run's
ref (`main`) and an empty payload. The pipeline creates its own record, anchored on the tag, with
the build inputs in `payload`; that is the one the promotion reads.

## Reading "what is in production now"

```bash
jq -r '.release.gitTag + "  (" + .state + ", " + .deploy.trigger + ")"' deployments/production.json
```

`release.sourceCommit` is the exact commit that was built; `deploy.previousVersion` is what it
replaced. A manifest with `"state": "unknown"` is the bootstrap placeholder: nothing has been
promoted yet.

## What a promotion guarantees, and what it does not

**It guarantees source identity.** The unit that moves from stage to production is
`release.gitTag` + `release.sourceCommit`, and the manifest must cite a green stage deployment
of that same tag and commit.

**It does not guarantee the bytes.** Production builds its own bundle, because
`apps/docs/src/consts.ts` (site URL, analytics) is copied per environment at build time. What
keeps the two builds comparable is that the inputs are pinned and recorded: `build.nodeVersion`
(from `.nvmrc`), `build.cliVersion` (from `.cli-version`), `build.configDir` and the frozen
`pnpm-lock.yaml`.

## Rules

- **Nobody edits `production.json` by hand.** Rerun *Deploy docs (stage)* for the tag with
  **promote** ticked to regenerate the promotion PR.
- **The promotion PR touches exactly one file.** The deploy's `paths:` filter depends on it.
- **The promotion PR was opened with the workflow token**, so its required checks do not start on
  their own: close and reopen it before merging.

## Azion state

The resource IDs live in `apps/docs/azion/<env>/azion.json`; the deploy always uses the copy on
`main`, not the one at the tag. The CLI rewrites that file on every run. When it changes for real
(a resource created or renamed), the deploy job reports the diff in its summary: commit it to
`main` through a PR, or the next deploy recreates the resource.

## Validating the manifest

```bash
node scripts/ci/validate-deployment-manifest.mjs            # everything here
node scripts/ci/validate-deployment-manifest.mjs <file>     # one file
```

The validator enforces `schema.json` plus what JSON Schema cannot express: `gitTag` is
`docs-v` + `version`, the `stage` block cites the same tag and commit as `release` and is green,
and a `reason` is required on a rollback and forbidden otherwise.
