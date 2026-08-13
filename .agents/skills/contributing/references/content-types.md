# Content types

Twelve page kinds. Pick by what the reader is trying to do, then follow the kind's skeleton exactly — the opening move, the section order, and the closing are mandated, not suggestions. That is what keeps a hundred pages by a hundred authors reading as one site.

## Pick the kind

Four base forms, from Diátaxis, plus a fifth for records. The base form sets the sentence budget in `.agents/references/simplified-technical-english.md`. The kind sets the skeleton.

| The reader wants to | Kind | Base form |
| --- | --- | --- |
| Meet a product and decide whether it fits | [Overview](#overview) | Reference |
| Use a product for the first time | [Get started](#get-started) | Tutorial |
| Learn by building something the author chose | [Tutorial](#tutorial) | Tutorial |
| Complete one task they arrived with | [How-to](#how-to) | How-to |
| Reach a goal that crosses products | [Multi-product guide](#multi-product-guide) | How-to |
| Fix a symptom they are looking at | [Troubleshooting](#troubleshooting) | How-to |
| Look up a field, a limit, a flag, a default | [Reference](#reference) | Reference |
| Understand how one thing works and why | [Concept](#concept) | Explanation |
| Understand how products combine into a design | [Architecture](#architecture) | Explanation |
| Know what changed and when | [Changelog](#changelog) | Record |
| Get sent deeper into a section | [Navigation hub](#navigation-hub) | None |
| Solve a business scenario end to end | [Use case](#use-case) | How-to |

A use case has its own skill: `.agents/skills/writing-a-use-case/`.

## The two confusions that actually happen

**Tutorial and how-to both contain steps. They serve opposite readers.** A tutorial reader does not yet know what they want; you choose the goal, you guarantee it works, and you keep decisions away from them. A how-to reader arrived with a problem; you remove obstacles, not teach. If you are writing "you can also" or "depending on your setup", it is a how-to. If you are explaining what a bucket is, it is a tutorial or a concept.

**Reference and concept both describe.** Reference is a map: complete, consistent, boring on purpose, consulted rather than read. Concept is a discussion: context, alternatives, reasons. "Why" and "instead of" belong in a concept and nowhere else.

**One kind per page.** A reference page that stops to walk through the Console is two pages sharing a file. Read the draft as each reader above; if two of them each want a different half, split it — see `information-architecture.md`.

---

## Overview

The product's front door. The reader is deciding whether it fits.

- **Title**: the product name, a noun. Not "documentation", not a gerund.
- **Opening move**: `**<Product>** is a <capability definition of roughly 10 to 15 words>.` Then what problems it solves, as a short benefit list in behavior terms. Then two CTAs:

```mdx
<LinkButton label="Get started" link="/en/documentation/.../get-started/" />
<LinkButton severity="secondary" label="<Product> reference" link="/en/documentation/.../" />
```

- **Sections, in order**: the definition block with CTAs; one `##` per major capability or module, noun phrases, each a short paragraph or a table; the interfaces list ("You can create and manage <Product> using:" Console, API, CLI, Terraform, as links).
- **Closing**: `## Related resources` — get started, key concepts.
- **Never**: numbered steps, procedures, code walkthroughs, quality adjectives. An overview that instructs is a get-started filed wrong.

## Get started

The product's first success, once, linearly. Not a hub — a hub of paths is a [Navigation hub](#navigation-hub).

- **Title**: `Get started with <Product>`.
- **Opening move**: `This guide instructs you through <outcome>.` followed by a short bullet list of what the reader will have done. Frame the outcome as a first: "your first bucket", "your first deployment".
- **Sections, in order**: `## Prerequisites` (bulleted; each item a link or a one-line command where one exists, otherwise a noun phrase naming the requirement); then numbered stage headings `## 1. <Imperative verb phrase>` through `## N.`, ending in a step that activates or verifies. Each stage holds a procedure per `.agents/references/procedures.md` — numbered when it has two or more actions — and ends with its outcome sentence.
- **Closing**: `## Next steps` — bulleted links, each with its reason.
- **One linear path.** Pick the primary interface and stay on it; alternatives are one link each, not parallel tracks. No `<Tabs>`.

## Tutorial

Teaches by building something that works. The reader is new; you choose the goal and guarantee the path.

- **Title**: an imperative verb phrase naming the artifact: `Build a comments API`, `Deploy a static site with Functions`.
- **Opening move**: `In this tutorial, you will <verb> <the artifact and its goal>.` Then one sentence enumerating the sub-goals: "You will create ..., configure ..., and deploy ...".
- **Sections, in order**: `## Prerequisites` first, always. Then numbered stage headings `## 1. <Imperative verb phrase>` in build order. `(Optional)` may follow the number: `## 8. (Optional) Add a custom domain`. The final stage deploys or verifies.
- **Closing**: `## Next steps` — bulleted links, each with its reason.
- **The contract**: you choose every option — no branching, no "depending on your needs"; every step shows a visible result; every command was run. A tutorial that fails at step 7 teaches the reader the product is broken.
- **No `<Tabs>`.** Tabs are a branch, and tutorials do not branch. If the task genuinely needs three interfaces, it is a how-to.
- **No explaining.** One sentence and a link when a concept is genuinely required. Keep asides rare.
- **Every code block gets a colon lead-in**: "Install the CLI:" then the command. Use `<Code>` for anything the reader copies.
- **One tutorial per product area.** Tutorials are expensive to keep working.

## How-to

Gets a reader who arrived with a task to a completed task.

- **Title**: a short imperative verb phrase naming the task: `Create a bucket`, `Bypass origin cache`. Not a gerund, not a question, not "How to ..." — the verb carries it.
- **Opening move**: one scope sentence stating what the page lets the reader do and from where: `You can create a bucket from Azion Console, the Azion CLI, or the API.` Never "In this guide".
- **Sections, in order**: `## Prerequisites` if any (bulleted; each item a link or a one-line command where one exists, otherwise a noun phrase naming the requirement); then one `##` per task, imperative verb phrases. Directly before each procedure, a lead-in ending in a colon: `To create the bucket:`. Steps follow `.agents/references/procedures.md`, and every procedure ends with its outcome sentence.
- **A task section's first sentence must add information its heading does not.** Never open a section by restating the heading in prose; the lead-in carries the section.
- **Multi-interface tasks use one `<Tabs>` block** — Console panel first, one complete procedure per panel. Mechanics in `.agents/references/components.md`.
- **Closing**: `## Next steps` — one or two bulleted links, each with its reason.
- **One task per heading.** A heading covering two tasks is two headings.
- **Do not teach.** A sentence of context, then the steps. A paragraph of background is a concept page reaching out; link it.
- **Separate major sections with `---`.**

## Multi-product guide

One goal that crosses products. Still a how-to; the products are the route, not the subject.

- **Title**: the goal, in plain language, with no product names: `Serve a site with cached content and a protected checkout`.
- **Opening move**: state the problem first, in one or two sentences. Introduce the products only after the problem, by role: "You configure caching with **Applications** and request filtering with **Firewall**."
- **Sections, in order**: `## Prerequisites`; then one `##` per **workflow stage**, not per product. Each stage names its product on entry and holds an ordinary procedure. Each stage's section stands alone.
- **Closing**: `## Next steps`.
- **Order by the workflow**, never by the product catalog. A page organized product-by-product is a bundle of how-tos wearing one title.

## Troubleshooting

Fixes a symptom the reader is looking at right now.

- **Title**: `Troubleshoot <feature or symptom class>`.
- **Opening move**: one scope sentence naming the product and the class of symptoms the page covers.
- **Sections**: one `##` per symptom, each fully self-contained and readable in any order. The heading is a noun phrase stating the observable behavior, quoting error strings verbatim in monospace: `` ## `403 Forbidden` on legitimate requests ``.
- **Inside each section, in order**: the symptom, one or two sentences; the cause; the fix, as a numbered procedure or as remedy bullets shaped `**<Remedy name>**: what it does and its link`; the outcome the reader should now see.
- **Closing**: `## Related resources` — the how-to and reference pages the fixes lean on.
- **Link long procedures instead of restating them.** The fix section holds what is specific to the symptom; the generic path is a link.

## Reference

Look-up material. Consulted, never read; complete, consistent, deliberately boring.

- **Title**: a noun phrase naming the thing: `Object Storage`, `Cache settings`, `azion create bucket`.
- **Opening move**: one to three definitional sentences about the artifact, then straight to the data. No procedure framing.
- **Sections**: noun-phrase `##`s naming the actual object, field group, or level. Tables carry the information — fields, values, defaults, limits — with consistent phrasing down every column and units on every number. Prose between tables is one or two sentences of orientation. Include a `## Limits` section when the product has them.
- **Closing**: `## Related resources` — the concept page and the main how-tos.
- **Never a numbered click-through.** The moment one appears, it is a how-to filed wrong. Link the how-to instead.
- **Be complete before you are interesting.** A reference missing three of twelve fields is broken; one with dull descriptions of all twelve is doing its job.
- **A CLI command page has its own shape**: one-line summary, `## Usage` with the command, `## Optional flags` with one entry per flag.

## Concept

Builds understanding of one mechanism. The reader is deciding or reasoning, not doing.

- **Title**: `How <X> works`, `About <X>`, or a short noun phrase.
- **Opening move**: a declarative statement of how the system behaves — never "This page explains". Close the intro with a roadmap sentence that names the mechanisms the `##`s cover, in order.
- **Sections**: one noun-phrase `##` per mechanism, mirroring the roadmap sentence. Cover the problem, the mechanism, and the tradeoff. An explanation that presents only upsides is marketing; every design choice costs something, so say what.
- **Closing**: `## Related resources` — the reference page and the how-tos that apply the concept.
- **No procedures.** Link the how-to. Alternatives and "instead of" live here and nowhere else.
- **Diagrams carry load here.** Alt text describes what the diagram shows. Assets are root-absolute with no language prefix.
- **Passive voice is allowed narrowly**: only where the actor is genuinely unknown or is the platform itself.

## Architecture

How products combine into a design. A concept at system scale.

- **Title**: the design, as a noun phrase: `Content delivery at the edge`.
- **Opening move**: what problem this design solves and for whom, in the first paragraph.
- **Sections, in order**: `## Architecture diagram` — the diagram, then a paragraph reading it; `### Dataflow` — a numbered walkthrough of what moves where, six items at most; `## Components` — what each part does and why it is there; `## Implementation` — links to the how-tos, and only links.
- **Closing**: `## Related resources`.
- **The diagram never stands alone.** The numbered dataflow carries the meaning; an agent fetching the markdown twin gets the list, not the image.

## Changelog

The record of what changed and when. Full entry rules in `changelog.md`.

- **Entry opening move**: `**<Product>** now <verb>s <capability>.` — present tense, the product as the subject, never "we".
- **Then, in order**: what it means concretely; who is not affected; migration or opt-in steps with a code sample when an API or configuration changed.
- **Entry closing**: `For more information, refer to [<the documenting page>](/en/documentation/.../).`
- **Dates are allowed here and only here.** Historical entries keep the product names they were written with.

## Navigation hub

Routes readers deeper. Not a content kind — a junction.

- **Opening move**: one orientation sentence saying what the section holds.
- **Body**: link groups under noun-phrase `##`s. Every link is shaped `[Title](/path/) - one sentence on what the reader gets there.`
- **No closing section, no other prose.** Every link earns its place; a hub is judged by what it leaves out.

## Use case

A how-to with a commercial frame: the reader arrives with a business scenario, not a task. Load the `writing-a-use-case` skill — it carries the intake, the skeleton, and the framing rules.

---

## Closings, one matrix

| Kinds | Closing section |
| --- | --- |
| Get started, Tutorial, How-to, Multi-product guide, Use case | `## Next steps` |
| Overview, Troubleshooting, Reference, Concept, Architecture | `## Related resources` |
| Changelog, Navigation hub | none |

Both closings are bulleted links shaped `[Title](/path/) - one sentence on why the reader would follow it.` `Next steps` answers "what do I do now"; `Related resources` answers "what else do I need".

A mandated slot — a CTA, an interfaces list, a required section — whose content the input does not supply is emitted with a gap marker. It is never omitted silently and never filled by invention.

## Cross-linking

Every page links to its neighbors, so a reader — or a retriever — can move between doing and understanding:

| Kind | Links to |
| --- | --- |
| Overview | Get started, the main concepts |
| Get started | Tutorials, the main how-tos |
| Tutorial | The how-tos and concepts it touched |
| How-to | Sibling how-tos, the reference page |
| Multi-product guide | Each product's how-tos and reference |
| Troubleshooting | The how-tos and reference the fixes lean on |
| Reference | The concept page, the main how-tos |
| Concept | The reference page, get started |
| Changelog entry | The page documenting the change |
| Navigation hub | Its section's children |

Links are bidirectional: if a concept links a how-to, the how-to's closing links the concept back.

The matrix applies where the target exists. Never invent a link to satisfy it; link what your input gives you.
