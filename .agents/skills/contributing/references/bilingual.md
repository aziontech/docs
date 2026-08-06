# Bilingual pages

Every page exists twice: English in `src/content/docs/en/`, Brazilian Portuguese in `src/content/docs/pt-br/`. English is the source of truth.

## The pairing

Pages are paired by `namespace`, not by file path. `getPageTranslations.ts` finds a page's translation by matching that field, and it is what makes the language switcher work.

```
en/pages/store-journey/storage/create-bucket.mdx
  title:     How to create an Object Storage bucket
  permalink: /documentation/products/store/storage/create-bucket/
  namespace: docs_store_journey_storage_create_bucket

pt-br/pages/store-jornada/storage/criar-bucket.mdx
  title:     Como criar um bucket do Object Storage
  permalink: /documentacao/produtos/store/storage/criar-bucket/
  namespace: docs_store_journey_storage_create_bucket
```

| Field | Portuguese page |
| --- | --- |
| `title` | translated |
| `description` | translated |
| `permalink` | **translated** |
| `namespace` | **identical to English** |
| `menu_namespace` | identical to English |
| `meta_tags` | conventionally left in English |

**A mismatched namespace breaks the language switcher and passes CI.** Nothing warns you. This is the single most costly mistake in a translation.

## Paths are translated too

Directory names and filenames are localized, not mirrored:

| English | Portuguese |
| --- | --- |
| `main-menu/` | `menu-principal/` |
| `main-menu/reference/` | `menu-principal/referencia/` |
| `guides/` | `guias/` |
| `agreements/` | `contratos/` |
| `architectures/` | `arquiteturas/` |
| `build-journey/` | `build-jornada/` |
| `devtools/`, `changelog/` | unchanged |

Permalinks follow: `/documentation/products/...` becomes `/documentacao/produtos/...`.

Permalinks must stay ASCII. Fold accents rather than encoding them: `configuracao`, not `configuração`.

## Links inside the page

Internal links are absolute, language-prefixed, and end with a slash.

```
English page:    [Applications](/en/documentation/products/build/applications/)
Portuguese page: [Applications](/pt-br/documentacao/produtos/build/applications/)
```

A Portuguese page may link to an English page when no translation exists. That is deliberate and about 72 links do it today. Do not link a Portuguese reader to English when a Portuguese page exists.

Asset paths carry no language prefix and are identical in both: `/assets/docs/images/uploads/...`.

## Translation rules

Full rules in `.agents/references/terminology.md`. The ones that come up constantly:

**Do not translate** generic technical terms: `edge computing`, `edge`, `edge location`, `data center`, `serverless`, `template`, `compliance`, `on-premise`.

**Do not translate** product names. `Applications`, `Functions`, `Firewall`, `Azion Web Platform`, `Azion Marketplace` stay as they are.

**Substitutions** that are easy to get wrong:

| Avoid | Use |
| --- | --- |
| borda | edge |
| computação na borda | edge computing |
| aplicativo | aplicação |
| centro de dados | data center |
| desempenho | performance |
| cacheado | armazenado em cache |
| módulo | solução |

**Titles are sentence case** in Portuguese: capitalize the first word only.

**Localize aside labels.** `:::note[nota]`, `:::tip[dica]`, `:::caution[Atenção]`. An untranslated label in a Portuguese page is a visible defect.

## When you cannot write the Portuguese version

Governance allows shipping English first with a follow-up `i18n` issue linked in the PR. Use it honestly: it is a commitment, not a way to close the ticket.

Do not machine-translate and ship without review. A wrong translation is harder to find and fix than a missing one.

## Checklist

- [ ] Both files exist
- [ ] `namespace` identical, character for character
- [ ] `menu_namespace` identical
- [ ] `permalink` translated, ASCII, trailing slash, no language prefix
- [ ] Directory and filename localized to match the sibling tree
- [ ] Internal links use the right language prefix
- [ ] Aside labels localized
- [ ] Product names and generic technical terms left in English
- [ ] Sidebar entry added to the pt-br menu file too
