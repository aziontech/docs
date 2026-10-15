# AGENTS.md

Instructions for AI coding agents working in this repository. Humans want
[CONTRIBUTING.md](.github/CONTRIBUTING.md); the rules behind both are in
[GOVERNANCE.md](.github/GOVERNANCE.md), which wins over this file if they disagree.

AI-assisted contributions are welcome and held to identical standards. Whoever opens the pull
request is accountable for the accuracy of what the agent wrote.

## What this repository is

The source of the [Azion documentation](https://azion.com/en/documentation/): an Astro site
built from MDX, published in English and Portuguese.

These pages are consumed as an API, not only read in a browser. Every page is also served as
Markdown at its own URL with `.md` appended, every section publishes an `llms.txt`, and the
page inventory feeds `llms.txt` at the site root and the Azion docs MCP server. Frontmatter,
heading structure, and working links are therefore contract requirements, not style
preferences.

## Layout

| Path | What it holds |
| --- | --- |
| `apps/docs/src/content/docs/en` · `.../pt-br` | every published page, as `.mdx` |
| `apps/docs/src/nav` | the navigation trees that build the sidebars |
| `apps/docs/src/pages` | routes, including the `.md` twins, `llms.txt`, and the sitemaps |
| `apps/redirects-massive/src/redirects/{en,pt-br}/doc.json` | the redirect map |
| `.claude/rules/webkit-*.md` · `CLAUDE.md` | the design system rules, for UI work only |

## Writing or changing a page

- **English is the source of truth.** Write it first, and add the `pt-br` version in the same
  pull request. If you genuinely cannot, open a follow-up `i18n` issue and link it.
- **Frontmatter.** The collection schema requires `title`. The pull request template also
  requires `description`, `meta_tags`, `namespace`, and `permalink`, and reviewers hold you to
  it. `namespace` pairs a page with its translation, so the two language versions share one.
- **Changing a `permalink` or moving a page requires a redirect in the same pull request**, in
  `apps/redirects-massive/src/redirects/{en,pt-br}/doc.json`. A permalink change without one is
  a broken build.
- **Register a new page in a navigation tree** under `apps/docs/src/nav`, or nothing links to it
  and it reaches no index.
- **Internal links are root-relative** (`/en/documentation/...`) and must resolve.
- Do not name competitors anywhere: not in pages, not in commit messages, not in pull request
  descriptions.

## Commands

Node comes from `.nvmrc`. pnpm is the package manager of record — never commit an npm or yarn
lockfile.

```bash
pnpm install --frozen-lockfile
pnpm dev                 # local preview

pnpm build:local         # build + frontmatter validation (CI runs this too)
pnpm lint:slugcheck      # permalink rules
pnpm lint:navcheck       # navigation trees
pnpm lint:links          # internal links, without a build
pnpm format              # prettier
```

Run a script of another app with `pnpm -F <app> <script>`, for example
`pnpm -F redirects-massive test`.

## Pull requests

- Branch off `main` (`type/short-slug`), keep it short-lived, and never push to `main`.
- Title is `type(scope): imperative summary`, enforced by CI, with **no ticket code** — merges
  are squash-only, so the title becomes permanent history. Types: `feat` new content, `fix`
  corrections, `docs` upkeep, `i18n` translation, `refactor`/`chore` structure and tooling.
- One concern per pull request. Content changes and platform or code changes never travel
  together.
- Fill the pull request template; its checklists are the review contract.
- Two people sign off: a subject matter expert for accuracy, a DevRel maintainer for writing
  and placement.

## Building UI

Components come from the `@aziontech/webkit` design system, and that work has its own
non-negotiables — flat imports, theme tokens instead of raw colors, no restyling a webkit
component. They are in [CLAUDE.md](CLAUDE.md) and `.claude/rules/webkit-*.md`, and ESLint
blocks the mechanical ones. Read them before touching anything under `apps/docs/src/components`.

## Reaching Azion itself

To look facts up or act on an Azion account while you work, connect to the Azion MCP servers —
`https://docs-mcp.azion.com/mcp` for the documentation, and the `build`, `secure`, `observe`,
and `storage` servers for the platform. Setup is at
<https://azion.com/en/documentation/devtools/mcp/quickstart/>.
