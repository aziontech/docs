# redirects-massive

> Imported from aziontech/site (`apps/redirects-massive`, commit `5fed26edce7ff50b6de7adf987304822faed3af4`). This copy is
> independent: it serves the docs URLs and has its own Azion resources (`docs-redirects`).

A **single** edge function that serves the permanent redirects of the Azion docs
(`www.azion.com/en/documentation/...` and `www.azion.com/pt-br/documentacao/...`).

## Structure

Redirects are grouped by **language**, split across numbered JSON files:

```
apps/redirects-massive/src/redirects/
  index.ts             # engine: loads every file, builds the lookup Map
  validate.mjs         # read-only data checks (pnpm -F redirects-massive validate)
  en/doc-00.json       # /en/documentation/...
  en/doc-01.json       # /en/documentation/...
  pt-br/doc-00.json    # /pt-br/documentacao/...
  pt-br/doc-01.json    # /pt-br/documentacao/...
```

> **Wiring**: `index.ts` imports each file explicitly into a `FILES` list. After
> creating a new file, add its `import` + a `FILES` entry — otherwise it is not
> loaded. The `wiring.test.ts` unit test fails if any on-disk file is not wired.

## The file format

Files use **Azion's Massive Redirect JSON schema**, so they double as valid
arguments for Azion's "Massive Redirect [Global]" function. Each entry has a
`from` (the old URL) plus **one** of `moved` or `found` — the key chooses the
HTTP status:

| Key     | Status | Meaning            |
| ------- | ------ | ------------------ |
| `moved` | `301`  | permanent redirect |
| `found` | `302`  | temporary redirect |

All values are **full URLs**. Almost everything here is a permanent move, so use
`moved`; use `found` only for a genuinely temporary redirect.

For pattern rules, use `from_regex` instead of `from`. Capture groups are
substituted into the target with Azion's backref syntax — `%s` (next group in
order) and `%N$` (the Nth group), e.g.
`{ "from_regex": "https://www\\.azion\\.com/en/documentation/old/([\\w-]+)/$", "moved": "https://www.azion.com/en/documentation/new/%s/" }`.
Exact `from` matches always win over regex rules. The current data has no regex rules.

```json
[
  {
    "from": "https://www.azion.com/en/documentation/products/core-concepts/",
    "moved": "https://www.azion.com/en/documentation/products/azion-platform-overview/"
  }
]
```

Validate anytime with:

```bash
pnpm -F redirects-massive validate
```

It checks the schema (`from` xor `from_regex`, `moved` xor `found`), flags
**conflicting duplicates** (same source, different target) as errors and
redundant duplicates as warnings, checks per-language file symmetry, and warns
when a file passes Azion's 300 KB budget. It also runs in CI.

## How to change or add a redirect

When a docs page changes its permalink or moves, add the redirect **in the same pull
request**.

1. **Change / add an entry** → open the file for the page's language and edit the
   JSON list. No build step, no script — the value you write is the value that is
   served. Add a `{ "from": "...", "moved": "..." }` object.
2. **New file** → create it and add it to the `import`s and the `FILES` list in
   `index.ts`.
3. Run `pnpm -F redirects-massive validate test`.

Guidelines so entries stay predictable:

- Use the **full URL** for both `from` and the target, ending with a trailing
  slash for page paths (matching the site convention).
- Use `moved` (301) unless the redirect is truly temporary — then use `found`
  (302).
- Point `from` straight at the **final** destination — don't chain one redirect
  into another (the engine flattens accidental chains, but direct is clearer).
- Don't point a `from` at itself, and don't list a `from` that is a live page: the
  function answers before the origin does.
- A target may carry a `#fragment`; the incoming query string is placed before it, and joined
  with `&` to a query string the target already has.

## How it works

- `index.ts` merges every file into one `Map` keyed by **host + path**, lower-cased
  and without a trailing slash. So matching ignores scheme (`http`/`https`), query
  string, and trailing slash.
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
pnpm -F redirects-massive validate          # data checks
pnpm -F redirects-massive test              # unit tests (+ data integrity checks)
pnpm -F redirects-massive test:integration  # integration tests
REDIRECTS_BASE_URL=https://<id>.map.azionedge.net pnpm -F redirects-massive test:e2e
```

## Deployment: not deployed yet

Nothing is deployed from this repository yet, and no workflow deploys it. The Azion
config is in **bootstrap state**: `azion.config.ts` names the resources `docs-redirects`,
and `azion/azion.json` carries ids `0`. The first manual deploy (Azion CLI logged in
to the account that will own the resources) creates the function, Application and
workload and writes their ids back into `azion/azion.json`; commit that file
afterwards, or the next deploy creates them again.

```bash
cd apps/redirects-massive
azion deploy --local --auto --debug
```

For the redirects to take effect on `www.azion.com/...`, the function's request
rule must run on the **same edge application that serves `www.azion.com`**. Deployed
standalone it gets its own `*.azionedge.net` domain and will not intercept production
paths. Attach the `Redirects` rule and function instance from `azion.config.ts` to the
production edge application. These are the site's resources as well, so wire the rule
there together with the site team.

## Notes

- **Status code**: chosen per entry by key — `moved` = 301 (permanent), `found`
  = 302 (temporary), matching Azion's Massive Redirect. Azion's integration does
  not use 307/308. All current entries are `moved` (301).
- **Native alternative**: because the files follow Azion's Massive Redirect
  schema, they can instead be fed directly to the Marketplace "Massive Redirect
  [Global]" function's Arguments (one array per file, each under 300 KB), skipping this
  custom function entirely. Pick one mechanism to avoid double redirects.
- **Provenance of the data**: the entries come from the docs repository's former
  `cicd/massive-redirect/{en,pt-br}.json`, plus the four entries that only the site's
  copy carried. Where a source was listed twice with different targets, the last entry
  won (what the runtime did); a source in the wrong language file was moved to the
  right one; exact duplicates were merged.
