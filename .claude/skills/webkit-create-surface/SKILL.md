---
name: webkit-create-surface
description: Where a create or settings form LIVES, and what it is built from. Use whenever you add or review a flow that creates a resource, edits one, or asks a question that commits — a "New X" button, a create route, an "add" affordance inside a detail page, a settings tab. Fixes the surface (a first-level resource creates on a PAGE; anything created inside a resource opens a DRAWER; nothing creates in a dialog), the anatomy every one of them shares (Section band with a Hint glyph over a flush card of rows, control right or stacked when wide), what belongs behind the collapsed Advanced band (the endpoint's not-required, already-defaulted fields), and the commit model (create pages carry a persistent bar; settings pages mount one only once something is edited).
status: active
last_updated: 2026-08-13
scope: general
enforced_by: [ui-verify, webkit-component-states, webkit-accessibility, webkit-prefer-over-custom]
---

# Skill: webkit-create-surface

## Purpose

"Where does this form go?" gets asked once per module and answered differently every time. One team
ships a create page, the next ships a modal for the same shape of task, a third puts an inline row in
the table — and the product teaches the reader three habits for one action. The cost is not
aesthetic: a modal cannot be linked or reloaded, a page thrown up over a list destroys the context
the reader was working in, and a dialog that holds a nine-field form traps them in a box they cannot
resize.

This skill removes the question. The surface is a **property of what is being created**, not a choice
the module makes. Three rules decide it, and one anatomy is shared by all of them so a reader who has
created one resource recognizes every other.

## 1. The surface rule

> **A first-level resource creates on a PAGE. Anything created inside a resource opens a DRAWER.
> Nothing creates in a dialog.**

**First level** means a resource the primary navigation routes to directly — the things the sidebar
lists. Creating one is the whole task: the reader came to do it, nothing behind it needs to stay
visible, and the result is something they will link to, reload and share. So it gets its own URL
(`/<module>/new`), its own screen, no sidebar, and it survives a refresh and the back button.

**Inside a resource** means a thing that only exists in the context of another: a record in a zone, a
rule in an application, a column in a table, a domain on a workload. Creating one is a step in work
already underway. The list behind the drawer is the context, and it has to stay visible — the thing
being added is judged against the things already there. A page here would throw that away and make
the reader navigate back to it.

**Dialogs never create.** A dialog is for a short blocking decision with one answer — a confirmation,
a destructive guard. The moment it holds a form, it is a drawer with worse ergonomics: no resize, no
scroll room, and a stray Escape destroys typed work.

### The one exception, and how to recognize another

**Variables create in a drawer at the first level.** A variable is a `KEY=value` pair; the flow is a
repeater over one triad, and it is routinely used to paste a whole `.env` at once. A dedicated page
for that would be a page whose entire content is one repeated row.

That is the shape of the exception, and it is the only test that licenses another: **the resource is
a single small tuple, and creating it is normally done in bulk.** "It only has three fields" is not
enough — a certificate has three fields and still creates on a page, because one certificate is one
deliberate act. If you cannot say both halves of the test out loud about your resource, it creates on
a page.

### Deciding

| What you are creating                        | Surface                | Route                          |
| -------------------------------------------- | ---------------------- | ------------------------------ |
| A resource the sidebar routes to             | Page                   | `/<module>/new`                |
| A resource inside another resource           | Drawer                 | none — it opens over the owner |
| A tuple normally created in bulk (variables) | Drawer, at first level | none                           |
| A confirmation, a destructive guard          | Dialog                 | none                           |

**Settings use the create surface again.** The page that edits a resource is the page that created
it, with values in it. Same bands, same rows, same order — so the two are one object seen twice, and
nothing has to be relearned between them.

## 2. The anatomy every form shares

One shape, whether it is a page or a drawer:

```
Heading (what this is, one line)
  Section — title + Hint glyph
    card
      row: name · guidance · control
      row: name · guidance · control
  Section — title + Hint glyph
    card
      ...
  Section "Advanced" — collapsed, gear glyph
    card
      the optional, already-defaulted rows
```

- **A band is a `Section`**: a title, an optional `Hint` (the ⓘ glyph that reveals its text on hover
  or focus), and a flush card of rows. The guidance is a **Hint, not a paragraph** — a sentence
  printed under every band is prose the reader has to cross to reach the controls, and on a page of
  four bands it costs more room than the fields do. The glyph costs 20px and answers only when asked.
- **A row is the label.** The row's title names the field and its description carries the guidance,
  so there is no separate `<Label for>` and the control takes an `aria-label`. That is what makes the
  shape compact: name, guidance and control share one line's worth of height instead of three.
- **The control sits right, capped at a fixed cell width**, so every field on the page ends at the
  same x and the card reads as a column rather than a ragged edge. A switch sits hard right at its
  natural size.
- **A control that cannot work in that cell makes the row stack**: a textarea, a code block, a radio
  group, a table, an editor. Name and guidance above, control at the full measure below. This is what
  keeps the anatomy usable for long-form fields instead of forcing a page to abandon it the first
  time it needs a textarea.
- **The band step is the same everywhere**, and the page opens on that same step: header → heading →
  first band → every band after it. One rhythm, top to bottom.

## 3. Advanced is the endpoint's not-required set

A form should ask, at rest, only what has to be answered. Everything else goes into ONE collapsed
band at the end, titled **Advanced**, with a gear glyph.

A field belongs in Advanced when **all three** are true:

1. the endpoint does not require it,
2. it already carries the endpoint's own default, and
3. it is not what the reader came here to decide.

The third clause is why this cannot be inferred from `required` alone. A firewall's modules and a WAF
set's thresholds are entirely optional too — and burying them would hide the point of the form. Read
the API, then ask what the person filling this in actually came to choose.

Two consequences worth stating:

- **Nothing required is ever inside the disclosure.** A failed submit must always point at a field
  already on screen; a form that scrolls to a collapsed band to show an error is a form that hid the
  question and then blamed the reader.
- **Submitting untouched sends what the API would have applied anyway.** That is the proof the
  defaults are right. If collapsing a field changes what gets created, it was not a default.

The collapsed region must be **`inert`** while closed — the rows are still in the DOM, and without it
a keyboard user tabs into fields nobody can see.

## 4. The commit model

**Create pages carry a persistent bar.** The reader arrived to fill the form in; there is always
something to commit. Cancel and Save, on the page's own measure, at the same height as the header so
the screen is bracketed by two equal bands.

**Settings pages mount the bar only once something is edited**, and it slides up when it appears. A
settings page opens read-mostly: a Save bar pinned from the first paint is a permanent call to action
for work nobody started, spending height to say there is nothing to do. Mount it, do not merely hide
it — a hidden bar still reserves its space.

- **A page-level commit owes a Discard.** Without it the only way back is undoing each field by hand
  and hoping the bar goes away.
- **Per-band saves are for pages whose bands are genuinely separate records** (an application's build
  configuration vs. its branch controls). When the page is ONE record, a per-band Save asks which part
  of one record the reader meant.
- **Drawers commit with one Save, alone on the right.** No Cancel: the panel's X, the overlay and
  Escape are already the dismissal, and a fourth exit only competes with the commit for the eye.

### Creating is not deploying

**Save creates, and stops.** Publishing spends real infrastructure, and a button labelled Save must
not do it as a side effect. Anything that costs money or serves traffic is a separate, explicit act
from the resource itself.

The same rule kills the "Save as draft / Save and deploy" pair: two buttons where one spends
infrastructure and the other does not, with nothing on the bar saying which.

**The success toast carries the resource.** Name what was created and give the toast an action that
opens it. Without that, the reader lands on a list and has to find the row they just made — which is
the whole reason anyone reads a success toast.

## 5. The lock

One flag for the whole scope while a request is in flight. The outer `<fieldset :disabled>` is the
native safety net **and** every control takes `:disabled` from the same flag — a fieldset blocks
interaction for the subtree, but each control renders its disabled _visual_ from its own prop, so the
fieldset alone leaves the form looking live mid-submit. The commit button carries `:loading`. Release
on success **and** failure.

Validation runs **on submit only**. An empty required field gets the amber `required` prompt; a value
the endpoint cannot accept gets the red `invalid` error. Required is not an error, the two are never
both on for one field, and nothing is judged while the reader is still typing. A request-level
failure is a toast with a way to recover — never silent, and never a validation summary.

## Checklist

- [ ] First-level resource → a page at `/<module>/new`. Inside a resource → a drawer. Never a dialog.
- [ ] A first-level drawer passes BOTH halves of the exception test (small tuple **and** normally bulk).
- [ ] Settings reuse the create page's bands, in the same order.
- [ ] Every band is a Section with a title and a Hint — not a paragraph of prose.
- [ ] Rows carry the name and guidance; the control has an `aria-label`, not a separate label.
- [ ] Wide controls stack their row instead of being squeezed into the cell.
- [ ] Advanced holds only fields that are not required, already defaulted, and not the point of the form.
- [ ] Nothing required is inside the disclosure; the collapsed region is `inert`.
- [ ] Create page: persistent Cancel + Save. Settings page: bar mounts on first edit, with Discard.
- [ ] Drawer: one Save, no Cancel.
- [ ] Save creates and stops — no deploy, no publish, no charge as a side effect.
- [ ] The success toast names the resource and offers a way to open it.
- [ ] One `submitting` flag locks the fieldset AND every control; released in `finally`.
- [ ] Validation on submit only; amber `required` vs red `invalid`, never both.
