# Rewriting a page

Fixing an existing page in place. The most common job in this repository, because most pages predate the current structure.

## The constraint that governs everything

**A rewrite must not change the page's identity.** Keep these exactly as they are:

- `permalink` — changing it breaks every inbound link and every bookmark, and requires a redirect
- `namespace` — changing it breaks the pairing with the Portuguese page, silently
- `menu_namespace` and the sidebar entries

If the rewrite genuinely requires a new URL, that is not a rewrite. It is a move, and it needs a redirect in the same change.

## Diagnose before you write

Run the `reviewing-a-page` skill first, or work through the same questions:

**What content type is this page trying to be?** Read it as each of the four readers in `choosing-a-content-type.md`. Usually one answer is obvious and the page is only partly delivering it.

**Is it two pages?** If two different readers each want a different half, stop. Read `splitting-a-page.md` instead.

**What is actually wrong?** Be specific before rewriting. "It reads badly" is not a diagnosis. Common real ones:

| Symptom | Diagnosis |
| --- | --- |
| Numbered click-steps in a page under `reference/` | How-to filed as reference |
| Long preamble before the first step | Explanation trapped inside a how-to |
| Table of settings inside a conceptual page | Reference trapped inside an explanation |
| Steps that branch on "depending on" | Tutorial that is really a how-to |
| Sections in no discernible order | No content type was ever chosen |

## Preserve every fact

The single largest risk in a rewrite is quietly dropping information. Restructuring is not a licence to delete.

Before you start, list every factual claim on the page: limits, defaults, field names, version notes, caveats, links. After you finish, check each one survived or was deliberately moved somewhere you can name.

If a fact no longer belongs on this page, it moves to the page where it does belong. It does not evaporate.

## Keep what is already good

Existing pages carry hard-won specifics: real error strings, a caveat someone hit in production, an exact value. Those are the most valuable lines on the page and the easiest to lose in a rewrite that optimizes for shape.

Voice is not a defect. If the page is clear and someone wrote it deliberately, leave the sentences alone and fix the structure.

## Scope

Rewrite one page at a time. A pull request that restructures nine pages cannot be reviewed properly, and the governance size cap is roughly 400 changed lines of prose.

If the same defect appears across a whole section, fix one page well, get it reviewed, then use it as the pattern for the rest.

## The Portuguese page

A structural rewrite of the English page leaves its translation structurally wrong. Either rewrite both in the same change, or open the `i18n` follow-up issue and link it, per `bilingual.md`.

Do not rewrite the Portuguese page by translating the new English one from scratch if the old translation contains locale-specific content the English never had. Check first.

## Checklist

- [ ] `permalink`, `namespace`, `menu_namespace` unchanged
- [ ] The page is now exactly one content type
- [ ] Every factual claim survived or moved somewhere named
- [ ] Specifics kept: error strings, exact values, real caveats
- [ ] Portuguese page rewritten too, or a linked follow-up issue exists
- [ ] `pnpm build:local` passes
