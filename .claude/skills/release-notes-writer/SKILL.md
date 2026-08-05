---
name: release-notes-writer
description: Turn a raw set of changelogs, PR/commit titles, Jira-linked tickets, or internal engineering deploy digests into formatted, customer-facing release notes entries for the Azion docs site, in both published languages (en, pt-br). Use when the user provides changelog content and asks to draft, write, format, filter, or add release notes, or asks to update release-notes.mdx, for one or more dates.
---

# Release Notes Writer

Converts raw/informal changelog input — including internal engineering digests with Jira ticket IDs and Slack noise — into the exact MDX shape used in this repo's live release notes page, for both `en` and `pt-br`, following fixed rules mined from the most recently published entries (see `references/formatting-rules.md`).

## Non-negotiable rules

1. **Only propose customer-facing items.** Internal-only engineering work (refactors, migrations, internal tooling) does not belong in release notes. If you're not sure whether something is customer-facing enough to include, **ask the user** — never guess silently in either direction. See `references/customer-facing-filter.md`.
2. **Never expose internal information**: Jira/ticket IDs, person names (authors, assignees, reviewers), or component/service/variable names that aren't part of Azion's public product vocabulary. See `references/customer-facing-filter.md` for the redaction list and the grep-based check for "is this term actually public."
3. **When a Jira issue is referenced, look it up** to understand the real customer-facing scope of the change before writing the note — a terse commit message is rarely enough on its own. Apply rules 1 and 2 to whatever you learn from the ticket; the ticket's internal detail is context for you, not content for the note. See `references/jira-enrichment.md`.
4. **Never run `git commit` (or `git push`) as part of this skill unless the user explicitly asks for a commit in this conversation.** Editing `release-notes.mdx` in the working tree is in scope; staging and committing is not. Leave the changes uncommitted so the user can review the diff themselves — do not treat "insert into the files" as implied permission to also commit them.

## Files this skill maintains

| Language | Path |
|---|---|
| en | `src/content/docs/en/pages/main-menu/release-notes/release-notes.mdx` |
| pt-br | `src/content/docs/pt-br/pages/menu-principal/release-notes/release-notes.mdx` |

Only these two languages exist in this repo (`src/i18n/languages.ts`). If the user asks for Spanish or another language, tell them there is no `es` content collection yet — adding one is a separate, larger task (new collection, nav entry, i18n config), not something this skill does.

## Workflow

1. **Strip noise and triage the raw input** per `references/customer-facing-filter.md`: drop Slack emoji/process labels, then classify every item as **Include** / **Exclude** / **Ask**. Collect every "Ask" item into a single short list for the user — do not proceed to drafting individual ambiguous items until the user has answered, but you can draft the unambiguous "Include" items in the same turn.

2. **Enrich Jira-linked items** per `references/jira-enrichment.md`: detect issue keys (`[A-Z][A-Z0-9]{1,9}-\d+`), look up each via the Jira MCP tools when the commit message alone doesn't clearly convey customer impact, and use the ticket only to understand the real-world scenario — never to source ticket IDs, names, or internal fields for the output.

3. **Redact** per `references/customer-facing-filter.md` step 2: no ticket IDs, no person names, no internal component/service/variable names. When a name's public-ness is unclear, grep `src/content/docs/en` for it before deciding.

4. **Read `references/formatting-rules.md` fully before drafting anything.** It contains the fixed heading formats, canonical product/category names, translation rules, and what must stay untranslated. These rules were extracted directly from the live file's most recent entries — do not deviate from them or invent new conventions unless the raw input clearly needs a new product-area heading (rule 4 allows exactly one degree of freedom there).

5. **Structure the surviving (Include) items** into:
   - date(s) — one dated section per distinct date, newest last if the user gives multiple (you'll place them newest-first in the file)
   - product/area per item → map to the canonical H3 list in rules §4
   - category per item → map to one of `Features` / `Improvements` / `Bug Fixes` / `Updates` / `Versions shipped` (rules §5), or a free-form H4 if it's a single named feature announcement
   - version number, if the product/change is versioned
   - whether it needs a `<Tag>` badge (`Preview`, `Deprecated`, `Breaking Changes` — rules §6)

6. **Draft the English MDX block first.** Follow rules §3 (date heading), §4 (H3 + optional version line), §5 (H4 category), §6 (`<Tag>`), §7 (bullet/prose style). Check `references/worked-example.md` for concrete before/after shapes if unsure how to structure a multi-product or versioned entry.

7. **Translate to pt-br from the drafted English block** (not from the raw input again) so both languages stay structurally identical section-by-section. Apply the translation table in rules §5/§6 and the "never translate" list in rules §8 (product names, package names, version numbers, code identifiers, URLs, and the specific terms `Updates` / `Breaking Changes` which stay in English by convention).

8. **Show both drafted blocks to the user for review** before touching the files, unless they've explicitly asked you to insert directly.

9. **Insert into both files** at the point described in rules §2 (prepend as a new `---`-led block, right after the `import Tag ...` line and before the file's current first `---`). Use the Edit tool on both files. Do not touch the frontmatter, the import line, or any existing dated section — this is a pure prepend.

10. **Sanity check after inserting**: grep the new H2/H3/H4 headings back out of both files to confirm they match between languages and that no stray separator or duplicate `---` was introduced.

11. **Stop there.** Report what was inserted and leave the working tree as an uncommitted change (per non-negotiable rule 4) — do not run `git add`/`git commit`/`git push` unless the user asks for it in this conversation.

## Notes

- If the raw changelog spans multiple dates, create one full dated block per date, most recent date inserted closest to the top (i.e., processed/inserted last, or inserted first in reverse order — either way, verify the final file has newest date first).
- If an item doesn't cleanly map to an existing canonical product/category, ask the user only if genuinely ambiguous; otherwise pick the closest canonical match per the rules rather than inventing a new taxonomy.
- Never fabricate details (version numbers, endpoint paths, metrics) not present in the raw input — ask the user if something needed for the fixed format (e.g. a version number for a versioned product) is missing.
- A short, accurate list of release notes is correct output for a noisy engineering digest — don't pad it with excluded/uncertain items to look complete.
