# Choosing components

The data you have, mapped to the component that carries it. Mechanics and props are in `.agents/references/components.md`; this file decides *which*.

## The table

| You have | Use | Mandatory? |
| --- | --- | --- |
| One task with a Console, CLI, or API path — more than one | `<Tabs client:visible>`, one complete procedure per panel | **Yes** — never three sequential sections for the same task |
| A command or snippet the reader copies | `<Code lang="..." code={...} />` | **Yes** — the copy button is the point |
| Output the reader reads but does not run | A fenced code block | Yes |
| A constraint, caveat, or version warning | `:::note`, `:::tip`, `:::caution`, or `:::danger` | — |
| A call to action toward another page | `<LinkButton>` | — |
| A status or availability badge | `<Tag client:only="vue">` | — |
| A video walkthrough | `<Video>` | — |
| A block reused across several pages | A shared snippet from `~/includes/snippets/` | — |
| Anything enumerable: fields, limits, flags, defaults | A GFM pipe table | Yes |
| A diagram or screenshot | A markdown image at `/assets/docs/images/uploads/...`, with alt text | — |

## Rules

**The primary interface is the first tab.** Console first unless the page's audience says otherwise. Do not nest tabs.

**Do not force a component where plain markdown is clearer.** A single link does not need a `<LinkButton>`; three settings do not need tabs; and a table is for data, never for page layout.

**Aside choice is severity, not decoration.** `note` for context, `tip` for a shortcut or an upgrade path, `caution` for something that can break, `danger` for something destructive or irreversible. At most one of the same type per section.

**Tabs are for interfaces, not for alternatives.** A tutorial never uses tabs — one path is the contract. A how-to uses one `<Tabs>` block per task, not one per page.

**If a component is not in `.agents/references/components.md`, it does not exist.** Do not invent markup, and do not import from the codebase on the strength of a plausible name.

## The pairings that break silently

- `<Tabs>` without `client:visible` — renders, does not switch.
- `<Tag>` without `client:only="vue"` — renders, does not hydrate.
- Markdown inside a `<Fragment>` without blank lines around it — renders as one literal paragraph.
- A `tab.x` slot without its `panel.x` — an empty panel.
