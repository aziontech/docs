# Bilingual pages

Every page exists twice: English and Brazilian Portuguese. English is the source of truth, and the pair ships together.

## The pairing

Pages are paired by `namespace`, not by file path. The site finds a page's translation by matching that field, and it is what makes the language switcher work.

```
en:     title:     Create an Object Storage bucket
        permalink: /documentation/products/store/storage/create-bucket/
        namespace: docs_store_storage_create_bucket

pt-br:  title:     Criar um bucket do Object Storage
        permalink: /documentacao/produtos/store/storage/criar-bucket/
        namespace: docs_store_storage_create_bucket
```

| Field | Portuguese page |
| --- | --- |
| `title` | translated |
| `description` | translated |
| `permalink` | **translated** |
| `namespace` | **identical to English**, character for character |
| `menu_namespace` | identical to English |
| `meta_tags` | conventionally left in English |

**A mismatched namespace breaks the language switcher and passes every build.** Nothing warns you. This is the single most costly mistake in a translation.

Permalinks follow the translated URL tree — `/documentation/products/...` becomes `/documentacao/produtos/...` — and must stay ASCII. Fold accents rather than encoding them: `configuracao`, not `configuração`. File placement mirrors the translated directory tree, in `information-architecture.md`.

## Links inside the page

Internal links are absolute, language-prefixed, and end with a slash.

```
English page:    [Applications](/en/documentation/products/build/applications/)
Portuguese page: [Applications](/pt-br/documentacao/produtos/build/applications/)
```

A Portuguese page may link to an English page only when no Portuguese page exists. Do not link a Portuguese reader to English when a Portuguese page exists.

Asset paths carry no language prefix and are identical in both: `/assets/docs/images/uploads/...`.

## Write the English page so it survives translation

The sentence rules in `.agents/references/simplified-technical-english.md` exist for readers who work in a second language, and they make the Portuguese page easier to write and less likely to drift. An English sentence that runs 45 words with three subordinate clauses forces the translator to restructure it, and a restructured sentence is where meaning gets lost.

The structural rules carry over to Portuguese unchanged: sentence caps, one instruction per step, simple tenses, active voice, noun clusters of at most three words, no contractions.

The vocabulary rules do not. The Portuguese side is the substitution table in `.agents/references/terminology.md`.

## Translation rules

Full rules in `.agents/references/terminology.md`. The ones that come up constantly:

**Do not translate** generic technical terms — `edge computing`, `edge`, `edge location`, `data center`, `serverless`, `template`, `compliance`, `on-premise` — or product names: `Applications`, `Functions`, `Firewall`, `Azion Web Platform`, `Azion Marketplace`.

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

**Titles are sentence case** in Portuguese: capitalize the first word and proper nouns only.

**Localize aside labels.** `:::note[nota]`, `:::tip[dica]`, `:::caution[Atenção]`. An untranslated label on a Portuguese page is a visible defect.

**Fixed section names have fixed Portuguese forms.** `## Prerequisites` → `## Pré-requisitos` · `## Next steps` → `## Próximos passos` · `## Related resources` → `## Recursos relacionados`.

**The link sentences have fixed Portuguese forms.** `Para mais informações, consulte [Título](/pt-br/.../).` and `Para <fazer algo>, consulte [Título](/pt-br/.../).`

**Console UI labels stay as the interface shows them.** Do not translate button or field names the Console renders in English: **Save**, **Workloads Access**, **+ Bucket**.

## When you cannot write the Portuguese version

Shipping English first is allowed only with an explicit, linked follow-up commitment. Use it honestly: it is a debt, not a way to close the ticket.

Do not machine-translate and ship without review. A wrong translation is harder to find and fix than a missing one.

## Checklist

- [ ] Both files exist
- [ ] `namespace` identical, character for character
- [ ] `menu_namespace` identical
- [ ] `permalink` translated, ASCII, trailing slash, no language prefix
- [ ] Internal links use the right language prefix
- [ ] Aside labels localized
- [ ] Product names and generic technical terms left in English
- [ ] Substitution table applied
- [ ] Sidebar entries exist in both languages, per `information-architecture.md`
