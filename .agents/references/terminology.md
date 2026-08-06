# Terminology

Derived from Azion's cross-surface terminology guidance, which is maintained outside this repository and covers the marketing site as well as documentation.

**This file is self-contained and authoritative for docs.** Everything you need is below. Where the wider guidance differs from what is written here, this file wins for anything under `src/content/docs/`, because two of its rules do not hold on this site. Those two are called out at the end so nobody reconciles them the wrong way later.

## Product names

Use these exactly. The products were renamed; the old names are legacy and the PR template has a checkbox against them.

| Use | Not |
| --- | --- |
| Applications | Edge Application, Edge Applications |
| Functions | Edge Functions |
| Firewall | Edge Firewall |
| Azion Web Platform | Azion Edge Platform |
| Azion Platform | (short form, acceptable) |
| Azion Marketplace | Marketplace da Azion |

**Historical documents are exempt.** Changelogs, release notes, and dated agreements record what was true when they were written. Do not rename products in:

- `pages/changelog/**`
- `pages/main-menu/release-notes/**`
- `pages/agreements/**`

A 2020 Terms of Service keeps the names it was signed with.

## Never translate

These stay in English in every language. They are generic technical vocabulary, not product names.

`edge computing` · `edge` · `edge location` · `data center` · `serverless` · `on-premise` · `template` · `compliance` · `e-commerce` · `e-mail` · `keywords` · `meta description`

The strings `edge application`, `edge function`, and `edge firewall` are also on the do-not-translate list in the upstream file. That is guidance for **translation**, not permission to use them as product names. If you are writing new English text, use the current names above.

## Portuguese substitutions

| Avoid | Use |
| --- | --- |
| borda | edge |
| computação na borda | edge computing |
| aplicativo | aplicação |
| centro de dados | data center |
| módulo | solução |
| nodo | node |
| desempenho | performance |
| cacheado | armazenado em cache |
| Marketplace da Azion | Azion Marketplace |
| Plataforma na Borda da Azion | Plataforma da Azion |
| Plataforma Edge da Azion | Plataforma da Azion |

## Forbidden expressions, all languages

Never use, in any language:

`digital landscape` / `paisagem digital` · `digital transformation` / `transformação digital` · `empower` / `capacitar` · `plethora` / `plétora` · `shed light` / `esclarecer` · `realm` / `reino` · `beacon` / `farol`

## Titles

Sentence case in both languages. Capitalize the first word and proper nouns only.

- `How to configure cache policies`
- Not `How To Configure Cache Policies`

## Two rules that do not carry over

The wider Azion terminology guidance was written primarily for the marketing site. Two of its rules are wrong for this repository, and both are the kind that look authoritative enough to be applied by mistake.

**Permalinks are translated here.** That guidance lists `permalink` under do-not-translate. On the docs site, permalinks are localized:

```
en:    /documentation/products/store/storage/create-bucket/
pt-br: /documentacao/produtos/store/storage/criar-bucket/
```

Applying that rule literally produces Portuguese pages sitting at English URLs.

**The frontmatter field list does not apply.** It names roughly fifteen fields that do not exist in this repo's schema: `_schema`, `cluster`, `draft`, `noindex`, `ogImage`, `imageDark`, `imageLight`, `lang`, `pillar`, `topics`, `buttons`, `position`, `logos`, `icon`, `target`. It also writes `Namespace` capitalized; the field here is lowercase `namespace`.

This repository's frontmatter contract is in `.agents/skills/contributing/references/frontmatter-and-permalinks.md`. The one rule that does carry over: **`namespace` is never translated**, because it is the key that pairs the two language versions.

## Not applicable

The upstream file's Spanish section and `/es/` URL rules have no target here. This site publishes English and Brazilian Portuguese only. Its `/en/learning/` URL example is a marketing path; documentation lives under `/en/documentation/`.

## When a name is not here

Ask. Do not infer a product name from a URL, a directory name, or an older page. Directory names in this repo still use legacy terms (`edge-application/`, `edge-firewall/`) that the prose has moved away from.
