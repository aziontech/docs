# redirects-massive

> Imported from aziontech/site (`apps/redirects-massive`, commit `5fed26edce7ff50b6de7adf987304822faed3af4`). This copy is
> independent: it serves the docs URLs and has its own Azion resources.

A **single** edge function that serves every permanent redirect for Azion,
consolidating what used to be several separate redirect functions/rules into one
maintainable place.

## Structure

Redirects are grouped by **language**, and inside each language by **group**
(one JSON file per group). Cross-domain host redirects live at the root.

```
apps/redirects-massive/src/redirects/
  index.ts             # engine: loads every file, builds the lookup Map
  validate.mjs         # read-only data checks (pnpm -F redirects-massive validate)
  en/
    pages.json         # top-level pages (e.g. /en/build/ -> /en/solutions/web-apps/)
    products.json      # /en/products/...
    solutions.json     # /en/solutions/...
    blog.json          # /en/blog/...
    doc.json           # /en/documentation/...
    marketplace.json   # /en/marketplace/...
  pt-br/
    pages.json  products.json  solutions.json  blog.json  doc.json  marketplace.json
  es/
    pages.json  products.json  solutions.json  blog.json  marketplace.json
  lp.json              # /<lang>/lp/... landing pages (language-agnostic file)
  pricing.json         # plans/pricing (language-agnostic file)
  hosts.json           # cross-domain, language-agnostic (e.g. azion.com.br -> azion.com)
```

> **Wiring**: `index.ts` imports each file explicitly into a `FILES` list. After
> creating a new file, add its `import` + a `FILES` entry — otherwise it is not
> loaded. The `wiring.test.ts` unit test fails if any on-disk file is not wired.

## The file format

Files use **Azion's Massive Redirect JSON schema**, so they double as valid
arguments for Azion's "Massive Redirect [Global]" function. Each entry has a
`from` (the old URL) plus **one** of `moved` or `found` — the key chooses the
HTTP status:

| Key     | Status | Meaning                |
| ------- | ------ | ---------------------- |
| `moved` | `301`  | permanent redirect     |
| `found` | `302`  | temporary redirect     |

All values are **full URLs**. Almost everything here is a permanent move, so use
`moved`; use `found` only for a genuinely temporary redirect.

For pattern rules, use `from_regex` instead of `from`. Capture groups are
substituted into the target with Azion's backref syntax — `%s` (next group in
order) and `%N$` (the Nth group), e.g.
`{ "from_regex": "http://www\\.azion\\.com/t/other/([\\w_]+)/([\\w_]+)/([\\w_]+)/$", "moved": "http://www.azion.com.br/doc/%3$/%1$/%2$/" }`.
Exact `from` matches always win over regex rules.

Validate anytime with:

```bash
pnpm -F redirects-massive validate
```

It checks the schema (`from` xor `from_regex`, `moved` xor `found`), flags
**conflicting duplicates** (same source, different target) as errors and
redundant duplicates as warnings, checks per-language file symmetry, and reports
the total size against Azion's 300 KB budget. It also runs in CI.

```json
[
  {
    "from": "https://www.azion.com/en/products/edge-caching/",
    "moved": "https://www.azion.com/en/products/edge-cache/"
  }
]
```

`hosts.json` uses the exact same shape for whole-domain redirects:

```json
[{ "from": "http://www.azion.com.br", "moved": "http://www.azion.com" }]
```

> Note: Azion's Massive Redirect also supports `from_regex` for pattern-based
> rules and enforces a 300 KB limit per JSON file (error `JA001` if an entry is
> missing both `moved` and `found`). Our current data is all exact matches, so
> this custom function only reads `from` + `moved`/`found`.
> Docs: <https://www.azion.com/en/documentation/products/guides/massive-redirect-integration/>

## How to change or add a redirect

1. **Change / add an entry** → open the right file (by language + group) and edit
   the JSON list. No build step, no script — the value you write is the value
   that is served. Add a `{ "from": "...", "found": "..." }` object.
2. **New group** (e.g. `docs`) → create `en/docs.json`, `pt-br/docs.json`,
   `es/docs.json` and add them to the `import`s and the `FILES` list in
   `index.ts` (one line each).

Guidelines so entries stay predictable:

- Use the **full URL** for both `from` and the target, ending with a trailing
  slash for page paths (matching the site convention).
- Use `moved` (301) unless the redirect is truly temporary — then use `found`
  (302).
- Point `from` straight at the **final** destination — don't chain one redirect
  into another (the engine flattens accidental chains, but direct is clearer).
- Don't point a `from` at itself.

## How it works

- `index.ts` merges every file into one `Map` keyed by **host + path**, lower-cased
  and without a trailing slash. So matching ignores scheme (`http`/`https`), query
  string, and trailing slash, and supports both locale path redirects
  (`www.azion.com/...`) and host redirects (`azion.com.br`).
- `../index.ts` (the handler) looks the request up and returns the entry's status
  (`301` for `moved`, `302` for `found`) with the target URL as `Location`. The
  incoming query string is preserved (so UTM/analytics params survive), and only
  `301`s carry a `Cache-Control` (a `302` is temporary and must not be cached).
  Anything not listed passes through to origin untouched.
- `azion.config.ts` runs the function for every request (`^/`); the O(1) lookup
  decides redirect vs. passthrough. **The edge application's origin must not be
  this same function**, or the passthrough `fetch(request)` would re-enter it.

```bash
pnpm -F redirects-massive dev               # local dev server
pnpm -F redirects-massive build             # azion/edge-functions build
pnpm -F redirects-massive lint              # eslint
pnpm -F redirects-massive typecheck         # tsc --noEmit
pnpm -F redirects-massive test              # unit tests (+ data integrity checks)
pnpm -F redirects-massive test:integration  # integration tests
```

## ⚠️ Notes

- **Deployment**: for redirects to take effect on `www.azion.com/...`, this
  function's request rule must run on the **same edge application that serves
  `www.azion.com`** (and any redirected host such as `www.azion.com.br`). Deployed
  standalone (like `sitemap-xml`), it gets its own `*.azionedge.net` domain and
  will not intercept production paths. Attach the `Redirects` rule + function
  instance from `azion.config.ts` to the production edge application.
- **Status code**: chosen per entry by key — `moved` = 301 (permanent), `found`
  = 302 (temporary), matching Azion's Massive Redirect. Azion's integration does
  not use 307/308. All current entries are `moved` (301).
- **Native alternative**: because the files follow Azion's Massive Redirect
  schema, they can instead be fed directly to the Marketplace "Massive Redirect
  [Global]" function's Arguments (concatenated into one array, under 300 KB),
  skipping this custom function entirely. Pick one mechanism to avoid double
  redirects.
- **Provenance**: the initial data was migrated from
  `apps/site/cicd/massive-redirect/` plus the legacy Build/Secure pages. This
  function is now the single source of truth for runtime redirects. One
  conflicting duplicate existed in the source
  (`/pt-br/blog/afinal-o-que-e-ddos/`) — verify its target.
