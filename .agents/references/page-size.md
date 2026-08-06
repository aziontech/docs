# Page size and retrieval

These pages are not only read by people. They are fetched by agents, served as markdown twins, and will be indexed by a retrieval system that splits them into chunks and embeds each chunk separately.

That changes how you write, not just how much.

## The limits

Measured on the body, excluding frontmatter.

| Unit | Target | Hard cap |
| --- | --- | --- |
| A `##` section | 2,000 characters | 4,000 |
| A whole page | 8,000 characters | 16,000 |

Roughly 4 characters per token in English, closer to 3.5 in Portuguese. So a 2,000-character section is about one retrieval chunk, and an 8,000-character page is three or four.

These are not arbitrary. Most of the corpus already fits: the median section is 751 characters and the median page 4,778. The targets sit near the 75th percentile, so they describe what good pages here already do. The hard caps are where a page stops being retrievable as a coherent thing.

Over the hard cap, split. See `.agents/skills/contributing/references/splitting-a-page.md`.

## Why it matters

A retrieval system does not return your page. It returns a chunk of it, usually one section, with no neighbours attached.

A 129,000-character page becomes 30 to 60 chunks. Any one of them, read alone, is a fragment: pronouns with no referent, steps with no goal, a table with no caption. The retriever finds it, the agent quotes it, and the answer is wrong in a way nobody can trace back to the page.

An 8,000-character page becomes three or four chunks, each still recognisably about one thing.

## Write for the chunk, not just the page

The rule that follows from this, and the one that actually changes your drafting:

**Every `##` section must make sense read alone, by someone who has not seen the rest of the page.**

Concretely:

- **Name the subject in each section.** Not "It caches content at the edge" but "Cache stores content at the edge." A pronoun whose referent is two sections up is broken the moment the section is retrieved on its own.
- **No back-references.** "As mentioned above", "the previous step", "this feature" all assume context the chunk will not have. If a section genuinely depends on an earlier one, say which: "After creating the bucket described in Creating a bucket".
- **Headings are search queries.** `Configuring cache TTL` retrieves. `Configuration` does not, and `Step 2` never will.
- **Keep a table with its caption.** A table split from the sentence that explains it is noise. If a table is long enough to be its own chunk, give it a heading.

## Concision is a retrieval requirement here

Verbose prose does not just waste the reader's time. It dilutes the chunk. An embedding of 2,000 characters where 600 carry the information matches worse than an embedding of 600 that are all signal.

So the vocabulary and padding rules in `writing-quality.md` are not only style. Cutting "in order to" to "to" is a small thing; cutting a 200-word preamble that restates the heading is the difference between a chunk that retrieves and one that does not.

## Exemptions

These legitimately exceed the caps and should not be split to satisfy them:

- **Reference tables.** A complete list of 200 status codes is one thing and belongs together. Long is correct; incomplete is not.
- **A `<Tabs>` block.** The Console, CLI, and API paths for one task are a single section by construction. Splitting the section breaks the component, and the three panels describe the same task, so they retrieve better together than apart. Expect these sections to land between 2,000 and 4,000 characters and let them.
- **Changelogs and release notes.** Append-only by nature.
- **Legal agreements.** They are single documents and splitting them changes their meaning.

Everything else that is over the cap is over the cap because it is doing too much.

## Current state of the corpus

Measured on the English tree, body only: 150 of 728 pages are over the 8,000 target and 60 are over the 16,000 cap. Those 60 are the split backlog, not a reason to relax the rule. New pages meet it.

## Checking

```bash
# body size of one page, excluding frontmatter
awk '/^---$/{d++; next} d>=2{c+=length($0)+1} END{print c+0}' <file>

# largest ## section in a page
awk '/^## /{if(n&&c>m)m=c; c=0; n=1; next} n{c+=length($0)+1} END{if(c>m)m=c; print m+0}' <file>

# every page over the hard cap
find src/content/docs -name '*.mdx' -size +16000c
```

Note the delimiter counting in the first command. An `awk` that toggles on `^---$` counts the frontmatter instead of the body, which reads as a suspiciously small number.
