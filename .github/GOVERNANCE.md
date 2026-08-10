# Azion Docs Governance

How contributions move through `aziontech/docs`: who owns what, what needs whose approval, and the conventions everyone follows. If another document in this repo contradicts this one, this one wins and the other gets a PR.

- How to contribute → [CONTRIBUTING.md](CONTRIBUTING.md)
- Who reviews what → [CODEOWNERS](CODEOWNERS)

## Principles

1. **Docs are an API.** People read these pages, and so do agents and crawlers through llms.txt, context7, and MCP. Frontmatter, heading structure, and working links are part of the contract.
2. **English is the source of truth.** `pt-br` mirrors `en`. When they drift, that gets tracked in an `i18n` issue rather than left silent.
3. **URLs are forever.** Moving or renaming a page means adding a redirect in the same PR.
4. **One PR, one concern.** Content and platform code don't travel together.

## Roles

| Role | Who | Owns |
|---|---|---|
| DevRel | The default owners in [CODEOWNERS](CODEOWNERS) | The project: content, style, IA, i18n, roadmap. Default owner and the final say on everything |
| DevRel lead | The project owner named under Escalation | The calls that are hard to undo: deleting pages, IA changes, changes to this document |
| UX Engineering | `@aziontech/team-uxe` | Platform code: `src/` components, config, CI. Co-reviews with DevRel |
| Product content | `@aziontech/product-content` | Published content and translations |
| SMEs | The relevant product team | Technical accuracy in their area |
| Contributors | Anyone, internal or external | Proposing changes through an issue and a PR |

Technical content passes two gates: an SME confirms it's true, and DevRel confirms it's well written and well placed. Neither substitutes for the other. CODEOWNERS requests one reviewer set per path, so not every approval in the table below is routed automatically. The author requests whoever CODEOWNERS didn't, starting with the SME, since there are no per-product entries.

## What needs what

| Change | Issue first? | Approvals |
|---|---|---|
| Typo, broken link, formatting | No | 1 DevRel |
| Update an existing page | Recommended | 1 DevRel, plus an SME if technical claims change |
| New page | Yes | 1 SME + 1 DevRel |
| Delete or move a page, change a permalink | Yes | 1 DevRel + DevRel lead, and the redirect ships in the same PR |
| Nav, menu, or IA change | Yes | DevRel lead + 1 UXE |
| Platform code (`src/`, config, CI) | Yes | 1 UXE + 1 DevRel |
| Change to this document | Yes, as a proposal | DevRel lead, with a comment window for affected teams |

## How a change moves

Open an issue, or pick up an existing one. Small fixes can skip straight to a PR.

Branch off `main`, which is the only branch anyone works from. Name it `EDU-1234-short-slug` or `type/short-slug`. Keep it short-lived: days, not weeks. Long branches are where merge pain and stale content come from, so if a branch is growing past a week, split it or land what's ready.

Don't park unfinished work in a branch waiting for a launch date. Either keep the PR small enough to merge on the day, or merge it behind a frontmatter flag that keeps the page out of nav, sitemap, and search until it's ready.

Open the PR against `main` and fill in the template. Merges are squash-only, so the PR title becomes the permanent commit message.

After merge, CI builds and deploys `main` to production.

## PR conventions

Titles follow `type(scope): imperative summary`, checked by CI.

- Types: `feat` (new content), `fix` (corrections), `docs` (upkeep and rewrites), `i18n` (translation sync), `refactor` (structure, no meaning change), `chore` (deps and tooling)
- Scope: a journey or product slug, like `secure`, `build`, `functions`, `object-storage`
- Good: `docs(secure): clarify Bot Manager scoring rules`
- Not this: `fix typo` · `Update en.json` · `Enhance documentation on...`

No ticket codes in the title. Squash merge makes titles permanent history and `[EDU-1234]` adds nothing there. The ticket lives in the branch name, which Jira links automatically, and in the PR body.

Keep PRs to roughly 400 changed lines of prose, translations excluded. Bigger ones are harder to review well, so split them unless there's a reason not to.

AI-assisted PRs follow the same rules as any other. The author, not the agent, is accountable for accuracy.

## What CI checks

On every PR: the site builds, frontmatter namespaces and permalinks are present and unique, and the PR title matches the convention. A broken build or a duplicate permalink blocks the merge.

Weekly: a link check crawls the built site for broken internal links and opens an issue when it finds them.

Everything else in this document is a convention that reviewers uphold, which is how most of it will always work.

## Review expectations

| Situation | Target |
|---|---|
| First response on any PR | 1 business day |
| Typos and broken links | Same day |
| Full review | 3 business days |

These are targets, not guarantees, but they matter more than usual here: short-lived branches only work if reviews are quick. If they slip consistently, the answer is more reviewer capacity, not longer branches.

A PR that goes quiet on the contributor's side gets a nudge, and may be closed after a couple of weeks with an invitation to reopen. A PR waiting on us is never closed for age.

## Maintenance and deprecation

Pages go stale. DevRel reviews the oldest content periodically and files upkeep issues for what needs attention.

When a feature is deprecated, its page gets a banner and a pointer to the replacement for one release cycle, then a redirect. The content stays in git history rather than ranking in search.

## Escalation

If an SME and DevRel disagree, @bruno-andrade-azion decides and the decision is recorded in the PR. To propose a change to this document, open an issue with the `governance` label.

---
*Owner: DevRel*
