---
name: writing-a-use-case
description: Use when creating a use-case page for the Azion documentation — turning a commercial scenario such as e-commerce, live streaming, online banking, or SaaS into a guide that shows the setup it needs, the products it uses, and how to verify it works.
---

# Writing a use case

A use case is a guide with a commercial frame. The reader arrives with a business problem rather than a task, so the page opens with the scenario and closes with a setup they can verify. Everything between those two is an ordinary guide.

This skill routes. The detail lives in `references/`. Paths are relative to this skill directory unless they start with `.agents/`, which means the folder root.

## Input

A scenario, usually one or two words: `e-commerce`, `live streaming`, `online banking`, `SaaS onboarding`.

That is not a page yet. One word names an industry. A use case names one setup that one team builds. Narrow it first, in `references/intake.md`.

## The rule that shapes the page

**Inline what is specific to this use case. Link what is true for every use case.**

Creating an account, installing the CLI, and creating an application are true for every use case. They are links. The cache rule that keeps a product page fresh for 30 seconds while the cart stays dynamic is specific to this one. It goes on the page, in full, with its values.

A use case that inlines everything duplicates pages that are already maintained elsewhere, and it goes stale the first time one of them changes. A use case that links everything is a hub, not a guide.

## Process

In order. Step 2 is the one that keeps the page honest, so do not skip it.

| Step | Read |
| --- | --- |
| 1. Narrow the scenario to one buildable setup | `references/intake.md` |
| 2. Build the evidence table before writing any prose | `references/intake.md` |
| 3. Draft against the skeleton | `references/page-shape.md` |
| 4. Write the scenario and requirements without selling | `references/commercial-framing.md` |
| 5. Set frontmatter, namespace, permalink | `.agents/references/style-guide.md`, the Frontmatter section |
| 6. Write the agent twin | `.agents/skills/contributing/references/agent-twin.md` |
| 7. Add the Portuguese version | `.agents/skills/contributing/references/bilingual.md` |
| 8. Place and register the page | `.agents/skills/contributing/references/information-architecture.md` |

Voice, sentence construction, terminology, step grammar, components, and length come from `.agents/references/`, the same as for any other page. This skill adds to them. It overrides none of them.

A use case is a **pattern of the how-to kind**, so the How-to entry in `.agents/skills/contributing/references/content-types.md` applies as well.

## Ground rules

**A use case is procedural.** It takes the tighter budget: 20 words per sentence, one instruction per step. See `.agents/references/simplified-technical-english.md`.

**Never invent a fact.** Every value, field name, product name, and command traces to your input or to a page you can name. A use case is written from a prompt rather than from a spec, which makes this the failure mode the skill exists to prevent. `references/intake.md` is how you avoid it.

**Never make a commercial claim.** No cost saving, no percentage gain, no competitor, no customer name, no compliance assertion. See `references/commercial-framing.md` for what goes in their place.

**Example figures are not limits.** A number that illustrates the scenario belongs in the scenario paragraph and nowhere else. Next to a product name, a reader reads it as a platform limit.

**Never invent a product name.** Read `.agents/references/terminology.md`. A URL or directory path is not evidence.

**Never commit or push automatically.** Make the changes, then ask.

## When it is not a use case

Stop and write something else when:

- **There is nothing to configure.** The page explains a design. Write an Architecture page, per `content-types.md`.
- **The setup is one task.** It is a How-to.
- **The reader has no scenario, only the product.** It is a Tutorial.

## Before you finish

- Every command and value on the page was run, or traces to your input or a page you can name.
- Every link came from the target page's `permalink` field, never from its file path.
- The Portuguese version carries the same `namespace`, character for character.
- No sentence on the page makes a claim the page does not check.
- The conformance checklist for the how-to kind passes: opening scope sentence, section order, `## Next steps`, step grammar, voice sweep.
