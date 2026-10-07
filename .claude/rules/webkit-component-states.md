# Rule: render every component state through data-\* and webkit's state components

Every interactive component has a **state surface** — the set of conditions it must visibly
handle. webkit components own the rendering of their states; your screen supplies only the
**trigger** (a boolean prop, or the async data your app owns). The same applies to components
you author in this project: decide which states each one handles and render them through
`data-*` attributes and webkit's own state components (`Skeleton`, `EmptyState`,
`HelperText`) — never an ad-hoc spinner or "no results" string improvised per screen.
This pattern is convention + code review in this project; the tokens used inside state
styling are still checked mechanically by the stylelint config and the
`webkit/no-hardcoded-color` ESLint rule.

The canonical states and how each renders:

| State             | Trigger                   | How it renders                                                        |
| ----------------- | ------------------------- | --------------------------------------------------------------------- |
| `disabled`        | `disabled` prop           | `data-disabled` + disabled tokens; not focusable                      |
| `loading`         | `loading` prop            | `data-loading` + `Skeleton` / spinner affordance; interaction blocked |
| `invalid`         | validation (form field)   | `data-invalid` + error tokens + a `HelperText` message                |
| `readonly`        | `readonly` prop           | `data-readonly`; value visible, not editable                          |
| `empty`           | no data (data-driven)     | the `EmptyState` component, not a hand-written "no results" string    |
| `error`           | load/action failure       | an error slot / message, never a bare thrown error                    |
| `open` / `closed` | `open` (+ `v-model:open`) | `data-state="open"` / `data-state="closed"` (overlays)                |

Not every component has every state — a button has `disabled` + `loading`; a data table adds
`empty` + `error`. Handle exactly the states the component owns, and handle all of them.

## Do

- Switch state styling with a `data-*` attribute on the element, styled by a Tailwind
  `data-[...]:` variant inline in its `class` — the state decision lives in the markup.
- Reuse the shipped state components: `Skeleton` for loading placeholders, `EmptyState` for
  no-data, `HelperText` for validation messages.
- Keep the trigger in the app: fetch data in your page/store/composable and pass `loading`,
  `items`, or `error` down as props. Components render states; they do not fetch.
- When authoring a local component, list its state surface up front and render every state —
  a silent empty list or an invisible error is a missing state, not a smaller component.

## Do not

- Never render a state with a `:class` ternary (`loading ? 'opacity-80' : ''`) — use
  `data-loading` + a `data-[loading]:` variant.
- Never hand-roll a spinner, shimmer, or "Nothing here" message that `Skeleton` /
  `EmptyState` already provides.
- Never fetch data or own async state inside a shared component just to drive its states —
  the trigger always comes from the consumer.
- Never ship a data-driven view that only handles the happy path — `loading`, `empty`, and
  `error` are part of the component, not per-screen afterthoughts.

## Correct

<!-- prettier-ignore -->
```html
<!-- the component renders its states; the page only supplies the trigger -->
<div
  :data-loading="loading || null"
  :data-disabled="disabled || null"
  class="flex flex-col gap-(--spacing-sm)
         data-[loading]:pointer-events-none
         data-[disabled]:cursor-not-allowed"
>
  <Skeleton v-if="loading" kind="shape" width="100%" height="48px" />
  <EmptyState v-else-if="items.length === 0" title="No results" />
  <slot v-else />
</div>
```

## Wrong

<!-- prettier-ignore -->
```html
<!-- :class ternary, hand-rolled placeholder and empty string, fetching inside -->
<div :class="loading ? 'opacity-50' : ''">
  <span v-if="loading" class="spinner" />
  <p v-else-if="items.length === 0">Nothing here</p>
  <slot v-else />
</div>
```
