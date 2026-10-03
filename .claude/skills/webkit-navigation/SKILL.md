---
name: webkit-navigation
description: Two navigation shells for UI on @aziontech/webkit — the persistent console shell (full sidebar + in-content GlobalHeader, always shown) for hub/browse pages, and the focused creation shell (no sidebar, GlobalHeader with back + brand + breadcrumb) for create/edit/deploy flows. A page picks exactly ONE shell, renders exactly ONE GlobalHeader, and the signed-in user stays visible in both. Also fixes second-level navigation and the content layout inside the persistent shell: a --spacing-md inset matching the header, a first-level module list with NO PageHeading (the crumb names it) opening on a controls row over a flush borderless CardBox table, tabbed pages putting the primary button on the TAB ROW (medium) while untabbed pages put it on the CONTROLS ROW (large), and the breadcrumb levels — one unlinked crumb at first level, `module › resource name` at second level, and never a tab. Built on @aziontech/webkit/global-header, /sidebar, /breadcrumb, /tab-view.
status: active
last_updated: 2026-08-13
scope: general
enforced_by: [webkit-accessibility, webkit-prefer-over-custom, ui-verify]
---

# Skill: webkit-navigation

## Purpose

Every screen in a console lives in one of **two** navigation shells, and picking the wrong one — or
worse, blending them — is where a prototype stops feeling like one product. A browse page with no way
back to the rest of the console strands the user; a focused create flow that keeps the full sidebar
lets the user wander off mid-task and lose their work. This skill fixes which shell a page uses, how
each is composed on `@aziontech/webkit`, and the one invariant they share: **the signed-in user is
always visible.** It is the layout-shell companion to `webkit-form` (what goes _inside_ a focused
flow) and `webkit-ux-heuristics` (states + feedback).

## How to use

- `/webkit-navigation`
  Apply the shell rules below to any page or flow you build in this conversation.
- `/webkit-navigation <file>`
  Review the file against the rules and output, per gap:
  - the exact line / element (quoted),
  - which rule it breaks (1 short sentence),
  - the concrete fix, naming the shell or webkit primitive to use.

## When to invoke

- Starting a new page and deciding how it sits in the app (a hub page vs a create/edit/deploy flow).
- The user asks "which header goes here", "should this have a sidebar", "how do I get back", "the user
  disappeared on the create screen".
- Reviewing a screen for whether it uses the right shell and shows exactly one header.

## How to find the components

Never guess an import path, and never copy one from another repo or sample app — files move. Resolve
every webkit primitive the same way:

- Ask the **webkit MCP** — `suggest_component` in plain words ("sidebar", "app header", "breadcrumb").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

The primitives you compose the shells from — `sidebar` (+ `sidebar-header`, `sidebar-group`,
`sidebar-footer`), `global-header`, `breadcrumb`, `tab-view` — all resolve this way. **There is no
`@aziontech/webkit/app-layout` and no `@aziontech/webkit/creation-header`:** the two shells are
components _you_ compose in your own app (shown below), not webkit imports — never copy a dead import
for them.

For spacing / color / typography use the **@aziontech/theme tokens (the webkit MCP lists them)** —
`--spacing-md`, `--spacing-lg`, `var(--bg-canvas)`, `text-heading-xxs` — never raw px.

## The two shells

A page picks **exactly one**. The choice is not stylistic — it follows from what the page is _for_.

|                | **Persistent console shell**                                                                                     | **Focused creation shell**                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| What it is     | A shell **you** compose (e.g. `components/AppShell.vue`) around a full `Sidebar` + one in-content `GlobalHeader` | A shell **you** compose (e.g. `components/CreationShell.vue`): one `GlobalHeader` (back + brand + breadcrumb + avatar), no sidebar |
| Use for        | Hubs, lists, dashboards, settings — anywhere the user _browses_ and moves laterally                              | Create / edit / deploy / wizard — a single task with a start and an end                                                            |
| Sidebar        | **Yes** — full console nav, always present                                                                       | **No** — removed so the task is the only focus                                                                                     |
| Header         | `GlobalHeader` inside the content zone: breadcrumb + Create/Docs actions + account avatar                        | `GlobalHeader`: back button + Azion brand + breadcrumb + account avatar                                                            |
| Way out        | Lateral — pick any other module from the sidebar                                                                 | Linear — the **back** button (and breadcrumb) returns to where the flow started                                                    |
| Signed-in user | Sidebar footer (avatar + account menu) **and** header avatar                                                     | Header avatar (right)                                                                                                              |
| Typical pages  | dashboards, list / index pages, settings hubs, resource-detail pages                                             | create / edit forms, multi-step wizards, deploy / publish flows                                                                    |

### Shell 1 — persistent console

For pages the user **browses**. A full-height `Sidebar` on the left carries the whole console
navigation (grouped by product area) plus the team switcher and the user footer; one `GlobalHeader`
lives inside the content zone and carries the module breadcrumb and the primary actions. The page
renders only its own content through the shell's default slot.

**The shell is yours to compose** — there is no `@aziontech/webkit/app-layout`. Build it once from
the webkit primitives and reuse it on every browse page:

```vue
<!-- components/AppShell.vue — a shell YOU compose in your app. NOT importable
     from webkit; it wraps the webkit primitives below (each resolved via the
     MCP / catalog, see "How to find the components"). -->
<script setup lang="ts">
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarHeader from '@aziontech/webkit/sidebar-header'
  import SidebarGroup from '@aziontech/webkit/sidebar-group'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'

  defineProps<{
    active: string
    breadcrumb: { label: string; href?: string }[]
    collapsible?: boolean // default true — the sidebar toggle in GlobalHeader.Left
  }>()
</script>

<template>
  <div class="flex h-dvh">
    <!-- The way out: full console nav + team switcher + the signed-in user -->
    <Sidebar :active="active">
      <SidebarHeader><!-- team / account switcher --></SidebarHeader>
      <SidebarGroup label="Build"><!-- grouped module links --></SidebarGroup>
      <SidebarFooter><!-- avatar + name + account menu (theme / logout) --></SidebarFooter>
    </Sidebar>

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- EXACTLY ONE GlobalHeader, inside the content zone -->
      <GlobalHeader>
        <GlobalHeader.Left>
          <!-- sidebar toggle (pi pi-bars) + the location breadcrumb -->
          <Breadcrumb :items="breadcrumb" />
        </GlobalHeader.Left>
        <GlobalHeader.Right>
          <!-- Create / Docs actions + the account avatar (always visible) -->
        </GlobalHeader.Right>
      </GlobalHeader>

      <!-- The shell owns the --spacing-md inset ONCE; pages never re-pad -->
      <main class="min-h-0 flex-1 overflow-auto p-(--spacing-md)">
        <slot />
      </main>
    </div>
  </div>
</template>
```

A browse page then imports **your** shell — not a webkit path — and renders only its content:

```vue
<script setup lang="ts">
  import AppShell from '@/components/AppShell.vue' // your shell — NOT a webkit import
</script>

<template>
  <AppShell
    active="applications"
    :breadcrumb="[{ label: 'Applications' }]"
  >
    <!-- page content only -->
  </AppShell>
</template>
```

- The sidebar is the way out — the user moves laterally to any other module. Never remove it on a
  browse page.
- The breadcrumb names where the user is on **every** level: a single crumb at the first level
  (`[{ label: 'Applications' }]`), a full trail (`Applications › New Application`) once nested.

#### The header always names the location (breadcrumb) + the sidebar toggle (`collapsible`)

1. **The breadcrumb renders on every level.** The header always names where the user is: a page that
   passes a single first-level crumb (`[{ label: 'Home' }]`, `[{ label: 'Applications' }]`) shows that
   one crumb, and a nested page shows the full trail (`Applications › New Application`). This is
   consistent across the console — first-level pages are **not** special-cased to hide the crumb. Crumb
   links (`href`) navigate; the last crumb is the current page.
2. **Sidebar toggle (`collapsible`, default `true`).** A toggle (`pi pi-bars`) sits at the far left of
   `GlobalHeader.Left` on **every** console page. Clicking it collapses the rail **totally** (not to a
   mini-rail — it is removed, and the content zone spans the full width); clicking again restores it.
   The user stays visible via the header avatar while collapsed, so the shared invariant holds even
   with no sidebar footer. It is standard chrome — you don't opt in; pass `:collapsible="false"` only
   to suppress it on a page that must not collapse its rail.

```vue
<template>
  <!-- Home: the header names the module via its single crumb; the sidebar
       toggle is present by default. Home leads with content (no page heading). -->
  <AppShell
    active="home"
    :breadcrumb="[{ label: 'Home' }]"
  >
    <!-- content only -->
  </AppShell>
</template>
```

- The breadcrumb naming the location and an in-page `PageHeading` are **different roles**: the crumb is
  top chrome that says _where you are_; the `PageHeading` is the page's own title + description +
  actions. A second-level page carries both (the crumb _and_ its `PageHeading`); Home carries only the
  crumb and lets its content lead.

### Shell 2 — focused creation

For a **single task** — create, edit, deploy, a wizard step. The sidebar is gone so nothing competes
with the form. The only chrome is one `GlobalHeader`: a **back** button, the Azion brand, the flow
breadcrumb, and the account avatar. The page owns its own full-bleed body below the header.

Again, **you compose this shell** — there is no `@aziontech/webkit/creation-header`. It is one
`GlobalHeader` with no sidebar:

```vue
<!-- components/CreationShell.vue — a focused shell YOU compose. NOT importable
     from webkit; it is one GlobalHeader (back + brand + breadcrumb + avatar)
     with NO sidebar, wrapping webkit primitives. -->
<script setup lang="ts">
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import IconButton from '@aziontech/webkit/icon-button'

  defineProps<{
    breadcrumb: { label: string; href?: string }[]
    backLabel?: string
    showBack?: boolean // default true — hide only on a terminal success screen
  }>()
  const emit = defineEmits<{ back: [event: MouseEvent]; navigate: [event: MouseEvent] }>()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <!-- EXACTLY ONE GlobalHeader; it IS the whole chrome for a focused flow -->
    <GlobalHeader>
      <GlobalHeader.Brand><!-- Azion brand --></GlobalHeader.Brand>
      <GlobalHeader.Left>
        <!-- the ONLY way out: back button + the flow breadcrumb -->
        <IconButton
          v-if="showBack !== false"
          icon="pi pi-arrow-left"
          :aria-label="backLabel"
          @click="emit('back', $event)"
        />
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Right>
        <!-- the account avatar — the persistent identity in a focused flow -->
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="min-h-0 flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>
```

A create page uses **your** shell and wires the exit:

```vue
<script setup lang="ts">
  import CreationShell from '@/components/CreationShell.vue' // your shell — NOT a webkit import
  const cancel = () => {
    /* route back to where the flow started */
  }
</script>

<template>
  <CreationShell
    :breadcrumb="[{ label: 'Applications', href: '/applications' }, { label: 'Create' }]"
    back-label="Back to Applications"
    @back="cancel"
    @navigate="cancel"
  >
    <!-- the focused task -->
  </CreationShell>
</template>
```

- The **back** button (and the breadcrumb links) are the _only_ way out — the exit is linear and
  explicit, so a half-finished task is never abandoned by an accidental sidebar click.
- Hide the back button (`:show-back="false"`) only on a terminal state (a success screen with nowhere
  left to go back to).

## The shared invariant — the user is never signed out

**Both shells keep the signed-in user visible.** A focused flow drops the sidebar, but it does **not**
drop the account avatar — it stays anchored to `GlobalHeader.Right`, mirroring the console header. A
user who is mid-create must still see they're signed in and reach their account; a header with no
identity reads as "logged out" and breaks trust.

- **Persistent shell:** the user shows twice — the sidebar footer (avatar + name + account menu with
  theme + logout) and the header avatar.
- **Focused shell:** the header avatar (`GlobalHeader.Right`) is the persistent identity. It routes to
  the same account destination as the console header, so identity is continuous across shells.

Wire this into the focused shell itself (render the avatar in `GlobalHeader.Right` there), so every
creation page gets it for free — a page must **not** have to remember to add it.

## Content layout (inside the persistent shell)

The shell frames the page; this is how the page's own content sits inside it. Every browse/list page
and every resource-detail page follows the **same** layout and spacing, so moving between modules
never feels like a different app.

### The inset matches the header (`--spacing-md`)

The content zone's padding is `--spacing-md` — the same edge padding as `GlobalHeader` — so page
content lines up with the breadcrumb and the header actions. Your persistent shell applies this inset
**once** (e.g. on its `<main>`, as in `AppShell` above); **don't** re-pad the page with a bespoke
inset (`p-(--spacing-lg)`). A resource-detail page that opts out of the shell inset (to run a
full-bleed tab bar) re-applies the same `p-(--spacing-md)` on its own scrolling content region —
never `lg`.

### First-level module list — the controls row leads, and there is no `PageHeading`

A **first-level** page is one the sidebar routes to directly (Applications, Workloads, Object Storage,
Deployments). It is **already named by the header breadcrumb**, so an `<h1>` repeating that name buys
nothing and costs the first row of the table above the fold. The page opens instead on what the user
came to do — **narrow the list, or add to it**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [ search ][ filter chips … ]                    Documentation  + New Thing  │  ← controls row
├──────────────────────────────────────────────────────────────────────────────┤
│  ╭────────────────────────────────────────────────────────────────────────╮  │
│  │  table (flush, borderless, inside the card)                            │  │
│  ╰────────────────────────────────────────────────────────────────────────╯  │
└──────────────────────────────────────────────────────────────────────────────┘
```

```vue
<template>
  <AppShell
    active="applications"
    :breadcrumb="[{ label: 'Applications' }]"
  >
    <main class="flex h-full flex-col">
      <!-- The controls row REPLACES the PageHeading on a first-level list.
           Narrowing reads left (where the eye starts); the module's own actions
           sit right (where a control belongs); the table follows. -->
      <header class="flex items-center gap-(--layout-group-gap)">
        <div class="flex min-w-0 grow items-center gap-(--layout-group-gap)">
          <!-- Hoisted out of the card, so it is a plain InputText bound to the
               table's global filter — `Table.Search` is context-aware and only
               works INSIDE `<Table>`. -->
          <InputText
            v-model="search"
            size="large"
            placeholder="Search..."
            aria-label="Search applications"
            class="min-w-36 grow"
          />
          <!-- filter chips / selects — the narrowing group grows and wraps -->
        </div>
        <div class="flex shrink-0 items-center gap-(--layout-group-gap)">
          <Button
            label="New Application"
            kind="primary"
            size="large"
            icon="pi pi-plus"
            @click="…"
          />
        </div>
      </header>

      <!-- The Table lives in a flush, borderless CardBox: the card supplies the
           frame, so the table is edge-to-edge (padded=false) and border-free. -->
      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
            <Table
              v-model:globalFilter="search"
              :data="…"
              :columns="…"
              row-key="id"
              :border="false"
            />
          </template>
        </CardBox>
      </section>
    </main>
  </AppShell>
</template>
```

- **No `PageHeading` on a first-level module list.** The breadcrumb crumb is the module's name; a
  second one is a duplicate that only pushes the data down.
- **The controls live OUT of the table, not in its `#toolbar`.** They belong to the **page** — the
  create button acts on the module, not on the table — and hoisting them keeps the card a frame around
  data only. The trade is that the search field must be a plain `InputText` bound to
  `v-model:globalFilter`, because `Table.Search` only resolves inside `<Table>`.
- **The controls row and the table are ONE band**, stacked at the group step — not two sections.
- **The table is framed by the card, not itself:** `CardBox :padded="false"` + `Table :border="false"`
  — the card is the only border, so the table sits edge-to-edge.
- **`Documentation` is a first-level affordance only.** It introduces the module. An internal level is
  already inside the module, so it carries only the action that level can perform; reference material
  a band needs is a `documentation` link on that band's own section heading instead.
- **A `PageHeading` still belongs** on a page that is _not_ a module list — a second-level page that
  names its own subject (an async deploy view, a gallery, a utility page). There it sits **out** of the
  card, `--spacing-lg` above it.

## Second-level navigation — tabs, and where the primary button goes

A resource you navigate INTO (an application, a workload, a DNS zone, a database), and any module
whose contents split into more than one page, carries a **full-bleed tab bar** as the bottom edge of
the header. Each tab is **its own page**, not a filter.

**This is the rule that decides where the page's primary button lives — and there is exactly one
answer per page shape:**

| The page…                                     | Second-level nav   | The primary action sits…                                                | Size     |
| --------------------------------------------- | ------------------ | ----------------------------------------------------------------------- | -------- |
| **Has tabs** (detail page, or a split module) | full-bleed tab bar | **on the tab row**, trailing the tabs, right-aligned                    | `medium` |
| **Has no tabs** (a plain first-level list)    | none               | **on the controls row**, right of the search / filters, above the table | `large`  |

The reason is positional, not stylistic: on a tabbed page the action belongs to the **page**, so its
position must never move as tabs change — only its **label** does. On a page with no tabs there is no
row above the table to put it on except the controls row, which is where narrowing already lives.

### Tabs → the button rides the tab row

```vue
<template>
  <AppShell
    active="applications"
    :padded="false"
    :breadcrumb="[{ label: 'Applications', href: '/applications' }, { label: application.name }]"
  >
    <main class="flex h-full flex-col">
      <!-- The tab bar IS the bottom of the header: full-bleed, its own bottom
           border, and it does not scroll. NO PageHeading on this page. -->
      <div class="border-b border-(--border-default) pr-(--spacing-lg) pl-(--spacing-sm)">
        <div class="flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
          <TabView
            v-model:value="activeTab"
            class="min-w-0 flex-1"
          >
            <TabView.List>
              <TabView.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </TabView.List>
          </TabView>

          <!-- The page's action, trailing the tabs. `min-h-8` RESERVES a medium
               button's height for the tab that renders nothing here, so switching
               tabs never nudges the page by 2px. -->
          <div class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)">
            <Button
              v-if="activeView.action"
              :label="activeView.action.label"
              :icon="activeView.action.icon"
              :loading="actionPending"
              kind="primary"
              size="medium"
              @click="runTabAction"
            />
          </div>
        </div>
      </div>

      <!-- Only this region scrolls; each tab's view brings its own inset. -->
      <section class="min-h-0 flex-1 overflow-auto">
        <KeepAlive>
          <component
            :is="activeView.component"
            ref="viewRef"
            v-bind="activeView.props"
          />
        </KeepAlive>
      </section>
    </main>
  </AppShell>
</template>
```

- **The row is `items-center`, not `items-end`.** A 32px `size="medium"` button centres against the
  30px tab items; aligning their bottoms makes the button overhang by 2px and forces a hand-written
  `mb-*` to undo.
- **`min-w-0 flex-1` on the `TabView`** lets the tab list shrink (and scroll horizontally on a narrow
  viewport) instead of pushing the action off the row.
- **Reserve the action's height (`min-h-8`)** on the wrapper, not on the row: a row's own padding
  counts against a min-height, so a floor there never binds. Without the reservation the row is
  content-sized — 30px with tabs alone, 32px with a button — so every switch between a tab that has an
  action and one that doesn't shifts the whole page below it.
- **The tab owns the flow; the row only positions the button.** Declare the action's _label and icon_
  on the tab entry and its _behaviour_ in the view, reached through the mounted view's `defineExpose`
  — so the drawer, the form, and the pending flag never leave the file that renders them. A tab with
  nothing to create simply declares no action.
- **The active tab lives in the URL (`?tab=`)**, so it survives reload and is linkable.
- **Inside a tab, a list keeps its controls row for narrowing but takes no actions** — its create
  button was hoisted to the tab row. Two create buttons on one page is the failure this rule prevents.

### No tabs → the button rides the controls row

The first-level list above. Nothing else changes: search and filters left, the module's actions right,
`size="large"` (the row has no 30px tab items to centre against), table below.

### A tabbed page renders no `PageHeading`

The tab bar is **navigation**, not a heading — each tab is its own page, so the bar carries no `<h1>`,
and each tab's own heading (if it needs one) lives inside that tab's view. A `PageHeading` folded into
the bar would be a heading block that renders no heading.

The one page shape that shows **both** is a first-level list whose tabs sit _in content, below_ the
heading, with no border and no full-bleed inset — that is a different element, not this bar with a
flag flipped.

Each tab renders one of two bodies:

- **A list tab** → the list pattern above (controls row + flush borderless `Table`), with its create
  action **on the tab row**.
- **A settings tab** → the `ItemGroup` form: `--spacing-sm`-titled sections (`text-heading-xxs`) each
  over a flush `CardBox` + `Item.List`, committed as **one block** by a single Save bar pinned below
  the scroll region (see `webkit-form` and `webkit-ui-states`).

## Breadcrumb — first level and second-level resource nav

The breadcrumb is the **only** thing naming the page's location, which is why it renders on every
level and why first-level pages dropped their `PageHeading`. It is top chrome that says _where you
are_; it is not the page's title block.

| Level                                              | Items                                                                                                    |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **First level** — a module the sidebar routes to   | `[{ label: 'Applications' }]` — one crumb, no `href`                                                     |
| **Second level** — a resource you opened           | `[{ label: 'Applications', href: '/applications' }, { label: application.name }]`                        |
| **Second level** — a sub-page that is not a record | `[{ label: 'Deployments', href: '/deployments' }, { label: 'Async deployment' }]`                        |
| **Third level** — a typed sub-collection           | `[{ label: 'Edge DNS', href: '/edge-dns' }, { label: 'Zone', href: '/edge-dns' }, { label: zone.name }]` |
| **Focused creation flow**                          | `[{ label: 'Applications', href: '/applications' }, { label: 'Create' }]`                                |

Four rules hold across every row:

1. **First-level pages are not special-cased to hide the crumb.** One crumb is still a breadcrumb —
   it is what names the module now that there is no `PageHeading`.
2. **The second-level crumb is the resource's own name**, not the page type: `webkit-sample-vue`, not
   `Application detail`. That name is the page's identity, which is exactly why the page needs no
   heading repeating it.
3. **Every non-last crumb links; the last crumb is the current page and never links.** In a focused
   flow the crumb links are the way out alongside the back button.
4. **A tab is never a crumb.** Switching tabs does not change the breadcrumb — the tab is second-level
   _navigation within one page_, and it already has its own visible bar. It travels in `?tab=`, not in
   the trail.

## Hard rules

- **One shell per page.** A page is either a persistent-console page or a focused-creation page —
  never both, never neither.
- **Exactly one `GlobalHeader` per page.** The persistent shell renders it inside the content zone;
  the focused shell _is_ it. Never render a second header inside the content.
- **The user is always visible.** Every shell shows the account avatar; a focused flow keeps it in
  `GlobalHeader.Right`. Never ship a screen where the user looks signed out.
- **Focused flows have no sidebar.** If a create/edit/deploy page renders a sidebar, it's the wrong
  shell. Remove the sidebar or switch to a browse page.
- **Focused flows have a back way out.** A focused shell without a working `@back` (or a terminal state
  that justifies `:show-back="false"`) strands the user.
- **The header always names the location.** The breadcrumb renders on every level — a single
  first-level crumb (Home, Applications) or a nested trail (Applications › New Application). Crumb
  links (`href`) navigate; the last crumb is the current page. The sidebar toggle (`collapsible`) is
  separate chrome and on by default.
- **Compose the shells, don't hand-roll.** Build each shell from `@aziontech/webkit/global-header`,
  `/sidebar`, `/breadcrumb` (resolved via the MCP / catalog). Never build a bare `<header>`/`<nav>`
  when the primitives exist, and never import a nonexistent `@aziontech/webkit/app-layout` or
  `/creation-header`.
- **The content inset is `--spacing-md`** — the header's edge padding. Take it from your shell (applied
  once); a page that runs a full-bleed tab bar re-applies `p-(--spacing-md)` on its own content
  region. Never a bespoke `p-(--spacing-lg)` page inset.
- **A list table lives in a flush, borderless `CardBox`.** `CardBox :padded="false"` +
  `Table :border="false"`; the card is the only border. Never ship a bare bordered table, never wrap
  the table in a padded card. Where a page does carry a `PageHeading`, it sits **out** of the card,
  `--spacing-lg` above it — never buried in the card's `#header`.
- **A first-level module list carries no `PageHeading`.** The breadcrumb crumb already names the
  module; the page opens on its controls row (narrowing left, the module's actions right) over the
  table. Never ship an `<h1>` that repeats the crumb.
- **One place for the page's primary button, decided by whether the page has tabs.** Tabs → the tab
  row (`size="medium"`, `items-center`, height reserved with `min-h-8`). No tabs → the controls row
  (`size="large"`). Never both: a tab's own list must not re-render the create button its tab row
  already carries.
- **A tabbed page renders no `PageHeading`.** The tab bar is navigation; each tab's heading lives
  inside that tab's view. The active tab travels in `?tab=`.
- **The breadcrumb names the level, and a tab is never a crumb.** One unlinked crumb at first level;
  `module › resource name` at second level; every non-last crumb links. Switching tabs must not change
  the trail.

## Review output

For `/webkit-navigation <file>`, list gaps. Each:

```
✗ CreateResource.vue:12  renders a sidebar inside a create flow
  rule: One shell per page — a create flow is the focused shell, which has no sidebar.
  fix: drop the sidebar; wrap the page in your focused shell (back + brand + breadcrumb + avatar).

✗ NewResourceForm.vue:40  GlobalHeader.Right is empty on a focused flow
  rule: The user is always visible — a header with no identity reads as signed out.
  fix: render the account avatar in GlobalHeader.Right (your focused shell should anchor it for you).

✗ Applications.vue:28  PageHeading title="Applications" above the table
  rule: A first-level module list carries no PageHeading — the breadcrumb crumb already names it.
  fix: drop the heading; open on the controls row (search/filters left, + New Application right).

✗ WorkloadDetail.vue:64  create button inside the Deployments tab's own controls row
  rule: One place for the primary button — a tabbed page puts it on the tab row, not per tab.
  fix: hoist it to the tab row (size="medium"), and reach the tab's flow via defineExpose.

✗ ApplicationDetail.vue:15  breadcrumb includes the active tab ("… › Build")
  rule: A tab is never a crumb — it is navigation within one page and travels in ?tab=.
  fix: end the trail at the resource name: [{ label: 'Applications', href }, { label: app.name }].
```

End with: `navigation sound` or `N gaps — fix before polish`.

## References

- **Persistent console shell** — a shell you compose that renders exactly one `GlobalHeader` inside the
  content zone and a full-height `Sidebar` (with its header / grouped links / user footer) beside the
  page content. Not importable from webkit; you build it once and every browse page reuses it.
- **Focused creation shell** — a focused shell = one `GlobalHeader` with a back button + Azion brand +
  flow breadcrumb + account avatar, and **no** sidebar. Also consumer-composed.
- **The webkit primitives both shells wrap** (resolve each via the MCP / catalog — see "How to find the
  components"): `@aziontech/webkit/global-header` (regions `GlobalHeader.Left` / `.Middle` / `.Right` /
  `.Brand`), `@aziontech/webkit/sidebar` (+ `/sidebar-header`, `/sidebar-group`, `/sidebar-footer`),
  `@aziontech/webkit/breadcrumb`. There is no `@aziontech/webkit/app-layout` or `/creation-header` — do
  not import one.
- **Companion skills:** `webkit-form` (what fills a focused flow), `webkit-errors` (where a failure on
  the page goes), `webkit-ux-heuristics` (states + feedback), `webkit-ui-states` (locking + toast),
  `webkit-lists` (the index page around the table), `webkit-baseline-ui` (components + tokens).

## Definition of Done

- [ ] The page uses exactly one shell (persistent console **or** focused creation), matching its job.
- [ ] Exactly one `GlobalHeader` renders on the page.
- [ ] The signed-in user is visible: sidebar footer + header avatar (persistent), or the
      `GlobalHeader.Right` avatar (focused).
- [ ] Focused flows have no sidebar and a working back way out (`@back` / breadcrumb).
- [ ] The breadcrumb names the location on every level; crumb links navigate, the last crumb is current.
- [ ] Shells are composed from the webkit primitives (`global-header` / `sidebar` / `breadcrumb` via the
      MCP / catalog), not hand-rolled, and there is no dead `@aziontech/webkit/app-layout` import.
- [ ] Content inset is `--spacing-md` (from the shell); a table sits in a flush borderless `CardBox`,
      and any `PageHeading` is out of the card, `--spacing-lg` above it. No bespoke `lg` page inset.
- [ ] A first-level module list has no `PageHeading` — it opens on the controls row (narrowing left,
      module actions right) over the table.
- [ ] The page's primary button is in exactly one place: the tab row (`medium`) if the page has tabs,
      the controls row (`large`) if it doesn't — never duplicated inside a tab's own list.
- [ ] A tabbed page renders no `PageHeading`, keeps the tab row `items-center` with the action's height
      reserved, and carries the active tab in `?tab=`.
- [ ] The breadcrumb matches the level (one unlinked crumb at first level; `module › resource name` at
      second level), every non-last crumb links, and no tab appears in the trail.
