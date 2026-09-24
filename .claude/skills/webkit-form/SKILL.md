---
name: webkit-form
description: Accessible forms on @aziontech/webkit — one Form Layout spacing reference (xs inside a field, lg between fields/rows) shared by five form types (Drawer, nested Drawer, Dialog, ItemGroup settings, CardBox with independent saves) that differ only in container + save model, with two internal layouts (Cards + ItemGroups / Fields separated) composing inside each. Every field carries a real label (never a placeholder-as-label), errors are tied to the control via aria-describedby, and related fields group in a real <fieldset>/<legend>; validated only on submit with the field's own required/invalid state as the feedback — no custom error-summary block, no Message callout for field validation. The a11y companion to /webkit-ux-heuristics (states) and /webkit-ui-states (locking + toast).
status: active
last_updated: 2026-07-21
scope: general
enforced_by: [webkit-accessibility, webkit-component-states, ui-verify]
---

# Skill: webkit-form

## Purpose

Forms are where a product is most keyboard- and screen-reader-tested and most often fails: a label
that is really a placeholder, a select whose `<label for>` points at nothing, a validation error shown
only in colour, a field that never says it was required. This skill fixes the accessibility of a form
built on `@aziontech/webkit` so it is operable by keyboard, understandable by a screen reader, and
recoverable when it rejects input. It is the a11y companion to `/webkit-ux-heuristics`
(which establishes the states) and `/webkit-ui-states` (which locks the scope and
toasts request errors) — this skill owns **layout, labels, grouping, validation semantics, and submit**.

There are **two ways to lay out a form**, and both are first-class:

- **Approach A — Cards + ItemGroups.** Sections are a flush `CardBox` wrapping an `Item.List`; every
  field is one `Item` row (name/guidance on the left, control on the right). This is the default for
  **grouped, settings-style, or list-like** forms — an account settings page, a resource's config or
  create page, a create drawer.
- **Approach B — Fields separated.** Standalone `field-*` triads stacked in a column. This is for
  **short, focused, single-purpose** forms — a sign-in flow, a rename or delete-confirmation dialog, a
  short create drawer, a single step in a wizard.

Pick one per form; don't mix row-fields and stacked-fields in the same section.

## How to use

- `/webkit-form`
  Apply the layout + patterns below to any form you build in this conversation.
- `/webkit-form <file>`
  Review the file's form against the patterns and output, per gap:
  - the exact line / element (quoted),
  - which pattern it breaks (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Building or reviewing any create/edit page, settings panel, drawer form, or multi-field form.
- The user asks "is this form accessible", "wire up the labels", "the screen reader skips this",
  "where do errors go", "which layout for this form".
- After `/webkit-ux-heuristics` establishes the states and before `/webkit-ui-states` locks the async submit.

## Reach for the complete `Field*` first — loose inputs are the fallback

webkit ships two tiers of form control. **Default to the complete `Field*` component**; reach for a loose
input only when no `Field*` fits.

- **`Field*` (complete, preferred):** `FieldText`, `FieldTextarea`, `FieldPassword`, `FieldPhoneNumber`,
  `FieldRadio` / `FieldRadioBlock`, `FieldCheckbox` / `FieldCheckboxBlock`, `FieldSwitch` /
  `FieldSwitchBlock`, `FieldTextSwitch`, `FieldInputGroup`. Each bundles the **label ↔ control
  association**, the on-field `HelperText`, and the `required` / `invalid` a11y wiring (`aria-required` /
  `aria-invalid` / `aria-describedby`) that this skill otherwise asks you to wire by hand. Using it means
  the accessible-name / error-association rules below are satisfied **by construction**.
- **Loose (`InputText`, `InputNumber`, `Textarea`, `Select`, `Checkbox`, `RadioButton`, `Switch`,
  `InputGroup`, …):** the bare control, no label/helper/validation shell. Use one only when the matching
  `Field*` genuinely doesn't fit — a composed `Select` inside a custom row, a control in an `Item.Actions`
  cell, a bespoke layout the `Field*` wrapper can't express. When you do, **you** own the label
  association + `aria-describedby` per the rules below.

This is a **preference, not a prohibition**: check whether a `Field*` covers the need first; if it does,
use it; if it truly doesn't, drop to the loose control and wire the a11y yourself.

```vue
<!-- ✅ Preferred — the field owns label + helper + validation -->
<FieldText
  id="app-name"
  label="Application name"
  v-model="form.name"
  :invalid="!!errors.name"
  :helper-text="errors.name || 'Shown in the dashboard.'"
  required
/>

<!-- ⚠️ Loose — only when no Field* fits; now YOU wire the label + aria-describedby -->
<Label for="app-name">Application name</Label>
<InputText
  id="app-name"
  v-model="form.name"
  aria-describedby="app-name-help"
  :invalid="!!errors.name"
/>
<HelperText id="app-name-help">{{ errors.name || 'Shown in the dashboard.' }}</HelperText>
```

## Label association — every control names itself (both approaches)

The one non-negotiable both layouts share: every control has a **programmatic accessible name**, its
error is **tied to it**, and related controls are **grouped** — so a screen reader announces the field,
its state, and the group it belongs to. The mechanics differ per approach, the contract does not:

- **A real label, never a placeholder.** Approach B (and a composed `Select`) wires a real `<label for>`
  to the control `id` — via a `field-*` wrapper or a hand-rendered `Label`; a composed `Select` points
  `for` at `Select.Trigger`'s `id` (labelling the wrapper labels nothing). Approach A (ItemGroup) uses
  `Item.Title` as the field name and gives the control an `aria-label`. A placeholder is **never** the
  label — it disappears on input and is not a reliable accessible name.
- **Errors associated via `aria-describedby`.** The on-field `HelperText` carries an `id` and the control
  points `aria-describedby` at it, so the message is announced when focus lands; the control's
  `:required` / `:invalid` props set `aria-required` / `aria-invalid` — don't hand-roll them. A `field-*`
  wrapper wires this for you; in an ItemGroup you set `aria-describedby` on the control and the `id` on
  the `<HelperText>` yourself.
- **Groups in `<fieldset>` + `<legend>`.** Each section is a native `<fieldset>` with a `<legend>`
  (`sr-only` when a visible title already names it); a radio/checkbox set is its own `<fieldset>` whose
  `<legend>` is the question.

The sections below show each mechanism in place; this is the contract they satisfy.

## Form Layout — the spacing reference

Every form sits on the same **Form Layout**: the shared spacing spec for field rows and columns — the
gutter between columns, the vertical rhythm between rows, and the label-to-control spacing. **This is the
reference.** The _form types_ below only change the **container** the form lives in and its **save
model**; the two internal layouts (Approach A / B) compose inside any of them. The spacing itself never
changes.

### Field spacing — the macro rule (one rhythm, everywhere)

The same spacing applies in **every** container and **both** approaches. Never hand-pick a one-off gap;
if a form seems to need a different rhythm, it's in the wrong container.

| Between                                          | Token          | px                                     |
| ------------------------------------------------ | -------------- | -------------------------------------- |
| Label → control → HelperText (inside one field)  | `--spacing-xs` | 8 — already baked into every `field-*` |
| Field → field (and row → row)                    | `--spacing-lg` | 24                                     |
| Section → section                                | `--spacing-lg` | 24                                     |
| Section overline → its card (Cards + ItemGroups) | `--spacing-sm` | 12                                     |
| Compact modal body (Dialog / Drawer)             | `--spacing-md` | 16 — the **only** allowed tightening   |

### Hierarchy (top → down, never inverted)

form title (`text-heading-*` — `PageHeading size="medium"` on a page, a `CardBox` title / `text-heading-sm`
in a contained card, `DialogTitle` in a modal) → form description (`text-body-sm text-(--text-muted)`)
→ section overline (`text-overline-sm`) or sub-heading (`text-heading-xs`) → **field label** (`Label`,
which carries the required tag) → control → **helper** (`HelperText` — guidance, or the required/invalid
feedback). A label is never smaller than its helper; a section title is never smaller than a field label.

## Form types — container and save model

Every form sits on the same **Form Layout** (above); a _type_ only changes the **container** the form
lives in and its **save model**. Approach A / B still applies inside each one. There are **five form
contexts** in Azion products:

- **Drawer form.** In-context creation — the user is deep inside a navigated module and needs to create
  a resource _without leaving the page they're on_. One scoped save (the drawer's primary action).
  Approach A for grouped/config-heavy creates (one flush ItemGroup, or several overline-titled sections),
  Approach B for short ones.

- **Nested drawer.** A drawer form whose Select points at a _related_ resource that may not exist yet — a
  Function, a Cache Setting, a Team. Rather than sending the user away to create it (losing the parent
  form's in-progress state), a "Create …" quick-add opens a **second, smaller drawer** stacked over the
  first; on save the new resource is appended to the Select's options and selected back into the parent.
  **Each drawer is its own form** — its own scoped save, its own `submitting` flag, its own `<fieldset>`;
  the two never share a lock. Approach A inside each. This is the create-a-related-resource-inline case,
  documented below.

- **Dialog form.** Small, focused, usually confirmational or destructive — e.g. removing a resource.
  Few (or zero) fields, a single confirm action. Approach B (stacked fields). A destructive confirm
  typically gates its action on a typed phrase (error prevention) rather than surfacing a required-error.

- **ItemGroup settings.** Account-level configuration surfaces built from `Item` rows (Approach A). The
  rows organize **either as multiple Cards** (grouped by topic — e.g. Billing split into Plan, Payment,
  Invoices; each card titled by an `OVERLINE` above it, see Approach A § _Section title_) **or as a
  single flush block** (all rows in one container, for shorter or flat settings). Used for Billing,
  Integrations, Account Settings — "define and manage personal account preferences and profile config".

- **CardBox with independent saves.** Long configuration pages split into multiple `CardBox` sections
  where **each card owns its own save**, so the user commits changes in parts instead of one giant
  submit. Approach A inside each card.

**Save model follows partitioning, not the container type.** A form that is one logical unit has **one
save** — a Drawer, a Dialog, or an ItemGroup (whether a single flush block **or** several overline-titled
sections, like Account Settings; the sections group the topic, not the save). A form deliberately split
into independently-committed cards — the **CardBox with independent saves** type — has **one save per
card**, each locking off its own `submitting` flag (the `/webkit-ui-states` contract).

### Example — CardBox with its own save

A self-contained settings card (one of possibly several on the page, each committing independently): the
card's name is the `CardBox` **`title`** (it renders in the card header), then a short description at the
top of the body, the fields, an optional inline note, and the card's **own save in the footer**.
`CardBox`'s footer is centered by default, so a full-width `justify-between` child puts a "Learn more"
link on the left and Save on the right. Canonical pattern:

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Label from '@aziontech/webkit/label'
  import Link from '@aziontech/webkit/link'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import { reactive, ref } from 'vue'

  const form = reactive({ preprod: 'default', prod: 'default' })
  const options = [
    { label: 'Default (controlled at the team level)', value: 'default' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
  ]
  const displayValue = (v) => options.find((o) => o.value === v)?.label ?? ''
  const submitting = ref(false) // /webkit-ui-states: Save :loading + fields :disabled off one flag
</script>

<template>
  <CardBox
    title="Azion Toolbar"
    class="w-full"
  >
    <template #content>
      <!-- body rhythm: fields are --spacing-lg apart; each field triad is --spacing-xs -->
      <div class="flex flex-col gap-(--spacing-lg)">
        <p class="text-body-sm text-(--text-muted)">
          Enable the Azion Toolbar on your Deployments.
        </p>

        <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label for="tb-preprod">Pre-Production Deployments</Label>
            <Select
              v-model="form.preprod"
              size="large"
              :display-value="displayValue"
            >
              <Select.Trigger id="tb-preprod" />
              <Select.Content>
                <Select.Option
                  v-for="o in options"
                  :key="o.value"
                  :value="o.value"
                  >{{ o.label }}</Select.Option
                >
              </Select.Content>
            </Select>
          </div>
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label for="tb-prod">Production Deployments</Label>
            <Select
              v-model="form.prod"
              size="large"
              :display-value="displayValue"
            >
              <Select.Trigger id="tb-prod" />
              <Select.Content>
                <Select.Option
                  v-for="o in options"
                  :key="o.value"
                  :value="o.value"
                  >{{ o.label }}</Select.Option
                >
              </Select.Content>
            </Select>
          </div>
        </div>

        <Message severity="info">
          To use the toolbar in production your team members need the Chrome extension, or
          <a href="/docs/toolbar">enable the toolbar for that domain</a>
          in the toolbar menu.
        </Message>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <Link
          href="#"
          label="Learn more about the Azion Toolbar"
          size="medium"
        />
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="submitting"
        />
      </div>
    </template>
  </CardBox>
</template>
```

### Example — Dialog form (destructive confirm)

A modal for a short, blocking decision. Compose `Dialog` + `DialogPortal`/`DialogOverlay`/`DialogContent`
with the `Panel*` regions; the body uses the compact `--spacing-md` rhythm. The primary (destructive)
action stays disabled until the user types the exact confirmation phrase — error prevention, not a toast.
Canonical pattern:

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { computed, ref } from 'vue'

  const open = ref(false)
  const phrase = 'webkit-storybook-dev'
  const confirmation = ref('')
  const canDelete = computed(() => confirmation.value.trim() === phrase)

  const remove = () => {
    if (!canDelete.value) return
    open.value = false
    confirmation.value = ''
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Delete Application</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <!-- compact modal body: --spacing-md between blocks -->
        <PanelContent class="flex flex-col gap-(--spacing-md)">
          <Message
            severity="warning"
            label="Once confirmed, this action can't be reversed."
          />
          <p class="m-0 text-body-sm text-(--text-muted)">
            The selected Application will be deleted, along with all associated settings or
            instances.
          </p>
          <label
            for="confirm-delete"
            class="text-body-sm text-(--text-default)"
          >
            To confirm, type "{{ phrase }}" in the box below:
          </label>
          <InputText
            id="confirm-delete"
            v-model="confirmation"
            autocomplete="off"
            class="w-full"
          />
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="outlined"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            label="Delete"
            kind="danger"
            :disabled="!canDelete"
            @click="remove"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
```

### Example — Nested drawer (create a related resource inline)

A drawer form whose `Select` points at a resource the user may not have created yet. Rather than sending
them away to make it — and losing everything they've typed in the parent — a "Create …" affordance in the
`Select`'s footer opens a **second, smaller drawer** on top. The child creates the resource, appends it to
the `Select`'s options, selects it back into the parent, and closes; the parent form is exactly as the user
left it. This is the pattern behind _Functions Instance → Edge Function → Create Function_ in the
Applications module.

Three decisions make it safe:

- **Independent scopes.** The parent and child are separate `<form>`s, each with its **own** `submitting`
  flag, its own `<fieldset :disabled>`, its own Save `:loading` (the `/webkit-ui-states` Pattern 1 lock, per
  drawer). Submitting the child never locks the parent, and the parent's save never touches the child.
- **A controlled Select + a sentinel value.** The parent `Select` is **controlled** (`:model-value`, not
  `v-model`) so picking the quick-add never commits a real value. The quick-add is a normal
  `Select.Option` in the `#footer` slot carrying a sentinel value; `@update:model-value` intercepts it,
  closes the dropdown, and opens the child instead of assigning `form.*`.
- **Explicit stacking.** A webkit `Drawer` panel sits at `z-1001` and a `Select.Content` teleports to
  `<body>` at `z-50`, so each layer must opt its overlay / content / popups **above** the layer beneath
  it: the child drawer's overlay `z-1002` / content `z-1003`, any `Select.Content` inside the child
  `z-1004`; a `Select.Content` in the **parent** drawer needs `z-1002` to clear the parent panel.
  (These `!z-[…]` overrides are the current stopgap for a webkit bug where overlay popups render behind a
  `Drawer` — remove them once webkit stacks overlay content above `Drawer`.)

Canonical pattern:

```vue
<script setup>
  // PARENT large drawer holds a Select of Functions; the CHILD medium drawer creates one.
  const functions = ref([{ value: 'fn-auth', label: 'auth-handler' }])
  const functionLabel = (v) => functions.value.find((f) => f.value === v)?.label ?? ''

  // The PARENT form's own scope.
  const form = reactive({ functionId: '' })
  const errors = reactive({ functionId: '' })
  const submitting = ref(false)

  // A sentinel Select value for the quick-add. The Select is CONTROLLED (:model-value),
  // so picking the sentinel never commits a real value — it opens the child instead.
  const CREATE_FUNCTION = '__create-function__'
  const functionSelectOpen = ref(false) // control the dropdown so we can close it first
  const onFunctionModel = (value) => {
    if (value === CREATE_FUNCTION) {
      functionSelectOpen.value = false // close the dropdown …
      functionOpen.value = true // … then open the child over the parent
      return
    }
    form.functionId = value
    errors.functionId = ''
  }

  // The CHILD form's own, SEPARATE scope — its own submitting flag.
  const functionOpen = ref(false)
  const functionForm = reactive({ name: '' })
  const functionSubmitting = ref(false)

  const submitFunction = async () => {
    if (functionSubmitting.value) return // re-entrancy lock, on the CHILD's flag
    functionSubmitting.value = true
    try {
      const value = `fn-${uid()}`
      functions.value = [{ value, label: functionForm.name.trim() }, ...functions.value]
      form.functionId = value // select the new resource back into the parent
      errors.functionId = ''
      toast.success(`Function "${functionForm.name.trim()}" created.`)
      functionOpen.value = false
    } catch (error) {
      toast.error('Could not create the function.', { description: error?.message })
    } finally {
      functionSubmitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <!-- PARENT: the Function Select with a quick-add in its footer slot -->
  <Select
    :model-value="form.functionId"
    v-model:open="functionSelectOpen"
    :display-value="functionLabel"
    :disabled="submitting"
    placeholder="Select a function"
    :required="!!errors.functionId"
    @update:model-value="onFunctionModel"
  >
    <Select.Trigger
      id="fi-function"
      aria-label="Edge Function"
    />
    <Select.Content class="!z-1002">
      <!-- above the parent drawer panel (z-1001) -->
      <Select.Option
        v-for="fn in functions"
        :key="fn.value"
        :value="fn.value"
        >{{ fn.label }}</Select.Option
      >
      <template #footer>
        <Select.Option
          :value="CREATE_FUNCTION"
          icon="pi pi-plus-circle"
          >Create Function</Select.Option
        >
      </template>
    </Select.Content>
  </Select>

  <!-- CHILD medium drawer — its own form + submitting flag; stacks above the parent -->
  <Drawer
    v-model:open="functionOpen"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay class="z-1002" />
      <DrawerContent class="z-1003">
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Function"
          novalidate
          @submit.prevent="submitFunction"
        >
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="functionSubmitting"
          >
            <legend class="sr-only">Create function</legend>
            <!-- Approach A ItemGroup sections here; a nested Select uses !z-1004 -->
          </fieldset>
          <!-- PanelFooter: Cancel + Save :loading="functionSubmitting" + sr-only submit -->
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
```

Rules:

- **Parent and child are two independent forms.** Each has its own `submitting` flag, `<fieldset :disabled>`,
  and Save `:loading`; neither save locks the other. Guard each handler and release in `finally`.
- **The parent `Select` is controlled + intercepted.** Use `:model-value` (not `v-model`), a sentinel
  value for the quick-add `Select.Option` (in the `#footer` slot), and an `@update:model-value` that opens
  the child on the sentinel and only otherwise assigns `form.*` and clears the error.
- **Close the dropdown before opening the child.** Control the parent `Select`'s open state
  (`v-model:open`) and set it `false` in the same handler that opens the child, so the popup doesn't linger
  under the new drawer.
- **On the child's save, wire the resource back into the parent** — append it to the `Select`'s options,
  set the parent's model to the new value, clear the parent's error for that field, `toast.success`, close
  the child. The parent form keeps everything else the user had typed.
- **Stack every layer explicitly** — child overlay `z-1002`, child content `z-1003`, a `Select.Content`
  inside the child `z-1004`, a `Select.Content` in the parent `z-1002` (temporary overrides for the
  webkit `Drawer`/overlay-popup stacking bug).
- Everything else follows the **Drawer form** rules: Approach A ItemGroup sections inside each drawer,
  validation on submit only (`Item.Title` as the label, `HelperText` under the control), Enter submits via
  an `sr-only` `<button type="submit">`.

## Approach A — Cards + ItemGroups (grouped / settings forms)

Each section is a flush `CardBox` (`:padded="false"`) whose body is an `Item.List`. `Item.List` draws
the dividers between rows automatically, so every field reads as a divided row inside one box: the
field's name + guidance on the left (`Item.Content`), the control on the right (`Item.Actions`).
Multiple sections stack, each with a small `OVERLINE` title above its card.

**In an ItemGroup, `Item.Title` IS the label.** Do **not** use `<Label>` inside an `Item` — the field
name is `Item.Title`, its guidance is `Item.Description`, and the control carries an `aria-label` for its
accessible name. `<Label>` is reserved for **Fields separated** (Approach B) and composed `Select`
fields, where there is a real `<label for>` wired to a control `id`. (`Label` renders at
`text-label-sm`, smaller than `Item.Description` — using it as a row title inverts the hierarchy.)

**Items are `size="small"`.** Small is the density that gives grouped forms the best rhythm and
hierarchy — tight enough that a section reads as one unit, roomy enough that each row is a clear field.
Use `size="small"` on **every** `Item` in a form; reserve `medium` for content/marketing rows.
Canonical pattern:

```vue
<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import Item from '@aziontech/webkit/item'
  import InputText from '@aziontech/webkit/input-text'
</script>

<template>
  <section class="flex flex-col gap-(--spacing-sm)">
    <p class="px-(--spacing-xs) text-overline-sm text-(--text-muted)">General</p>
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item
            size="small"
            class="items-start"
          >
            <Item.Content>
              <!-- Item.Title is the label; control takes an aria-label -->
              <Item.Title>Name</Item.Title>
              <Item.Description>A unique, descriptive name for the application.</Item.Description>
            </Item.Content>
            <Item.Actions class="flex-1 justify-end">
              <!-- Control + feedback stack in one field-width column: the
                   HelperText renders UNDER the control, --spacing-xs apart, only
                   after a failed submit. An empty required field is amber
                   `required` (a prompt, NOT an error); a filled-but-malformed value
                   is red `invalid`. Emptiness picks the state — never both at once. -->
              <div class="flex w-full max-w-(--container-xl) flex-col gap-(--spacing-xs)">
                <InputText
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  :required="!!errors.name && !form.name.trim()"
                  :invalid="!!errors.name && !!form.name.trim()"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                  @update:model-value="errors.name = ''"
                />
                <HelperText
                  v-if="errors.name"
                  id="name-error"
                  :kind="form.name.trim() ? 'invalid' : 'required'"
                  :value="errors.name"
                />
              </div>
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>
  </section>
</template>
```

Rules:

- **`CardBox :padded="false"` + `Item.List`** — one box, dividers from the list, no box-in-box.
- **Every `Item` is `size="small"`.** Consistent across the whole form.
- **`Item.Title` is the label; the control takes an `aria-label`.** Name in `Item.Title`, guidance in
  `Item.Description`, control on the right in `Item.Actions class="flex-1 justify-end"`. No `<Label>`
  inside an `Item` — validation feedback is the control's own `:required`/`:invalid` on submit.
- **The validation message renders as a `HelperText` under the control.** Since there is no `Label` (so
  no `HelperText` triad) and no guidance region on the right, wrap the control in a field-width
  `flex flex-col gap-(--spacing-xs)` column — capped at `max-w-(--container-xl)` (576px) so the
  control column stays a legible field width on wide pages — and render a `<HelperText>` **below** it, shown only
  after a failed submit and linked to the control via `aria-describedby`. This is still the field saying
  what it needs, on the field — **not** a summary block or a `Message` callout. `Item.Description` stays
  as the always-on guidance on the left.
- **Required is NOT an error — pick the state by what failed.** An empty required field is a _prompt_:
  `<HelperText kind="required">` (amber) + the control's `:required` (amber). A field whose value is
  present but malformed is an _error_: `<HelperText kind="invalid">` (red) + the control's `:invalid`
  (red). Never set both `:required` and `:invalid` at once — that yields an amber border with a red
  helper. When one field can fail both ways, emptiness is the discriminator
  (`:kind="value.trim() ? 'invalid' : 'required'"`). Note `Select`/`MultiSelect` have no amber border,
  so for an empty-required Select the amber `HelperText` (and `:required` for `aria-required`) carries
  the cue — never colour it red.
- **A row whose left column wraps to two lines uses `class="items-start"`** so the title aligns to the
  control's top, not its centre.
- **Richer controls that don't fit a one-line row** (a radio group, a block of `field-radio-block`s)
  stay a full-width block inside `Item.Actions` (or their own `Item`), not forced onto the row.

### Section title — an OVERLINE above the card

When a settings surface is split into topic sections (a multi-Card ItemGroup — the Account Settings
pattern), **each section is titled by an `OVERLINE` above its flush `CardBox`**, not by the card's own
header. The `<section>` stacks the overline over the card with `--spacing-sm` (12px); the `CardBox` stays
`:padded="false"` and header-less (content only). This keeps the topic label lightweight and lets the
card read as a single divided block of rows.

```vue
<section class="flex flex-col gap-(--spacing-sm)">
  <p class="px-(--spacing-xs) text-overline-sm text-(--text-muted)">General</p>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <!-- Item rows … -->
      </Item.List>
    </template>
  </CardBox>
</section>
```

Rules:

- **The section title is `text-overline-sm text-(--text-muted)`** with `px-(--spacing-xs)`
  inset so it aligns with the card's content; `--spacing-sm` gap to the card (per the spacing macro rule).
- **The card is header-less** (`:padded="false"`, only `#content`). Don't also set a `CardBox` `title` —
  the overline is the section title; a card header would double it.
- **A dangerous section** (Danger Zone) reuses the pattern with the danger tokens: overline in
  `text-(--danger-contrast)` above a `CardBox class="border-(--danger-border) bg-(--danger)"`.
- **Overline vs `CardBox` title — pick by role.** An **OVERLINE above** the card titles a _section of a
  larger page_ (multi-Card ItemGroup). A **`CardBox` `title`** (in the card header) names a _self-contained
  card that is the form_ — the "CardBox with its own save" / Contained form. Never use both on one card.

## Approach B — Fields separated (short focused forms)

A field is a **triad**: a visible `Label`, the control, and a `HelperText`. Ship it as one of the
`@aziontech/webkit/field-*` components — they render the triad and wire the a11y for you: the `Label`'s
`for` matches the control `id`, the helper is linked via `aria-describedby`, `required` sets
`aria-required`, and `invalid` sets `aria-invalid`. Stack the fields in a single column.

The `required` tag on the `Label` is **persistent** — it advertises the field is mandatory from first
render, independent of validation. Because `field-*`'s own `label` prop couples the Label tag to the
same `required` that drives the field's amber state, render the `Label` **yourself** (always `required`)
and give the wrapper **no** `label`; then bind the wrapper's `:required` to the post-submit empty state
so only the field's amber (border + helper) is revealed on submit. Canonical pattern:

```vue
<script setup>
  import FieldText from '@aziontech/webkit/field-text'
  import Label from '@aziontech/webkit/label'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <!-- Label required ALWAYS (rendered here; the wrapper gets no `label`). Empty →
         :required (amber), the wrapper's helper flips to kind=required. A malformed
         value → :invalid (red). Never both at once. `errors.name` holds the message
         ("" = valid), so the helper falls back to guidance when clear. -->
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <Label
        for="app-name"
        required
        >Name</Label
      >
      <FieldText
        v-model="form.name"
        input-id="app-name"
        name="name"
        placeholder="my-application"
        :required="!!errors.name && !form.name.trim()"
        :invalid="!!errors.name && !!form.name.trim()"
        :helper-text="errors.name || 'A unique name for this application.'"
        @update:model-value="errors.name = ''"
      />
    </div>
  </div>
</template>
```

Available wrappers (ask the webkit MCP `suggest_component`, or read
`node_modules/@aziontech/webkit/catalog.json` (`imports`) — every key is a real subpath): `field-text`,
`field-textarea`, `field-password`, `field-phone-number`, `field-input-group`, `field-checkbox` /
`field-checkbox-block`, `field-radio` / `field-radio-block`, `field-switch` / `field-switch-block`,
`field-text-switch`.

Rules:

- **Never a bare `InputText` / `Textarea` next to a floating `<p>` "label".** Use the `field-*`
  wrapper. A placeholder is **not** a label — it vanishes on input and is not a reliable accessible name.
- **The helper region is the guidance region.** Feed it the field's guidance; on a failed submit swap it
  for the message and flip the state — `:required` (amber, `kind=required`) for an empty field,
  `:invalid` (red, `kind=invalid`) for a malformed one. Never pass both `:required` and `:invalid` true
  together (amber border + red helper). It's still the wrapper's own helper row, not a second error node.
- **A composed `Select` labels its TRIGGER, not the wrapper** — see the next pattern.

## Composed Select — label the TRIGGER, not the wrapper

There is no `field-select`. When you compose one from `Label` + `Select` + options, the focusable
element is the **trigger** (a `role="combobox"` `<button>`), and `Select`'s `$attrs` land on its outer
wrapper `<div>`, _not_ the button. So the `Label`'s `for` and the `id` must go on **`<Select.Trigger>`**.
Pointing `<label for>` at the `<Select>` wrapper labels nothing. This holds in **both** approaches.

```vue
<!-- Label required ALWAYS; empty-required → :required (amber semantics), not
     :invalid (red). Select has no amber border, so pair with a HelperText. -->
<Label for="app-country" required>Country</Label>
<Select
  v-model="form.country"
  placeholder="Select an option…"
  :required="!!errors.country"
  :display-value="labelOf(countries)"
  @update:model-value="errors.country = ''"
>
  <Select.Trigger id="app-country" />
  <Select.Content>
    <Select.Option v-for="o in countries" :key="o.value" :value="o.value">{{ o.label }}</Select.Option>
  </Select.Content>
</Select>
```

Rules:

- **`Label for` === `Select.Trigger id`.** Same string, and it must be the trigger's.
- **`Select` already sets `aria-required` / `aria-invalid`** on the trigger from its `required` /
  `invalid` props — pass the props, don't hand-roll the aria.

## Grouping — a real `<fieldset>` + `<legend>`

Each section is a **group of related controls**. Give it programmatic grouping with a native
`<fieldset>` and an `sr-only` `<legend>` (the visible section title — the `OVERLINE` or `CardBox title`
— already names it, so it isn't drawn twice). A `<fieldset>` also disables its whole subtree in one
attribute, which is how you lock the scope on submit.

```vue
<fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0" :disabled="submitting">
  <legend class="sr-only">Account settings</legend>
  <!-- sections: CardBox + Item.List (Approach A) OR stacked field-* (Approach B) -->
</fieldset>
```

Rules:

- **`<legend>` is the fieldset's first child**, and `sr-only` when a visible title already shows it.
- **Related radios/checkboxes are their own group** — a set of radios is a `<fieldset>` whose
  `<legend>` is the question; the `field-radio-block` labels are the options.

## Validation — required (amber) vs invalid (red), surfaced only on submit

Validation runs **on submit, once** — not on every keystroke, not on blur. The **feedback is the
field's own state plus an on-field `HelperText`** — there is **no separate error-summary block and no
`Message` callout** for field validation; the field says what it needs, where it is.

**Required is not an error.** Two failure kinds, two states:

- **Required-but-empty** → the amber `required` state (`:required` on the control, `HelperText
kind="required"`). It is a _prompt to fill_, not a rejection — never the red danger state.
- **Filled-but-malformed** → the red `invalid` state (`:invalid` on the control, `HelperText
kind="invalid"`). The value is present and wrong.

Never set both on one field at once (amber border + red helper is the bug this rule prevents). When a
field can fail both ways, emptiness is the discriminator. Store a real message so the `HelperText` has
something to show.

**Where a field has a `Label`, its required tag is persistent** — it shows from first render, not just
on a failed submit, so the user knows the field is mandatory before touching it. Only the field's amber
state (border + helper) is revealed on submit. Because `field-*`'s `label` prop couples the tag to the
same `required` that colours the field, render the `Label` yourself (always `required`) and leave the
wrapper's `label` unset (see Approach B). An **ItemGroup** has no `Label`, so it has no persistent tag —
its required feedback is the on-submit amber `HelperText` only.

```js
const errors = reactive({ name: '', country: '' }) // "" = valid; populated ONLY by validate()

const validate = () => {
  // Empty → a required prompt; a non-empty bad value → an invalid message.
  errors.name = form.name.trim() ? '' : 'This field is required.'
  errors.country = form.country ? '' : 'This field is required.'
  return !errors.name && !errors.country
}

const submit = async () => {
  if (submitting.value) return // re-entrancy lock
  if (!validate()) return // errors now drive :required / :invalid — no focus dance, no summary
  submitting.value = true
  try {
    await save(form)
    toast.success('Saved.')
  } catch (error) {
    toast.error('Could not save.', {
      description: error?.message,
      action: { label: 'Retry', onClick: submit }
    })
  } finally {
    submitting.value = false
  }
}
```

Rules:

- **`<form novalidate @submit.prevent>`** — own the validation; the native bubble UI is inconsistent
  and unstyleable.
- **Validate on submit only.** No live validation while the user types the first time.
- **The feedback is `:required` OR `:invalid` bound to the error** (amber for empty, red for malformed —
  never both), appearing only after a failed submit and clearing as the user edits
  (`@update:model-value="errors.x = ''"`). Colour is never the only signal — the required tag / helper
  text is the non-colour cue.
- **The message lives on the field, as a `HelperText`.** In **Fields separated** it is the `field-*`
  wrapper's own helper row (its `kind` flips to `required` when you pass `:required`, `invalid` when you
  pass `:invalid`); in an **ItemGroup** it is a `<HelperText>` rendered under the control, its `kind`
  matching the failure (`required` amber / `invalid` red — see Approach A). Either way it is
  `aria-describedby`-linked to the control and appears only after a failed submit.
- **No custom error-summary block** (`role="alert"` list of links) and **no `Message` callout** for
  field validation. Those were removed on purpose: the field's own state + its `HelperText` is the feedback.
- **Never `toast` a field error.** Missing/invalid input stays on the field. Toast is for
  request/API failures only (see `/webkit-ui-states`).

> **A server rejection scoped to one field is a different case**, and it is the one place a `Message`
> is right. The value is not malformed — the API rejected it (a referenced object was deleted, a name
> is already taken), so it takes **both** surfaces: a `Message` inside that field's own section _and_
> the field's red `invalid` state (never the amber `required` prompt — the value is present). On a
> long form, scroll-anchor the erroring section. The full placement table — field, section `Message`,
> toast, auth card, background-job toast — is **`/webkit-errors`**.

## Submission — native submit, one locked scope, sticky actions

The primary action drives the native submit so **Enter submits**. While the request runs, **one flag
locks the whole scope** — this is `/webkit-ui-states` **Pattern 1**; this skill **references it, does not
re-derive it**. Save shows `:loading`, and **every field the action reads takes `:disabled` off the same
flag**. On a long form, the actions live in a **sticky bar** so Save/Cancel are always reachable.

**Bind `:disabled` on the controls, not only the `<fieldset>`.** A native `<fieldset :disabled>` blocks
_interaction_ for the whole subtree, but webkit controls (`Select`, `Switch`, `field-*`, `InputText`)
render their **disabled visual** from their own `disabled` prop — a fieldset alone leaves them looking
active mid-submit. Keep the `<fieldset :disabled="submitting">` as the native safety net **and** pass
`:disabled="submitting"` to each control (`field-*` forward it to their inner input). Multi-save forms
(CardBox with independent saves) bind each card's controls to _that card's_ flag.

```vue
<footer
  class="sticky bottom-0 border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
>
  <div class="mx-auto flex max-w-(--container-5xl) items-center justify-end gap-(--spacing-sm) px-(--spacing-xl) py-(--spacing-sm)">
    <Button type="button" label="Cancel" kind="outlined" size="medium" :disabled="submitting" @click="cancel" />
    <Button label="Save" kind="primary" size="medium" :loading="submitting" @click="submit" />
  </div>
</footer>
```

Rules:

- **Enter must submit.** The webkit `Button` renders a native `type="button"` and doesn't forward a
  `type`, so drive `submit` from its `@click`; where the form is a drawer/dialog, add a hidden
  `<button type="submit" class="sr-only">` inside the `<form>` so Enter still submits.
- **Lock off one flag.** `<fieldset :disabled="submitting">` + `:disabled="submitting"` on **every**
  control + Save `:loading="submitting"`; guard the handler and release in `finally` (this IS
  `/webkit-ui-states` Pattern 1 — the fieldset is the native lock, the per-control
  `:disabled` is what makes webkit `Select`/`Switch`/`field-*` show the disabled visual).
- **Report the request result where the user is looking** — `toast.success` on the happy path,
  `toast.error` with a Retry on failure. Field errors stay inline.

## Disabled state — the disabled helper is optional context, not submit feedback

A `HelperText` with `kind="disabled"` (it prepends a lock glyph, muted text) is an **optional** element
whose only job is to explain **why a field is disabled** and how to lift the lock. It is **not**
validation feedback and it is **not** required by the submit lock. Two cases:

- **Submit lock — you don't need a helper, and you get none.** The `:disabled="submitting"` applied to
  every control during a save is transient (it clears in `finally`) and the Save button's `:loading`
  already says the form is busy. **Don't add a disabled-reason helper just because fields are locked
  mid-submit.** A `field-*` that already has a guidance `helper-text` keeps showing it (its `kind` flips
  to `disabled`, so the lock glyph joins it for the ~1s of the request); one with **no** `helper-text`
  renders **no helper row at all** — the field writes no copy of its own, so nothing appears and
  disappears under the field mid-save. Do **not** invent a lock explanation for a lock that lasts a
  second.

- **Persistent disable — use the disabled helper when the reason isn't obvious.** When a field is
  disabled by a **dependency** (a plan tier, a toggle that must be on first, a mode that doesn't apply),
  the disabled `HelperText` is the right, optional tool — e.g. _"Enable HTTPS support to choose HTTPS
  ports."_ It gives the user the context to understand and lift the lock. In an **ItemGroup** that
  context usually already lives in `Item.Description` (e.g. a disabled "HTTPS Ports" row whose
  description reads _"Applies when the Application serves HTTPS traffic."_), so a separate disabled
  helper is redundant — add one only when it says something the description doesn't.

Rules:

- **The submit lock needs no disabled-reason helper** — it's transient and the Save `:loading` covers it.
- **A disabled helper is optional and explains the dependency**, never validation — it answers only
  "why is this locked and how do I unlock it".
- **Don't fabricate a disabled explanation for a transient lock.** Reserve `kind="disabled"` for a
  persistent, non-obvious dependency.
- **A disabled field is never also `required`/`invalid`.** `disabled` wins the control's state (and the
  `HelperText` `kind`), so a locked field shows neither the amber required nor the red invalid cue.

## Choosing an approach

| Situation                                                            | Approach                                                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Settings page, resource config, many grouped fields, a Create drawer | **A — Cards + ItemGroups** (`Item.List`, `size="small"`)                             |
| Login, rename, a short 1–3 field dialog, one wizard step             | **B — Fields separated** (`field-*` stacked)                                         |
| A section mixes a couple of simple rows with a radio block           | **A**, with the radio block as a full-width child inside its `Item`                  |
| A drawer's Select needs a related resource that doesn't exist yet    | **Nested drawer** — quick-add opens a second drawer; each drawer its own scoped save |

The module **create** action for a long form lands on a dedicated **page** (route `/<module>/new`), not
a modal, so it is linkable and back-button-safe; a short create can live in a drawer.

## Review output

For `/webkit-form <file>`, list gaps grouped by pattern. Each:

```
✗ SomeForm.vue:NN  <Label for="runtime" /> but no element has id="runtime"
  pattern: composed Select labels its trigger — for points at nothing; the combobox has no accessible name.
  fix: add id="runtime" to <Select.Trigger>, matching the Label's for.

✗ SomeForm.vue:NN  <Item> with no size
  pattern: Cards + ItemGroups — form Items are size="small" for rhythm/hierarchy.
  fix: <Item size="small">.
```

End with: `form is accessible` or `N gaps — fix before polish`.

## References

- Field wrappers, `Label`, `HelperText`, `Item`, `CardBox`, `Select`, `Button` import paths: ask the
  webkit MCP `suggest_component`, or read `node_modules/@aziontech/webkit/catalog.json` (`imports`) —
  every key is a real subpath.
- Companion skills: `/webkit-ux-heuristics` (states + inline error placement), `/webkit-ui-states`
  (lock-the-scope + toast for request errors), and `/webkit-errors` (where every failure goes: the
  field, a section `Message`, a toast, the auth card — including the signed-out screens, which never
  toast).
- Token catalog (spacing, colour, shape, typography): the `@aziontech/theme` tokens (the `--*` CSS
  variables it ships; the webkit MCP lists them).
- Compose only webkit components and theme tokens — no external UI libraries, no hex/rgb colours, no
  component-local CSS.

## Definition of Done

- [ ] Every control is a complete `Field*` (`FieldText`, `FieldTextarea`, `FieldPassword`, `FieldRadioBlock`,
      `FieldSwitch`, …) unless no `Field*` fits; a loose input (`InputText`, `Select`, …) is used only as
      the fallback, and then the label + `aria-describedby` are wired by hand.
- [ ] The form type fits the flow (Drawer / nested Drawer / Dialog / ItemGroup settings / CardBox with
      independent saves), and the **save model follows partitioning**: one save for a logical unit (Drawer,
      Dialog, or an ItemGroup — single block _or_ multiple overline-titled sections); one save per card only
      for the CardBox-with-independent-saves type.
- [ ] A **nested drawer** keeps parent and child as independent forms — each its own `submitting` flag,
      `<fieldset :disabled>`, and Save `:loading`; the parent `Select` is controlled with a sentinel
      quick-add; the child wires its new resource back into the parent on save; every layer is stacked
      explicitly (child overlay/content and any nested `Select.Content` above the parent panel).
- [ ] Field spacing follows the macro rule: `--spacing-xs` inside a field, `--spacing-lg` between fields
      and sections (`--spacing-md` only in a compact modal body). No one-off gaps.
- [ ] Hierarchy is not inverted: title → description → section title → field label → control → helper.
- [ ] Section titling matches role: a multi-Card ItemGroup titles each section with an `OVERLINE`
      (`text-overline-sm`) above a header-less flush `CardBox`; a self-contained card that _is_ the form
      uses the `CardBox` `title` in its header. Never both on one card.
- [ ] The form uses **one** layout: Cards + ItemGroups (`Item.List`, every `Item` `size="small"`) or
      Fields separated (`field-*` stacked) — not a mix within a section.
- [ ] Field naming matches the type: in an **ItemGroup**, `Item.Title` is the label and the control
      takes an `aria-label` (no `<Label>` inside an `Item`); in **Fields separated**, a real `Label`
      (or `field-*` wrapper) with `for`→`id`, and a composed `Select` labels its trigger. No bare
      control with a floating `<p>` label, no placeholder-as-label.
- [ ] Where a required field has a `Label`, its required tag is **persistent** (always `required`, not
      revealed on submit) — render the `Label` yourself and leave the `field-*` `label` unset so the tag
      stays on while only the field's amber state is revealed on submit.
- [ ] Each section is a native `<fieldset>` with an `sr-only` `<legend>`.
- [ ] Validation runs on submit only; feedback is the field's state **and** an on-field `HelperText`
      message (the `field-*` helper row in Fields separated; a `<HelperText>` under the control in an
      ItemGroup), bound to the error and cleared on edit. Required-but-empty uses the amber `required`
      state/`kind` (required is NOT an error); filled-but-malformed uses the red `invalid` state/`kind`;
      never both on one field. No error-summary block, no `Message` callout for field validation.
- [ ] `<form novalidate @submit.prevent>`; Enter submits; the scope locks off one flag
      (`<fieldset :disabled>` **and** `:disabled` on every control + Save `:loading`, per `/webkit-ui-states`
      Pattern 1); request errors toast, field errors stay inline.
