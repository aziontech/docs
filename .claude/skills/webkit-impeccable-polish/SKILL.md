---
name: webkit-impeccable-polish
description: The "feels finished" sign-off for UI on @aziontech/webkit — a whole-screen cross-axis pass that confirms state completeness, optical balance, and coherence AFTER the per-axis skills ran, plus an optional earned-delight pass (at most one or two restrained, token-driven moments at a completion / first-time / recovery / milestone). It names each axis and defers the token rules to the skill that owns them; it does not re-teach token sets.
status: active
last_updated: 2026-07-20
scope: general
enforced_by: [ui-verify, webkit-component-states, webkit-motion, review]
---

# Skill: webkit-impeccable-polish

## Purpose

The last 10% that separates "functional" from "finished". This is a **sign-off**, not a rulebook: it
runs after `/webkit-ux-heuristics`, `/webkit-baseline-ui`, and `/webkit-motion-polish`, and checks the
things each of those touches but none guarantees end-to-end — a coherent scale across the _whole_
screen, every state accounted for, and optical balance. It names the axis and points at the skill
that owns the rule; it deliberately does **not** re-enumerate token sets (that is
`/webkit-baseline-ui`'s job — restating them here would only let the two drift).

## How to use

- `/webkit-impeccable-polish` — hold UI work in this conversation to the checklist below.
- `/webkit-impeccable-polish <file>` — review the file and report, per issue: the quoted line, why it
  falls short (one sentence), and the concrete fix.

## The sign-off checklist

Each item is a **cross-screen** check. Where a token set or rule is involved, the owning skill is
named — go there for the allowed values; here you only confirm the screen as a whole holds together.

1. **Typography hierarchy is coherent across the screen.** No inverted or skipped levels; a heading is
   never smaller than a label; `text-balance` on headings, `text-pretty` on body, `tabular-nums` on
   aligned figures, `truncate`/`line-clamp` in dense areas. Allowed token set: `/webkit-baseline-ui`.
2. **Spacing rhythm is steady.** One predictable step between related elements; consistent section
   padding; related items grouped tighter than unrelated (proximity reads as grouping). Scale:
   `/webkit-baseline-ui`.
3. **State completeness — the part no single skill guarantees end-to-end:**
   - Every interactive element has **hover, focus-visible, active, disabled** (visible focus ring).
   - Every async surface has **loading, empty, error** — cross-check `/webkit-ui-states`.
   - Selected / current states are visible (not just inferable).
     This is the highest-value check here: a screen usually fails "finished" on a missing state, not on
     a wrong token.
4. **Shape & elevation are coherent per role.** All cards share one radius, all inputs another;
   elevation is monotonic with stacking (overlays sit above cards), not every surface floating.
   Token roles: `/webkit-baseline-ui`.
5. **Optical balance & restraint.** Shared edges and consistent optical centers; icons aligned to the
   text baseline; **one accent per view**, the rest on surface/text/border tokens; no gradient/glow
   unless requested; nothing that doesn't earn its place. Motion is smooth and reduced-motion-safe —
   confirm via `/webkit-motion-polish`.
6. **Two themes hold.** The screen reads correctly in light and dark without per-theme edits — confirm
   via `/webkit-theming-dark-mode`, and observe it for real with `/webkit-ui-verify`.

## Earned delight (optional)

Once the six checks hold, **at most one or two** moments may earn a touch of delight — never sprinkled
across hover states and every button (that is exactly the noise the restraint check, item 5, exists to
catch). A moment is earned only at a **completion** (saved / deployed / published), a **first-time**
success, an **error recovery**, or a **milestone** crossed.

Keep it inside the register:

- **Token-driven motion only** — a `transform`/`opacity` transition on the right curve (values per
  `/webkit-motion-polish`). No new dependency, no confetti, no component-local `@keyframes`.
- **Copy is the cheapest delight** — product-specific and technical. Say what the product actually did
  ("Deployed to 24 edge locations"), never generic filler ("All done! 🎉") or AI-slop loading lines.
- **Never block** — each moment is `< 1s`, skippable, and carries a `motion-reduce:*` escape; it
  amplifies the result, never gates or obscures it.
- **Nothing playful on a critical error path** — be calm and clear, not cute.

## Hard rules

- Do not re-teach token sets here — name the axis, defer the allowed values to the owning skill.
- Do not sprinkle delight — at most one or two earned moments (completion / first-time / recovery /
  milestone), token motion + product-specific copy only; no new lib, no confetti, no `@keyframes`.
- Do not sign off a screen with a missing interactive or async state — that is what this pass exists
  to catch.
- Do not add polish that the structure skills haven't cleared: a missing empty/error state is a
  `/webkit-ux-heuristics` gap, not something a taste pass can paper over.

## Review output

For `/webkit-impeccable-polish <file>`, group issues by checklist item. Each:

```
✗ SomeCard.vue:42  <button class="… focus:outline-none">  (no visible focus state)
  why: keyboard users lose track of focus — fails state completeness (item 3).
  fix: add a focus-visible ring using the ring token (see /webkit-baseline-ui for the exact token).
```

End with a verdict: `finished` or `N issues across <items>`.

## Definition of Done

- [ ] Type scale and spacing rhythm coherent across the whole screen (values per `/webkit-baseline-ui`).
- [ ] Every interactive state present; every async state present (`/webkit-ui-states`); selected/current visible.
- [ ] Radii and elevation coherent per role; one accent per view; no unrequested ornament.
- [ ] Motion reduced-motion-safe; the screen holds in both themes (verified, not assumed).
- [ ] Delight, if any, is at most one or two earned moments — token motion + product-specific copy, `< 1s`, skippable, `motion-reduce:*`-safe, no new lib/confetti.
