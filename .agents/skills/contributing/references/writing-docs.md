# Writing docs

The workflow for creating or editing a page, start to finish. Follow it in order.

You are an editor first. Match the existing voice, structure, and depth of the pages around the one you are changing, and keep edits small unless the task is a deliberate restructure. When an existing page contradicts a reference file, the reference wins — but that licenses fixing the page, not rewriting its neighbors.

## 1. Gather context

Name the source of truth: a spec, a brief, an engineer, an existing page, the user's input. Every fact on the page will trace back to it. If you cannot name it, stop and ask — documentation assembled from plausible guesses is worse than no page, because a reader cannot tell which parts are made up.

Confirm the audience and what the reader is trying to do. That decides everything downstream.

## 2. Check whether the page already exists

Search before adding. Extending a page almost always beats creating a neighbor that competes with it in search. Placement and the search commands are in `information-architecture.md`.

## 3. Pick the kind

Read `content-types.md`. Pick one of the twelve. The kind mandates the opening move, the section order, and the closing, and it sets the sentence budget. A page that is two kinds is the most common structural defect there is.

## 4. Write the frontmatter first

The five-field contract is in `.agents/references/style-guide.md`, Frontmatter section. Deciding the permalink first forces you to decide what the page is. Never guess a permalink or namespace — they are unique per language, and `namespace` pairs the translations.

## 5. Draft against the kind

Open the kind's entry in `content-types.md` and follow its skeleton exactly: the verbatim opening formula, the required sections in order, the closing. Sentence construction from `.agents/references/simplified-technical-english.md`; voice and word choice from `.agents/references/style-guide.md`; every numbered step from `.agents/references/procedures.md`.

Body starts at `##`. The `title` field renders the H1.

## 6. Choose components

`choosing-components.md` maps the data you have to the component that carries it. Only the set in `.agents/references/components.md` exists; a plausible-looking component that is not there fails the build.

## 7. Write the agent twin

Procedural kinds — get started, tutorial, how-to, multi-product guide, use case — also ship a markdown twin written for an agent executing the steps. Read `agent-twin.md`.

## 8. Add the Portuguese version

Read `bilingual.md`. English is the source of truth, and every page ships as a pair: translated title, description, and permalink; identical namespace.

## 9. Register and validate

Inside the documentation repository, place the files, register the sidebar entries, and run the build — all in `information-architecture.md` and the validation section of `SKILL.md`. Then run the self-check below regardless of where you are working.

## Editing an existing page

The same workflow applies, plus four constraints:

**Do not change the page's identity.** `permalink`, `namespace`, and `menu_namespace` stay exactly as they are. A rewrite that changes the URL is a move, and a move needs a redirect in the same change. A changed `namespace` breaks the translation pairing silently.

**Diagnose before you write.** Decide which kind the page is trying to be and what is specifically wrong. "It reads badly" is not a diagnosis. A numbered click-through under a reference title is; a long preamble before the first step is.

**Preserve every fact.** List every factual claim before you start — limits, defaults, field names, error strings, caveats. After you finish, check each one survived or was deliberately moved to a page you can name. Restructuring is not a license to delete, and existing pages carry hard-won specifics that are the most valuable lines on them.

**Rewrite one page at a time.** If the same defect spans a section, fix one page well, get it reviewed, then use it as the pattern.

A structural rewrite of the English page leaves its translation structurally wrong. Rewrite both in the same change, or say explicitly that the Portuguese half is owed.

## Before you hand it over

- [ ] One kind, and the page follows its skeleton: opening formula, section order, closing
- [ ] Every claim traces to the source from step 1; gaps are marked, never papered over
- [ ] Frontmatter contract met; description 50–160 characters, imperative opener
- [ ] Steps follow `procedures.md`: canonical first step, one action per step, outcome sentence
- [ ] Voice sweep: no contractions, no "we", no filler, no marketing, standard link phrasing
- [ ] Sentence caps hold: 20 procedural, 25 descriptive
- [ ] Every `##` section reads alone; size caps in `.agents/references/page-size.md` hold
- [ ] Only live components, with their mandatory directives
- [ ] Portuguese pair present with identical `namespace`, or explicitly owed
- [ ] Agent twin written, for procedural kinds
