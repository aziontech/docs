# P1 — structural checks

The page works but is wrong. Fix before publishing.

## Mixed content types

The most common defect in this corpus, and the reason most of it needs restructuring.

Read the page as each of the four readers in `.agents/skills/contributing/references/choosing-a-content-type.md`. If two of them each want a different half, it is two pages.

Concrete signals:

| Signal | Diagnosis |
| --- | --- |
| Numbered click-steps in a page under `reference/` | How-to filed as reference |
| Three or more paragraphs of background before the first step | Explanation trapped inside a how-to |
| A settings table inside a conceptual page | Reference trapped inside an explanation |
| Steps that branch on "depending on" or "if you prefer" | Labelled a tutorial, actually a how-to |
| Headings in no discernible order | No content type was ever chosen |

Report which type the page mostly is, which content does not belong, and where it should go. If the split is large, point at `splitting-a-page.md` rather than describing the whole restructure inline.

## Missing sections for the declared type

Check against the skeleton in the matching reference file. Common gaps:

- Reference page with no `Limits` section
- How-to whose first paragraph does not state the outcome
- Tutorial with no statement of what the reader will have built
- Explanation that names no tradeoff

## Legacy product names

| Flag | Replace with |
| --- | --- |
| Edge Application, Edge Applications | Applications |
| Edge Functions | Functions |
| Edge Firewall | Firewall |
| Azion Edge Platform | Azion Web Platform |
| Marketplace da Azion | Azion Marketplace |

**Historical documents are exempt. Do not flag these paths:**

- `pages/changelog/**`
- `pages/main-menu/release-notes/**`
- `pages/agreements/**`

Those are dated records of what was true when written. A 2020 Terms of Service keeps its original names. This exemption matters: most of the corpus-wide legacy hits sit in those three trees, and a checker without it produces mostly noise.

Directory names are also exempt. `edge-application/` as a path is not prose and renaming it would change permalinks.

## Plain markdown where a component is house style

The page renders, so this is not P0, but it makes the page look foreign.

| Found | Should be |
| --- | --- |
| `> ` blockquote used as a callout | `:::note` or `:::tip` |
| A bare link styled as a call to action | `<LinkButton>` |
| Three sequential sections for Console, CLI, API | One `<Tabs>` block |
| A hand-built scrolling wrapper around a table | Plain GFM table, scrolling is automatic |

Blockquotes are the common one. There are roughly 2,000 asides in the corpus and blockquotes appear in a handful of pages, so a `> ` callout is almost always a page that predates the convention.

## Over the size caps

From `.agents/references/page-size.md`. Measure the body, excluding frontmatter.

| Over | Report as |
| --- | --- |
| A `##` section over 4,000 characters | P1, will not retrieve as a coherent chunk |
| A page over 16,000 characters | P1, split candidate |
| A `##` section over 2,000, or page over 8,000 | P2, over target but workable |

Exempt: reference tables that are complete by nature, changelogs, release notes, legal agreements.

Also flag, regardless of size, any section that cannot be read alone: an opening pronoun with no referent inside that section, "as mentioned above", "the previous step", or a heading too generic to match a search (`Configuration`, `Overview`, `Step 2`).

## Forbidden expressions

From `.agents/references/terminology.md`, in any language:

`digital landscape` · `digital transformation` · `empower` · `plethora` · `shed light` · `realm` · `beacon`

## Links

| Check | Correct form |
| --- | --- |
| Relative link | Absolute: `/en/documentation/...` |
| Missing language prefix | `/en/` or `/pt-br/` |
| Missing trailing slash | Ends `/`, or `/#anchor` |
| Portuguese page linking to English | Only when no Portuguese page exists |
| Asset with a language prefix | Assets are `/assets/...`, no prefix |

```bash
grep -nE '\]\((?!https?://|/en/|/pt-br/|/assets/|#)' -P <file>
```

## Translation pair drift

Beyond the namespace check in P0:

- Portuguese page with untranslated aside labels. Should be `:::note[nota]`, `:::tip[dica]`, `:::caution[Atenção]`.
- Portuguese page whose `menu_namespace` differs from English.
- Portuguese permalink containing accented characters. Must be ASCII-folded.
- Portuguese page using a term from the substitution table in `terminology.md`: `borda` for `edge`, `aplicativo` for `aplicação`, `desempenho` for `performance`.

## Sidebar

If the page sets `menu_namespace`, confirm the value appears in `src/data/availableMenu.ts`. An unregistered value silently falls back to `nav`, which looks like the field being ignored.

If the page is new, check that an entry exists in both `src/i18n/en/<menu>.ts` and `src/i18n/pt-br/<menu>.ts`, and that its `slug` matches the page's `permalink` exactly.

## Code samples

- A command with a plausible-looking fake value a reader might paste as-is. Placeholders must be obviously placeholders: `[TOKEN VALUE]`, `<your-bucket-name>`.
- Any credential, real or fake.
- A language tag outside the set in `.agents/references/components.md`. Terraform is `hcl`.
