---
name: webkit-ds-adoption
description: Migrating an existing app onto @aziontech/webkit is a sequence of small, shippable stories in dependency order — never a big-bang rewrite. Use when adopting webkit into a legacy screen or app: decompose the migration, check the catalog before building custom, track a coverage scorecard per screen, and file gaps instead of forking. Drives each screen from custom toward webkit, story by story.
status: active
last_updated: 2026-07-20
scope: general
enforced_by: [webkit-prefer-over-custom, webkit-prop-vocabulary, webkit-style-override, review]
---

# Skill: webkit-ds-adoption

## Purpose

You rarely adopt a design system all at once — you adopt it one screen, one primitive at a time,
without freezing feature work. This skill is the **method for that migration**: how to break an
existing app's move onto `@aziontech/webkit` into small stories that each ship on their own, in an
order where nothing depends on work that hasn't landed yet. The goal is not a rewrite; it is that
every screen you touch comes out with **more webkit and less hand-rolled UI than it went in with**,
and that the parts you replace stay replaced. The mechanics of _how_ to import and token a component
live in **webkit-usage** — this skill is about _what to migrate, in what order, and how far_.

## How to use

- `/webkit-ds-adoption` — plan and execute the next migration story on the code in this conversation:
  pick the smallest shippable slice in dependency order and do it.
- `/webkit-ds-adoption <screen-or-dir>` — audit the target, produce its **coverage scorecard**
  (webkit vs custom), and propose the migration stories in order.

## Check the catalog before you build anything

The default is **compose webkit**; writing a custom component is the **exception, and it must be
justified**. Before you write UI — new or migrated — check whether the system already ships it:

- Ask the **webkit MCP** — `suggest_component` in plain words ("modal", "data table", "tag input").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

If a component exists, use it — compose it, pass its props, fill its slots. A hand-rolled button,
modal, or table when webkit ships one is not a migration; it is new debt.

## Migrate in small stories, in dependency order

Never a big-bang rewrite. Decompose the migration into slices that each ship independently, bottom-up:

1. **Wire the dependency + tokens.** Add `@aziontech/webkit` / `@aziontech/theme` / `@aziontech/icons`
   and import theme + icons once at the app entry (see webkit-usage). Nothing renders differently yet —
   this is the foundation every later story stands on.
2. **Replace primitives.** Swap the leaf controls — `button`, `input`, `modal`, `select`, `checkbox` —
   for their webkit equivalents, one type at a time. Each swap is a small, reviewable, shippable PR.
3. **Replace composite patterns.** Once the primitives are webkit, migrate the assemblies built on them
   — a data table, a form section, a filter bar, an empty state — to the webkit composite (or compose it
   from its sub-components).
4. **Remove dead custom CSS.** After a pattern is on webkit, delete the legacy styles, class presets, and
   one-off components it replaced. The migration isn't done until the old code is gone — a half-migrated
   screen carries both systems.

The order matters: composites depend on primitives, primitives depend on the wired dependency. Doing them
out of order means redoing work.

## Coverage scorecard

Track adoption as a **percentage per screen**: of the interactive/structural elements a screen renders,
how many come from webkit vs are still hand-rolled. Drive it up one story at a time.

Eyeball it fast — count the `@aziontech/webkit/*` imports actually rendered against the hand-rolled
interactive elements still in the template (a bare `<button>`, a `<div @click>`, a custom `<Modal>`, a
`<table>` you styled yourself, a local `MyInput.vue`). `webkit / (webkit + custom)` is the screen's score.

```
WorkloadsList.vue   webkit 7 / custom 4  → 64%   (custom: <table>, MySpinner, 2× <button>)
SettingsForm.vue    webkit 2 / custom 9  → 18%   (custom: MyInput ×5, MyModal, <select> ×3)
```

A screen doesn't reach 100% by accident — you get there by closing the named custom items story by story.
The **webkit-adoption-auditor** agent produces this scorecard automatically across a screen or directory;
run it to get the numbers and the per-item breakdown without counting by hand.

## Gap, not fork

When webkit genuinely lacks what you need, **do not fork it and do not hand-roll a near-duplicate** —
either creates a second source of truth that drifts from the system forever.

- First, try to **compose it from existing sub-components** (a compound's `Root` + parts) or configure a
  close component — webkit covers more than the top-level name suggests.
- If it truly isn't there, **open a gap/request against the design system** so the fix lands **once, for
  everyone** — and build the smallest bridge you need meanwhile, using theme tokens, kept composable with
  webkit so it's trivial to replace when the real component ships.

A fork looks faster today and costs the whole team every upgrade after. The gap is the cheaper path.

## Map foreign patterns, don't carry them

A legacy component's API and look are not the target — webkit's are. As you migrate:

- **Rename props to the webkit vocabulary** — `variant`→`kind`, `sm/md/lg`→`small/medium/large`,
  `onValueChange`→`@update`. Don't preserve the old names "to reduce churn"; map them once, here.
- **Replace hex/rgb with theme tokens** — `#1e40af` → `var(--primary)`, custom spacing → `var(--spacing-*)`.
  See webkit-usage for the import/token mechanics.
- **Migrate the look to the tokens — never restyle a webkit component to match the legacy look.** If the
  old button was a different blue, the fix is the token system's blue, not overriding webkit's to match a
  color you're retiring. The point of adoption is that the screen ends up looking like the product.

## Migration story breakdown (example)

`WorkloadsList.vue` today: a hand-styled `<table>`, a `MySpinner`, a custom `<Modal>` for delete, and two
bare `<button>`s — scorecard **~40% webkit**. Broken into shippable stories:

1. **Story A — deps + tokens** (if not already done app-wide): dependency wired, theme/icons imported.
2. **Story B — buttons**: the two `<button>`s → `@aziontech/webkit/button` with `kind`/`size`. Ships alone.
3. **Story C — loading + empty**: `MySpinner` → `Skeleton`; add the missing `EmptyState` (see webkit-ui-states).
4. **Story D — delete modal**: custom `<Modal>` → `@aziontech/webkit/dialog`, focus-trap for free.
5. **Story E — the table**: hand-styled `<table>` → `@aziontech/webkit/table` (compound or data-driven).
6. **Story F — cleanup**: delete the legacy table CSS, `MySpinner.vue`, `MyModal.vue`. Scorecard **100%**.

Six PRs, each shippable, each raising the score — no rewrite, no long-lived branch.

## Hard rules

- Never a big-bang rewrite — decompose into small stories in dependency order (deps → primitives →
  composites → cleanup).
- Check the catalog/MCP before writing any component; a custom build is a justified exception, not the default.
- When webkit lacks something, file a gap or compose from sub-components — never fork or hand-roll a
  near-duplicate.
- Map legacy props to the webkit vocabulary and legacy colors to theme tokens; never carry the old API over.
- Never restyle a webkit component to match the legacy look — migrate the look to the token system.
- A story isn't done until the custom code it replaced is deleted; don't leave both systems on one screen.

## Review output

For `/webkit-ds-adoption <screen-or-dir>`, lead with the scorecard, then the ordered stories:

```
Screen: WorkloadsList.vue — webkit 4 / custom 6 → 40%
  custom still present: <table> (styled), MySpinner, MyModal, 2× <button>

stories (ship in order):
  1. buttons → @aziontech/webkit/button                    (+2)
  2. MySpinner → Skeleton, add EmptyState                   (+2)
  3. MyModal → @aziontech/webkit/dialog                     (+1)
  4. <table> → @aziontech/webkit/table; delete legacy CSS   (+1, cleanup)
```

End with: `target 100% in N stories` or, if already fully webkit, `adopted — no custom UI left`.

## Enforcement

Paired with a lint and a human. The **webkit-prefer-over-custom** rule flags UI hand-rolled when webkit
ships an equivalent (a custom button/modal/table, or a foreign component library for something webkit
covers) — it steers every new line toward the system so the migration doesn't regress behind you. What it
can't judge — whether a slice is the _smallest shippable story_, whether a claimed gap is real, whether a
fork snuck in as "composition" — a reviewer confirms. The **webkit-adoption-auditor** agent is the
executable companion: it generates the coverage scorecard on demand, so progress is a number, not a feeling.

## Definition of Done

- [ ] The migration is a sequence of small shippable stories in dependency order — no big-bang branch.
- [ ] Every component was checked against the catalog/MCP first; any custom build is justified in writing.
- [ ] Coverage scorecard captured per screen and rising story by story (or produced via webkit-adoption-auditor).
- [ ] Missing pieces filed as design-system gaps or composed from sub-components — nothing forked.
- [ ] Legacy props mapped to the webkit vocabulary, legacy colors to theme tokens; look migrated, not restyled.
- [ ] Each landed story deleted the custom code it replaced — no screen left running both systems.
