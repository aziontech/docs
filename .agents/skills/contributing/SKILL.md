---
name: contributing
description: Use when writing, rewriting, or splitting a page in the Azion documentation repository — choosing a content type, drafting a tutorial, how-to, reference, or explanation, setting frontmatter and permalinks, adding the Portuguese version, or registering a page in a sidebar.
---

# Contributing to Azion Docs

This is the skill to load for any content change in this repository. It holds no detail itself. It routes you to the reference that matches your task. Read that reference, then follow it.

Paths are relative to this skill directory unless they start with `.agents/`, which means repo root.

## Ground rules

- **Never invent a product name.** Read `.agents/references/terminology.md`. If a name is not there, ask.
- **Write in Simplified Technical English.** Every page in this repository follows `.agents/references/simplified-technical-english.md`, adapted from ASD-STE100 Issue 9. Procedures cap at 20 words per sentence and one instruction per step; description caps at 25. Simple tenses, active voice, noun clusters of at most three words.
- **Never guess a permalink.** They are build-gated and unique per language. Read `references/frontmatter-and-permalinks.md`.
- **Never commit or push automatically.** Make the changes, then ask.
- **The existing pages are not the model.** Most of this corpus predates the current structure and is due for restructuring. Match the shapes in these references, not the page you happen to be reading.

## Before you start

Answer these before writing. If the request already covers them, skip ahead.

- **What is the source of truth?** A spec, an existing page, an engineer, a product brief. Documentation invented from nothing is documentation nobody can verify.
- **What does the reader want to do?** This decides the content type. See `references/choosing-a-content-type.md`.
- **Does a page already cover this?** Check before adding. Extending a page usually beats creating a neighbour.
- **English or both languages?** English is the source of truth. See `references/bilingual.md`.

## Task index

| Your task | Read |
| --- | --- |
| Write a new page from scratch | `references/writing-a-page.md` |
| Fix or restructure an existing page | `references/rewriting-a-page.md` |
| Break a large page into several | `references/splitting-a-page.md` |
| Decide which content type to write | `references/choosing-a-content-type.md` |
| Write a tutorial (learning by doing) | `references/tutorial.md` |
| Write a how-to (a task with a goal) | `references/how-to.md` |
| Write the agent-facing `.md` twin of a how-to or tutorial | `references/agent-twin.md` |
| Write reference (look-up material) | `references/reference.md` |
| Write explanation (understanding) | `references/explanation.md` |
| Set frontmatter, namespace, permalink | `references/frontmatter-and-permalinks.md` |
| Add or update the Portuguese version | `references/bilingual.md` |
| Make a page appear in a sidebar | `references/sidebar-registration.md` |
| Look up voice and formatting rules | `.agents/references/house-style.md` |
| Check sentence length, tense, voice, noun clusters | `.agents/references/simplified-technical-english.md` |
| Check a draft for machine-generated patterns | `.agents/references/writing-quality.md` |
| Check page length and retrieval chunking | `.agents/references/page-size.md` |
| Look up an MDX component | `.agents/references/components.md` |
| Look up a product name or banned term | `.agents/references/terminology.md` |
| Audit a page for problems | Load the `reviewing-a-page` skill instead |

## Validate before you finish

```bash
pnpm build:local
```

This runs the build and the frontmatter validator. Both must pass. A missing `namespace` or a malformed `permalink` exits non-zero, and the message names the file.

Then check by hand what the build cannot:

- Does the page appear in the sidebar you intended? Sidebar registration is a separate manual edit.
- If this is a translation, does its `namespace` exactly match the English page?
- If a permalink changed, is the redirect in the same change?
