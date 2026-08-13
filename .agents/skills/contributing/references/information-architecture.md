# Information architecture

Where pages live in the `aziontech/docs` repository, how they get found, and the mechanics that decide whether a change ships whole: placement, enforcement, sidebars, redirects, and splits. Writing rules live in the voice references; this file is about the repository.

## Where pages live

Pages are `.mdx` files under `src/content/docs/{en,pt-br}/`. Portuguese paths are translated, not mirrored:

| Content | English | Portuguese |
| --- | --- | --- |
| Product reference | `en/pages/main-menu/reference/<journey>/<product>/` | `pt-br/pages/menu-principal/referencia/...` |
| How-to guides | `en/pages/guides/<product>/` | `pt-br/pages/guias/...` |
| Journey tasks | `en/pages/<journey>-journey/<product>/` | `pt-br/pages/<journey>-jornada/...` |
| Architectures | `en/pages/architectures/<product>/` | `pt-br/pages/arquiteturas/...` |
| CLI, SDKs, devtools | `en/pages/devtools/` | `pt-br/pages/devtools/` |
| Changelog, agreements | `en/pages/changelog/`, `en/pages/agreements/` | `changelog/`, `contratos/` |

**The directory decides nothing about the URL; `permalink` does.** Breadcrumbs derive from permalink segments. Keep path and permalink aligned anyway, because the directory decides who finds the file later.

## Search before adding

```bash
grep -rl "<the feature>" src/content/docs/en --include='*.mdx'
```

Do not re-explain a concept that already has its own page. Link the canonical page with descriptive text instead — duplicated explanations drift apart the first time the product changes.

## Enforcement: the schema lies, the validator does not

Astro's schema in `src/content/config.ts` marks almost everything optional. `test-frontmatter.js` disagrees, and it runs inside every `build:*` script, so it is the real gate.

| Field | Schema | Validator |
| --- | --- | --- |
| `title` | required | not checked |
| `namespace` | optional | **exits 1 if missing or duplicated** |
| `permalink` | optional | **exits 1 if missing, malformed (`/^[a-z0-9\-\/]+$/`), or duplicated** |
| `menu_namespace` | defaults to `nav` | not checked |
| `type` | defaults to `base` | not checked — **omit it** unless building a card-grid home |

Unknown keys are silently stripped, so a mistyped field name fails quietly.

> `.github/CONTRIBUTING.md` tells authors to include the language prefix in permalinks. That instruction is wrong and produces `/en/en/...` URLs. The contract in `.agents/references/style-guide.md` is correct.

Verify uniqueness against the corpus, not by eye:

```bash
grep -rh '^permalink:' src/content/docs/en --include='*.mdx' | sort | uniq -d
grep -rh '^namespace:' src/content/docs/en --include='*.mdx' | sort | uniq -d
grep -rn '^permalink: */\(en\|pt-br\)/' src/content/docs --include='*.mdx'
```

And the pairing — the check nothing in CI runs:

```bash
grep -rl "^namespace: <the namespace>$" src/content/docs
```

Two hits, one per language, is correct. One hit means the language switcher is broken for that page, and the build stays green.

## Sidebars

**A new page is reachable from nowhere until it is registered by hand.** Nothing scans the content directory. Two edits:

**1. Point the page at a menu** with `menu_namespace` in its frontmatter. Omit the field and the page falls back to `nav`, the main sidebar. An unregistered value also falls back silently. Registered values live in `src/data/availableMenu.ts`:

`nav`, `buildMenu`, `secureMenu`, `observeMenu`, `deployMenu`, `storeMenu`, `cliMenu`, `cliMenuAlpha`, `runtimeMenu`, `graphqlMenu`, `devtoolsMenu`, `libMenu`, `mcpMenu`

**2. Add the entry to the menu file, in both languages** — `src/i18n/en/<menu>.ts` and `src/i18n/pt-br/<menu>.ts`:

```ts
// src/i18n/en/storeMenu.ts
{ text: 'Create a bucket', slug: '/documentation/products/store/storage/create-bucket/', key: 'createBucket' },

// src/i18n/pt-br/storeMenu.ts
{ text: 'Criar um bucket', slug: '/documentacao/produtos/store/storage/criar-bucket/', key: 'createBucket' },
```

`slug` equals the page's `permalink` exactly — no language prefix, trailing slash — or the sidebar link 404s. `key` is camelCase, unique within the menu, identical across the two languages. `text` is translated. Heading entries additionally carry `header: true` and `type`.

Adding the English entry alone gives Portuguese readers a page with no way to reach it. Both languages, or neither.

## Redirects

A permalink that changes or disappears needs a redirect in the same change. Pairs live in `cicd/massive-redirect/en.json` and `cicd/massive-redirect/pt-br.json`, as full URLs:

```json
{ "from": "https://www.azion.com/en/documentation/products/old-path/", "moved": "https://www.azion.com/en/documentation/products/new-path/" }
```

> These files are not referenced by the build or CI; the layer that applies them is external. Confirm with whoever owns the edge configuration that an entry here is sufficient.

## Splitting a page

Split when one page carries two kinds, or when a reader has to scroll past four sections they do not care about. Length alone is weak evidence, but a page over the 16,000-character cap in `.agents/references/page-size.md` is almost always doing too much.

- **Find the seams in the outline**: a distinct task a reader would search for on its own, a shift of kind, a section that repeats a pattern the others do not share. Never "part 1 / part 2". Every child must stand alone for a reader arriving from search.
- **The parent keeps its permalink and becomes a navigation hub.** That protects every inbound link. It holds an orientation sentence and links, not a copy of the content.
- **Each child gets a new, unique permalink and namespace.**
- **Both languages split identically** — same children, matching `namespace` per pair. Splitting English alone leaves the Portuguese tree paired with a hub whose content it does not match.
- **Redirect every URL that no longer resolves.** The parent needs none if it keeps its permalink.
- **Every child gets sidebar entries in both languages.** A split that adds six pages and no menu entries has hidden six pages.
- **Propose before executing.** Pass one: the outline, each child's permalink and namespace, the redirect list, one sentence per child on why it stands alone. Pass two: execute, one child per commit.

## The markdown twin, on this branch

Authored agent twins (see `agent-twin.md`) have no serving mechanism here yet: `src/pages/[lang]/[...slug].md.js` strips the frontmatter and emits the page body, so it cannot serve an authored twin. Confirm how the twin is sourced before authoring a set of them.

## Validate

```bash
npm run build:local
```

Runs the build and the frontmatter validator; both must pass, and a failure names the file. If the build runs out of memory: `export NODE_OPTIONS='--max-old-space-size=8120'`.

Then check by hand what the build cannot:

- The page appears in the sidebar you intended, in both languages.
- A translation's `namespace` matches its English page exactly.
- A changed permalink has its redirect in the same change.
