# Rule: building your own Vue components — the construction standards

When this project builds a component of its own (a screen part the design system does not
ship), it follows the same construction standards the design system's components are built
with. One pattern per concern — follow ✅, avoid ❌.

| Pattern         | ❌ Avoid                                                        | ✅ Do                                                                                                           |
| --------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Two-way value   | `defineProps({ modelValue })` + `emit('update:modelValue')`     | `const model = defineModel<string>()`                                                                           |
| Props           | runtime `defineProps({ kind: { type: String } })` · `any`       | typed `withDefaults(defineProps<Props>(), {…})` + JSDoc per prop                                                |
| Prop vocabulary | `variant` · `sm/md/lg` · `isDisabled` · `closeable`             | `kind` · `small/medium/large` · `disabled` · `dismissible`                                                      |
| Emits           | `defineEmits(['click'])` · `emit('click', item)`                | typed `defineEmits<{ 'item-click': [e, item] }>()` — DOM event first                                            |
| Slots           | `<slot/>` with no declaration                                   | typed `defineSlots<{ default(): unknown }>()`                                                                   |
| Composables     | `return reactive({…})` · listeners with no cleanup              | `return { value: readonly(v), set }` · args via `toValue()` · cleanup in `onScopeDispose`                       |
| Styling         | `const kindClasses = {…}` · `<style>` blocks · hex/palette      | utilities inline on the root, variants via `data-*` + theme tokens                                              |
| Structure       | one file, many components · random script order                 | one component per folder/file · fixed `<script setup>` order (options → props → emits → models → slots → state) |
| Root element    | wrapper `<div>` swallowing attrs · `as` prop · `class` in props | own the root · `inheritAttrs: false` + `v-bind="$attrs"` · polymorphism via `href`                              |
| States          | ad-hoc spinner / "no results" string                            | `data-*` states + `@aziontech/webkit/skeleton` / `empty-state`                                                  |
| Accessibility   | `<div @click>` · ids by counter                                 | native elements · `focus-visible` · `useId()` · `motion-reduce:` on every animation                             |
| data-testid     | none, or duplicated                                             | root `:data-testid` with a stable, derived fallback                                                             |
| Deprecation     | silent rename/removal                                           | `@deprecated` naming the replacement + version, then remove in a major                                          |

## The full rules (one per pattern)

Each row above is a one-line digest; the full rule (with examples) ships alongside this
file: `webkit-v-model.md`, `webkit-props.md`, `webkit-prop-vocabulary.md`,
`webkit-emits.md`, `webkit-slots.md`, `webkit-composables.md`, `webkit-styling.md`,
`webkit-component-structure.md`, `webkit-root-element.md`, `webkit-component-states.md`,
`webkit-accessibility.md`, `webkit-testid.md`, `webkit-deprecation.md`.

## Notes

- These are the design system's `scope: general` standards — they apply to any Vue
  component, not only to webkit's. The mechanizable ones are **blocked** by the
  `webkit/authoring-standards` ESLint rule (error) at commit and in CI; the rest are
  convention + review.
- Before building, check the catalog first (`suggest_component` on the `webkit` MCP or
  `node_modules/@aziontech/webkit/catalog.json`) — the component may already exist.
