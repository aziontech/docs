---
name: webkit-ui-states
description: Every data-backed view in a @aziontech/webkit app declares its full state surface — loading, empty, partial, error, success — not just the happy path, AND behaves correctly while an async action is in flight and when it fails. Use when building or reviewing any screen that fetches, filters, submits, or paginates. Maps each state to the shipped component (Skeleton, EmptyState, Message), locks the scope off one flag while an action runs (trigger :loading + every field :disabled, released in finally), and reports request errors via toast.
status: active
last_updated: 2026-07-21
scope: general
enforced_by: [webkit-component-states, webkit-prefer-over-custom, ui-verify]
---

# Skill: webkit-ui-states

## Purpose

Most "unfinished" UI is not a styling problem — it is a missing state or a mishandled async moment.
A view that fetches renders beautifully with data and breaks with none: a spinner that never
resolves, a blank panel where an empty result should explain itself, a red toast where an inline
field error belongs. And the async moments leak just as badly: a submit that stays clickable fires
twice, a form whose fields stay editable mid-request sends data the user has already changed, a
request that fails silently leaves the user staring at a spinner that never clears.

This skill fixes **both halves** of a trustworthy data-backed view:

1. **The state surface** every view owns — loading, empty, partial, error, success — each mapped to
   the `@aziontech/webkit` component that renders it, so the loading/empty/error of every screen
   looks the same.
2. **The async behavior** — what happens **while** an action is in flight (lock the scope off one
   flag) and **when it fails** (report the failure where the user is looking, via toast) — so the
   screen behaves the same everywhere too.

## How to use

- `/webkit-ui-states` — apply the state matrix **and** the async-behavior contract to any view you
  build in this conversation.
- `/webkit-ui-states <file>` — review the file's views and async flows and report, per gap: the
  quoted line, which state or behavior is missing or mis-handled, and the concrete fix naming the
  webkit component.

## When to invoke

- Building or reviewing any screen that fetches, filters, submits, paginates, or mutates data.
- The user asks "handle the empty state", "where do errors go", "why did it submit twice", "the form
  didn't lock", "handle the API error", "why does the spinner keep spinning after it's done".

## How to find the components

Never guess an import path. Resolve it the same way for every component below:

- Ask the **webkit MCP** — `suggest_component` in plain words ("empty state", "loading placeholder",
  "toast").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

Do **not** rely on a path you saw in another repo file — files move; the catalog and MCP are the
contract.

## The state matrix — every data-backed view

A view that fetches, filters, submits, or paginates owns **all** of these. Declare each one; a view
missing any is not done.

| State                                    | When                                            | Render with                                                                               |
| ---------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Loading** (first paint / route enter)  | data is arriving, nothing actionable yet        | `Skeleton` in the shape of the arriving content — reserve the layout so it doesn't reflow |
| **Loading** (inline / a control is busy) | a button/section is working, the rest is usable | `Spinner` inside the control (or the button's own `loading` prop)                         |
| **Empty** (no data at all)               | the collection is genuinely empty (first run)   | `EmptyState` — a one-line reason + one clear next action                                  |
| **Empty** (no results for a filter)      | data exists, the current filter matches nothing | `EmptyState` with a "clear filters" action — distinct copy from first-run empty           |
| **Partial**                              | some rows loaded, more paging in                | render what arrived + an inline `Spinner`/"load more"; never blank the list               |
| **Error** (request failed)               | network / 5xx / 4xx not tied to one field       | a `Message` in the view (or a `toast` for a transient action) with what failed + a retry  |
| **Success** (transient)                  | a mutation completed                            | optional toast; don't leave the user guessing whether it worked                           |

Field-level validation is **not** in this matrix — a bad email or a required value stays inline next
to the field (see `/webkit-form` and the toast-vs-field boundary below). This skill is about the
**view's** data states, not a single input's.

## Loading: pick by the direction of the flow

The loading affordances answer different questions and are **not** interchangeable. Pick by the
**direction** of the flow — data coming _in_ vs. an action going _out_:

- **Reading data _into_ a view → `Skeleton`.** There is nothing for the user to act on yet; the
  screen is arriving. Reserve the layout with skeletons so it doesn't reflow when the data lands, and
  do **not** render disabled-but-empty fields as a "loading" state — a disabled empty input reads as
  broken, not loading.
- **Committing an action _out_ of a view → the trigger's `loading` + every field `:disabled`.** The
  screen is already here and the user has committed a payload; lock the scope off one flag (see the
  next section). Only the busy control shows motion.

Rules of thumb:

- **Never a Skeleton on a form the user is filling.** Filling ≠ loading; a Skeleton over live inputs
  hides the fields the user is trying to use.
- **Never a Button spinner while a view is still loading its data.** There's no committed action to
  reflect — use Skeletons for the content and only show a `:loading` trigger once the user submits.
- **A view can do both in sequence:** Skeletons while the initial data loads, then Button `:loading`
  - `:disabled` fields when the user submits the now-populated form. Two different flags, two
    different affordances.

For **ongoing activity** that is neither first paint nor a committed submit, pick by whether you can
count the work:

- **Indeterminate / streaming → `Spinner`, low emphasis, always with a label.** "Preparing
  repository…", "Provisioning… 12s", or the running step in a multi-step list — a `Spinner` beside
  text, never a bare spinner with no label. Remove it the instant the process settles.
- **A measurable whole → `ProgressBar` (`:value` / `:max`).** When you can compute "N of M done"
  (an upload, a deploy with countable phases), show forward motion, not a spinner. Remove it on
  completion.
- **Both together only** when you have per-unit liveness _and_ a countable whole (a per-step `Spinner`
  over an overall `ProgressBar`). Every ongoing affordance clears the moment the flow finishes.

The state-matrix render — Skeleton (data in), then Message / EmptyState / data:

```vue
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Skeleton from '@aziontech/webkit/skeleton'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Message from '@aziontech/webkit/message'
  import Button from '@aziontech/webkit/button'

  type Row = { id: string; name: string }
  const rows = ref<Row[]>([])
  const loading = ref(true)
  const error = ref('')

  const load = async () => {
    loading.value = true
    error.value = ''
    try {
      rows.value = await fetchRows()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
</script>

<template>
  <!-- Loading: reserve the shape of the arriving content -->
  <div
    v-if="loading"
    class="flex flex-col gap-(--spacing-sm)"
  >
    <Skeleton
      kind="shape"
      width="100%"
      height="44px"
    />
    <Skeleton
      kind="shape"
      width="100%"
      height="44px"
    />
    <Skeleton
      kind="shape"
      width="100%"
      height="44px"
    />
  </div>

  <!-- Error: located in the view, recoverable -->
  <Message
    v-else-if="error"
    severity="danger"
    :label="error"
  >
    <Button
      label="Retry"
      kind="outlined"
      size="small"
      @click="load"
    />
  </Message>

  <!-- Empty: one reason + one action -->
  <EmptyState
    v-else-if="!rows.length"
    title="No workloads yet"
    description="Create your first workload to see it here."
  >
    <Button
      label="Create workload"
      kind="primary"
      @click="onCreate"
    />
  </EmptyState>

  <!-- Success: the data -->
  <ul
    v-else
    class="flex flex-col gap-(--spacing-xs)"
  >
    <li
      v-for="r in rows"
      :key="r.id"
    >
      {{ r.name }}
    </li>
  </ul>
</template>
```

The trigger for each state comes from the **consuming app** (its data layer / async state). The
design system ships the _rendering_ of each state; it never fetches. Keep the state flags where the
app owns them (a `ref`, a store, a query result), and route them to the components above.

## Lock the scope while an action is in flight

While an async action runs, **one boolean drives the whole scope**: the trigger shows `:loading`, and
**every field the action reads is `:disabled` off that same flag**. Not the button alone — a loading
button next to editable fields still lets the user change the payload after they committed it.

Why both, off one flag:

- **No double-submit.** `:loading` disables the trigger and shows a spinner; the handler also guards
  on the flag (`if (submitting.value) return`).
- **No mid-flight edits.** Disabling the inputs freezes the payload the user just committed.
- **One source of truth.** A single `ref` flips on entry and off on settle (success _or_ failure), so
  the button and the fields can never disagree.

```vue
<script setup>
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'

  const submitting = ref(false)
  const scope = ref('')
  const repoName = ref('')

  const runDeploy = async () => {
    // Guard: the flag is also the re-entrancy lock.
    if (submitting.value) return
    submitting.value = true
    try {
      await deploy({ scope: scope.value, repoName: repoName.value })
    } finally {
      // Release on BOTH paths — success and failure — so the scope never stays stuck.
      submitting.value = false
    }
  }
</script>

<template>
  <Select
    v-model="scope"
    :disabled="submitting"
  >
    <Select.Trigger />
    <Select.Content><!-- options --></Select.Content>
  </Select>
  <InputText
    v-model="repoName"
    :disabled="submitting"
  />
  <Button
    label="Deploy"
    kind="primary"
    :loading="submitting"
    @click="runDeploy"
  />
</template>
```

Rules:

- **Bind `:loading` and every field's `:disabled` to the same flag.** Never a loading button over
  live fields.
- **Guard the handler on the flag** (`if (submitting.value) return`) — `:loading` disabling the
  button is the visual lock, the guard is the logical one.
- **Release in `finally`.** The flag must clear on failure too, or a failed request bricks the form.
- **`:disabled` is not `:loading`.** Only the trigger takes `:loading` (spinner); the fields take
  `:disabled`. Don't put a spinner on every input.

## Report request/API errors via toast

A request-level failure (network down, 4xx/5xx not tied to one field, "Deploy failed") is a
**transient, screen-level event** — it surfaces through `@aziontech/webkit/toast`, not by mutating the
form and not by a silent `console.error`. Mount the region once; raise from anywhere.

```js
// main.js — mount the region once for the whole app.
import { ToastPlugin } from '@aziontech/webkit/toast'
createApp(App).use(router).use(ToastPlugin).mount('#app')
// ToastPlugin registers <Toaster> globally. (Alternatively: place a single
// <Toaster /> at the app root and import { toast } directly.)
```

```vue
<script setup>
  import { ref } from 'vue'
  import { toast } from '@aziontech/webkit/toast'

  const submitting = ref(false)

  const runDeploy = async () => {
    if (submitting.value) return
    submitting.value = true
    try {
      await deploy()
      toast.success('Deployment started.')
    } catch (error) {
      // Say what failed and how to recover — never just "Error".
      toast.error('Deployment failed.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => runDeploy() }
      })
    } finally {
      submitting.value = false // release the lock from the section above on failure too
    }
  }
</script>
```

Prefer `toast.promise` when the whole lifecycle maps to one request — it raises a loading toast and
settles it to success/error in place:

```js
toast.promise(deploy(), {
  loading: 'Deploying…',
  success: 'Deployment started.',
  error: (e) => `Deployment failed: ${e?.message ?? 'unknown error'}`
})
```

Rules:

- **Mount `<Toaster>` exactly once** (via `ToastPlugin` or a single `<Toaster />` at the app root).
  The store is a singleton — a second region does not duplicate toasts, but there must be one.
- **Use the typed shortcut for the severity:** `toast.error` for failures, `toast.success` for the
  happy path, `toast.promise` to track a request end-to-end.
- **The message is actionable.** State what failed and the recovery; attach an
  `action: { label, onClick }` (e.g. "Retry") when the user can retry. Never a bare "Error".
- **Release the lock on error** (the `finally` above) so the toast's Retry actually re-runs.

### The toast-vs-inline-field boundary (do not cross it)

`toast` is for **request / system** errors. **Field validation is not.** A bad email, a missing
required value, an out-of-range number stays **next to the field** with the field/message components
(`/webkit-form`, and `/webkit-ux-heuristics` for error placement) — validating before submit is error
prevention, and it never fires a global toast.

| Failure                                                  | Where it goes                                   |
| -------------------------------------------------------- | ----------------------------------------------- |
| Field is invalid / required / malformed                  | inline `field-*` + `message`, next to the field |
| Request failed (network, 5xx, 4xx not tied to one field) | `toast.error` / `toast.promise`                 |
| Long request succeeded / started                         | `toast.success` (optional)                      |

Two more rows exist, and both are places a toast is **wrong**: a server rejection **scoped to one
field** (→ a `Message` in that field's own section + the field's `invalid` state) and anything on a
**signed-out** screen (→ one `Message` in the card; **auth never toasts**). The inverse case — a
failure that arrives **after** the user left the screen — is the one that _must_ be a toast, and a
permanent, closable one. The full table lives in **`/webkit-errors`**.

## Hard rules

- Every fetch/filter/submit/paginate view renders loading **and** empty **and** error — not just the
  happy path; plus partial where it paginates.
- First-run empty and no-filter-results empty are **different copy** and different actions.
- Skeleton for data arriving; the control's own loading for an action leaving. Never a full-page
  spinner for content that has a shape, and never a Skeleton over a form the user is filling.
- Every async action locks its scope off **one** flag — trigger `:loading`, every field `:disabled`;
  the handler guards on the flag and releases it in `finally` (success **and** failure).
- Request/API errors raise `toast.error` / `toast.promise` with what failed + how to recover;
  `<Toaster>` is mounted once. Never a silent `console.error`.
- Hand-rolled "Nothing here" strings or bespoke spinners are forbidden when `EmptyState` / `Skeleton`
  / `Spinner` exist — resolve them via the MCP/catalog.
- Field validation is inline (`field-*` + `message`), never in this matrix and never a toast.

## Review output

For `/webkit-ui-states <file>`, list gaps grouped by view / flow. Each:

```
✗ WorkloadsList.vue:31  v-if="items.length" with no empty/error branch
  state: Empty + Error missing — a failed or empty fetch renders a blank panel.
  fix: add EmptyState (reason + Create action) and a Message severity="danger" with Retry.

✗ SomeForm.vue:44  Button :loading="submitting" but fields have no :disabled
  behavior: Lock the scope — a loading trigger over editable fields lets the payload change mid-request.
  fix: bind :disabled="submitting" on the Select / InputText / Switch in the same card; guard the handler, release in finally.

✗ api.js:31  catch (e) { console.error(e) }
  behavior: Report request errors — the failure is silent; the user sees a spinner that never clears.
  fix: toast.error("Request failed.", { description: e.message, action: { label: "Retry", onClick } }); release the lock in finally.
```

End with: `states + async sound` or `N gaps — fix before polish`.

## Definition of Done

- [ ] Every data-backed view renders loading, empty, and error — plus partial where it paginates.
- [ ] Skeleton reserves the arriving layout; controls show their own loading; no blank async panels.
- [ ] First-run empty ≠ no-results empty (distinct copy + action).
- [ ] Every async action locks its scope off **one** flag: trigger `:loading`, every field `:disabled`.
- [ ] The handler guards on the flag and releases it in `finally` (success **and** failure).
- [ ] `<Toaster>` is mounted once; request/API errors raise `toast.error` / `toast.promise` with what failed + how to recover (Retry where it applies).
- [ ] Field validation stays inline (`field-*` + `message`) — never a toast.
- [ ] Every state component came from the MCP/catalog, not a guessed or borrowed path.
