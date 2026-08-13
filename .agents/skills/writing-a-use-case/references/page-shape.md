# Page shape

The skeleton, section by section. It is a how-to skeleton with three additions: the scenario, the requirements table, and a verification section that checks outcomes rather than steps.

## Skeleton

```mdx
[Scenario paragraph. Three to five sentences: what the team has, what it needs, what this page sets up.]

[One line naming what the use case does not cover.]

## Prerequisites

[Bulleted. Each item is a link or a one-line command where one exists, otherwise a noun phrase naming the requirement.]

---

## What you build

[The requirements table. Requirement, what it needs, where it is documented.]

---

## Architecture

[Numbered dataflow, or a diagram with a numbered dataflow under it.]

---

## Configure <the first specific thing>

[Steps. Tabbed by interface when the task has more than one.]

## Configure <the second specific thing>

---

## Verify the setup

[One check per requirement, each with its expected result.]

---

## Next steps

[Two or three bulleted links, each with a reason to follow it.]
```

## Section rules

### Scenario paragraph

Three to five sentences. It is the only place on the page where a business term is allowed to lead. See `commercial-framing.md`.

The last sentence says what the page sets up, in platform terms. The reader has to be able to tell from this paragraph alone whether the page is for them.

No heading. The `title` field renders the H1 and the body starts at `##`.

### What you build

A table, one row per requirement, straight out of the evidence table in `intake.md`.

| The storefront needs | Which means | Documented in |
| --- | --- | --- |
| Catalogue pages that load from cache | A cache rule matched on the catalogue path | [link] |
| A cart that is never shared between users | A rule that bypasses cache on the cart path | [link] |

This is the section a technical lead reads before deciding to read the rest. Keep the left column in the reader's words and the middle column in platform words.

Consistent phrasing down each column. A column where every cell is shaped differently has to be read rather than scanned.

### Architecture

What talks to what, in order, numbered. Six items at most.

A diagram is optional and it never stands alone. Diagrams are assets at `/assets/docs/images/uploads/<name>.png`, root-absolute with no language prefix. An agent fetching the markdown twin gets the numbered list and not the image, so the list carries the meaning.

Every diagram needs alt text describing what it conveys, and it must not rely on color alone to distinguish paths.

Cut this section when the setup has one product and one path. Three sentences of dataflow is not an architecture.

### Configure sections

These are ordinary how-to sections, so the How-to entry in `.agents/skills/contributing/references/content-types.md` applies: imperative heading, a colon lead-in, numbered steps per `.agents/references/procedures.md`, an outcome sentence. The `<Tabs>` mechanics are in `.agents/references/components.md`.

Two rules on top of those:

**Only what is specific to this use case.** The generic path to the same screen is a link. If a section could be pasted unchanged into a different use case, it belongs in a guide and the use case links to it.

**Every value is explained once.** A TTL of 30 seconds in a step needs the sentence that says why 30, in that section. A value with no reason gets copied into production and never revisited.

At most four of these sections. Five means the use case is two use cases.

### Verify the setup

The section that separates a use case from a list of tasks. It checks the requirements from `## What you build`, not the steps.

One check per requirement, each with the result the reader should see:

```mdx
<Code lang="bash" code={`curl -I https://<your-domain>/products/example`} />

The response includes a cache hit header. The catalogue page is served from cache.
```

Write the check against the outcome. `The rule appears in the list` proves the reader selected **Save**. It does not prove the setup works.

When a result takes time to propagate, say so and say what to do about it. Without that line a reader debugs a working configuration.

### Next steps

Two or three bulleted links, shaped `[Title](/path/) - one sentence on why the reader would follow it.` Not a summary of the page.

## Size budget

Caps are in `.agents/references/page-size.md`: 2,000 characters per `##` section, 8,000 per page body. A use case reaches them faster than most pages, so budget up front.

| Section | Target characters |
| --- | --- |
| Scenario | 500 |
| What you build | 900 |
| Architecture | 700 |
| Each `## Configure` section, four at most | 1,200 |
| Verify the setup | 700 |
| Next steps | 200 |

That totals about 7,800. A `<Tabs>` block legitimately pushes its own section between 2,000 and 4,000 characters, which `page-size.md` exempts. Nothing else on the page is exempt.

**Budget for the translation, not for the English.** Portuguese runs longer than the same page in English. Aim the English at 7,000 so the pair fits.

Over the total, the fix is not compression. It is a narrower use case or a step that becomes a link.

## Every section stands alone

These pages are served as markdown twins and indexed for retrieval, so a reader may see one section and nothing else. Name the subject in each section, and never write "as described above" or "the previous step". A `## Configure` section retrieved on its own has to say which setup it is part of.

## Components

Live components only, listed in `.agents/references/components.md`. A use case typically needs four:

| For | Use |
| --- | --- |
| Anything the reader copies | `<Code lang="bash" code={...} />` |
| A task with a Console, CLI, and API path | `<Tabs client:visible>` with paired `tab.` and `panel.` slots |
| A constraint or caveat | `:::note` or `:::caution` |
| A pointer to the reference page for a product | `<LinkButton>` |

Valid asides are `note`, `tip`, `caution`, and `danger`. `:::warning` is not one.
