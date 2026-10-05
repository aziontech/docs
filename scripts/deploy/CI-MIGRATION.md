# Azion deploys: from manual to the release pipeline

The docs deploy to two Azion Applications, `docs-stage` and `docs-prod`, with the Azion CLI.
Today those deploys are **manual**. This file lists everything needed to automate them exactly
as the pipeline that was validated end to end in a sandbox copy of this repository.

## Today: manual deploys

```bash
bash .azion-stage/deploy-stage.sh
bash .azion-prod/deploy-prod.sh
```

- Requires the Azion CLI **4.23.0** logged in (`azion -t <token>`) to the account that owns the
  two Applications. The IDs in `.azion-<env>/azion/azion.json` belong to that account.
- `scripts/deploy/azion-deploy.sh` copies `.azion-<env>/azion.config.ts` and `.azion-<env>/azion/`
  to the repository root (the CLI only reads them from there), copies `env/consts.stage.ts` or
  `env/consts.production.ts` to `src/consts.ts`, runs `azion deploy --local --auto --debug`, and on
  exit always copies the CLI state back to `.azion-<env>/` and restores `src/consts.ts`.
- If `git status` shows a change under `.azion-<env>/` after a deploy, the CLI created or changed
  a resource: commit it, or the next deploy recreates that resource.
- `rotate-prefix` is `false`: every deploy overwrites the same storage prefix and
  `purge_on_publish` purges the edge cache.

## Target: the release pipeline

1. Every merge to `main` deploys **stage** (`docs-stage`).
2. After stage, release-please opens or updates the Release PR `chore(release): vX.Y.Z`
   (`package.json` bump + `CHANGELOG.md`). Only user-facing commit types bump the version:
   `chore` is hidden, so a `chore`-only merge deploys stage but cuts no version.
3. Merging the Release PR skips stage, creates the tag `vX.Y.Z` and the GitHub Release, and deploys
   **production** (`docs-prod`) from the tag.
4. After each deploy the workflow commits `.azion-<env>/` back to `main` as
   `chore(deploy): record <env> azion state (...)`, only when the CLI changed it.

## Files to add

### `.cli-version`

```bash
# Azion CLI version used by every deploy workflow. Sourced with `source .cli-version`.
CLI_VERSION=4.23.0
```

### `release-please-config.json`

Set `bootstrap-sha` to the full SHA of `main`'s HEAD **at migration time**. `main` only accepts
squash merges, so commits from feature branches never reach its history.

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "bootstrap-sha": "<full SHA of main HEAD at migration time>",
  "include-v-in-tag": true,
  "include-component-in-tag": false,
  "pull-request-title-pattern": "chore(release): v${version}",
  "changelog-sections": [
    { "type": "feat", "section": "Features" },
    { "type": "fix", "section": "Bug Fixes" },
    { "type": "perf", "section": "Performance Improvements" },
    { "type": "revert", "section": "Reverts" },
    { "type": "docs", "section": "Documentation" },
    { "type": "refactor", "section": "Code Refactoring" },
    { "type": "test", "section": "Tests" },
    { "type": "build", "section": "Build System" },
    { "type": "ci", "section": "Continuous Integration" },
    { "type": "style", "section": "Styles" },
    { "type": "chore", "section": "Miscellaneous Chores", "hidden": true }
  ],
  "packages": {
    ".": {
      "release-type": "node",
      "changelog-path": "CHANGELOG.md"
    }
  }
}
```

### `.release-please-manifest.json`

Keep it in sync with the `version` in `package.json` at migration time.

```json
{
  ".": "1.0.1"
}
```

Also add `CHANGELOG.md` to `.prettierignore` (release-please writes it).

### `.github/workflows/release.yml`

```yaml
name: Release

# push to main -> deploy stage -> release-please -> deploy production when a release is cut.
# Merging the release PR skips stage: it only carries the version bump and the changelog.

on:
  push:
    branches:
      - main

permissions: {}

concurrency:
  group: release-pipeline
  cancel-in-progress: false

jobs:
  stage:
    name: Deploy stage
    if: "${{ !startsWith(github.event.head_commit.message, 'chore(release): v') }}"
    permissions:
      contents: write
    uses: ./.github/workflows/deploy-stage.yml
    with:
      ref: ${{ github.sha }}
    secrets: inherit

  release-please:
    name: Release PR and tags
    needs: stage
    if: ${{ always() && (needs.stage.result == 'success' || needs.stage.result == 'skipped') }}
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: write
      pull-requests: write
    outputs:
      release_created: ${{ steps.release.outputs.release_created }}
      tag_name: ${{ steps.release.outputs.tag_name }}
    steps:
      - name: Run release-please
        id: release
        uses: googleapis/release-please-action@45996ed1f6d02564a971a2fa1b5860e934307cf7 # v5.0.0
        with:
          token: ${{ github.token }}
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
          target-branch: main

  production:
    name: Deploy production
    needs: release-please
    # !cancelled(): a skipped stage would otherwise propagate and skip production too.
    if: ${{ !cancelled() && needs.release-please.result == 'success' && needs.release-please.outputs.release_created == 'true' }}
    permissions:
      contents: write
    uses: ./.github/workflows/deploy-production.yml
    with:
      release_tag: ${{ needs.release-please.outputs.tag_name }}
    secrets: inherit
```

### `.github/workflows/deploy-stage.yml`

```yaml
name: Deploy stage

# Builds the docs and deploys them to Azion stage with the CLI, then commits the CLI state
# (.azion-stage) back to main. Called by release.yml; can also be dispatched by hand.

on:
  workflow_call:
    inputs:
      ref:
        description: Git ref (branch, tag or SHA) to build and deploy
        required: true
        type: string
  workflow_dispatch:
    inputs:
      ref:
        description: Git ref (branch, tag or SHA) to build and deploy
        required: true
        default: main
        type: string

permissions: {}

jobs:
  deploy:
    name: Deploy to stage
    runs-on: ubuntu-latest
    timeout-minutes: 45
    permissions:
      contents: write
    environment:
      name: stage
      url: ${{ steps.result.outputs.url }}
    concurrency:
      group: deploy-azion-stage
      cancel-in-progress: false
    env:
      HUSKY: 0
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: ${{ inputs.ref }}
          fetch-depth: 0

      - name: Use the latest Azion state from main
        run: |
          set -euo pipefail
          # The checked-out ref can predate the last state commit; deploying with stale IDs would duplicate resources.
          git fetch --no-tags origin main
          git checkout origin/main -- .azion-stage

      - uses: ./.github/actions/setup

      - name: Install Azion CLI
        run: |
          set -euo pipefail
          source .cli-version
          : "${CLI_VERSION:?.cli-version must define CLI_VERSION}"
          echo "Using Azion CLI ${CLI_VERSION}"

          CLI_PKG="azion_${CLI_VERSION}_linux_amd64.deb"
          BASE_URL="https://github.com/aziontech/azion/releases/download/${CLI_VERSION}"
          cd "$RUNNER_TEMP"
          curl -fsSL -o "$CLI_PKG" "${BASE_URL}/${CLI_PKG}"
          curl -fsSL -o azion_checksum.txt "${BASE_URL}/azion_v${CLI_VERSION}_checksum"

          CHECKSUM_LINE="$(awk -v pkg="$CLI_PKG" '$2 == pkg' azion_checksum.txt)"
          if [ -z "$CHECKSUM_LINE" ]; then
            echo "::error::No checksum entry for ${CLI_PKG} in azion_v${CLI_VERSION}_checksum"
            exit 1
          fi
          echo "$CHECKSUM_LINE" | sha256sum -c -

          sudo dpkg -i "$CLI_PKG"
          rm -f "$CLI_PKG" azion_checksum.txt
          azion version

      - name: Configure Azion CLI
        env:
          DEPLOY_TOKEN: ${{ secrets.AZION_DEPLOY_TOKEN }}
        run: azion -t "$DEPLOY_TOKEN"

      - name: Verify Azion authentication
        run: |
          set -euo pipefail
          if ! azion whoami >/dev/null 2>&1; then
            echo "::error::azion whoami failed: AZION_DEPLOY_TOKEN is missing or invalid in the stage environment"
            exit 1
          fi
          echo "Azion CLI authenticated"

      - name: Build and deploy
        id: deploy
        env:
          NODE_OPTIONS: --max-old-space-size=8120
        run: bash .azion-stage/deploy-stage.sh

      - name: Commit the Azion state back to main
        if: ${{ always() && steps.deploy.outcome != 'skipped' }}
        run: |
          set -euo pipefail
          STATE_DIR=.azion-stage
          SNAPSHOT="$RUNNER_TEMP/azion-state"
          rm -rf "$SNAPSHOT"
          cp -R "$STATE_DIR" "$SNAPSHOT"
          SHORT_SHA="$(git rev-parse --short HEAD)"
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

          # Commit on top of the latest main so the state never conflicts; retry if main moves meanwhile.
          for attempt in 1 2 3; do
            git fetch --no-tags origin main
            git reset --hard --quiet
            git switch --quiet --force-create deploy-state origin/main
            rm -rf "$STATE_DIR"
            cp -R "$SNAPSHOT" "$STATE_DIR"
            git add -A -- "$STATE_DIR"
            if git diff --cached --quiet; then
              echo "No Azion state change to record"
              exit 0
            fi
            git commit --quiet -m "chore(deploy): record stage azion state (${SHORT_SHA})"
            if git push origin HEAD:main; then
              exit 0
            fi
            echo "Push rejected (attempt ${attempt}); retrying on the new main"
          done
          echo "::error::Could not push the Azion state to main after 3 attempts"
          exit 1

      - name: Summarize deployment
        id: result
        if: ${{ always() }}
        env:
          DEPLOY_OUTCOME: ${{ steps.deploy.outcome }}
          DEPLOY_REF: ${{ inputs.ref }}
        run: |
          set -euo pipefail
          URL=""
          STATE_FILE=.azion-stage/azion/azion.json
          if [ -f "$STATE_FILE" ]; then
            URL="$(jq -r '.workloads.url // empty' "$STATE_FILE" 2>/dev/null || true)"
          fi
          case "$URL" in
            '' | http://* | https://*) ;;
            *) URL="https://${URL}" ;;
          esac
          echo "url=${URL}" >> "$GITHUB_OUTPUT"

          {
            echo "### Stage deployment"
            echo
            echo "| Field | Value |"
            echo "| --- | --- |"
            echo "| Environment | stage |"
            echo "| Ref | \`${DEPLOY_REF}\` |"
            echo "| URL | ${URL:-_not recorded_} |"
            echo "| Deploy | ${DEPLOY_OUTCOME} |"
          } >> "$GITHUB_STEP_SUMMARY"
```

### `.github/workflows/deploy-production.yml`

```yaml
name: Deploy production

# Builds the docs at a release tag and deploys them to Azion production with the CLI, then
# commits the CLI state (.azion-prod) back to main. Called by release.yml when a release is
# cut; can also be dispatched by hand to redeploy an existing tag.

on:
  workflow_call:
    inputs:
      release_tag:
        description: Release tag to deploy, as vX.Y.Z
        required: true
        type: string
  workflow_dispatch:
    inputs:
      release_tag:
        description: Existing release tag (vX.Y.Z) to redeploy to production
        required: true
        type: string

permissions: {}

jobs:
  deploy:
    name: Deploy to production
    runs-on: ubuntu-latest
    timeout-minutes: 45
    permissions:
      contents: write
    environment:
      name: production
      url: ${{ steps.result.outputs.url }}
    concurrency:
      group: deploy-azion-production
      cancel-in-progress: false
    env:
      HUSKY: 0
    steps:
      - name: Validate release tag
        env:
          RELEASE_TAG: ${{ inputs.release_tag }}
        run: |
          set -euo pipefail
          if [[ ! "$RELEASE_TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "::error::release_tag must be vX.Y.Z, got '${RELEASE_TAG}'"
            exit 1
          fi

      - name: Checkout release tag
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: refs/tags/${{ inputs.release_tag }}
          fetch-depth: 0

      - name: Verify the tag matches package.json
        env:
          RELEASE_TAG: ${{ inputs.release_tag }}
        run: |
          set -euo pipefail
          VERSION="$(jq -r '.version // empty' package.json)"
          if [ "$VERSION" != "${RELEASE_TAG#v}" ]; then
            echo "::error::${RELEASE_TAG} checks out package.json version '${VERSION}': tag and version disagree"
            exit 1
          fi

      - name: Use the latest Azion state from main
        run: |
          set -euo pipefail
          # The checked-out ref can predate the last state commit; deploying with stale IDs would duplicate resources.
          git fetch --no-tags origin main
          git checkout origin/main -- .azion-prod

      - uses: ./.github/actions/setup

      - name: Install Azion CLI
        run: |
          set -euo pipefail
          source .cli-version
          : "${CLI_VERSION:?.cli-version must define CLI_VERSION}"
          echo "Using Azion CLI ${CLI_VERSION}"

          CLI_PKG="azion_${CLI_VERSION}_linux_amd64.deb"
          BASE_URL="https://github.com/aziontech/azion/releases/download/${CLI_VERSION}"
          cd "$RUNNER_TEMP"
          curl -fsSL -o "$CLI_PKG" "${BASE_URL}/${CLI_PKG}"
          curl -fsSL -o azion_checksum.txt "${BASE_URL}/azion_v${CLI_VERSION}_checksum"

          CHECKSUM_LINE="$(awk -v pkg="$CLI_PKG" '$2 == pkg' azion_checksum.txt)"
          if [ -z "$CHECKSUM_LINE" ]; then
            echo "::error::No checksum entry for ${CLI_PKG} in azion_v${CLI_VERSION}_checksum"
            exit 1
          fi
          echo "$CHECKSUM_LINE" | sha256sum -c -

          sudo dpkg -i "$CLI_PKG"
          rm -f "$CLI_PKG" azion_checksum.txt
          azion version

      - name: Configure Azion CLI
        env:
          DEPLOY_TOKEN: ${{ secrets.AZION_DEPLOY_TOKEN }}
        run: azion -t "$DEPLOY_TOKEN"

      - name: Verify Azion authentication
        run: |
          set -euo pipefail
          if ! azion whoami >/dev/null 2>&1; then
            echo "::error::azion whoami failed: AZION_DEPLOY_TOKEN is missing or invalid in the production environment"
            exit 1
          fi
          echo "Azion CLI authenticated"

      - name: Build and deploy
        id: deploy
        env:
          NODE_OPTIONS: --max-old-space-size=8120
        run: bash .azion-prod/deploy-prod.sh

      - name: Commit the Azion state back to main
        if: ${{ always() && steps.deploy.outcome != 'skipped' }}
        env:
          RELEASE_TAG: ${{ inputs.release_tag }}
        run: |
          set -euo pipefail
          STATE_DIR=.azion-prod
          SNAPSHOT="$RUNNER_TEMP/azion-state"
          rm -rf "$SNAPSHOT"
          cp -R "$STATE_DIR" "$SNAPSHOT"
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

          # Commit on top of the latest main so the state never conflicts; retry if main moves meanwhile.
          for attempt in 1 2 3; do
            git fetch --no-tags origin main
            git reset --hard --quiet
            git switch --quiet --force-create deploy-state origin/main
            rm -rf "$STATE_DIR"
            cp -R "$SNAPSHOT" "$STATE_DIR"
            git add -A -- "$STATE_DIR"
            if git diff --cached --quiet; then
              echo "No Azion state change to record"
              exit 0
            fi
            git commit --quiet -m "chore(deploy): record production azion state (${RELEASE_TAG})"
            if git push origin HEAD:main; then
              exit 0
            fi
            echo "Push rejected (attempt ${attempt}); retrying on the new main"
          done
          echo "::error::Could not push the Azion state to main after 3 attempts"
          exit 1

      - name: Summarize deployment
        id: result
        if: ${{ always() }}
        env:
          DEPLOY_OUTCOME: ${{ steps.deploy.outcome }}
          RELEASE_TAG: ${{ inputs.release_tag }}
        run: |
          set -euo pipefail
          URL=""
          STATE_FILE=.azion-prod/azion/azion.json
          if [ -f "$STATE_FILE" ]; then
            URL="$(jq -r '.workloads.url // empty' "$STATE_FILE" 2>/dev/null || true)"
          fi
          case "$URL" in
            '' | http://* | https://*) ;;
            *) URL="https://${URL}" ;;
          esac
          echo "url=${URL}" >> "$GITHUB_OUTPUT"

          {
            echo "### Production deployment"
            echo
            echo "| Field | Value |"
            echo "| --- | --- |"
            echo "| Environment | production |"
            echo "| Release | \`${RELEASE_TAG}\` |"
            echo "| URL | ${URL:-_not recorded_} |"
            echo "| Deploy | ${DEPLOY_OUTCOME} |"
          } >> "$GITHUB_STEP_SUMMARY"
```

## Repository settings (admin)

- **Environments** `stage` and `production`, each with the secret `AZION_DEPLOY_TOKEN` (an Azion
  personal token of the account that owns the Applications). Never commit the token.
- **Settings → Actions → General:** enable "Allow GitHub Actions to create and approve pull
  requests". release-please needs it to open the Release PR.
- **Merge settings:** squash only, commit title = PR title. Already the case here; the `stage` job
  relies on the Release PR merge commit starting with `chore(release): v`.

## Changes required by the `main` ruleset

The `main` ruleset requires a pull request and the "Design system adoption" check, with no bypass.

- **Commit-back.** A push made with `github.token` is rejected. Create a GitHub App, add it as a
  bypass actor of the `main` ruleset, and use `actions/create-github-app-token` to get the token for
  the checkout used by the commit-back step in both deploy workflows. Because the IDs are already
  committed, a commit-back only happens when a resource changes, so this is rare.
- **Loop guard.** Pushes made with an App token **do** trigger workflows. Add
  `paths-ignore: ['.azion-*/**']` to the `push` trigger of `release.yml`.
- **Release PR checks.** A PR opened with `github.token` does not trigger `pull_request` checks, so
  the required check never reports. Either pass the App token to release-please (`token:`), or close
  and reopen the Release PR before merging.
- **GCS workflows.** `prod.yml` also deploys on every push to `main`. Retire `prod.yml`, `stage.yml`
  and `dev.yml` once `docs-prod` replaces the GCS production site, or both deploy in parallel.

## Lessons from the sandbox

- **A skipped job propagates.** `stage` is skipped on the Release PR merge, and GitHub then skips
  every job downstream of it unless its `if:` uses a status function. That is why `production`
  uses `!cancelled() && needs.release-please.result == 'success' && ...`.
- **Stale state duplicates resources.** The checked-out ref can predate the last state commit; both
  deploy workflows overlay `.azion-<env>` from `origin/main` right after checkout, and the
  commit-back is made on top of the latest `main`, with retry.
- **`--skip-build` skips the upload** on the CLI's v4 path (`pkg/cmd/deploy_remote/deploy.go`), so
  the deploy lets the CLI build (the `astro` preset runs `pnpm run build`).
- **The first deploy reads `.edge/manifest.json` before it builds.** The script generates it with
  `@aziontech/bundler` when it is missing; locally, delete a stale `.edge/` before bootstrapping a
  new environment.
- **Bootstrap state:** `bucket: ""` (the CLI creates the bucket from `name`) and `function: null`
  (on the v4 path `{}` fails to unmarshal). The CLI fills the `$..._NAME` / `$BUCKET_PREFIX`
  placeholders in `azion.config.ts` and reformats the file on the first deploy, which is why
  `.azion-*/azion.config.ts` is in `.prettierignore`.
- **v3 vs v4.** The CLI falls back to its v3 command set when the account has the
  `block_apiv4_incompatible_endpoints` flag; the v4 config here only works on the v4 path.

## Validation checklist

1. Merge a `fix(...)` PR: stage deploys, no state commit-back, the Release PR appears with a patch
   bump.
2. Merge a `feat(...)` PR: stage deploys, the Release PR moves to a minor bump.
3. Merge the Release PR: `stage` is skipped, the tag and the GitHub Release are created,
   `production` deploys from the tag.
4. Dispatch `deploy-stage.yml` with `ref: main`: no commit-back, no new resources.
5. `curl` both workload URLs: 200 on `/en/documentation/`, 404 on a page that does not exist.
