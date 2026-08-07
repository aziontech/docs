# House style

Voice and formatting for Azion documentation. Product names and banned expressions are in `terminology.md`. Components are in `components.md`. Sentence construction — length, tense, voice, noun clusters — is in `simplified-technical-english.md`, and where the two touch, that file is the narrower rule.

## Voice

**Second person, present tense, active voice.** "You create a bucket", not "A bucket is created" or "The user will create a bucket".

**Imperative for steps.** "Click **Save**." Not "You should click Save" or "Next, the Save button should be clicked."

**Say what it does, not how good it is.** Documentation describes behaviour and limits. It does not sell. A reader who reached the docs has already bought.

**Short sentences carry technical content better than long ones.** If a sentence has three clauses and a parenthetical, it is two sentences. The caps are 20 words in a procedure and 25 in descriptive text, from `simplified-technical-english.md`.

**Short is not the same as clipped.** Never drop a subject, a verb, or an article to hit the cap. "Objects not cached will be purged" is shorter than "Azion purges the objects that are not cached" and leaves the reader guessing which objects. Split the sentence instead.

## Headings

**Sentence case.** `Configure cache policies`, not `Configure Cache Policies`.

**Lead with an imperative verb, not a gerund.** `Create a bucket`, not `Creating a bucket`. Gerunds translate inconsistently as the first word of a heading, and they put the heading in a different register from the imperative steps underneath it. An `-ing` word that names a thing rather than a task is a noun and stays: `Getting started`, `Monitoring`. Full rule and the corpus backlog are in `simplified-technical-english.md`.

**Body starts at `##`.** The `title` field renders the H1. A `#` in the body is a defect.

**Headings name the thing, not the section.** `Limits`, not `Some important limits to keep in mind`. `Create a bucket`, not `Step 1`.

**Do not skip levels.** `##` then `###`, never `##` then `####`.

## Emphasis

**Bold for UI labels and product names.** `Click the **Save** button.` `**Applications** is an Azion product that...`

Not for making a sentence feel important. A paragraph with three bold phrases has none.

*Italic* is rare here. Use it for a term being defined, once.

## Links

**Absolute, language-prefixed, trailing slash.**

```
[Applications](/en/documentation/products/build/applications/)
```

Not relative, not missing the language prefix, not missing the slash. Anchors keep the slash before the fragment: `/en/documentation/products/observe/data-stream/#data-sources`.

**Link text describes the destination.** Not "click here", not "this page", not a bare URL. The reader should know where a link goes without reading around it.

**Assets are root-absolute with no language prefix:** `/assets/docs/images/uploads/diagram.png`.

## Lists

**Numbered for sequence, bulleted for sets.** If the order does not matter, it is not numbered.

**Parallel grammar within a list.** All items start with a verb, or all start with a noun. Mixing them makes a list harder to scan than a paragraph.

**A list of one is a sentence.**

## Tables

The right tool for anything enumerable: fields, limits, flags, defaults, status codes.

**Consistent phrasing down a column.** Reference readers scan; a column where each cell is phrased differently forces actual reading.

**State units and defaults.** A limit without a unit is not a fact.

## Code

Every command and snippet must have been run. An untested code block is a guess that looks authoritative.

**Placeholders are obvious and consistent:** `[TOKEN VALUE]`, `<your-bucket-name>`. Never a plausible-looking fake value a reader might paste as-is.

**Never a real credential**, not even an expired one, not even a fake one that looks real.

## Words to avoid

**"Simply", "just", "easy", "obvious".** If it were, the reader would not be here. These only tell someone stuck that they should be embarrassed.

**"Please".** Documentation instructs; it does not ask.

**"Currently", "at the time of writing", "will soon".** All age badly and nobody returns to fix them. Say what is true and let the changelog carry the timeline.

**"Note that", "it is important to note".** Delete the phrase and keep the sentence.

**Latin abbreviations.** Use "for example" and "that is", not "e.g." and "i.e."

## Writing quality

The vocabulary tables, the patterns that make a draft read as machine-generated, and the docs-specific calibration are in `writing-quality.md`. The sentence-level rules — one instruction per step, simple tenses, noun-cluster limits — are in `simplified-technical-english.md`. Read both before handing over a draft.

The short version: documentation tolerates bullets, tables, dense emphasis, and repeated structure, and those are not defects here. It does not tolerate promotional language, rhetorical questions as headings, or invented specifics. That last one is the failure that matters, because a confidently wrong limit is indistinguishable from a correct one until a reader tries it.
