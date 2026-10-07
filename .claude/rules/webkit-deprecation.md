# Rule: deprecate a public part before removing it — mark, keep one major cycle, then delete

Removing or renaming a public part of a component this project authors — the component
itself, a prop, an event, a slot — is a **breaking change** for everyone who uses it. The
lifecycle is fixed: mark the part `@deprecated` (naming its replacement and its removal
version), ship it working for **at least one major version**, then remove it in a
subsequent major. The `webkit/authoring-standards` ESLint rule blocks a **bare
`@deprecated`** tag as an error; the cycle length and the version bumps are convention,
upheld in code review.

## Do

- Write the tag as `@deprecated since <version> — use <replacement> instead. Removed in
<version>.` Both the replacement and the removal version are required — a deprecation
  with no exit is a warning that never ends.
- Ship the marking as a `patch`/`minor`; ship the removal as a **major** (`!` on the
  commit type or a `BREAKING CHANGE:` footer).
- Keep the deprecated part **fully working** during its cycle — annotate it, do not
  change its behavior.
- When `webkit/no-deprecated-component` flags an import of a webkit component marked
  deprecated in the catalog, migrate to the named replacement before the next major.

## Do not

- Never remove or rename a public part without a deprecation cycle first — no silent
  removals.
- Never write a bare `@deprecated` (no replacement, no removal version) — blocked by
  `webkit/authoring-standards`.
- Never change a deprecated part's behavior during its cycle — annotate, don't mutate.
- Never ship a removal as anything other than a major, breaking release.
- Never keep building on a deprecated webkit part once the replacement is named — the
  lint warning is the migration window, not noise to suppress.

## Correct

<!-- prettier-ignore -->
```ts
interface Props {
  /**
   * @deprecated since 4.2 — use `kind` instead. Removed in 5.0.
   */
  variant?: string
  /** Visual variant. */
  kind?: ButtonKind
}
```

Deprecating a whole component:

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  /** @deprecated since 4.2 — use `EmptyState` instead. Removed in 5.0. */
  defineOptions({ name: 'EmptyResultsBlock' })
</script>
```

## Wrong

<!-- prettier-ignore -->
```ts
interface Props {
  /** @deprecated */ // bare tag: no replacement, no removal version — blocked by lint
  variant?: string
}
```

<!-- prettier-ignore -->
```ts
// Renamed `variant` to `kind` outright in a minor release — a silent breaking
// change. Consumers get no migration window and no machine-readable warning.
interface Props {
  kind?: ButtonKind
}
```
