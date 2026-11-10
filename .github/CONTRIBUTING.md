# Contributing to Azion Docs

Thanks for helping improve [Azion Developer Documentation](https://azion.com/en/documentation/)!

## The 60-second version:
1. Open an issue (or grab one) → 2. Branch from `main` → 3. Write the page → 4. Run `pnpm build:local` → 5. Open a PR with a [conventional title](GOVERNANCE.md#4-pr-standard-enforced-by-ci) → 6. CI + two reviewers → 7. Squash-merge

Rules of the road live in [GOVERNANCE.md](GOVERNANCE.md). This page is the practical walkthrough.

## Before you write

- Search existing issues first. If none fits, open one via the [issue forms](https://github.com/aziontech/docs/issues/new/choose) (Add / Upkeep / Fix / Question).
- Small fixes (typos, broken links) can skip the issue and go straight to a PR.
- Who reviews what is defined only in [`.github/CODEOWNERS`](CODEOWNERS). If you read a list of names anywhere else, trust CODEOWNERS.

## Setup

```bash
git clone https://github.com/aziontech/docs.git   # or your fork (external contributors)
cd docs
nvm use                          # Node version from .nvmrc
pnpm install --frozen-lockfile   # pnpm is the package manager of record. Do not commit npm/yarn lockfiles
pnpm dev                         # local preview
```

## Making changes

- All content lives in `apps/docs/src/content/docs/{en,pt-br}` as `.mdx`. English is the source of truth, so write it first. Add the `pt-br` version in the same PR when you can.
- Trunk-based flow: `main` is the only long-lived branch. Branch off it (`EDU-1234-short-slug` or `type/short-slug`), keep the branch alive **3 days or less**, and PR back into `main`. Do not push to `main` directly, do not commit through the web UI, and do not keep personal long-running branches. Embargoed launch content merges behind a draft/publish frontmatter gate instead of waiting in a branch.
- One concern per PR. Content changes and platform/code changes never travel together.

## Before opening the PR

```bash
pnpm build:local     # build + frontmatter validation (CI runs this too)
pnpm lint:slugcheck  # permalink rules
pnpm lint:changelog  # release notes entries (see below)
```

- Changed a permalink or moved a page? **Add the redirect in this PR**, in the highest-numbered file of `apps/docs/redirects/{en,pt-br}/`, and list it on the redirect row of the PR checklist.
- Can't update `pt-br` yourself? Create the follow-up `i18n` issue and link it in the PR checklist.

### Changelog entries

The release notes and the changelog archive are records: an entry is never rewritten, so the
[changelog rules](../apps/docs/src/content/docs/en/pages/style-guide/content/changelog.mdx) of the
style guide apply in full to the entries you add. `pnpm lint:changelog` checks the changelog pages,
or the files you pass it.

Every entry, old or new, keeps an `anchor` that is unique on the page and starts with its date as a
slug, and the entries run newest first. An entry dated after October 22, 2026 also needs:

- the date as its `label`: `October 22, 2026` in English, `22 de outubro de 2026` in Portuguese;
- the date as its `anchor`: `october-22-2026`, `22-de-outubro-de-2026`. Another entry on the same
  date adds its tag: `october-22-2026-azion-cli`;
- exactly one tag, from the list below: `tags={['Azion CLI']}`;
- `description="Version 4.25.0"` (`Versão 4.25.0` in Portuguese) only when the release has a version;
- a blank line after the opening tag and another before the closing tag;
- the closing link as its last paragraph, to a page in the same language:
  `For more information, refer to [Azion CLI](/en/documentation/devtools/cli/).` or
  `Para mais informações, consulte [Azion CLI](/pt-br/documentacao/devtools/cli/).`

The tags are the current names of the Platform Resources and products, plus the channels the release
notes report on. Older entries keep the names of their time.

- **Platform Resources and channels:** Azion API, Azion CLI, Azion Console, Azion MCP servers,
  Terraform Provider, DevTools & Integrations, Marketplace, GraphQL API, Real-Time Metrics,
  Applications, Firewall, Connectors, Workloads, Certificate Manager, Custom Pages, Real-Time Purge,
  Copilot.
- **Build:** AI Inference, Application Accelerator, Cache, Durable Objects, Functions, Image
  Processor, Live Ingest, LoRA Fine-Tune, Orchestrator.
- **Store:** KV Store, Object Storage, SQL Database.
- **Secure:** AI Gateway, Bot Manager, Edge DNS, Load Balancer, Network Shield, Origin Shield, Secure
  Internet Access, WAF.
- **Observe:** Data Stream, Edge Pulse, Real-Time Events.

A release that needs a new tag adds it to this list and to `TAGS` in
`apps/docs/scripts/lint-changelog.mjs` in the same PR.

On a PR that changes a changelog page, the **Changelog entries** check runs the same script over the
pages the PR changes and annotates each finding on its line. It does not block the merge: you decide
whether to fix the entry there.

## The PR

- Title: `type(scope): imperative summary`, enforced by CI. **No ticket codes in the title**: the branch name and the Related issue field carry those, and squash makes titles permanent history.
  - `feat` new content · `fix` corrections · `docs` upkeep · `i18n` translation · `refactor`/`chore` structure & tooling
- Fill the PR template. The checklists are the review contract, and reviewers will hold you to them.
- Two people sign off: an SME confirms it's technically true, and a DevRel maintainer confirms it's well written and well placed. Expect a first response within 1 business day. Short-lived branches only work when reviews are fast.
- Merges are **squash-only**; your PR title becomes the permanent commit message.

## External contributors

Fork → branch → PR to `main`. Enable "allow maintainer edits" so we can help you across the finish line. Internal team PRs may take priority when a launch is in flight, but community PRs get folded in and credited.

## AI-assisted contributions

Welcome, and held to identical standards. Whether the branch came from you, Codex, Copilot, or Claude, it meets the same template, title, and checklist requirements as any other PR. You are accountable for the accuracy of what the agent wrote, and "the AI generated it" is not a review response.

## After the merge

CI deploys `main` to production automatically. Check your page on [https://azion.com/en/documentation/](https://azion.com/en/documentation/), then close the issue.
