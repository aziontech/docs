---
name: webkit-ui-verify
description: Drive a finished @aziontech/webkit screen in a real browser (Playwright, headless Chromium) and OBSERVE before declaring it done — screenshot both themes at multiple widths, assert zero console errors, run axe-core against the live tree, and exercise the loading/empty/error states and the primary interaction. The runtime a11y gate the accessibility rule defers to: axe on the rendered tree, focus trap/restore observed, live-region announcements. Use as the runtime gate that verifies what the other skills prescribe, before you call any route finished.
status: active
last_updated: 2026-07-20
scope: general
enforced_by: [ui-verify, webkit-accessibility, webkit-component-states]
---

# Skill: webkit-ui-verify

## Purpose

The other skills in this pack _prescribe_ — tokens for both themes, a full state surface, WCAG at the
composition layer, layout across breakpoints. This one _verifies_ they held, by driving the running
screen in a real browser and looking. A screen "looks done" only in the one theme, one width, and one
data state you happened to open; the regressions the other skills warn about — a dark-mode-only
contrast break, an empty fetch that renders a blank panel, a focus that never returns to its trigger,
a Vue warning in the console — are invisible until something exercises them. This is the executable
companion to the whole pack: the runtime gate you run **before** calling any route finished.

The method is **reconnaissance, then action** — OBSERVE, never assume. Navigate, screenshot, read the
live accessibility tree, and let what is actually on the page drive the next step. Do not assert
against selectors or state you _expect_ to exist; find them, then act.

## How to use

- `/webkit-ui-verify` — run the full pass against the route you just built in this conversation.
- `/webkit-ui-verify <route-or-file>` — verify a specific route (`/workloads`) or the view a `.vue`
  file renders; report per finding: what failed, the evidence (console line, axe rule, screenshot),
  and the fix.

The agent form is **webkit-ui-verifier** — hand it a route and it runs this loop end to end and reports
back. Either way the loop is the same; only who drives it changes.

## Before you run

- Build/serve the app locally first (`pnpm dev` / `pnpm build && pnpm preview`), and verify the URL
  responds — the pass drives a **live** server, not a static file.
- The consumer installs two devDeps: **`playwright`** (the browser) and **`axe-core`** (the a11y
  engine). Install Chromium once with `npx playwright install chromium`.

## The loop — capture, then assert

Run every route through all four, in both themes and at 2–3 widths. A pass that skipped a theme, a
width, or a state did not verify the screen.

- **Visual, both themes × widths.** Screenshot in **light** and in `data-theme="dark"`, at **375**,
  **768**, and **1280** px. This is the check `webkit-theming-dark-mode` and `webkit-baseline-ui`
  (responsive widths) defer to — two-theme screenshots catch the dark-only regression; multi-width catches the layout that
  only breaks on a phone. Look at every shot; a saved file is not a passed check.
- **Console, zero tolerance.** Collect `console` errors, `pageerror`, and `requestfailed` on load
  **and** during the primary interaction. A Vue warning or a failed request is a **fail**, not noise.
- **Accessibility (runtime).** This is the executable a11y check **the accessibility rule defers to** —
  the runtime gate for the behavioral surface lint cannot see. Run **axe-core** against the rendered
  tree (contrast on real surfaces, names, roles as rendered); any violation is a finding. Then observe
  the two things axe cannot assert on its own: **focus trap/restore** on overlays (focus moves in on
  open, stays trapped while open, returns to the trigger on close — see Interaction + focus below), and
  **live-region announcements** — a status that changes asynchronously (loading, saved, error) must
  reach an `aria-live` region / webkit status surface, not be conveyed by colour or a silent spinner
  alone.
- **States, forced.** Do not wait for the happy path to be the only path. Force **loading** (throttle
  or delay the request), **empty** (make it return no data), and **error** (make the request fail), and
  confirm each renders per `webkit-ui-states` — a `Skeleton`, an `EmptyState`, a `Message` — never a
  blank or broken screen. Intercept with `page.route()` to force empty/error without touching the app:

```js
await page.route('**/api/workloads', (r) => r.fulfill({ status: 500 })) // error
await page.route('**/api/workloads', (r) => r.fulfill({ json: [] })) // empty
```

- **Interaction + focus.** Drive the primary flow — submit the form, open the overlay, paginate — and
  confirm the action's feedback appears (a toast/message, the new rows) and focus behaves: an overlay
  **traps** focus while open and **restores** it to the trigger on close (compare
  `document.activeElement` before open and after close).

## The runtime check

Self-contained Node script — navigate, set the theme before first paint, screenshot both themes at two
widths, collect console/network problems, and run axe against the live tree. Save it in your app and
run `node verify.mjs http://localhost:5173/workloads`.

```js
// verify.mjs — devDeps: playwright, axe-core
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const url = process.argv[2] ?? 'http://localhost:5173/'
const themes = ['light', 'dark']
const widths = [375, 1280] // add 768 for a third breakpoint
const outDir = 'verify-shots'

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch() // headless by default
let failures = 0

for (const theme of themes) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })

    // A console error, a page error, or a failed request is a FAIL — collect them all.
    const problems = []
    page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`))
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
    page.on('requestfailed', (r) => problems.push(`request: ${r.url()} ${r.failure()?.errorText}`))

    // Set the theme BEFORE the app paints, the way webkit-theming-dark-mode prescribes.
    await page.addInitScript((t) => {
      document.documentElement.dataset.theme = t
    }, theme)
    await page.goto(url, { waitUntil: 'networkidle' })

    // OBSERVE — screenshot each theme × width; look at every shot afterward.
    await page.screenshot({ path: `${outDir}/${theme}-${width}.png`, fullPage: true })

    // Runtime a11y — inject axe-core and run it against the live tree.
    await page.addScriptTag({ path: axePath })
    const { violations } = await page.evaluate(() => window.axe.run())

    for (const p of problems) (failures++, console.log(`✗ ${theme} @ ${width}px  ${p}`))
    for (const v of violations)
      (failures++, console.log(`✗ ${theme} @ ${width}px  axe ${v.id} (${v.impact}): ${v.help}`))
    if (!problems.length && !violations.length)
      console.log(`✓ ${theme} @ ${width}px  clean — ${outDir}/${theme}-${width}.png`)

    await page.close()
  }
}

await browser.close()
process.exit(failures ? 1 : 0)
```

Extend it per route: add `page.route()` calls to force empty/error, and a `userEvent`-style
`page.click()` / `page.fill()` block to drive the primary flow and re-check console + focus after it.

## Hard rules

- OBSERVE before you assert — screenshot and read the live tree first; never assume a selector or a
  state is present.
- Screenshot **both** themes and at **2–3** widths; a single-theme, single-width pass is not a pass.
- **Zero** console errors on load and on the primary interaction — a Vue warning or a failed request
  fails the route.
- Run **axe-core** against the rendered tree; any violation is a finding to fix, not to note.
- Force loading, empty, and error, and confirm each renders a webkit state component — never a blank or
  broken screen.
- Overlays trap focus while open and restore it to the trigger on close; the action's feedback appears.
- Async status (loading, saved, error) is announced via an `aria-live` region / webkit status surface —
  not colour or a silent spinner alone.
- Assert **behavior, console, a11y, and visual snapshots** — never class strings, pixel positions, or
  animation timing.

## Review output

For `/webkit-ui-verify <route-or-file>`, report the pass as a checklist with the evidence for each:

```
Route: /workloads

[✓] Visual     light + dark, 375/768/1280 — shots saved, checked
[✗] Console    dark @ 1280: "[Vue warn] Missing required prop: title"
[✗] a11y       axe color-contrast (serious): .status-pill text on --bg-surface-raised in dark
[✗] States     empty fetch → blank panel, no EmptyState rendered
[✓] Interaction dialog traps + restores focus; success toast appears

fix: pass :label to <Message>; darken the pill text token; add EmptyState to the no-data branch.
```

End with: `verified — ship` or `N findings — fix before ship`.

## Definition of Done

- [ ] The route was driven in a real headless browser; every screenshot was looked at, not just saved.
- [ ] Both themes and 2–3 widths captured; no dark-only or narrow-width regression.
- [ ] Zero console errors / failed requests on load and on the primary interaction.
- [ ] axe-core run against the live tree with no violations; async status announced via a live region.
- [ ] Loading, empty, and error each forced and each renders its webkit state component.
- [ ] Primary flow driven; focus traps + restores; the action's feedback appears.
- [ ] Wired into CI as a smoke/visual job — this runtime gate runs on every PR, not just locally.
