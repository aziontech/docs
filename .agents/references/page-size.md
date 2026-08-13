# Page size and retrieval

Documentation pages are not only read by people. They are fetched by agents, served as markdown twins, and indexed by retrieval systems that split them into chunks and embed each chunk separately. That changes how you write, not just how much.

## The limits

Measured on the body, excluding frontmatter.

| Unit | Target | Hard cap |
| --- | --- | --- |
| A `##` section | 2,000 characters | 4,000 |
| A whole page | 8,000 characters | 16,000 |

Roughly 4 characters per token in English, closer to 3.5 in Portuguese. So a 2,000-character section is about one retrieval chunk, and an 8,000-character page is three or four. Portuguese runs longer than the same page in English, so aim the English at 7,000 and the pair fits.

Over the hard cap, split. The split procedure is in the contributing skill's `information-architecture.md`.

## Why it matters

A retrieval system does not return your page. It returns a chunk of it, usually one section, with no neighbors attached.

A very long page becomes dozens of chunks. Any one of them, read alone, is a fragment: pronouns with no referent, steps with no goal, a table with no caption. The retriever finds it, an agent quotes it, and the answer is wrong in a way nobody can trace back to the page.

An 8,000-character page becomes three or four chunks, each still recognizably about one thing.

## Write for the chunk, not just the page

**Every `##` section must make sense read alone, by someone who has not seen the rest of the page.**

- **Name the subject in each section.** Not "It caches content at the edge" but "Cache stores content at the edge." A pronoun whose referent is two sections up is broken the moment the section is retrieved on its own.
- **No back-references.** "As mentioned above", "the previous step", "this feature" all assume context the chunk will not have. If a section genuinely depends on an earlier one, say which: "After creating the bucket described in Create a bucket".
- **Headings are search queries.** `Configure cache TTL` retrieves. `Configuration` does not, and `Step 2` never will.
- **Keep a table with its caption.** A table split from the sentence that explains it is noise. If a table is long enough to be its own chunk, give it a heading.
- **One topic per paragraph, six sentences at most.** From `simplified-technical-english.md`. A paragraph covering two topics chunks badly wherever the splitter cuts it.

## Concision is a retrieval requirement

Verbose prose does not just waste the reader's time. It dilutes the chunk. An embedding of 2,000 characters where 600 carry the information matches worse than an embedding of 600 that are all signal.

So the padding rules in `style-guide.md` are not only style. Cutting a 200-word preamble that restates the heading is the difference between a chunk that retrieves and one that does not.

What concision does not license: compression by deletion. Dropping an article or a subject to save characters produces a shorter chunk that retrieves an ambiguity.

## Exemptions

These legitimately exceed the caps and should not be split to satisfy them:

- **Reference tables.** A complete list of 200 status codes is one thing and belongs together. Long is correct; incomplete is not.
- **A `<Tabs>` block.** The Console, CLI, and API paths for one task are a single section by construction, and the panels retrieve better together than apart. Expect these sections to land between 2,000 and 4,000 characters and let them.
- **Changelogs and release notes.** Append-only by nature.
- **Legal agreements.** Single documents; splitting them changes their meaning.

Everything else over the cap is over the cap because it is doing too much.
