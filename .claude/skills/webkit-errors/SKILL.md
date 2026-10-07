---
name: webkit-errors
description: Where an error goes in a @aziontech/webkit app, and what it carries when it gets there. One decision table covering all five cases — client-side validation on the field, a server rejection scoped to one field as a Message in that section (plus the field's invalid state and a scroll anchor on a long form), an unscoped request failure as a toast with Retry, the signed-out screens where auth NEVER toasts and every outcome lands in one card Message, and the async failure that outlives its screen as a permanent closable toast. Use when building or reviewing any submit, any auth screen, or any long-running action. Built on @aziontech/webkit/message, /toast, /field-*.
status: active
last_updated: 2026-08-13
scope: general
enforced_by: [webkit-component-states, webkit-accessibility, ui-verify]
---

# Skill: webkit-errors

## Purpose

Every screen that talks to a server can fail, and almost every failure gets put in the wrong place —
usually a toast, because a toast is the easiest thing to reach for and it always compiles. A toast is
wrong for a field the user must fix (it dismisses itself and points nowhere), wrong for a sign-in
(it flies away from the only object on the page and stacks one card per attempt), and _right_ for
exactly one case most apps never handle: the failure that arrives after the user has walked away.

This skill fixes **where an error goes**, **what it carries when it gets there**, and **what it
says**. It is the error half of `webkit-ui-states` (which owns the full loading / empty / partial
state surface) and the failure half of `webkit-form` (which owns the field and submit mechanics).

## How to use

- `/webkit-errors`
  Apply the placement table below to every failure path in this conversation.
- `/webkit-errors <file>`
  Review the file and output, per gap:
  - the exact line / handler (quoted),
  - which row of the table it breaks (1 short sentence),
  - the concrete fix, naming the surface and what it must carry.

## When to invoke

- Writing or reviewing any `catch` around a submit, a create, a delete, or a sign-in.
- Building a signed-out screen (sign in, sign up, reset password, MFA).
- Building a long-running action (deploy, import, provision) the user can navigate away from.
- The user asks "where does this error go", "should this be a toast", "the error disappeared before
  I read it", "the user can't find what failed", "how do I show a 500".

## How to find the components

Never guess an import path — files move. Resolve every primitive the same way:

- Ask the **webkit MCP** — `suggest_component` in plain words ("inline message", "toast", "password
  field").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

The surfaces this skill uses — `message`, `toast`, the `field-*` family, `helper-text` — all resolve
this way. Use **@aziontech/theme tokens** for spacing and color, never raw px or hex.

## The one question

> **What can the user do about it, and will they still be there when it lands?**

Everything below follows from that. The failure's HTTP status does not decide the surface — its
_recoverability_ and the user's _presence_ do.

| The failure…                                                     | Goes to                                                                            | Carries                                            |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| **1.** Empty or malformed input, caught before any request       | the **field itself** — amber `required` prompt / red `invalid`                     | nothing — the field is the recovery                |
| **2.** Server rejection **scoped to one field**                  | a **`Message`** inside **that field's own section**, + the field's `invalid` state | the fix, in words; on a long form, a scroll anchor |
| **3.** Request failed, tied to **no** field (5xx, network)       | **`toast.error`**                                                                  | **Retry**                                          |
| **4.** Anything on a **signed-out** screen                       | **one `Message` in the card** — auth never toasts                                  | Retry only if the user can't fix it                |
| **5.** A failure that arrives **after the user left the screen** | a **permanent, closable toast** — the only global surface                          | the ways out (retry + an escape)                   |

Rows 1–3 are the create-form ladder. Row 4 is the same question asked where the answer collapses to
one surface. Row 5 is the inversion: the page that owned the error may not be mounted any more.

## 1. Client-side validation → the field

An empty or malformed value never reaches the server, so it never reaches a `Message` or a toast. It
belongs on the control that holds it. Validate **on submit**, not on every keystroke, and keep the two
states distinct:

- **amber `required`** — the value is missing. A prompt, not an accusation.
- **red `invalid`** — the value is present and wrong.

Mechanics (the `field-*` triad, `aria-describedby`, submit-time validation, the locked scope) live in
**`/webkit-form`**. The only rule this skill adds: **client-side validation is the one thing that does
not go in a `Message`.** The `Message` is for what the **server** said.

## 2. Server rejection scoped to one field → a `Message` in that section

The case most apps get wrong. Two people work the same module: User 1 fills in a form and links a
resource; User 2 deletes that resource through the API before User 1 saves. User 1's browser is never
told — its copy of the list is simply stale. The create request is the moment the drift surfaces, and
the API rejects it naming the field.

This is neither field validation (nothing the user typed is malformed) nor a plain request failure
(it _is_ tied to a field). It is a third case, and it decides the surface:

```js
try {
  await createApplication(payload)
} catch (error) {
  if (error?.code === 'object_not_found' && error?.field === 'connectorId') {
    // Field-scoped rejection → the section that owns the field…
    originError.value =
      `Connector "${connectorLabel(payload.connectorId)}" no longer exists. ` +
      `Another user deleted it while you were filling in this form, so the ` +
      `Application wasn't created. Nothing else was lost: reload the connector ` +
      `list and select another one.`
    // …plus the field's own state. The value is PRESENT but no longer valid,
    // so it is the red `invalid`, never the amber `required` prompt.
    errors.connectorId = 'This connector no longer exists.'
  } else {
    // Unscoped → row 3.
    toast.error('Could not create the application.', {
      description: error?.message ?? 'Check your connection and try again.',
      action: { label: 'Retry', onClick: () => submit() }
    })
  }
} finally {
  submitting.value = false // release the lock on success AND failure
}
```

- **A toast is wrong here**: it dismisses itself and points nowhere, while the only place the user can
  recover is one `Select`, possibly six sections down.
- **The `Message` renders inside that section's own heading region**, so the section that needs
  attention carries the notice itself. Animate the region's height so nothing below it jumps.
- **It stays until the user recovers** — no auto-dismiss on something that names a required action.
- **The field takes its own state too.** The `Message` says what happened; the red `invalid` field
  says _which control_ to touch. Neither alone is enough on a long form.
- **Nothing is lost.** The form keeps every value: the request was rejected, not partially applied.
  Say so in the copy — that sentence is what stops the user from starting over.

### On a long form, add a positional scroll anchor

If the erroring section can be below the fold, telling the user is not enough — you have to _take_
them there. Smooth-scroll the scroll container to the section's own offset, parked just under the top
edge, then land focus on the field to fix:

```js
if (originError.value) {
  await nextTick()
  scrollToOriginAnchor() // primary: the section becomes the scroll anchor
  focusConnector() // and the caret lands on the field, un-trapped
}
```

Three details that decide whether this works:

- **Move the user only after the lock is released.** The scope is `:disabled` while submitting, and a
  disabled control cannot take focus.
- **Compute the target container-relative** (`container.scrollTop + section.top - container.top -
offset`), so it is correct wherever the section sits and however far the container is already
  scrolled.
- **Re-assert once the message region has finished expanding.** At the first scroll the region is
  still collapsed, so the container is shorter than it will be — near the end of a long form that is
  enough for the browser to clamp the target and leave the section short of the anchor. A second call
  after the expand is a no-op when the first one landed.
- **Honour `prefers-reduced-motion`**: `behavior: 'auto'` instead of `'smooth'`.

Focus is moved, not trapped — the rest of the form stays reachable by keyboard the whole time.

## 3. Unscoped request failure → `toast.error` + Retry

A 5xx or a network failure that names no field has nowhere better to go: there is no control to
attach it to, and blocking the whole form with a banner over-weights something a retry may fix.

- Use the typed shortcut (`toast.error`), not a generic notification with a severity prop.
- **Carry `Retry`**, and make sure the lock was released in `finally` so the action can actually re-run.
- Say what failed and what to do next — see the words section below.

The mechanics of the in-flight lock (one flag, trigger `:loading`, every field `:disabled`, released
in `finally`) belong to **`/webkit-ui-states`**.

## 4. Signed-out screens → auth never toasts

On the signed-out screens the placement question collapses to **one answer**, and it is the one most
apps get backwards:

> **Auth never toasts.** Every outcome the server returns — including success — lands in **one
> `Message`, inside the card, in the same slot, at the same size.**

A toast is wrong here for reasons that do not apply inside the console. There is exactly **one object
on the page and the user cannot leave it**, so a notice that flies to a screen corner has travelled
away from the only thing they are looking at. It **self-dismisses**, so the reason a sign-in failed can
expire while the user is still typing. And it **stacks**: three attempts leave three corner cards
saying the same thing, none of them near the fields.

| Outcome                           | Status        | Severity  | Carries             |
| --------------------------------- | ------------- | --------- | ------------------- |
| signed in / account created       | 200           | `success` | nothing             |
| credentials rejected              | 401           | `danger`  | nothing             |
| the service itself is down        | 503           | `warning` | Retry               |
| request failed, tied to no field  | 500           | `danger`  | Retry               |
| no answer came back               | (no response) | `warning` | Retry               |
| the address is already registered | 409           | `danger`  | two exits, as links |

With the placement settled, three decisions are left per outcome:

1. **401 is not field-scoped.** Which half of the pair is wrong is not yours to disclose — saying
   "wrong password" confirms the address exists. So it goes above **both** fields, and the password is
   cleared and refocused under it.
2. **Whether the `Message` carries an action, decided by whether the user can fix it.** After a 401 the
   credentials are right there to retype, so a button would only repeat the form. A 503, a 500 and a
   timeout are fixable by nobody, so the `Message` carries the one move left — **Retry** — and stays
   until it works. A 409 _is_ fixable, but not only here, so it carries the two exits (sign in, reset
   your password) as links in the copy.
3. **Severity follows certainty, not severity of tone.** A 500 is a failure → `danger`. A timeout is an
   _unknown_ → `warning`: the POST may well have landed, so its copy must not claim the account was
   not created.

**Client-side validation is still row 1**, even here: an empty or malformed value is caught before any
request and belongs on the field.

Two rendering notes worth carrying over:

- **`size="small"` on every auth `Message`.** It sits inside a card under a heading — it is a notice on
  the form, not a second banner competing with it.
- **Put the copy in the default slot, not the `label` prop**, if any variant needs to slot links; and
  animate the notice's entrance on a **wrapper**, not on `<Message>` itself (the component sets an
  inline `transition` on its own root, and an inline style beats a utility class).

## 5. The failure that outlives its screen → a permanent, closable toast

A deploy takes tens of seconds, asks nothing of the user while it runs, and the whole point of it being
async is that they are free to go elsewhere. So its error has nowhere on the originating page to land —
that page may not be mounted when the failure arrives. This inverts everything above:

| The failure arrives…                   | Report it in…                         |
| -------------------------------------- | ------------------------------------- |
| while the user is on the form          | a `Message` in the owning section     |
| scoped to one field they must fix      | + that field's `invalid` state        |
| after they left, from a background job | a **toast** — the only global surface |

Three things follow:

1. **The run cannot live in the component.** Its timer, state and toast live at module scope in a small
   store, so navigating away does not cancel it — the page unmounting is not an event the run hears.
2. **Progress is a `loading` toast** (spinner, `duration: 0`, not closable). It is the only thing that
   travels with the user through the whole app.
3. **The error toast is permanent and closable.** `duration: 0` — a failure the user was not present for
   must not expire unseen — and `closable: true`, because anything that never expires must be
   dismissible by hand. It carries **both ways out** (retry, and an escape to the module that lists the
   runs), because once dismissed the toast was the only reference to the failure on screen.

The success counterpart is the ordinary case: `duration: 6000`, closable, no action needed.

## Severity, and the words

- **`danger`** = it failed, and we know it failed. **`warning`** = we don't know (a timeout, a service
  that may recover). Never dress an unknown as a failure; the copy must not claim an outcome the
  server never confirmed.
- **Every error says what happened and what to do next**, in that order. `"Could not create the
application. Check your connection and try again."` — not `"Error 500"`.
- **The status code goes last**, if at all. It is for the support ticket, not the lede.
- **Say what was _not_ lost.** On a rejected submit, `"Nothing else was lost"` is the sentence that
  stops a user from re-entering a six-section form.
- **`Retry`**, never "Try again". Sentence case, no em dash. Full copy rules: **`/webkit-microcopy`**.

## Hard rules

- **Never a toast for a field-level error.** If the user must fix a control, the error renders on or
  beside that control.
- **Never a toast on a signed-out screen.** Every auth outcome lands in one `Message` in the card.
- **A field-scoped server rejection takes both surfaces** — the `Message` in its section _and_ the
  field's red `invalid` state. Never the amber `required` prompt: the value is present, just no longer
  valid.
- **Never auto-dismiss an error that names a required action.** `Message`s stay until recovery;
  background-job error toasts are `duration: 0` **and** `closable`.
- **Release the lock in `finally`**, on success and failure alike — otherwise Retry cannot re-run.
- **Move the user to the problem only after the lock is released**; a disabled control cannot take
  focus.
- **Never scroll or focus without honouring `prefers-reduced-motion`.**
- **An async run's state never lives in the component that started it.** If unmounting the page can
  cancel the run or lose the failure, the run is in the wrong place.
- **Never claim an outcome the server did not confirm.** A timeout is a `warning` about an unknown.

## Review output

For `/webkit-errors <file>`, list gaps. Each:

```
✗ CreateApplication.vue:118  toast.error for a rejection that names `connectorId`
  rule: A field-scoped rejection goes to a Message in that field's section, not a toast.
  fix: render Message severity="danger" in the Origin section + set the field's invalid state.

✗ SignIn.vue:64  toast.error('Incorrect credentials')
  rule: Auth never toasts — one Message in the card, same slot, every outcome.
  fix: render a size="small" danger Message above both fields; clear and refocus the password.

✗ Deploy.vue:52  error toast uses the default duration
  rule: A failure the user was not present for must not expire unseen.
  fix: duration: 0 + closable: true, carrying Redeploy and an escape to Deployments.

✗ ErrorValidation.vue:301  scrollToSection() runs before `submitting` is released
  rule: Move the user only after the lock is released — a disabled control cannot take focus.
  fix: scroll + focus after the `finally`, then re-assert once the message region has expanded.
```

End with: `errors placed correctly` or `N gaps — fix before polish`.

## References

- **Surfaces** (resolve each via the MCP / catalog — see "How to find the components"):
  `@aziontech/webkit/message` (inline notice: `severity`, `size`, `#action` slot, default slot for
  copy with links), `@aziontech/webkit/toast` (`toast.error` / `.success` / `.loading`, `duration`,
  `closable`, `action`), the `@aziontech/webkit/field-*` family + `/helper-text` (the field's own
  required / invalid state).
- **Companion skills:** `/webkit-form` (the field triad, submit-time validation, the locked scope),
  `/webkit-ui-states` (the full loading / empty / partial / error surface and async behaviour),
  `/webkit-microcopy` (what the words are), `/webkit-navigation` (which shell the failing page sits
  in), `/webkit-ux-heuristics` (the right component per moment).

## Definition of Done

- [ ] Every `catch` on the screen routes to a surface picked from the table — not to whichever one was
      easiest.
- [ ] Client-side validation renders on the field (amber `required` / red `invalid`), never in a
      `Message` or a toast.
- [ ] Field-scoped server rejections render a `Message` in the owning section **and** set that field's
      red `invalid` state, and say what was not lost.
- [ ] On a long form, the erroring section is scroll-anchored and the field takes focus — after the
      lock is released, re-asserted after the message region expands, `prefers-reduced-motion` honoured.
- [ ] Unscoped request failures use `toast.error` and carry `Retry`, with the lock released in
      `finally`.
- [ ] No signed-out screen toasts: every auth outcome is one `size="small"` `Message` in the card, and
      only the outcomes the user cannot fix carry an action.
- [ ] A long-running action's state lives outside the component; its progress is a non-dismissing
      `loading` toast and its failure a `duration: 0` + `closable` toast carrying both ways out.
- [ ] Severity matches certainty (`warning` for an unknown, `danger` for a confirmed failure), and every
      message says what happened then what to do next.
