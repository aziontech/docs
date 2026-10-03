---
name: webkit-ux-heuristics
description: Component-map discovery pass — for each UX moment (loading→Skeleton, destructive→Dialog confirm, field error→Field*/Message inline, overlay→shipped focus-trap, empty→one action) name the @aziontech/webkit component that already serves it, so the flow is sound before polish. State rendering + async behavior lives in /webkit-ui-states.
status: active
last_updated: 2026-07-20
scope: general
enforced_by: [webkit-prefer-over-custom, webkit-component-states, webkit-accessibility, review]
---

# Skill: webkit-ux-heuristics

## Purpose

Get the flow right before it is made to look good. Most UI slop is not a styling problem — it is a
missing loading state, an error in the wrong place, an empty screen with no next step, or a
destructive action with no confirmation. This is the **discovery pass**: for each moment in a flow,
name the `@aziontech/webkit` component that already serves it, so you compose shipped behavior instead
of hand-rolling it. **Before polish, the flow must be sound.**

Boundary: this skill picks the component per moment. How each state actually **renders** (the loading
shape, the empty layout, the error affordance) and how **async behavior** sequences belong to
`/webkit-ui-states`.

## How to use

- `/webkit-ux-heuristics`
  Apply the component map to any flow you design or build in this conversation.
- `/webkit-ux-heuristics <file>`
  Review the file's flow against the map and output, per gap:
  - the exact line / element (quoted),
  - the moment it mishandles (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Designing or reviewing a flow, form, list, or screen — **before** `/webkit-baseline-ui` /
  `/webkit-motion-polish`.
- The user asks "is this good UX", "what am I missing", "review this flow".

## Component map (the right tool per moment)

Each moment below is a Nielsen heuristic made concrete — the map **is** the checklist. Pick the
component for the moment; don't re-derive the principle.

| Moment                            | Use                                                                                                                     | Don't                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Loading (content vs. inline)      | `@aziontech/webkit/skeleton` for content shape; the control's own loading / `@aziontech/webkit/spinner` for inline busy | a bare full-page spinner for content that has a shape |
| Destructive / irreversible action | `@aziontech/webkit/dialog` (confirm)                                                                                    | a silent immediate action                             |
| Field validation error            | `@aziontech/webkit/field-*` + `@aziontech/webkit/message` **next to the field**                                         | a global toast for a field error                      |
| Page / section status             | `@aziontech/webkit/message`, `@aziontech/webkit/status-indicator`                                                       | inventing a banner                                    |
| Empty state                       | `@aziontech/webkit/button` for the one next action + a one-line reason it's empty                                       | a dead-end "no results" string                        |
| Contextual actions / menu         | `@aziontech/webkit/dropdown-menu`                                                                                       | a hand-rolled popover                                 |
| Side surface                      | `@aziontech/webkit/panel`, `@aziontech/webkit/drawer`                                                                   | a fixed div without focus management                  |
| Tooltip help                      | `@aziontech/webkit/tooltip`                                                                                             | `title` attribute only                                |
| Field label                       | `@aziontech/webkit/label`                                                                                               | placeholder-as-label                                  |

Overlays (`dialog`, `drawer`, `dropdown-menu`, `panel`) must trap focus and restore it on close — use
the **shipped focus-trap composable** (discover its exact import via the MCP / catalog); don't rebuild
focus/escape behavior by hand.

## Three states every fetch/submit surface needs

- **Loading** — reserve content shape while data arrives; show inline busy on the working control.
- **Empty** — one clear next action (a `@aziontech/webkit/button`) and a one-line reason it's empty.
- **Error** — recoverable, located next to the cause, with a retry/fix affordance.

A surface that fetches or submits but is missing any of these three is **not done** — flag it. How each
one renders, and how the async sequence behaves, lives in `/webkit-ui-states`.

## Hard rules

- Same action → same component, in the same place, with the same label, everywhere. Never two
  components for one job.
- Destructive / irreversible → `dialog` confirm; never a silent immediate action.
- Field errors sit next to the field (`field-*` + `message`); never a global toast for a field-level
  error.
- Overlays trap and restore focus via the shipped focus-trap composable; never hand-roll focus/escape.
- Labels are literal; use `label`, never placeholder-as-label; never block paste.
- No motion or delight here — this pass is structure only. Defer ornament to `/webkit-motion-polish` /
  `/webkit-impeccable-polish`.
- Component discovery is always the webkit MCP `suggest_component` or
  `node_modules/@aziontech/webkit/catalog.json` (`imports`) — never a source path.

## Review output

For `/webkit-ux-heuristics <file>`, list gaps grouped by moment. Each:

```
✗ <file>:<line>  delete handler fires immediately on click
  moment: destructive action — irreversible, no confirmation.
  fix: wrap in @aziontech/webkit/dialog confirm; primary action "Delete", default focus on Cancel.
```

End with: `flow sound` or `N gaps — fix before polish`.

## Definition of Done

- [ ] Every moment uses the correct webkit component (see map).
- [ ] Every fetch/submit surface has loading + empty + error states (rendered per `/webkit-ui-states`).
- [ ] Destructive actions confirm; field errors sit next to their cause; paste is never blocked.
- [ ] Overlays trap and restore focus via the shipped focus-trap composable (import resolved via the MCP/catalog).
- [ ] No motion or delight added here (structure only).
