---
name: webkit-motion-polish
description: Make motion smooth using only @aziontech/theme animate tokens — animate-* utilities, duration-*/ease-*/curve tokens, compositor-props-only, ≤150ms interaction feedback, and a mandatory motion-reduce escape on every motion class. No external animation library, no inline cubic-bezier, no hardcoded ms.
status: active
last_updated: 2026-08-12
scope: general
enforced_by: [webkit-motion, webkit-accessibility, ui-verify]
---

# Skill: webkit-motion-polish

## Purpose

Apply motion that feels native to the design system: token-driven, fast, accessible, and limited to
properties the compositor can animate cheaply. Motion should confirm an action or guide attention —
never decorate.

## How to use

- `/webkit-motion-polish`
  Apply the motion constraints below to any animated UI in this conversation.
- `/webkit-motion-polish <file>`
  Review the file's animations and output, per violation:
  - the exact line / snippet (quoted),
  - why it's wrong (1 short sentence),
  - the token-based fix.

## How to find the tokens

Never guess a duration, curve, or utility name. Resolve them the same way every time:

- Ask the **webkit MCP** — it lists the `animate-*` utilities and the `duration-*` / `ease-*` / `curve`
  tokens that ship in `@aziontech/theme`.
- If a utility or token name is not one the MCP lists, it does not exist — do not invent a
  `duration-[…]` or an inline `cubic-bezier`.

## When to invoke

- After structure (`webkit-ux-heuristics`) and baseline (`webkit-baseline-ui`) are sound.
- Adding entrances/exits, hover/active feedback, or overlay open/close motion.
- The user asks to "make it smooth", "add a transition", "animate this".

## Constraints

### Use only the catalogued utilities

The `animate-*` utilities from the animation token catalog (listed by the webkit MCP) — they ship with
`motion-safe` / `motion-reduce` variants:

| Utility                                              | Behavior                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| `animate-fade-in` / `animate-fade-out`               | opacity in / out                                                 |
| `animate-slide-down`                                 | height 0 → auto (the one catalogued height animation — see note) |
| `animate-popup-scale-in` / `animate-popup-scale-out` | scale + fade for popovers/menus                                  |
| `animate-slide-in-left` / `animate-slide-out-left`   | left-anchored panel enter/leave (sidebar, nav drawer)            |
| `animate-slide-in-right` / `animate-slide-out-right` | right-anchored panel enter/leave (settings/detail drawer)        |
| `animate-blink`                                      | caret/blink                                                      |
| `animate-highlight-fade`                             | row-flash highlight                                              |

For `animate-popup-scale-in/out`, set `--popup-origin` per instance to match the trigger anchor.

### The panel recipe (sidebar / drawer / any v-if region)

A conditionally rendered region never animates by itself — wrap the `v-if` in a Vue `Transition`
and hand the phases to the catalogued pair:

```vue
<Transition
  enter-active-class="animate-slide-in-left motion-reduce:animate-none"
  leave-active-class="animate-slide-out-left motion-reduce:animate-none"
>
  <aside v-if="sidebarOpen">...</aside>
</Transition>
```

Same shape with `animate-fade-in/out` for in-place content and backdrops, and
`animate-slide-down` for vertical disclosure.

### Size transitions — the two sanctioned layout exceptions

A box whose content changes (a form that swaps steps, a chip that gains a value, a panel that
drills into a sub-level) **snaps** to its new size. That snap is the glitch: it reads as one
element being replaced by a different one rather than as the same element answering. Neither case
has a catalogued `animate-*` — a keyframe cannot know the two heights — so both are transitions,
and both are allowed only in the exact shapes below.

#### A. Height — the box follows its content

CSS cannot interpolate to or from `height: auto`, and `auto` is what the box must be at rest: a
height pinned in JS stops responding to a resize, a late-loading font, or a validation line
appearing. So height is measured and pinned **only for the length of the move**, then released.

Two ways to drive it. Use the **observer** when the content resizes continuously (a field appears,
a Skeleton swaps for a button):

```js
// The measured element is INSIDE the one being sized and never gets a height of
// its own — otherwise the wrapper animating to it feeds straight back into the read.
const cardContent = ref(null)
const cardHeight = ref(0)
let observer = null

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    cardHeight.value = Math.round(entry.contentRect.height)
  })
  observer.observe(cardContent.value)
})
onBeforeUnmount(() => observer?.disconnect())
```

```vue
<!-- Padding lives OUTSIDE the sized box: the read is content-box, so padding on the
     animated element is counted out of the height it travels to and clips by 2× the step. -->
<div class="p-(--spacing-lg)">
  <div
    :style="cardHeight ? { height: `${cardHeight}px` } : undefined"
    :data-resizing="resizing || null"
    class="transition-[height] duration-moderate-02 ease-productive-entrance data-[resizing]:overflow-hidden motion-reduce:transition-none"
  >
    <div ref="cardContent"><!-- never sized --></div>
  </div>
</div>
```

Use the **measure-mutate-measure** form when the change is discrete (a wizard step, a panel level):

```js
const from = node.offsetHeight // still auto — this is what the user is looking at
mutate()
await nextTick()
const to = node.offsetHeight // new content, STILL auto, not yet painted
if (to === from) return // nothing to animate; height stays auto

height.value = `${from}px` // pin the old value…
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    height.value = `${to}px` // …let it paint, then travel: px → px interpolates
  })
)
// release to '' (auto) on transitionend, plus a timeout fallback so an interrupted
// move can never leave the height pinned
```

Order is load-bearing. The obvious shortcut — pin the old height first, _then_ read
`scrollHeight` — silently breaks every **shrink**: with a height pinned, `scrollHeight` returns
the greater of content and box, so a step that got shorter reports the old height and never moves.
Measure while still `auto` and growing and shrinking behave the same.

- **`overflow-hidden` only while moving** (`data-[resizing]:overflow-hidden`). Permanently on, it
  shaves the focus ring (`ring-2` + `ring-offset-2` = 4px) off any control flush with the content
  edge. Permanently off, an out-of-flow leaving block hangs below the box as it shrinks.
- **Always release on `transitionend` AND a fallback timer** (longest duration + a frame or two).
  An interrupted or unmounted move never fires `transitionend`, and a box stuck at a pinned height
  is worse than one that snapped.
- **Re-entrancy:** land the run in flight before measuring again, or `from` is a value the previous
  transition is still easing through.

#### B. Width — grow a value into a `0fr → 1fr` grid track

A grid track cannot be transitioned from `auto`, but it **can** from `0fr` to `1fr`. That is the
whole recipe: put the appearing content in a single-column grid, animate the track, and let the
element's own `auto` width follow.

```vue
<span
  class="grid grid-cols-[0fr] transition-[grid-template-columns] duration-moderate-01 ease-productive-entrance data-[shown]:grid-cols-[1fr] motion-reduce:transition-none"
  :data-shown="applied || null"
>
  <!-- The clip is BARE. Padding on it survives the collapse (it is not content, so
       `min-width: 0` cannot shrink it) and leaves dead space in the empty state —
       so the gap and padding live on the row INSIDE, which is clipped with the text. -->
  <span class="min-w-0 overflow-hidden">
    <span class="flex min-w-0 items-center gap-(--spacing-xxs) whitespace-nowrap pl-(--spacing-xxs)">…</span>
  </span>
</span>
```

It only reads as growth if the element **keeps its DOM position**. A list that reorders when the
value is applied re-inserts the node, which discards the pending transition — see the glitch
catalog.

### Entrance choreography (first-paint screens)

A screen that is a composition — a form beside an illustration, a card beside a panel — assembles
from its parts instead of fading in as one flat block: each part travels in from **its own outer
edge**, one leading and the other a beat behind.

```js
const ENTER = `${duration['slow-01']} ${curve['expressive-entrance']}`
const leadStyle = { transition: `opacity ${ENTER}, translate ${ENTER}, transform ${ENTER}` }
const followStyle = { ...leadStyle, transitionDelay: duration['fast-01'] }

// TWO frames, not one. A single requestAnimationFrame can land in the frame the
// browser is already painting, so the from-state is never committed, there is no
// change left to interpolate, and the move snaps.
const entered = ref(false)
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => (entered.value = true)))
})
```

```vue
<div
  :data-entered="entered || null"
  :style="leadStyle"
  class="-translate-x-6 opacity-0 data-[entered]:translate-x-0 data-[entered]:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
>
```

- **`slow-01` + `expressive-entrance`, not the interaction budget.** A card- or console-sized object
  crossing real distance reads as confident at 400ms and as a twitch at 150. The ≤150ms rule governs
  _feedback_; this is a scene arriving. Keep it to first paint — never replay it on a step change.
- **Stagger, don't synchronise.** One `fast-01` between lead and follow. Simultaneous arrival reads
  as a slide transition; the offset reads as choreography.
- **Timing rides `style`, states ride `data-*`.** Tailwind cannot emit a per-state duration/easing
  from theme tokens, so the two `transition` declarations are inline (read from `duration` / `curve`
  — still never a literal) while the offsets and opacities stay in `data-[entered]:` classes.
- **Scale the offset to the element's relationship with the page edge.** A panel that _is_ the right
  edge travels a short step (a longer one opens a visible strip of bare canvas beside it on the way
  in); an element that runs off-page can travel further.
- **Direction carries meaning.** If two screens sit in a flow, enter each from the side it occupies
  in that flow, so moving between them reads as a direction rather than as two unrelated page loads.
- **Reduced motion kills it whole**: `transition: 'none'` in the style _and_ the
  `motion-reduce:translate-x-0 motion-reduce:opacity-100` landing classes, so the from-state is
  never what the user is left looking at.
- **The entrance belongs to the LAYOUT, not the screen.** If three steps share a shell, put the
  shell (and the entrance) on the parent route so it mounts once — the chrome holds still and only
  the card swaps. Give each step its own copy and every step change replays the 400ms slide, so the
  user reads three page loads where they only changed step.

### The two arrivals ship in the theme — do not hand-roll them

`@aziontech/theme` carries both entrances an app shell needs, as ordinary utilities. Use them; a
per-app copy is a copy that drifts, and the reasoning below is already baked into these.

| Utility                 | What it is for                                                                                                                                                                                                                                  | Where it goes                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `animate-page-enter`    | A page arriving on a route change. Travels in from the LEFT — navigation lives on that edge, so a page arriving from it reads as coming FROM the row that was clicked; a plain fade has no origin and a right-side arrival reads as going back. | The **content zone only**, keyed on the route path. Never the shell. |
| `animate-content-enter` | Content settling inside a page that is already on screen — a load resolving, a list swapping, a step changing. Rises a hair rather than travelling: the page is in place and only its contents changed.                                         | The block that changed.                                              |

```vue
<!-- the content zone, in the shell -->
<div :key="route.path" class="animate-page-enter motion-reduce:animate-none overflow-auto">
  <slot />
</div>

<!-- two columns assembling in reading order: lead, then follow one fast-01 behind -->
<aside class="animate-content-enter motion-reduce:animate-none">…</aside>
<section
  class="animate-content-enter motion-reduce:animate-none [--content-enter-delay:var(--transition-duration-fast-01)]"
>…</section>
```

- **`--content-enter-delay`** is the stagger knob (default `0s`). One `fast-01` between lead and
  follow — simultaneous arrival reads as a swap, the offset reads as choreography.
- **`--page-enter-distance`** is the travel (default: one `--layout-boundary-inline`). Retune it per
  shell, not per page.
- **Neither fills forwards, on purpose.** A filled entrance leaves a `translate` on the element,
  which makes it a containing block for any `position: fixed` descendant — and the page-enter box is
  usually the scroll container, so its sticky children would start measuring against it.
- **`motion-reduce:animate-none` on both**, always.

### A page arrives once

The route transition **is** the page's entrance. Anything inside that page which also animates **on
mount** runs concurrently with it — and because both usually take their timing from the same tokens,
they run in lockstep, which does not read as two animations. It reads as one element travelling on a
diagonal.

The signature, sampled across `requestAnimationFrame` on a real navigation:

```
  8ms   block: opacity 0.10, rising 7.2px      page: opacity 0.10, sliding -21.5px
 91ms   block: opacity 0.63, rising 2.96px     page: opacity 0.63, sliding -8.88px
```

**Identical opacities frame for frame is the tell** — one entrance, played twice, on two axes. Fix it
so the page lands first (`opacity 1`, `translate none`) and only then does anything inside it move.

A content-settle entrance is earned only when the content changes inside a page that is **already
standing**. Three shapes this goes wrong in:

| Shape                                                    | What you see                                                            | Fix                                                                                                 |
| -------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| A settle class on a block that _is_ the page             | The diagonal above                                                      | Drop it. The route transition carries the arrival; animate only on a swap, or after a load resolves |
| Two variants of one screen, each rendering its own shell | Chrome blinks and the page re-slides on a switch that navigated nowhere | Hoist the shell to the parent that swaps them, so only the content zone changes                     |
| A screen whose content is genuinely read on arrival      | Content pops in when the read lands                                     | A wire for the read, then the settle after it — two beats, never overlapping                        |

- **A wire is per shape, not per route.** If one URL resolves to two different layouts, each needs a
  wire of **its own** shape. A wire that resolves into a different layout is the jump it exists to
  prevent. Verify by measuring the block's top and height in the wire and after it settles — a couple
  of px is a settle, tens of px is a jump.
- **Measure, never eyeball.** A snap and a 240ms ease are indistinguishable by eye in review. Sample
  the animated property across `requestAnimationFrame` and assert there are interpolated frames
  between the two ends — and that the page's own frames are finished before the content's begin.

### Route and step transitions

```vue
<RouterView v-slot="{ Component, route }">
  <Transition
    mode="out-in"
    enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
    leave-to-class="opacity-0"
  >
    <!-- THE KEYED WRAPPER IS LOAD-BEARING — see the glitch catalog. -->
    <div :key="route.path">
      <component :is="Component" />
    </div>
  </Transition>
</RouterView>
```

- **A step swap is an order of magnitude smaller than an entrance.** Leave `fast-02`, enter
  `moderate-01`: the old card is gone before the new one commits, which is what makes a step change
  read as a step change rather than as a change of screen.
- **`out-in` between siblings of different heights**, so the two never fight for the same column.
  But **never `out-in` inside a box that is resizing** — the field area collapses to nothing in
  between and the box dips on the way. There, cross-fade with the leaving block taken out of flow
  (`leave-active-class="absolute inset-x-0 top-0"`) so the incoming one owns the layout immediately
  and the box has a single height to travel to.
- **Every routed step needs exactly one root element.** A fragment root cannot be animated.
- **Match the skeleton to what replaces it.** A Skeleton in the exact geometry of its target button
  makes the swap a pure cross-fade with no height to travel, so nothing jumps under the cursor.

### The glitch catalog

Every entry here compiles, lints, and passes type-check. They fail **silently** — that is what makes
them expensive. When motion "doesn't work" and nothing is red, start here.

| Symptom                                                      | Cause                                                                                                                                     | Fix                                                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Element lands in the right place, no motion at all           | `transition-[transform]` beside `translate-x-*` / `scale-*` — v4 compiles those to `translate` / `scale`                                  | Name the real properties: `transition-[translate,scale,opacity]`                         |
| Entrance snaps to its final state                            | A single `requestAnimationFrame` — the from-state was never painted                                                                       | Two nested `requestAnimationFrame`s                                                      |
| Routed step is blank when navigated to, correct on reload    | `<component :is>` as the direct child of `<Transition mode="out-in">` — the leave completes and the entering branch is dropped            | Wrap it in a stable keyed **element**; keying the component does nothing                 |
| `<Transition>` around a component does nothing               | The component's root is a fragment                                                                                                        | Give it one root element                                                                 |
| Growing animates, shrinking snaps                            | Height pinned _before_ `scrollHeight` was read                                                                                            | Measure both heights while still `auto`                                                  |
| Box stays stuck at a pinned height                           | `transitionend` never arrived (interrupted, unmounted)                                                                                    | Release on a timeout fallback too                                                        |
| Height transition jitters / never settles                    | `ResizeObserver` is watching the element being sized                                                                                      | Observe an inner element that is never given a height                                    |
| Box dips mid-swap                                            | `out-in` inside a height-animated container                                                                                               | Cross-fade with the leaving block `absolute`                                             |
| Focus ring is clipped on flush-edge controls                 | Permanent `overflow-hidden` on the animated box                                                                                           | Clip only while moving, via `data-[resizing]:`                                           |
| Consumer's `transition-*` class is ignored                   | An inline `style="transition: …"` on the same element beats every class                                                                   | Express it as a utility, or accept the component owns that transition                    |
| Enter-from opacity has no effect                             | A base `opacity-*` on the same element is emitted after `opacity-0`                                                                       | Recede with token colours (border/fill), and leave `opacity` to the transition           |
| Reordering a list kills the item's own animation             | Re-inserting a node discards any transition pending on it or inside it                                                                    | A list either reorders or its items animate in place — not both on one interaction       |
| A badge/dot is cut off, or the control jumps when it appears | The host clips to its own shape (`overflow-hidden`), and an in-flow marker widens the box                                                 | Overlay it on a `relative` wrapper _outside_ the control, `pointer-events-none`          |
| Content rises while the page is still sliding in             | A mount-time entrance inside a page whose route transition is already running — same tokens, so they lockstep into one diagonal move      | Let the route transition own the arrival; animate content only on a swap or after a load |
| Chrome blinks and the page re-slides, but nothing navigated  | Two variants of one screen each render their own shell, so swapping variants unmounts the sidebar/header and replays the route transition | Hoist the shell to the parent that swaps the variants                                    |
| Element fades out but never leaves                           | A DS component's own remove animation completed and _then_ emitted — correct for a thing going away, wrong for a thing that stays         | Own the control locally when the element must survive                                    |

### Timing only from tokens

- **Durations**: `duration-fast-01` (70ms), `duration-fast-02` (110ms), `duration-moderate-01`
  (150ms), `duration-moderate-02` (240ms), `duration-slow-01` (400ms), `duration-slow-02` (700ms).
- **Curves**: `ease-productive-entrance` / `ease-productive-exit` (UI chrome),
  `ease-expressive-entrance` / `ease-expressive-exit` (prominent surfaces), and the generic
  `ease-in` / `ease-out` / `ease-in-out`.
- **NEVER** a hardcoded `duration-[180ms]` / `transition: opacity 200ms`, and **NEVER** an inline
  `ease-[cubic-bezier(...)]` — use the `duration-*` / `ease-*` tokens (the webkit MCP lists them; they
  ship in `@aziontech/theme`).

### Property discipline

- **MUST** animate compositor props only: `transform` and `opacity`.
- **NEVER** animate layout props (`width`, `height`, `top`, `left`, `margin`, `padding`) — they
  thrash layout. Three exceptions, and only three: the catalogued `animate-slide-down` for a
  0 → auto disclosure, and the two recipes in **Size transitions** below (a box that follows its
  own content's height, a value that grows into a `0fr → 1fr` grid track). Anything else that
  wants to resize is a `transform` in disguise — find it.
- **Name the property the utility actually sets.** Tailwind v4 compiles `translate-x-*` to the
  standalone `translate` property and `scale-*` to `scale`, **not** to `transform`. So
  `transition-[transform]` beside a `translate-x-*` compiles, lints, emits CSS — and animates
  nothing. Write `transition-[translate,opacity]`, `transition-[scale,opacity]`. A
  `<TransitionGroup>` sets an inline `transform` for its own move, so its `move-class` names all
  three: `transition-[transform,translate,scale,opacity]`.
- **SHOULD** avoid animating paint props (`background`, `color`) except small, local UI (a single
  icon, a chip). For hover/active surface fills use the `::before`/`::after` ghost-layer pattern from
  the Interactive states catalog (listed by the webkit MCP) — fade `opacity` on the pseudo-layer, not
  `background` on the root.

### Feel

- **Interaction feedback ≤ `duration-moderate-01` (150ms)** — use `fast-01`/`fast-02` for hover/active.
- **`ease-out` (decelerate) on entrance, `ease-in` (accelerate) on exit** — or the productive/
  expressive entrance/exit pair.
- **NEVER** introduce a custom easing curve unless explicitly requested.

### `data-state` / open-close motion

For overlays with `data-state="open|closed"` (or Vue `<Transition>`), read the `duration` + `curve`
tokens and emit an inline `transition` per phase; keep transform/opacity in classes, only timing goes
inline; defer unmount until the longest close duration elapses.

### Accessibility & performance (mandatory)

- **MUST** pair every motion-bearing class with a `motion-reduce:*` escape on the same class string:
  `motion-reduce:transition-none`, `motion-reduce:transform-none`, `motion-reduce:animate-none`. This
  is the consumer-facing rule — no motion class ships without its reduced-motion escape.
- **MUST** `aria-hidden="true"` on decorative spinning/looping elements; pause loops off-screen;
  nothing looping > 5s without being pausable.
- **NEVER** animate large `blur()` / `backdrop-filter` surfaces; **NEVER** `will-change` outside an
  active animation; **SHOULD** avoid animating full-screen surfaces or large images.

### Forbidden

- **NEVER** a component-local `@keyframes`, inline `cubic-bezier`, or hardcoded ms literal.
- **NEVER** an external animation library — use the animate tokens + Vue `<Transition>` /
  `<TransitionGroup>`.

## Review output

For `/webkit-motion-polish <file>`, list violations. Each:

```
✗ <file>:<line>  transition: all 0.3s cubic-bezier(0.2,0,0,1)
  why: hardcoded duration + inline curve + animates `all` (layout props); no reduced-motion escape.
  fix: transition-transform duration-moderate-01 ease-productive-entrance motion-reduce:transition-none
```

End with: `motion clean` or `N violations`.

## References

- Motion catalog (listed by the webkit MCP): Animations, Motion primitives, Interactive states,
  Reduced motion.

## Definition of Done

- [ ] Only `animate-*` utilities and `duration-*` / `ease-*` / `curve` tokens are used.
- [ ] Only `transform` / `opacity` animate — plus catalogued `animate-slide-down` and the two
      sanctioned size recipes, each in the exact shape above.
- [ ] Every `transition-[…]` names the property the utility actually sets (`translate` / `scale`,
      not `transform`).
- [ ] Interaction feedback ≤ 150ms; entrance `ease-out`, exit `ease-in`. A first-paint entrance is
      exempt (`slow-01` + expressive) and runs once, on mount only.
- [ ] Any animated height releases back to `auto` — on `transitionend` **and** a fallback timer —
      and clips only while it moves.
- [ ] Motion was **measured, not eyeballed**: sample the animated property across
      `requestAnimationFrame` and confirm interpolated frames between start and end. A snap and a
      150ms ease are indistinguishable by eye, and every entry in the glitch catalog looks fine in
      a screenshot.
- [ ] Every motion class has a `motion-reduce:*` escape; decorative loops are `aria-hidden` and pause off-screen.
- [ ] No `@keyframes`, inline `cubic-bezier`, hardcoded ms, or external animation lib.
