# AGENTS.md — Azion Docs

Guidance for AI agents working in `aziontech/docs`, the source for [Azion's developer documentation](https://azion.com/en/documentation/).

## Repository overview

An Astro site with MDX content, published in English and Brazilian Portuguese at `azion.com/{en,pt-br}/documentation/`. Roughly 742 pages per language. It builds to static files and deploys from `main`.

It began as a fork of the Astro docs site, which matters more than it sounds: much of `src/components/` and several schema fields are inherited and unused. Do not assume something works because it exists.

## Directory structure

```
src/
  content/docs/
    en/                       English, the source of truth
      homes/                  card-grid landing pages (type: homepage)
      pages/
        main-menu/reference/  product reference
        guides/               how-to guides
        *-journey/            build, deploy, secure, store, observe task pages
        architectures/        solution explainers
        devtools/             CLI, SDKs, GraphQL, Terraform, MCP
        agreements/           legal, historical
        changelog/            historical
    pt-br/                    Portuguese, mirrored with translated paths
  components/                 mostly dead fork legacy, see .agents/references/components.md
  i18n/{en,pt-br}/            sidebar menus, hand-maintained TypeScript arrays
  includes/snippets/          shared MDX snippets, en/ and pt/ variants
  pages/[lang]/               routes, including [...slug].md.js for markdown twins
  content/config.ts           the Zod schema
  data/availableMenu.ts       registry of valid menu_namespace values
env/                          per-environment consts, copied by build:* scripts
cicd/massive-redirect/        redirect pairs, en.json and pt-br.json
scripts/                      linters and utilities
test-frontmatter.js           the real frontmatter gate
.agents/                      agent skills, agents, and references
```

## Agent skills, agents, and references

Repo-specific agent config lives in `.agents/`. All of it is committed. Tool-specific paths are symlinks into it: `.claude/CLAUDE.md`, `.claude/agents`, `.claude/skills`. **Add files to `.agents/`, never to `.claude/`** — that directory carries a deny-all `.gitignore`, so anything dropped there is invisible to git.

### Skills

| Skill | Use it for |
| --- | --- |
| `contributing` | Writing, rewriting, splitting, or translating a page |
| `reviewing-a-page` | Auditing a page and reporting problems, ranked |

Both are thin routers. The detail lives in their `references/`, loaded only when the task needs it.

### Agents

| Agent | Use it for |
| --- | --- |
| `writer` | A delegated writer working on pages |
| `reviewer` | A delegated auditor, especially across many files |

Use these when fanning work out to subagents, which do not inherit the skills loaded in your session.

### Reference files

| File | Contents |
| --- | --- |
| `.agents/references/house-style.md` | Voice, headings, links, lists, code |
| `.agents/references/writing-quality.md` | Patterns that read as machine-generated |
| `.agents/references/components.md` | The MDX components that are actually live |
| `.agents/references/terminology.md` | Product names, banned terms, translation rules |
| `.agents/references/page-size.md` | Length caps and writing for retrieval |

## Content

### File locations

Pages live in `src/content/docs/{en,pt-br}/` as `.mdx`. The directory decides nothing about the URL; `permalink` does. Keep them aligned anyway, because breadcrumbs derive from permalink segments.

Portuguese paths are translated, not mirrored: `main-menu/` is `menu-principal/`, `guides/` is `guias/`, `agreements/` is `contratos/`.

### Frontmatter

```yaml
---
title: How to create an Object Storage bucket
description: >-
  Learn how to create a read-only bucket and grant read-write permissions
  using the Azion API.
meta_tags: 'Object Storage, bucket, S3, API'
namespace: docs_store_journey_storage_create_bucket
permalink: /documentation/products/store/storage/create-bucket/
---
```

| Field | Required by | Notes |
| --- | --- | --- |
| `title` | Zod schema | Renders the H1. Body starts at `##`. |
| `namespace` | `test-frontmatter.js` | Unique per language. **Identical across a translation pair.** |
| `permalink` | `test-frontmatter.js` | Unique per language. **No language prefix.** |
| `description` | nothing | Write it. It is the meta description. |
| `meta_tags` | nothing | Write it. Comma-separated keywords. |
| `menu_namespace` | nothing | Only to place a page in a product sidebar. |
| `og_image` | nothing | Rare. |
| `type` | nothing | **Omit it** unless building a card-grid home. |

The Zod schema marks nearly everything optional; `test-frontmatter.js` disagrees and runs inside every `build:*`. The validator is the real contract. Unknown keys are silently stripped, so a mistyped field name fails quietly.

### Writing and style rules

In `.agents/references/house-style.md` and the content-type references under `.agents/skills/contributing/references/`. Four Diátaxis types: tutorial, how-to, reference, explanation. One per page.

## Components

Only a small set is live. Ranked by real usage: asides (`:::note`, auto-imported), `LinkButton`, `Code`, `Tag`, `Tabs`+`Fragment`, `Video` (auto-imported), `SectionBasicContent`, shared snippets.

`Card`, `Badge`, `FileTree`, `Checklist`, `Spoiler`, `Since`, `Button`, `TabBox`, and `Breadcrumb` have **zero usages in content**. Importing one fails the build. Full catalogue in `.agents/references/components.md`.

## Validation

```bash
npm run build:local        # build + frontmatter validation. The gate.
npm run test:frontmatter   # frontmatter only, fast
npm run check              # astro check
npm run lint:eslint        # code only
```

`build:local` copies `env/consts.localhost.ts` into `src/consts.ts`, runs `astro build`, then `test:frontmatter`. Both must pass.

The build needs headroom. If it runs out of memory:

```bash
export NODE_OPTIONS='--max-old-space-size=8120'
```

Three things the build cannot check, so check them by hand:

1. Does the page appear in the sidebar you intended? Registration is a separate manual edit.
2. If this is a translation, does its `namespace` match the English page exactly?
3. If a permalink changed, is the redirect in the same change?

### Tooling that is broken or misleading

- `lint:slugcheck` is **not a permalink check**. It requires byte-identical file paths across languages and exits 1 against 686 existing `pt-br` pages that use localized slugs. Not wired into CI. Do not gate on it.
- `lint:linkcheck` runs `npm build`, which is not a valid command.
- `lint:a11y:remote` points at `wwww.azion.com`, four w's.
- `translation-status` invokes `scripts/translation-status.ts`, which does not exist.

## CI pipeline

Three workflows, all triggered on **push**, none on pull request:

| Workflow | Trigger | Does |
| --- | --- | --- |
| `prod.yml` | push to `main` | build, reindex search, publish, purge cache |
| `stage.yml` | push to `stage` | build, publish to stage |
| `dev.yml` | push to `dev` | build, publish to dev |

Nothing runs before a merge, so a broken build reaches `main` before anyone finds out. `dev` and `stage` are 905 commits behind and last saw a commit in June 2025.

CI installs with `npm`. Both `package-lock.json` and `pnpm-lock.yaml` are committed.

## Common mistakes to avoid

**Putting the language in the permalink.** `/en/documentation/...` renders at `/en/en/documentation/...`. Write `/documentation/...`. `.github/CONTRIBUTING.md` documents this incorrectly.

**Changing a translation's namespace.** It is the join key. Change it and the language switcher breaks while CI stays green and nothing warns you.

**An H1 in the body.** `title` renders it.

**`:::warning`.** Not a valid aside type. Valid: `note`, `tip`, `caution`, `danger`. Fifteen pages use it anyway.

**Bare `<br>`.** MDX requires `<br />` or `<br></br>`.

**Forgetting `client:visible` on `<Tabs>`** or `client:only="vue"` on `<Tag>`. They render and do not work.

**No blank lines around markdown inside a `<Fragment>`.** The numbered list renders as one paragraph.

**Accents in a Portuguese permalink.** Must be ASCII-folded: `configuracao`, not `configuração`.

**`---` immediately after the frontmatter.** Parsed as an empty frontmatter block.

**Assuming a component exists** because it is in `src/components/`.

## Content collections

`src/content/config.ts` defines a union of nine schemas: `base`, `homepage`, `backend`, `cms`, `integration`, `migration`, `tutorial`, `deploy`, `recipe`.

Only `base` (the default) and `homepage` are used. The other seven are fork legacy with **zero pages**, and setting one changes which branch validates: `recipe` makes `description` required, `integration` requires the title to start with `@astrojs/`. Omit `type`.

`i18nReady` exists in the schema, is read by `RightSidebar/ContributeMenu.astro`, and is set by no page.

## Bilingual

Pages pair by `namespace`, not by path. `src/util/getPageTranslations.ts` matches on it, and that powers the language switcher.

| Field | In the Portuguese page |
| --- | --- |
| `title`, `description` | translated |
| `permalink` | **translated**, `/documentacao/produtos/...` |
| `namespace` | **identical to English** |
| `menu_namespace` | identical |
| `meta_tags` | conventionally left in English |

737 namespaces pair correctly today; 8 English pages have no Portuguese version.

## Sidebars

Nothing scans the content directory. A new page is reachable from nowhere until it is registered by hand in `src/i18n/en/<menu>.ts` **and** `src/i18n/pt-br/<menu>.ts`.

Entries need `text` and `key`; link entries need `slug`, which equals the page's `permalink` exactly and excludes the language code. Valid `menu_namespace` values are in `src/data/availableMenu.ts`; an unrecognized value silently falls back to `nav`.

## Page size and retrieval

These pages are fetched by agents, served as markdown twins at `<url>.md`, and will be indexed for retrieval. A retriever returns one section, not a page.

Targets: 2,000 characters per `##` section, 8,000 per page body. Hard caps 4,000 and 16,000. Currently 150 of 728 English pages are over target and 60 over the cap.

The rule that matters more than the number: **every section must make sense read alone.** Details in `.agents/references/page-size.md`.

## Terminology

`Applications` not `Edge Application`. `Functions` not `Edge Functions`. `Firewall` not `Edge Firewall`. `Azion Web Platform` not `Azion Edge Platform`.

Changelogs, release notes, and dated agreements are exempt: they record what was true when written.

Never translate `edge computing`, `edge`, `edge location`, `data center`, `serverless`, `template`, `compliance`. Full rules in `.agents/references/terminology.md`.

## Ground rules

**This is a public repository.** Never put internal URLs, credentials, unreleased product names, or customer information into pages, commits, or pull requests.

**Never commit or push automatically.** Make the changes, then ask.

**Never invent a fact.** A limit, default, field name, or error string must trace to a source you can name. In documentation a confident wrong value is indistinguishable from a correct one until a reader tries it.

**The existing pages are not the model.** Most predate any consistent structure and are due for restructuring. The references describe the target state; do not edit a reference to match a page you happened to read.

## Commit conventions

`type(scope): imperative summary`, no ticket codes in the title. Types: `feat`, `fix`, `docs`, `i18n`, `refactor`, `chore`. Scope is a journey or product slug.
