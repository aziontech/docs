# Style guide

Prescriptive rules for writing and reviewing Azion documentation. This file is the canonical voice and formatting law. Where a rule here touches sentence construction — length, tense, noun clusters — `simplified-technical-english.md` is the narrower rule. Step grammar is in `procedures.md`. Product names and translation rules are in `terminology.md`. Components are in `components.md`.

## Voice

**Second person, present tense, active voice.** "You create a bucket", not "A bucket is created" or "The user will create a bucket".

**Never "we".** The actor is "Azion" or "you". "Azion recommends a TTL of 60 seconds", not "We recommend".

**No contractions.** Write "do not", "cannot", "it is". Contractions read casually and translate unevenly.

**Imperative for steps.** "Select **Save**." Not "You should select Save" or "Next, the Save button should be selected."

**Say what it does, not how good it is.** Documentation describes behavior and limits. It does not sell. A reader who reached the docs has already bought.

**Short sentences carry technical content better than long ones.** The caps are 20 words in a procedure and 25 in descriptive text, from `simplified-technical-english.md`.

**Short is not the same as clipped.** Never drop a subject, a verb, or an article to hit the cap. Split the sentence instead.

**Documentation reads as timeless.** No "currently", "at the time of writing", "will soon", "now available", "recently", or "new" as a modifier. No month or year outside a changelog. Say what is true and let the changelog carry the timeline.

## Word choice

**Filler that never survives review.** Delete these on sight:

| Not this | This |
| --- | --- |
| it is important to note that | (delete, keep the sentence) |
| note that | (delete, keep the sentence) |
| in order to | to |
| due to the fact that | because |
| has the ability to | can |
| at this point in time | now |
| utilize | use |
| leverage (as decoration) | use |
| delve into, dive into | cover, explain |
| facilitate | let, allow |
| straightforward | (delete, or say what the steps are) |
| a wide range of | (name the range) |
| various | (name them, or say how many) |
| seamless, seamlessly | (delete, or say what does not break) |
| cutting-edge, state-of-the-art | (delete) |
| plays a crucial role in | (say what it does) |

**Marketing framing has a substitution.** These phrases sell instead of describing:

| Not this | This |
| --- | --- |
| Perfect for, Essential for, Critical for | Use for |
| Best for | Use when |
| empowers you to, enables you to | (state the action directly) |
| powerful, robust, comprehensive (about an Azion product) | (say what it does, what it withstands, what it covers) |
| modern `<thing>` | `<thing>` |

The test is whether the word claims *quality* or describes *behavior*. "Robust security" is a quality claim. "A robust retry with exponential backoff" describes behavior and stays.

**No condescension.** "Simply", "just", "easy", "obvious", "of course". A reader who is stuck reads these as being told they should not be.

**No "please".** Documentation instructs; it does not ask.

**No Latin abbreviations.** "For example" and "that is", not "e.g." and "i.e.". Never "etc." — list the items or rewrite.

**Same word, same meaning, every time.** One verb per action, across the page and its neighbors. Rotating "check", "verify", and "confirm" for one action reads as three actions. Full rule in `simplified-technical-english.md`.

Banned expressions in any language — `digital landscape`, `digital transformation`, `empower`, `plethora`, and the rest — are in `terminology.md`.

## UI language

**Verbs for interface actions:**

| Use | Not |
| --- | --- |
| select | click, hit, tap |
| go to | navigate to |
| turn on, turn off | enable, disable (for switches and toggles) |
| enter | type in, input |
| refer to | see, check out |

"Enable" and "disable" stay legitimate for describing state in prose: "When the module is enabled, requests pass through it."

**Bold for UI labels and product names.** `Select **Save**.` `**Applications** is an Azion product that...` Not for making a sentence feel important; a paragraph with three bold phrases has none.

**Italic for UI values and options.** `Set the permission to _Read-only_.` Also for a term being defined, once.

**Monospace for code and typed values.** Commands, paths, field names, flags, headers, status codes, filenames, and anything the reader types. Tool names are monospace, not bold: `azion`, `npm`, `curl`.

**No directional language.** Not "on the left", "above", "below", "right-hand side". Name the element instead: "In the **Rules Engine** tab". Directions break on mobile, in translation, and for screen readers.

## Headings and titles

**Sentence case, both languages.** `Configure cache policies`, not `Configure Cache Policies`. Product names keep their capitals.

**A task heading leads with an imperative verb, never a gerund.** `Create a bucket`, not `Creating a bucket` and not `Bucket creation`. The heading then matches the steps under it, and it survives translation. An `-ing` word that names a thing rather than a task is a noun and stays: `Getting started`, `Monitoring` as a feature name.

**A non-task heading is a short noun phrase.** `Limits`, `Cache modules`, `Request phases`. Not `Some important limits to keep in mind`.

**Headings are never questions and never calls to action.** `Caching`, not `What is caching?`. `Next steps`, not `Ready to deploy?`.

**Body starts at `##`.** The `title` field renders the H1. A `#` in the body is a defect.

**Do not skip levels.** `##` then `###`, never `##` then `####`.

**Headings name the thing, not the position.** `Create a bucket`, not `Step 1`. A heading is also a search query, and `Step 2` never matches one.

Title grammar per page kind — imperative for tasks, noun for overviews and reference — is in the kind's entry in `content-types.md`.

## Links

**Absolute, language-prefixed, trailing slash.**

```
[Applications](/en/documentation/products/build/applications/)
```

Not relative, not missing the language prefix, not missing the slash. Anchors keep the slash before the fragment: `/en/documentation/products/observe/data-stream/#data-sources`.

**Standard link phrasing.** Two forms cover almost every case:

- `For more information, refer to [Page Title](/en/documentation/.../).`
- `To <do something>, refer to [Section Title](/en/documentation/.../).`

Do not write "Learn more about...", "To read more...", "click here", "this page", or a bare URL in prose. Link text names the destination.

**A closing-section link carries its reason.** `[Title](/path/) - one sentence on what the reader gets there.`

**Assets are root-absolute with no language prefix:** `/assets/docs/images/uploads/diagram.png`.

## Lists

**Numbered for sequence, bulleted for sets.** If the order does not matter, it is not numbered. A procedure is always numbered, never bulleted.

**Parallel grammar within a list.** All items start with a verb, or all start with a noun. Mixing them makes a list harder to scan than a paragraph.

**A list of one is a sentence** — including a single prerequisite. Do not use a list for fewer than three items unless the items are steps; two genuinely parallel items may stay a list when the section is a list by convention.

## Tables

The right tool for anything enumerable: fields, limits, flags, defaults, status codes.

**Consistent phrasing down a column.** Reference readers scan; a column where each cell is phrased differently forces actual reading.

**State units and defaults.** A limit without a unit is not a fact. A setting without a default is a question.

**Do not use a table to lay out a page.** Tables hold data, not design.

## Code and examples

**Every command and snippet must have been run**, or trace to a source you can name. An untested code block is a guess that looks authoritative.

Tool syntax needed to express a sourced fact — `curl` flags, a `Content-Type` header carrying a given JSON body, shell quoting — is composition, not invention. A new product value, field, endpoint, or default is invention.

**Introduce every code block with a sentence that ends in a colon.** "Create the bucket with the CLI:" then the command. A bare code block with no lead-in is a fragment.

**Placeholders are obvious and consistent.**

| Kind of value | Form |
| --- | --- |
| Secret or token | `[TOKEN VALUE]` |
| Reader-supplied name or value | `<your-bucket-name>`, `<your-azion-domain>` |
| Example domain | `example.com`, `example.org` |
| Example IP range | `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` |

Never a plausible-looking fake value a reader might paste as-is. The IP ranges above are reserved for documentation and route nowhere.

**Never a real credential.** Not an expired one, not a fake one that looks real.

**A fence for output the reader reads; `<Code>` for input the reader copies.** Mechanics in `components.md`.

## Admonitions

Four types: `:::note`, `:::tip`, `:::caution`, `:::danger`. `:::warning` is not one.

**At most one admonition of the same type per section.** A section with three notes is a section whose prose is in the wrong place.

**Keep them rare in procedures.** A numbered list interrupted by three asides is a list the reader loses their place in. Constraints that apply to one step go in that step.

Portuguese pages localize the label: `:::note[nota]`, `:::tip[dica]`, `:::caution[Atenção]`.

## Frontmatter

Every page carries five fields. This is the contract; where the repository enforces it is described in `information-architecture.md`.

```yaml
---
title: Create an Object Storage bucket
description: >-
  Create a read-only Object Storage bucket and grant read-write
  permissions from the Azion API, the CLI, or Azion Console.
meta_tags: 'Object Storage, bucket, permissions, edge storage, create bucket'
namespace: docs_store_storage_create_bucket
permalink: /documentation/products/store/storage/create-bucket/
---
```

| Field | Rule |
| --- | --- |
| `title` | Renders the H1. Grammar per kind: see `content-types.md`. |
| `description` | The meta description. Contract below. |
| `meta_tags` | Comma-separated search keywords. |
| `namespace` | Lowercase snake_case, unique per language, **identical across a translation pair** — it is the key that pairs the languages. |
| `permalink` | Lowercase ASCII, hyphens and slashes only, trailing slash, **no language prefix**, unique per language. |

**The description contract.** One or two self-contained sentences, 50 to 160 characters, starting with an imperative verb, stating what the reader accomplishes. It does not restate the title word for word. Banned openers: "This page describes...", "This document explains...", "Learn more about...", "Learn how to..." — start with the bare verb instead.

**Permalinks carry no language prefix.** The language comes from which tree the file is in. Writing `/en/documentation/...` renders at `/en/en/documentation/...`.

**What translates in the Portuguese pair:**

| Field | Portuguese page |
| --- | --- |
| `title`, `description` | translated |
| `permalink` | **translated**: `/documentacao/produtos/...`, ASCII-folded (`configuracao`, not `configuração`) |
| `namespace` | **identical to English**, character for character |
| `meta_tags` | conventionally left in English |

A mismatched `namespace` breaks the language switcher and no build step warns you. Full bilingual rules in the contributing skill's `bilingual.md`.

## Page structure

**Body starts at `##`.** No H1, no preamble heading.

**`---` separates major sections** — roughly three per page, unless the kind's skeleton shows otherwise. Never immediately after the frontmatter block — it parses as an empty frontmatter block.

**One page kind per page.** A reference page that stops to walk through the Console is two pages sharing a file. The kinds, their openings, and their required sections are in `content-types.md`.

**Every `##` section makes sense read alone.** These pages are indexed for retrieval, and a retriever returns one section, not the page. Name the subject in each section, no "as mentioned above", no pronoun whose referent is in another section. Size caps are in `page-size.md`.

**Every page closes as its kind requires.** Procedural kinds close with `## Next steps`; descriptive kinds close with `## Related resources`. The matrix is in `content-types.md`. A page that ends by restating itself ends one section too late.

## Patterns that read as machine-generated

**Invented specifics — the one that matters most.** A limit, default, field name, flag, or error string that came from pattern-matching a similar product rather than from this one. It is indistinguishable from correct documentation until a reader tries it. Every number, field name, and command must trace to a source you can name. If you cannot name it, leave a gap and say so; a page with a gap is recoverable, a page with a confident wrong value is not.

**Promotional framing.** Adjectives selling an Azion product. Not "Applications offers powerful, flexible caching capabilities" — "Applications caches content at the edge. The default TTL is 60 seconds."

**Significance inflation.** Sentences about how important something is, in place of what it does. "Caching plays a crucial role in web performance" tells the reader nothing they can act on.

**Rhetorical questions**, especially as headings. `What is caching?` becomes `Caching`. `Why use Tiered Cache?` becomes `When to use Tiered Cache`.

**Participle padding.** Trailing `-ing` clauses that add words and no information: "...routes traffic, reducing latency and improving performance." Cut to the claim that is measurable. `simplified-technical-english.md` bans the same construction as an ambiguity.

**Generic conclusions.** A closing paragraph that restates the page. End on the last concrete fact, the verification, or the closing section the kind requires.

**Negative parallelism.** "It's not just X, it's Y." Say Y.

**False ranges.** "From configuration to deployment to monitoring" where the items are not on a scale. Name the actual set.

**Undefined "you can".** "You can configure various options" has no content. Name the options or link to where they are named.

**Copula avoidance.** "X serves as the mechanism for Y" is "X does Y". "Applications provides the ability to cache" is "Applications caches".

**Uniform sentence length.** A paragraph where every sentence is the same mid-length reads as generated. Vary it, and prefer short.

## Calibration

Documentation legitimately does things a blog post should not. Bullets, tables, dense bold on UI labels, hedging for accuracy, and repeated parallel structure across sibling pages are the medium here, not defects. What documentation never tolerates: promotional language, rhetorical questions, title-case headings, and invented specifics.

## Self-reference escape hatch

Files that quote bad examples in order to ban them are not violating their own rules. When checking anything under `.agents/`, judge what a page *asserts*, not what strings it contains.
