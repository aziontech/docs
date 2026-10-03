# Rule: import webkit for the smallest bundle

Every component is importable in a way that ships only what you render. Choose the narrow path.

## Prefer the tree-shakeable path

Composition components (Table, Dropdown, Dialog, and similar) expose two roots:

- The compound path — `@aziontech/webkit/table` — attaches every sub-component for dot-notation (`Table.Row`, `Table.Cell`). Convenient, but a bundler keeps all the sub-components even if you only render the root.
- The `-root` path — `@aziontech/webkit/table-root` — is the standalone root with nothing attached.

Rules:

- If you only need the root, import the `-root` path.
- If you need a few sub-components, import each on its own subpath (`@aziontech/webkit/table-row`) instead of pulling the whole compound.
- Reach for the compound path only when the dot-notation ergonomics are worth shipping the whole set.

```js
// Only the root — smallest:
import Table from '@aziontech/webkit/table-root'

// A specific sub-component — still tree-shakeable:
import TableRow from '@aziontech/webkit/table-row'

// The full compound — convenient, heavier:
import Table from '@aziontech/webkit/table'
```

## Icons: import the font once, use CSS classes

- `@aziontech/icons` is an icon font. Import it once for its side effects (`import '@aziontech/icons'`, near the app entry) and reference icons by their CSS class.
- Do not import a default/namespace binding (`import Icons from '@aziontech/icons'`) — the entry is CSS; a binding is meaningless and usually a mistake.

## Lazy-load heavy overlays

Dialogs, drawers, and tables are often off-screen at first paint. Load them on demand:

```js
import { defineAsyncComponent } from 'vue'

const Dialog = defineAsyncComponent(() => import('@aziontech/webkit/dialog'))
```

This keeps the overlay out of the initial bundle until it is actually opened.
