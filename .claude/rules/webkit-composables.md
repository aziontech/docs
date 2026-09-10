# Rule: composables — one shape, `readonly` outward, cleanup on scope dispose

A composable (`useXxx`) is a public building block: imported, typed, and relied on across
the app, so it follows one contract — a predictable surface, a predictable lifetime, and
no surprises on destructure. The `webkit/authoring-standards` ESLint rule blocks the two
mechanical violations (returning a `reactive()` object, authoring the file as `.js`); the
rest of the contract is convention, enforced in review.

## Do

- Name it `useXxx`, one composable per file, kebab filename, always `.ts`
  (`use-controllable.ts`). Co-locate it in the component's own `composables/` folder when
  it is specific to that component; put shared ones in your project's `src/composables/`.
- Return an **object of refs / computed / functions**. Wrap reactive state that escapes
  in `readonly()`; expose writes only through returned setter functions.
- Accept arguments as `MaybeRefOrGetter<T>` and resolve them with `toValue()`, so a
  caller may pass a ref, a getter, or a raw value.
- Use generics and an **explicit return type**; export the return type when a consumer
  needs to hold it (`UseControllableReturn<T>`).
- Tear down everything you start: remove every listener, timer, `requestAnimationFrame`,
  and observer in `onScopeDispose` — it also fires inside a detached `effectScope()`,
  unlike `onUnmounted`, so the composable never leaks between tests.
- Call lifecycle composables **synchronously in `setup`** — Vue can only bind lifecycle
  hooks during synchronous setup.
- Use `useId()` for generated ids (SSR-stable). Reuse VueUse primitives
  (`useEventListener`, `onClickOutside`) — they already own their cleanup.
- Make instance vs singleton deliberate: state created **inside** the function is
  per-instance; state at **module scope** is a shared singleton — say which one it is in
  the name and the doc comment, never by accident of where a `ref` was declared.
- For state shared root-to-leaf in a compound component, write a context composable: a
  typed `InjectionKey<T>` next to the root, and a `useXxxContext()` that injects and
  **throws a clear error when used outside its provider**. Only the root calls
  `provide()`; leaves only inject through the composable.

## Do not

- Never return a `reactive()` object — destructuring loses reactivity. Blocked by lint.
- Never author a composable as `.js` — consumers need the derivable return type. Blocked
  by lint.
- Never expose mutable state outward, and never accept a `reactive` object as an
  argument — `readonly()` out, `MaybeRefOrGetter` + `toValue()` in.
- Never use `any` or omit the return type.
- Never register a listener/timer/observer without `onScopeDispose` cleanup (or a VueUse
  primitive that owns it).
- Never call a lifecycle composable after an `await` or outside `setup`.
- Never roll your own id counter — use `useId()`.
- Never `provide()` from anything other than a context composable invoked at a component
  root.
- Never mix data fetching, HTTP clients, or store logic into a UI composable — that
  belongs in your data layer; components reach loading/empty/error states through props.

## Correct

<!-- prettier-ignore -->
```ts
// use-controllable.ts — pure, per-instance, readonly outward
export interface UseControllableReturn<T> {
  value: Readonly<Ref<T>>
  setValue: (next: T) => void
}

export function useControllable<T>(
  modelValue: MaybeRefOrGetter<T | undefined>,
  fallback: T,
  emit: (value: T) => void
): UseControllableReturn<T> {
  const internal = ref(fallback) as Ref<T>
  const value = computed(() => toValue(modelValue) ?? internal.value)
  const setValue = (next: T) => {
    internal.value = next
    emit(next)
  }
  return { value: readonly(value) as Readonly<Ref<T>>, setValue }
}
```

## Wrong

<!-- prettier-ignore -->
```ts
// Returns reactive() (destructure loses reactivity), exposes mutable
// state directly, and registers a listener that is never removed.
export function useDropdown(open) {
  const state = reactive({ open })
  window.addEventListener('keydown', onKeydown)
  return state
}
```
