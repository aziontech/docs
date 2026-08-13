# Changelog entries

The record of what changed and when. Entries are append-only, dated, and the one place in the documentation where dates belong.

## Before writing: three things or stop

1. **The product name**, as `terminology.md` spells it today.
2. **What changed**, specifically: the flag, the field, the version, the behavior.
3. **Why it matters to a reader** — what they can do now, or what stops working.

If any of the three is missing from your input, ask for it. Do not proceed on two, and do not reconstruct the third from memory.

## Entry shape

An entry sits under a date heading and runs three to six short paragraphs, no headings of its own. When the release notes group entries by area, the product heading nests one level deeper under the area heading:

```markdown
## <Month> <day>, <year>

### <Product> <version, when there is one>

**<Product>** now <verb>s <capability>, <the concrete detail: the flag, field, or default>.

<What this means in practice: what works without configuration now, or what behaves differently.>

<Who is not affected: existing configurations, earlier versions, accounts that did not opt in — and how they can opt in.>

<When an API, CLI, or configuration changed: the migration or opt-in, with a code sample.>

For more information, refer to [<the documenting page>](/en/documentation/.../).
```

## The rules

**The opening sentence carries the whole change.** `**<Product>** now <verb>s <capability>.` Present tense, the product as the subject. Never "we", never "Azion is excited to".

- `**Functions** now supports Node.js built-in modules by default for new deployments.`
- Not: `We are thrilled to announce improved Node.js support.`

**State the blast radius.** Every entry says who is *not* affected: "Existing buckets keep their current permissions." A reader's first question about any change is whether it breaks them; answer it before they ask.

**Close with the documentation link.** Every entry ends with `For more information, refer to [...]` pointing at the page that documents the feature. An entry that documents the feature itself, in full, is a page filed in the wrong place.

**A code sample when the surface changed.** If the change touches an API, a CLI command, or a configuration file, show the new shape in a `<Code>` block or a fence. Two lines is enough.

**Titles are declarative claims.** When an entry needs its own title, it states the change as a fact: `Node.js compatibility is enabled by default`, not `Node.js improvements`.

## What changelogs are exempt from

- **Timelessness.** Dates, "now", and version numbers are the content here.
- **Renames.** Historical entries keep the product names they were written with. A 2023 entry about a product's old name stays as written; only new entries use current names.
- **Size caps.** Changelogs are append-only and grow without bound. Do not split them to satisfy a length target.

Everything else applies: sentence caps (descriptive, 25 words), no marketing, no invented specifics, link phrasing from `.agents/references/style-guide.md`.
