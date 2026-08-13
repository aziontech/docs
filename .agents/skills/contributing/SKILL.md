---
name: contributing
description: Use when writing, rewriting, splitting, or reviewing a page in the Azion documentation — choosing a page kind, drafting an overview, get-started, tutorial, how-to, multi-product guide, troubleshooting, reference, concept, architecture, changelog, or navigation hub, setting frontmatter and permalinks, adding the Portuguese version, or registering a page in a sidebar.
---

# Contributing to Azion Docs

The single skill to load for any documentation change. It holds no detail itself — it routes you to the reference for the task in front of you. Do not guess at conventions; the references are the source of truth.

Paths are relative to this skill directory unless they start with `.agents/`, which means the folder root.

## Ground rules

- **This is a public repository.** Never put internal URLs, credentials, unreleased product names, or customer information into pages, commits, or pull requests.
- **Never invent a fact or a product name.** Every limit, default, field name, and name traces to your input or a source you can name. `.agents/references/terminology.md` carries the names; if one is not there or in your input, ask.
- **Never guess a permalink or namespace.** They are unique per language, and `namespace` pairs the two languages.
- **Never commit or push automatically.** Make the changes, then ask.
- **The existing pages are not the model.** Most predate the current structure. Match the references, not the page you happen to be reading.

## Before you start

- What is the source of truth?
- What does the reader want to do? That picks the kind: `references/content-types.md`.
- Does a page already cover this? Extending beats duplicating.

The workflow that chains these: gather context → locate where the page belongs → pick a kind → draft against the kind and the style guide → choose components → add the Portuguese pair → register and validate. Step by step in `references/writing-docs.md`.

## Task index

| Your task | Read |
| --- | --- |
| Write a new page, or edit an existing one | `references/writing-docs.md` |
| Decide which kind of page to write | `references/content-types.md` |
| Write a changelog entry | `references/changelog.md` |
| Write a commercial use case | Load the `writing-a-use-case` skill |
| Match data to a component | `references/choosing-components.md` |
| Place a page, register a sidebar, redirect, or split | `references/information-architecture.md` |
| Write the agent-facing `.md` twin | `references/agent-twin.md` |
| Add or update the Portuguese version | `references/bilingual.md` |
| Review a page or a docs PR | `references/reviewing-docs.md` |
| Voice, word choice, formatting, frontmatter | `.agents/references/style-guide.md` |
| Step grammar | `.agents/references/procedures.md` |
| Sentence length, tense, noun clusters | `.agents/references/simplified-technical-english.md` |
| Component mechanics and props | `.agents/references/components.md` |
| Product names, translation rules | `.agents/references/terminology.md` |
| Length and retrieval chunking | `.agents/references/page-size.md` |

## Validate before you finish

Run the writer's checklist at the end of `references/writing-docs.md` on every draft.

Inside the documentation repository, also build:

```bash
npm run build:local
```

The build and the frontmatter validator must both pass, and the hand-checks in `references/information-architecture.md` — sidebar entries, namespace pairing, redirects — must hold.
