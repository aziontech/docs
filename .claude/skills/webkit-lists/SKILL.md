---
name: webkit-lists
description: The list page — the one shape every resource index takes on @aziontech/webkit, and the filter system that narrows it. Fixes the page skeleton (shell → page heading carrying the create action → controls row → filter bar → card-wrapped Table), the split between search and filters (search runs through the table's own global filter; filters pre-narrow the data outside it), and the filter model itself — a field catalog the page declares plus a flat `{ fieldId: values[] }` applied state where fields intersect and the values inside one field union. Ships the chip-bar composition (one Popover walking fields then values, one chip per field, dimmed until it narrows something) so filtering looks and behaves the same on every index in the product, instead of one Select per column on one page and an operator builder on the next. Use when building or reviewing any resource index, list, or "all X" page. The page-level companion to /webkit-tables (which owns the Table and its cell recipes).
status: active
last_updated: 2026-08-24
scope: general
enforced_by: [webkit-prefer-over-custom, webkit-component-states, webkit-styling, ui-verify, review]
---

# Skill: webkit-lists

## Purpose

A product's list pages are the screens people spend the most time on and the ones that drift the fastest.
Each one is built by whoever needed it, so one index puts a row of Selects above the table, the next hides
the same job behind a badged funnel button, a third uses an operator builder with a `contains` dropdown
nobody changes from the default — and none of them agree on where the search field goes or how much air
sits between the controls and the rows they narrow.

They are all the same page. This skill fixes that page: **one skeleton**, **one filter model**, and **one
rule for which columns become filters**. `/webkit-tables` owns what happens inside the `Table` — the
column model, the toolbar, the cell recipes. This skill owns everything around it: the page's structure,
the controls row, the filter bar, and the state that connects them.

Find the components named here through the `webkit` MCP (`suggest_component` / `get_component`) or
`node_modules/@aziontech/webkit/catalog.json`.

## How to use

- `/webkit-lists` — build any index page in this conversation to the shape below.
- `/webkit-lists <file>` — review that page against the patterns; per gap report the exact line/element
  (quoted), which pattern it breaks (one sentence), and the concrete fix.

Related: `/webkit-tables` (the Table, columns, cells) · `/webkit-navigation` (the app shell the page sits
in) · `/webkit-ui-states` (the empty and loading states a filtered list must render) ·
`/webkit-microcopy` (field labels, the empty-state sentence).

## When to invoke

- Building any "all X" / resource index / management list page.
- Adding filtering to an existing table, or being asked "how do I filter this".
- Reviewing a page whose controls row has grown a third `Select`.
- The user says the filters look different from the other pages, the table jumps to an empty page after
  filtering, or the search and the filters fight each other.

---

## 1. The list page, one shape

A heading, then three nested bands, and nothing else:

```vue
<template>
  <AppShell
    active="applications"
    :breadcrumb="[{ label: 'Applications' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- THE PAGE HEADING. At first level this is the only place the module's name
           appears: the shell renders the breadcrumb from the SECOND crumb up, so the
           single crumb above is passed and not drawn. The create action lives HERE,
           and it is the page's one `large` control. -->
      <PageHeading
        size="medium"
        title="Applications"
        description="Build, deploy, and manage your applications."
      >
        <template #actions>
          <Button
            label="Create application"
            kind="primary"
            size="large"
            icon="pi pi-plus"
          />
        </template>
      </PageHeading>

      <!-- the band below the heading; `layout-section-start` opens it at the boundary
           step, and zeroes itself when the heading is absent (empty account) -->
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <!-- ONE band: the controls, the filters, and the rows they narrow -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- NARROWING ONLY, and all of it `medium`. The page's own action is in the
               heading above; `#actions` here is for an action on the LISTING (a bulk
               operation over the rows a filter selected), and is omitted when there is
               none. -->
          <ControlsHeader>
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search applications..."
              aria-label="Search applications"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft
                ><i
                  class="pi pi-search"
                  aria-hidden="true"
              /></template>
            </InputText>
          </ControlsHeader>

          <FilterBar
            v-model="filters"
            :fields="filterFields"
          />

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="visibleRows"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  @row-click="open"
                />
              </template>
            </CardBox>
          </section>
        </section>
      </section>
    </main>
  </AppShell>
</template>
```

**A first-level module index opens with a `PageHeading`, and the module's create action lives in it.**
The crumb does not name the page any more: the shell draws the breadcrumb only from the **second** crumb
up (`/webkit-navigation`), because at first level a lone crumb repeated the word the highlighted nav row
was already showing. So the heading is the only place the module's name appears in the content — a page
without one is named nowhere but the rail. Title, one line of what the module is, `size="medium"`, and the
create button in `#actions`.

**The size ladder is what makes the two rows read as two rows.** The heading's action is the page's only
`large` (40px) control; **everything** on the controls row is `medium` (32px) — search, the filter anchor,
any listing action beside them. That difference IS the hierarchy: what the page is _for_ reads first, what
_narrows_ the list reads second. At 40px both rows competed and the create button stopped being the
biggest thing on screen. Promote or demote a row **whole**: one 32px control beside a 40px one leaves a
4px break top and bottom.

**Where each action goes.** The page's create action is the heading's; `ControlsHeader #actions` is for an
action on the **listing** — a bulk operation over the rows a filter selected — and renders nothing when
there is none. Never move the create button onto the controls row: its place would then depend on how the
list is filtered, or on whether the list has rows at all.

**The label is not a per-page choice.** A list the sidebar routes to reads `Create <object>`, the object
lowercase because it is an instance and not the module (`Create application`, `Create network list`); a
list that is a **tab inside a resource** reads `Add <Product Module>` in that module's exact
capitalization (`Add Cache Settings`). Never a bare noun, never `New` — see `/webkit-microcopy`.

**Two states keep the heading out of the way.** An empty account leads with its first-use screen instead
(`v-if="!accountEmpty"`), whose hero already names the module; and `layout-section-start` zeroes its own
step when it lands first, so the band below needs no change when the heading is absent.

(A _second_-level list — a tab inside a resource — carries a `size="small"` heading: there the crumb
_does_ name the resource, so the heading only labels the list inside it.)

**The controls, the filter bar and the table are ONE band**, joined by the group step
(`--layout-group-gap`), not the section step. They are not three things stacked on a page; they are one
thing — a set of rows and the two controls that narrow it. Pushing the search a full section step away
from the table it filters is the single most common version of this page done wrong.

**The card is unpadded and the table is unbordered** (`:padded="false"` + `:border="false"`), so the card
frames the table edge to edge. A padded card inside a bordered table gives you two nested rectangles with
a stripe of dead space between them.

**Empty and loading are the table's, not the page's.** Pass `:loading` and let the `Table` render its
skeleton; render the empty state through `EmptyState` — see `/webkit-ui-states`. A filtered-to-nothing
list needs a _different_ sentence from a genuinely empty account ("No applications match these filters"
vs "Create your first application"), and only the page knows which it is.

---

## 2. Search and filters narrow different things

They are not two flavours of the same control, and they do not live in the same place.

|         | Search                                               | Filters                                           |
| ------- | ---------------------------------------------------- | ------------------------------------------------- |
| Answers | "where is the one I already know the name of"        | "show me the subset that shares a property"       |
| Runs    | inside the table, `v-model:globalFilter`             | outside it, over `:data` before the table sees it |
| Covers  | the free-text columns (name, id, repository, domain) | the enumerable ones (status, type, author, date)  |
| Lives   | in the controls row, growing to fill it              | in its own row below                              |

```js
const visibleRows = computed(() => applyFilters(allRows.value, filterFields, filters.value))
// → :data="visibleRows"   v-model:globalFilter="search"
```

**Filters narrow `:data` from outside the table** for two reasons. First, a field is often not a column at
all — "Author" is a tooltip on the Last Modified avatar, not its own column, and a filter on it could
never come from the table's own column state. Second, the table's applied-filter band only exists once a
filter exists, so the affordance that _starts_ filtering has nowhere to live inside the table.

**The filter bar is its own row, and it wraps.** It grows every time a filter is applied — a chip gains a
value half, and on a narrow viewport the row becomes two rows. Sitting it inside the controls row makes
the search field jump width as filters come and go. It never scrolls horizontally: a filter you cannot
see is a filter you will not remove.

---

## 3. The field catalog — the columns decide the fields

The page declares what it can be narrowed by. Only the page knows which of its columns are enumerable and
how a row answers for each one, so the catalog is page data, not a component prop schema:

```js
const filterFields = [
  {
    id: 'author', // key in the applied state
    label: 'Author', // chip prefix and menu row
    kind: 'options', // many values, or exactly one
    options: authorOptions, // [{ value, label, avatar?, icon? }]
    match: (row, values) => values.includes(row.author)
  },
  {
    id: 'status',
    label: 'Status',
    kind: 'options',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' }
    ],
    match: (row, values) => values.includes(row.status)
  },
  {
    id: 'modified',
    label: 'Last Modified',
    kind: 'range', // one window at a time
    options: DATE_PRESETS, // 24h · 7d · 30d · 3m · Custom…
    formatValue: formatDateRange, // for a value not in `options`
    match: (row, values) => matchDate(row.modifiedAt, values)
  }
]
```

**Which columns become fields:**

- **Enumerable column → one field.** Status, type, environment, runtime, author, team. If you can list its
  values, it is a field.
- **Date column → relative periods, plus `Custom…`.** People arrive asking "what changed this week", not
  "what changed between the 3rd and the 9th". Ship the periods as the values and put the month grid behind
  a `Custom…` row, so the common ask is one click and the rare one costs the extra step it is worth. The
  periods are open-ended (`end: null`) — each means _since_, and pinning the end to `now` silently drops a
  row that lands while the panel is open.
- **Free-text column → nothing.** Name, id, repository, domain are covered by the search field. One field
  per text column gives you six chips nobody opens.
- **A column with two values that are never both interesting → nothing.** A field that is always set to
  the same value is a control with one option.

**`kind` says how many values a field holds, not how it looks.** `options` accumulates — three authors is
still one filter on Author. `range` replaces — two date windows at once contradict each other, so picking
a second swaps it and picking the same one again clears it. The bar reads `kind` to decide whether picking
a value keeps the panel open or returns to the field list.

**Order the options the way the domain does, not alphabetically,** when the domain has an order:
Production · Staging · Development reads as a promotion path; Development · Production · Staging reads as
a sorted list of unrelated words.

---

## 4. The applied state — one flat object

```js
const filters = ref({}) // { status: ['Active'], modified: ['7d'] }
```

Keyed by field id, each holding the **array** of picked values. A missing or empty entry is not a filter.
That one rule is what the whole bar reads from:

| Question                          | Answer                                                     |
| --------------------------------- | ---------------------------------------------------------- |
| Is this field narrowing anything? | its entry is non-empty                                     |
| How many filters are applied?     | the count of non-empty entries — never the count of values |
| What does the chip show?          | the first pick's label, plus `+N` for the rest             |
| Which chips are dimmed?           | the ones whose entry is empty                              |

**Fields intersect; the values inside a field union.** Author _and_ Status, but author A _or_ author B.
Every list filter implies this arrangement and almost none of them state it, so state it once in one
helper instead of re-deriving it per page:

```js
export const applyFilters = (rows, fields, state) =>
  rows.filter((row) =>
    fields.every((field) => {
      const values = state[field.id]
      if (!values?.length) return true
      return field.match(row, values)
    })
  )
```

**Count fields, not values.** Three authors is one filter on Author; reading "3" suggests three columns are
cut when only one is.

**The chip's value half names something concrete.** "Author Bruno Germano +2" beats "3 selected": they are
the same width, and the second tells you nothing — you have to open the panel to learn a single one of the
three, which is the exact cost the whole pattern exists to remove.

---

## 5. Compose the bar from webkit primitives

There is no `@aziontech/webkit/filter-bar`. The bar is a small component you own, built from `Popover` and
`Chip`, because the field catalog and its `match` functions are your data — a package component would have
to take them as props anyway, and then you would own the same file with more indirection.

**Anatomy:**

```
[⚙ Add Filter ▾]  [Author · Bruno Germano +2 ×]  [Status]  [Last Modified]
 dashed chip,      filled chip, removable          outlined chips —
 opens the panel                                   available, not applied
```

- **One anchor, not one popover per chip.** A single `Popover` whose panel walks two levels: the field list,
  then that field's values. Clicking any chip opens the panel _onto that field_. One anchor means one focus
  contract and one dismiss contract, instead of N popovers competing to be open.
- **The trigger is a `Chip kind="dashed"`** — the dashed border is the "add one" affordance, and it sits in
  the same row as the chips it creates. A `Chip` with `clickable` works as a `Popover.Trigger` child from
  the keyboard: `Enter`/`Space` dispatch a real click.
- **Applied chips are `kind="filled"` + `removable`; idle chips are `kind="outlined"`.** Every field gets a
  chip, always, in catalog order — the bar shows what the page _can_ be narrowed by, not only what it is.
- **Never reorder the chips.** Moving an applied chip to the front re-inserts its DOM node, which discards
  any transition that was about to run on it, and moves the target out from under the pointer that just
  clicked it.
- **The remove `×` clears the field, and the chip stays.** `Chip` emits `remove` and does not unmount
  itself — presence is yours. Here the chip must survive its own removal: it goes from filled back to
  outlined, because the field is still available.
- **One search field serves both levels.** Typing narrows the field list at level one and the value list at
  level two.
- **Keyboard: `↑`/`↓` walk the rows of the _current_ level only.** Scope the query to the level's own
  container, or a level sliding out will steal focus.
- **Restore focus to the chip that opened the panel**, not to the bar.

**Accessibility:** value rows carry `role="menuitemcheckbox"` when the field accumulates and
`role="menuitemradio"` when it replaces. The trigger's accessible name carries the applied count out loud
("Add filter, 2 applied") — a count badge that is only a coloured dot is invisible to a screen reader.

---

## 6. Rewind pagination when the filters change

Filtering `:data` from outside the table does **not** trip the table's own auto-reset, because from its
point of view the data simply changed. Filter down from page 4 and you land on an empty page 4.

```js
watch(filters, () => {
  pagination.value = { ...pagination.value, pageIndex: 0 }
})
```

Rewind on anything that re-narrows the set from outside: the filters, and a tenancy/scope switch.

**Fold the four repeated pieces into one helper** rather than re-typing them per page — the applied-state
ref, `applyFilters`, the pagination ref, and this watcher. Every index page then declares its catalog and
its columns and nothing else.

---

## Hard rules

- The controls row, the filter bar and the table are **one band** at the group step — never a section step
  between the search and the rows it filters.
- A first-level module index **opens with a `PageHeading`** (`size="medium"`) carrying the module's
  create action — the breadcrumb starts at the second level, so nothing else names the page.
- **The heading's action is the page's only `large` control; the whole controls row is `medium`.**
- `CardBox :padded="false"` + `Table :border="false"` — never a padded card around a bordered table.
- **Search runs inside the table** (`v-model:globalFilter`); **filters narrow `:data` outside it**. Never
  route a membership filter through an operator builder — `is one of` on every row is a control with one
  option.
- **No row of Selects** above the table, and no badged funnel button hiding them. One chip row, one anchor.
- The filter bar **wraps; it never scrolls horizontally**.
- The applied state is `{ fieldId: values[] }` — flat, arrays, empty means absent. Not a list of
  `{ field, operator, value }` conditions.
- **Count fields, not values.**
- Chips render in **catalog order, always** — applied chips are never floated to the front.
- **Rewind `pageIndex` to 0** whenever the filters or the scope change.
- A free-text column does **not** get a field; the search field covers it.
- Every field needs a `match` — the catalog is what narrows the rows, not a parallel `if` chain in the page.

## Review output

Per gap:

```
✗ ApplicationsList.vue:38
  quoted: <section class="layout-section-start flex flex-col gap-(--layout-section-gap)">
  rule:   the controls row and the table it narrows are one band, joined at the group step
  fix:    gap-(--layout-group-gap) — keep the section step for the gap ABOVE the band

✗ WorkloadsIndex.vue:71
  quoted: <Select v-model="statusFilter" :options="statusOptions" />
  rule:   filtering is one chip row behind one anchor, not one Select per column
  fix:    declare status in the field catalog and render the shared filter bar

✗ ConnectorsList.vue:22
  quoted: <ControlsHeader> … <template #actions><Button label="New Connector" size="large" /></template>
  rule:   the create action is the PAGE's, so it belongs to the heading — the controls row
          narrows the list and runs entirely at `medium`
  fix:    add the size="medium" PageHeading (the crumb no longer names the page) and move the
          button into its #actions as `Create connector`, large
```

Close with `List sound` or `N gaps — fix before polish`.

## References

- `/webkit-tables` — the `Table`, the column model, the toolbar and the cell recipes inside the card.
- `/webkit-navigation` — the shell the page sits in and how its nav row is activated.
- `/webkit-ui-states` — the loading skeleton, and the two different empty states (no rows vs no matches).
- `/webkit-microcopy` — field labels, the empty-state sentence, the search placeholder.
- Components used here, all resolvable through the MCP or the catalog: `Table`, `CardBox`, `Popover`,
  `Chip`, `InputText`, `Button`, `EmptyState`, `Avatar`, `Tooltip`.

## Definition of Done

- [ ] Page is shell → column → heading → section → one band holding controls, filters and the card.
- [ ] First-level index carries a `size="medium"` `PageHeading` with the create action in `#actions`.
- [ ] Heading action `large`; every control on the controls row `medium`.
- [ ] Search is in the controls row and bound to the table's global filter; filters narrow `:data`.
- [ ] A field catalog exists, with a `match` per field and `kind` chosen deliberately.
- [ ] Every enumerable column is a field; no free-text column is.
- [ ] The date field offers relative periods plus `Custom…`, and its periods are open-ended.
- [ ] Applied state is `{ fieldId: values[] }`; the applied count counts fields.
- [ ] One anchor, chips in catalog order, applied chips filled and removable, idle chips outlined.
- [ ] The `×` clears the field and the chip remains, dimmed.
- [ ] Value rows carry `menuitemcheckbox` / `menuitemradio`; the trigger's name says the applied count.
- [ ] `↑`/`↓` are scoped to the current level; focus returns to the chip that opened the panel.
- [ ] `pageIndex` rewinds to 0 on any filter or scope change.
- [ ] Filtered-to-nothing renders a different empty state from a genuinely empty account.
- [ ] Verified in both themes with `/webkit-ui-verify`.
