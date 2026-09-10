# Rule: typed `defineEmits`, kebab-case names, event-first activation payloads

Events are declared with the **type-only `defineEmits`** form (tuple type-literal), named in
**kebab-case**, and split into two kinds with two payload shapes. **Model/value events**
(`update:<name>`, `value-change`, `sort`) carry the new value only. **Activation events**
(click, select, remove, `item-click`, `row-click`) carry the DOM event **first** and, when
the activation targets a specific subject, that subject **second**: `(event, item)`. The
consumer of an event must be able to tell **what happened** (the event) and **which thing
it happened to** (the item) from the payload alone.

The `webkit/authoring-standards` ESLint rule blocks the runtime array form
(`defineEmits([...])` must become the typed form) and a hand-rolled `modelValue` prop +
`update:modelValue` emit (use `defineModel` instead). Event naming and payload order are
convention, upheld in code review.

## Do

- Declare emits with `const emit = defineEmits<{ 'item-click': [event: MouseEvent, item: MenuItem] }>()` —
  the tuple type-literal form, so every payload is typed.
- Name every event in **kebab-case**: `item-click`, `row-click`, `value-change`.
- Emit activation events as `(event, item?)` — DOM event first, subject second. A lone
  control with no distinct subject (a plain button, a close control) emits `(event)` alone.
- Pick the smallest `item` that says which element was activated: the bound data object,
  or its `value` / `label` / `href` when there is no richer model.
- Use `defineModel` for any two-way value; keep `update:<name>` in `defineEmits` only for
  a one-way "changed" signal that is not a `v-model`.
- Keep model/value events value-only: `emit('update:value', next)`, `emit('sort', direction)` —
  no DOM event in the payload.

## Do not

- Never use the runtime array form `defineEmits(['click'])` — blocked by lint; payloads
  lose their types.
- Never declare a manual `modelValue` prop plus `update:modelValue` emit — blocked by
  lint; `defineModel` expresses the two-way value.
- Never name an event in camelCase (`itemClick`) or fake it with an `on`-prefixed prop
  (`onValueChange`) — declare the event and let consumers bind `@item-click`.
- Never emit the subject before the event (`(item, event)`) or bury the event inside a
  payload object (`{ value, event }`) — the event is always the first positional argument.
- Never emit a redundant `<x>-change` alongside `update:<x>` / `v-model`. A genuinely
  distinct commit event (e.g. commit-on-blur) is a bare `change`, never `<x>-change`.
- Never add a DOM event to a model/value event (`update:*`, `value-change`, `sort`) —
  those emit their value only.
- Never pass the same datum both positionally and inside a payload object.

## Correct

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  interface MenuItem {
    label: string
    href?: string
  }

  // two-way value: a model, not a manual emit pair
  const value = defineModel<string>('value')

  const emit = defineEmits<{
    // activation with a subject — event first, item second
    'item-click': [event: MouseEvent, item: MenuItem]
    // lone control — event only
    close: [event: MouseEvent]
    // one-way value event — the new value, no DOM event
    sort: [direction: 'asc' | 'desc']
  }>()

  function onItemClick(event: MouseEvent, item: MenuItem) {
    emit('item-click', event, item)
  }
</script>
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  // runtime array form — untyped payloads (blocked by lint)
  const emit = defineEmits(['itemClick', 'update:modelValue'])

  // manual v-model pair instead of defineModel (blocked by lint)
  const props = defineProps<{ modelValue: string }>()

  function onItemClick(event: MouseEvent, item: { label: string }) {
    emit('itemClick', item, event) // camelCase name, subject before event
    emit('update:modelValue', { value: item.label, event }) // event buried in the payload
  }
</script>
```
