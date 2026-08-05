# Release notes formatting rules

Derived from the actual published entries in both language files as of 2026-07. When in doubt, grep the live file for a precedent before inventing a new convention:

```bash
grep -n "^### " src/content/docs/en/pages/main-menu/release-notes/release-notes.mdx | sort | uniq -c | sort -rn
```

## 1. File locations (single source of truth per language — no per-date files)

| Language | Path |
|---|---|
| en | `src/content/docs/en/pages/main-menu/release-notes/release-notes.mdx` |
| pt-br | `src/content/docs/pt-br/pages/menu-principal/release-notes/release-notes.mdx` |

Only these two languages are published in this repo (see `src/i18n/languages.ts`). There is no `es` collection — do not create one unless the user explicitly asks to add Spanish as a new locale (that's a larger, separate task: new content collection, nav entry, i18n config).

## 2. Insertion point (always prepend, never append)

Entries are in reverse-chronological order. The file starts with:

```
---
title: Release notes
...
---
import Tag from 'primevue/tag'


---
## <newest existing date heading>
...
```

To add a new dated entry, insert a new block **between the blank lines after `import Tag ...` and the existing first `---`**, following this exact shape:

```
---
## <New Date Heading>

<body>

```

The existing first `---` then becomes the separator before the *previous* newest entry — do not duplicate it or remove it.

## 3. Date heading (H2, `##`)

- English: `## Month D, YYYY` — e.g. `## July 10, 2026`. Full month name, no leading zero on day, comma before year.
- pt-br: `## D de month, YYYY` — e.g. `## 10 de julho, 2026`. Month name lowercase, no leading zero on day, comma before year.
- If a single push covers more than one date, give each date its own `##` section (do not merge dates), each preceded by its own `---` separator, newest first.

## 4. Product/area heading (H3, `###`)

Canonical names — reuse verbatim in **both** languages (product names are proper nouns, not translated):

Azion CLI · Azion Console · Azion API (use singular "API", not "APIs", for new entries — "Azion APIs" appears once historically but singular is now the dominant form) · Marketplace · Terraform Provider · Edge Functions · Edge Application · Edge Firewall · Data Stream · GraphQL API · Real-Time Metrics · Real-Time Events · DevTools & Integrations · Object Storage · API v4 (Preview)

Rules:
- Match an existing heading exactly if the change belongs to a product already in the list above (fixes prior casing drift like "Console" vs "Azion Console" or "Bug fixes" vs "Bug Fixes" — always use the canonical form).
- If the change is versioned (CLI, Terraform Provider), add a `**Version X.Y.Z**` line directly under the H3, on its own line, before the first H4.
- If the change is a set of package releases (e.g. DevTools & Integrations), list them under an H4 `#### Versions shipped` (pt-br: `#### Versões lançadas`) as `- **@scope/pkg-name**: X.Y.Z`.
- One new product area not on the canonical list is fine (the corpus keeps growing) — pick a short, title-cased, human name consistent with the others; do not invent a category system beyond this.

## 5. Category heading (H4, `####`) and its EN → pt-br translation

Only these four are standardized; use them whenever the change fits:

| English | pt-br | Meaning |
|---|---|---|
| `#### Features` | `#### Recursos` | New capability |
| `#### Improvements` | `#### Melhorias` | Enhancement to existing behavior |
| `#### Bug Fixes` | `#### Correções de Bugs` | Fix |
| `#### Updates` | `#### Updates` | General/miscellaneous change — **left untranslated in pt-br by established convention**, do not translate it |
| `#### Versions shipped` | `#### Versões lançadas` | Package/dependency version list |

If a change doesn't fit any of these, use the specific feature/product name itself as the H4 (as seen in the corpus, e.g. `#### Send Event function`, `#### Solution deprecations`) — translate this free-form H4 text into pt-br like normal prose, keeping any product/code names untouched.

## 6. `<Tag>` badges

Only use for these three statuses, exact component shape (props are never translated, only the label text is):

```mdx
<Tag severity="info" client:only="vue">Preview</Tag>          → <Tag severity="info" client:only="vue">Preview</Tag>
<Tag severity="info" client:only="vue">Deprecated</Tag>        → <Tag severity="info" client:only="vue">Descontinuado</Tag>
<Tag severity="warning" client:only="vue">Breaking Changes</Tag> → <Tag severity="warning" client:only="vue">Breaking Changes</Tag>
```

(Note: "Breaking Changes" has historically been left untranslated too — keep it as-is in pt-br.) Place the tag on its own line, directly under the H4 it qualifies, before the descriptive paragraph. Requires `import Tag from 'primevue/tag'` at the top of the file — already present, do not duplicate the import.

## 7. Body prose and bullet style

- Bullets: `- **Short Name**: Sentence in past tense, ending with a period.` — bold lead-in noun phrase, colon, then a plain-English/plain-Portuguese description of what shipped. Standardize this even though older entries are inconsistent about trailing punctuation.
- Use past tense verbs for what changed: Added, Improved, Fixed, Released, Updated, Removed, Deprecated — never imperative ("Add X"), never future tense.
- When a product needs a one-line scope statement before its bullets (common for API entries), use the established phrasing pattern: `Updates deployed to \`api.azion.com/v4/\`:` (pt-br: `Atualizações implementadas em \`api.azion.com/v4/\`:`).
- Inline code (`` `field_name` ``, endpoints, flags, config keys), version numbers, URLs, and product/company names are never translated and never reformatted — copy verbatim into the pt-br block.
- Links: `[link text](url)` — translate the link text, keep the URL unchanged.
- Nested sub-bullets (e.g. old-name → new-name alias mappings) are indented two spaces under their parent bullet, same format in both languages.
- Section separator between dated entries is a bare `---` line, with exactly one blank line before it and none after (before the next `##`).

## 8. What never changes between languages

Product names, package names (`@aziontech/...`), version numbers, endpoint paths, config/field/flag identifiers in backticks, URLs, `<Tag>` component props (only the label text translates), and the `Updates`/`Breaking Changes` heading/tag text (kept in English by convention).
