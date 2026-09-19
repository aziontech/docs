# Rule: motion uses theme animation tokens only — never hardcoded timing or a lib

Animation in UI built on `@aziontech/webkit` is constrained to the design system's motion
vocabulary: the `animate-*` utilities and the `duration-*` / `ease-*` / `curve` tokens from
`@aziontech/theme`. Motion confirms an action or guides attention — it never decorates — and it
always has a reduced-motion escape. This is the invariant behind the `/webkit-motion-polish` skill
(which is the how-to); this rule is the constraint.

## Do

- Animate with the catalogued `animate-*` utilities (`animate-fade-in`, `animate-slide-down`,
  `animate-popup-scale-in/out`, …) — discover the catalog via the webkit MCP or
  `node_modules/@aziontech/theme`. For `animate-popup-scale-*`, set `--popup-origin` per instance.
- Take timing only from tokens: `duration-fast-01/02`, `duration-moderate-01/02`,
  `duration-slow-01/02`; curves `ease-productive-entrance/exit`, `ease-expressive-entrance/exit`.
- Animate **only compositor props** — `transform` and `opacity` (plus the catalogued
  `animate-slide-down` for disclosure height). Interaction feedback is ≤ `duration-moderate-01`
  (150ms): `ease-out` on entrance, `ease-in` on exit.
- Pair **every** motion-bearing class with a `motion-reduce:*` escape on the same class string:
  `motion-reduce:transition-none` / `motion-reduce:transform-none` / `motion-reduce:animate-none`.
- For `data-state="open|closed"` overlay motion, read `duration` + `curve` from the tokens and emit
  the inline `transition` per phase; keep transform/opacity in classes, only timing inline.

## The panel recipe (sidebar / drawer / any v-if region)

A conditionally rendered region never animates by itself — wrap the `v-if` in a Vue `Transition`
and hand the enter/leave phases to the catalogued utilities. For lateral panels the pair is
`animate-slide-in-left` / `animate-slide-out-left` (right-anchored drawers use the `-right` pair):

```vue
<Transition
  enter-active-class="animate-slide-in-left motion-reduce:animate-none"
  leave-active-class="animate-slide-out-left motion-reduce:animate-none"
>
  <aside v-if="sidebarOpen">...</aside>
</Transition>
```

Content or backdrops appearing in place use `animate-fade-in` / `animate-fade-out` in the same
shape; vertical disclosure uses `animate-slide-down`. Ask the webkit MCP
(`list_tokens` with category `animations`) for every utility, its timing, and when to use it.

## Never

- A hardcoded duration (`duration-[180ms]`, `transition: opacity 200ms`) or an inline
  `ease-[cubic-bezier(...)]` — the values live in the theme tokens.
- Animating layout props (`width`, `height`, `top`, `left`, `margin`, `padding`) — they thrash
  layout (exception: the catalogued `animate-slide-down`).
- A component-local `@keyframes`, or any external animation library (`gsap`, `framer-motion`,
  `motion`, `@vueuse/motion`, `@formkit/auto-animate`, lottie, popmotion). Use the utilities above +
  Vue `<Transition>` / `<TransitionGroup>`.
- A motion class with no `motion-reduce:*` fallback.

## Enforcement

- The mandatory `motion-reduce:*` escape overlaps the shipped `webkit-accessibility` rule (motion is
  an a11y concern) and is verified at runtime by the `webkit-ui-verifier` agent (it exercises
  `prefers-reduced-motion`).
- The no-external-lib constraint holds because the forbidden packages are never installed — an import
  fails the build.
- The token discipline (no hardcoded ms / inline `cubic-bezier` / layout-prop animation) is the
  `/webkit-motion-polish` review pass; where a stylelint rule can catch a raw `cubic-bezier(` or a
  bare `transition: all`, wire it as the mechanical floor. Suggestion is not the ceiling: what a lint
  can block, block.

### Known `no-hardcoded-motion` gaps (review still owns these)

The lint is a heuristic over class and style strings; three shapes are known to slip past it and
stay a review concern:

- **Tailwind arbitrary properties** bypass the timing check: in `[transition:opacity_200ms]` the
  underscore defeats the word boundary, and `[animation-delay:2s]` sits outside the `animation:`
  prefix — while `[transition:all]` is caught.
- **Tailwind v4's dynamic numeric scale**: `duration-937` passes (only the bracketed
  `duration-[937ms]` form is flagged).
- **The `motion-reduce:` pairing check reads only the static `class` attribute** — when the escape
  lives in a coexisting bound `:class` fragment, the static-side motion class is flagged even
  though the element is correctly paired.
