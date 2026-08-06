# Frontmatter and permalinks

The build gates. Get these wrong and the page either fails CI or ships broken.

## The template

```yaml
---
title: How to create an Object Storage bucket
description: >-
  Learn how to create a new read-only bucket and attribute read-write
  permissions to it using the Azion API.
meta_tags: 'Object Storage, bucket, S3, API'
namespace: docs_store_journey_storage_create_bucket
permalink: /documentation/products/store/storage/create-bucket/
---
```

## Required, and by what

Astro's schema in `src/content/config.ts` marks almost everything optional. `test-frontmatter.js` disagrees, and it runs inside every `build:*` script, so it is the real gate.

| Field | Schema | Validator | Verdict |
| --- | --- | --- | --- |
| `title` | required | not checked | **required** |
| `namespace` | optional | **exits 1 if missing or duplicated** | **required** |
| `permalink` | optional | **exits 1 if missing or malformed or duplicated** | **required** |
| `description` | optional | not checked | write it anyway, it is the meta description |
| `meta_tags` | optional | not checked | write it anyway, comma-separated keywords |
| `menu_namespace` | defaults to `nav` | not checked | set it only to place the page in a product sidebar |
| `og_image` | optional | not checked | rare, only 9 pages use it |
| `type` | defaults to `base` | not checked | **omit it** unless building a card-grid home |

Unknown keys are silently stripped by the schema. A typo in a field name fails quietly rather than loudly.

## Permalink rules

**No language prefix.** The language comes from which directory tree the file is in. The permalink is the rest of the URL.

```
file:      src/content/docs/en/pages/store-journey/storage/create-bucket.mdx
permalink: /documentation/products/store/storage/create-bucket/
URL:       /en/documentation/products/store/storage/create-bucket/
```

Writing `/en/documentation/...` produces `/en/en/documentation/...`.

> `.github/CONTRIBUTING.md` currently tells authors to include the language prefix. That instruction is wrong. This file is correct.

**Character set.** Validated against `/^[a-z0-9\-\/]+$/`. Lowercase letters, digits, hyphens, slashes. No uppercase, no underscores, no dots, no spaces, no accented characters. Portuguese permalinks are ASCII-folded: `configuracao`, not `configuração`.

**Trailing slash.** The site sets `trailingSlash: 'always'`. Permalinks end with `/`.

**Unique per language.** Checked separately across `en` and `pt-br`. An English page and its Portuguese translation have *different* permalinks, so there is no conflict between them.

**The directory path is cosmetic.** Only the permalink determines the URL, and breadcrumbs are derived from permalink segments rather than from the filesystem. A page in `pages/guides/` with a permalink under `/documentation/products/store/` will render with store breadcrumbs. Keep them aligned unless you have a reason not to.

## Namespace rules

**It is the join key between languages.** `getPageTranslations.ts` finds a page's translation by matching namespace. The English page and its Portuguese translation must carry the **same** namespace, character for character.

```
en/pages/store-journey/storage/create-bucket.mdx      namespace: docs_store_journey_storage_create_bucket
pt-br/pages/store-jornada/storage/criar-bucket.mdx    namespace: docs_store_journey_storage_create_bucket
```

Appending `_pt` to the translation breaks the language switcher. The build still passes. Nothing tells you.

**Unique per language.** A duplicate within `en` or within `pt-br` exits 1.

**Naming.** Lowercase snake_case. Two prefixes dominate: `documentation_*` and `docs_*`. Follow whichever the neighbouring pages use, and build the rest from the product and feature: `docs_store_journey_storage_create_bucket`.

## What gets translated and what does not

| Field | In the Portuguese page |
| --- | --- |
| `title` | translated |
| `description` | translated |
| `permalink` | **translated**, using `/documentacao/produtos/...` |
| `namespace` | **identical to English** |
| `menu_namespace` | identical to English |
| `meta_tags` | usually left in English |

Azion's wider terminology guidance lists `permalink` as do-not-translate. That is correct for the marketing site and wrong here: docs permalinks are translated. See `.agents/references/terminology.md`.

## Checklist

- [ ] `title`, `description`, `meta_tags`, `namespace`, `permalink` all present
- [ ] Permalink has no `/en` or `/pt-br` prefix
- [ ] Permalink is lowercase, ASCII, hyphenated, ends with `/`
- [ ] Permalink does not collide with another page in the same language
- [ ] Namespace does not collide within the language
- [ ] If this is a translation, namespace matches the English page exactly
- [ ] No `type:` field unless this is a card-grid home
- [ ] `pnpm build:local` passes
