---
name: webkit-ui-craft
description: Umbrella entry for building product UI on @aziontech/webkit with taste and PRO UX. Explains the 3 principles and the non-negotiable rules, then routes to the focused skills — mechanics (usage), structure (ux-heuristics, ui-states, form, create-surface, errors, tables, lists, navigation), foundation (baseline-ui), cross-cutting quality (theming-dark-mode, data-viz), polish (motion-polish, impeccable-polish), verification (ui-verify), and adoption (ds-adoption).
status: active
last_updated: 2026-08-13
scope: general
enforced_by: [webkit-prefer-over-custom, webkit-tokens, webkit-accessibility, ui-verify]
---

# Skill: webkit-ui-craft

## Purpose

Make UI built **on top of** `@aziontech/webkit` + `@aziontech/theme` look and feel like the design
system intended: technical, minimal, polished, PRO-UX-first. This is the **map** to a pack of focused
skills — it carries the shared principles and routes each task to the skill that owns the detail. It
is for **consuming** apps (composing screens from shipped components and tokens), not for authoring
webkit primitives.

## How to use

- `/webkit-ui-craft` — apply the principles below to all UI work in this conversation and route to the
  right child skill for the task at hand.
- `/webkit-ui-craft <file>` — run the progression as a review: structure (`/webkit-ux-heuristics` →
  `/webkit-ui-states` → `/webkit-form` → `/webkit-create-surface` → `/webkit-errors` →
  `/webkit-tables` → `/webkit-lists` → `/webkit-navigation`) → foundation (`/webkit-baseline-ui`) →
  cross-cutting quality (`/webkit-theming-dark-mode`, `/webkit-data-viz`) → polish
  (`/webkit-motion-polish` → `/webkit-impeccable-polish`) → verify (`/webkit-ui-verify`). Output each
  child skill's findings under its own heading.

## The 3 principles

1. **Tech language.** Infrastructure-grade product UI: copy and visuals are precise, calm, and literal
   — no emoji-as-decoration, no marketing fluff inside the product.
2. **Minimal and polished.** Remove before you add. Every element earns its place; ornament is the
   exception that has to justify itself.
3. **PRO UX first.** Get flow, states, and feedback right before any aesthetic pass. A beautiful
   screen with a missing empty/error/loading state is not done.

## The non-negotiable rules (detail lives in the owning skill)

1. **Components only** — compose from `@aziontech/webkit`; never hand-roll a button/input/modal/
   dropdown the system ships. (Find them via the webkit MCP `suggest_component` or
   `node_modules/@aziontech/webkit/catalog.json`.) See `/webkit-usage`, `/webkit-ds-adoption`.
2. **Tokens only** — color, typography, shape, spacing, shadow come from `@aziontech/theme`; no hex,
   `rgb`, `hsl`, or Tailwind palette. See `/webkit-baseline-ui`.
3. **Typography hierarchy** — only the `text-*` tokens, never inverted (`text-heading-* >
text-body-* > text-label-* > text-overline-*`). See `/webkit-baseline-ui`.
4. **Spacing rhythm** — one `--spacing-*` step, applied consistently. See `/webkit-baseline-ui`.
5. **One content column** — inside a vertical list (nav rail, menu, settings list, any stack of rows),
   **every row's content starts on the same x**, whatever the row is. A section title's text, a row's
   leading glyph, and a row with no glyph at all all begin on that one column; a row that reserves a
   glyph box pads by the column minus the glyph's own centring, so the glyph — not the box — lands on
   it. Nesting shifts the whole column by exactly one indent step, so the alignment cascades at every
   depth instead of being re-derived per level.
   Three things follow, and each is a real bug when skipped:
   - **Never reserve an empty glyph box.** A box with no glyph in it misreports where the row's
     content starts: the label sits off the column its siblings hold, and anything drawn from that
     content (a tree rail, a hover surface) anchors to blank space. Render the box only when there is
     a glyph.
   - **Derive the indent from tokens, never a literal.** Hold the step and the column in two custom
     properties and compute everything else from them, so an elbow or rail cannot come unstuck from
     the rows it connects. Avoid any `--spacing-*` token that is redefined at a breakpoint — the
     column would drift as the viewport grows.
   - **Structure lines live in the gutter, never over a row.** A tree rail, elbow or depth guide
     stops at the row's box edge — not at its text. The row's hover and selected surfaces fill that
     box, so a line drawn any further is painted underneath them and reads as a glitch on exactly
     the states a user interacts with.
   - **Verify it by measuring, not by looking.** Read the rendered `x` of each row type and assert
     they are equal, and assert a rail's right edge never exceeds the row surface's left edge. A 4px
     break is invisible in review and obvious in production.
6. **Contain the page** — cap reading/content width with `max-w-(--container-*)`, keep
   data-dense surfaces fluid; never a raw `px`/`rem` width. The full container doctrine (fluid-first
   shell, focused-flow centering) lives in `/webkit-baseline-ui`.
7. **Token motion only** — `animate-*` utilities + `duration-*`/`ease-*` tokens, with a
   `motion-reduce:*` escape; no animation library. See `/webkit-motion-polish`.
8. **Accessible by construction** — labels, focus, ARIA state, target size. See `/webkit-form`,
   `/webkit-ui-verify`.
9. **Works in both themes** — style through role tokens so light and dark need no per-theme edits.
   See `/webkit-theming-dark-mode`.

> Accessibility is enforced by the shipped `accessibility` rule and verified at runtime by
> `/webkit-ui-verify` (axe on the rendered screen).

## The progression — route by phase

Run roughly in this order; polish amplifies a sound structure, it can't rescue a broken one.

| Phase      | Goal                                                                                      | Skill                       |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------- |
| Mechanics  | Import path, tokens, tree-shaking                                                         | `/webkit-usage`             |
| Structure  | Right component + Nielsen heuristics; the 3 states must exist                             | `/webkit-ux-heuristics`     |
| Structure  | Full loading/empty/error/partial state surface + async scope-lock & toasts                | `/webkit-ui-states`         |
| Structure  | Accessible forms: fieldset/legend, submit-time required/invalid                           | `/webkit-form`              |
| Structure  | Where a create lives: page vs drawer, the Advanced band, the commit bar                   | `/webkit-create-surface`    |
| Structure  | Where a failure goes: the field, a section Message, a toast, the auth card                | `/webkit-errors`            |
| Structure  | Data tables: data-driven `<Table :data :columns>`, toolbar, internal scroll, cell recipes | `/webkit-tables`            |
| Structure  | The index page around the table: one band, search vs filters, the chip filter bar         | `/webkit-lists`             |
| Structure  | The two console shells; one GlobalHeader; user always visible                             | `/webkit-navigation`        |
| Foundation | Deslop: components-only, tokens-only, hierarchy, rhythm, containers                       | `/webkit-baseline-ui`       |
| Quality    | Both themes work with zero per-theme edits                                                | `/webkit-theming-dark-mode` |
| Quality    | Charts mapped to tokens: form by question, palette, anatomy                               | `/webkit-data-viz`          |
| Polish     | Smooth motion with tokens only                                                            | `/webkit-motion-polish`     |
| Polish     | The "feels finished" cross-screen sign-off, incl. an earned delight moment                | `/webkit-impeccable-polish` |
| Verify     | Drive the screen: both themes, widths, console, axe/a11y, states                          | `/webkit-ui-verify`         |
| Migrate    | Adopt webkit incrementally in an existing app; coverage scorecard                         | `/webkit-ds-adoption`       |

## When to invoke

- Building or reviewing a product screen/flow that consumes `@aziontech/webkit`.
- The user asks for "polish", "make this feel better", "deslop", "is this good UX", "review this UI".
- You're about to write UI on top of webkit and want the constraints and the right child skill loaded.

## Definition of Done

- [ ] The right child skill ran for the task (structure before polish).
- [ ] Every component is from `@aziontech/webkit`; every visual value is a token.
- [ ] Structure is sound (states, feedback, a11y) before any polish or delight was added.
- [ ] The screen was verified for real (`/webkit-ui-verify`), not assumed — both themes, no console errors.
