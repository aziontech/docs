---
name: webkit-microcopy
description: The writing rules for Azion product interfaces (Console). Use whenever you author or review any interface string: page and section titles, field labels, helper text, buttons, menu and nav items, table headers, tags, tooltips, empty states, toasts, dialogs, validation messages. Fixes punctuation and capitalization (no em dash, no ampersand, no parentheses in labels, no bold in running text, sentence case with Azion product names capitalized), which surface each kind of copy belongs on (label names, description constrains, Message explains impact, Popover defines, Tag states), one word per concept (Select not Pick, Include dependencies not Additional dependencies, Deployment topology not Composition, Review and deploy not Build and activate, Application not Edge Application, and no `edge` as a prefix or a location), navigation and IA naming, and copy that survives every breakpoint.
status: active
last_updated: 2026-08-20
scope: general
enforced_by: [ui-verify, webkit-component-states, webkit-prefer-over-custom, review]
---

# Skill: webkit-microcopy

## Purpose

Interface copy is part of the design system, not a per screen decision. When one screen says "Pick a
workload" and the next says "Choose an application", when a label carries a warning that belongs in a
message, or when an em dash splices two sentences inside a toast, the product reads as assembled by
different people, and the reader pays for it with attention.

This skill fixes three things, in priority order:

1. **Mechanics.** Punctuation and capitalization are settled, not stylistic. The bans below are hard.
2. **Placement.** Every kind of copy has one surface that owns it. A label names an input; it never
   explains, warns, or gives feedback. Explanation comes **before** the input that needs it.
3. **Terminology.** One word per concept, across every surface where that concept appears.

Scope: strings the user reads inside Azion products. It does not govern docs, marketing pages, code
comments, or commit messages. Copy is authored in English; translation follows the Azion brand
glossary, and every rule here survives translation because none of it depends on a specific wording.

## How to use

- `/webkit-microcopy` while building: apply the rules to every string you write, and place each
  string on the surface that owns it before styling anything.
- `/webkit-microcopy <file|screen>` as a review: walk the seven sections in order and report each
  violation as `current → corrected`, with the surface it should move to when placement is wrong.

Related: `/webkit-ui-states` owns how loading, empty, and error **render** and where request failures
go. `/webkit-form` owns field structure and validation timing. This skill owns the **words** on all of
them.

## 1. Mechanics: the hard bans

| Ban                                        | Why                                                                                      | Instead                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Em dash and en dash** (`—`, `–`)         | Splices two thoughts into one unreadable line, and reads as unfinished editing           | A period, a comma, or a colon. Two sentences are two sentences                      |
| **Ampersand** (`&`)                        | Not a word; noise in a label                                                             | `and`                                                                               |
| **Parentheses in labels**                  | Flattens hierarchy: the aside competes with the name of the field                        | Move the aside to the field description, or to a `Message` above the group          |
| **Bold inside running text**               | Emphasis mid sentence fights the typography scale and reads as shouting                  | One idea per sentence. If it deserves prominence it deserves its own heading or tag |
| **Feedback or consequence in a label**     | The reader has to parse a warning while looking for the field name                       | `Message` before the inputs it governs                                              |
| **Exclamation marks and decorative emoji** | Infrastructure product, technical register                                               | State the fact                                                                      |
| **`please`, `sorry`, `oops`, `whoops`**    | Padding, and it apologizes instead of resolving                                          | Say what happened and what to do next                                               |
| **`simply`, `just`, `easy`, `quick`**      | Tells the reader their difficulty is their fault                                         | Delete the word; the sentence is already shorter                                    |
| **ALL CAPS for emphasis**                  | Only the overline token and acronyms are uppercase                                       | Sentence case                                                                       |
| **A colon ending a field label**           | The input already shows where the value goes                                             | `Version`, never `Version:`                                                         |
| **`...` (three periods)**                  | Not an ellipsis                                                                          | The single character `…`, and only for genuine in-progress state (`Deploying…`)     |
| **Copy that names a layout position**      | The position changes at other widths, and in a drawer or bottom sheet it is simply false | Name the thing, not where it sits (`in Deployment settings`, not `on the right`)    |

Punctuation that stays: the hyphen inside compound words (`real-time`, `read-only`, `pre-selected`),
the period at the end of a full sentence, the colon that introduces a list or a value.

**Terminal punctuation.** Full sentences take a period, including toasts, descriptions, messages, and
validation text. Fragments do not: labels, buttons, headings, nav items, table headers, tags, and
single fragment tooltips. Never mix the two styles inside one list.

## 2. Capitalization

**Sentence case everywhere.** Page titles, section headings, field labels, buttons, menu items, tab
names, table headers, tags, toasts. First word capitalized, the rest lowercase.

Three exceptions, and only three:

1. **`Azion`** is always capitalized, in every position. Never `azion`, `AZION`, or a misspelling.
2. **Azion product and entity names** keep their capitalization when they name the product or the
   Console entity: `Azion Console`, `Azion Marketplace`, `Applications`, `Workloads`, `Deployments`,
   `Firewall`, `Connectors`, `Network Lists`, `Custom Pages`, `Functions`, `Edge DNS`,
   `Object Storage`, `SQL Database`, `Variables`. The same word lowercases when it means the generic
   thing rather than the entity: `Select a network list` refers to an item, `Network Lists` is the
   page that holds them.
3. **Acronyms** are uppercase: `API`, `DNS`, `TLS`, `WAF`, `HTTP`, `URL`, `JSON`, `TTL`, `CNAME`.

```
❌ Review And Deploy        ❌ include Dependencies      ❌ Deploy to azion
✅ Review and deploy        ✅ Include dependencies      ✅ Deploy to Azion
```

## 3. Placement: which surface owns which copy

This is where most interface copy goes wrong, and it is not a wording problem. **Explain, then ask:**
anything the reader needs in order to answer appears before the input, never inside its label.

| The copy is…                               | Surface                                    | Shape                                     | Example                                                                                       |
| ------------------------------------------ | ------------------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| The name of an input                       | `Label`                                    | 1 to 3 words, no punctuation              | `Version`                                                                                     |
| A constraint or format the value must meet | field description / `HelperText`           | One short sentence, with a period         | `Lowercase letters, numbers, and hyphens.`                                                    |
| Why this input exists, or what it affects  | `Message` above the group                  | 1 to 2 sentences                          | `This connector is shared. Changing its version affects every deployment that references it.` |
| A definition, or how a feature works       | `Tooltip` / `Popover` on a help affordance | A short paragraph, optionally a docs link | What a deployment topology is                                                                 |
| The state of an object                     | `Tag` / `Badge` / `StatusIndicator`        | 1 to 2 words, never a sentence            | `Active release`, `Draft`                                                                     |
| The result of something the user did       | `Toast`                                    | One sentence, past tense, with a period   | `Deployment created.`                                                                         |
| Why a value was rejected                   | field error, inline at the field           | What is wrong plus what to do             | `Version 1.2.0 was already deployed. Select another version.`                                 |
| There is nothing here yet                  | `EmptyState`                               | One sentence plus one action              | `No deployments yet. Create your first deployment to start receiving traffic.`                |

Three consequences worth stating on their own, because each one is a real defect when skipped:

- **A repeated per row aside is a message, not a decoration.** When the same caveat would appear as a
  tag or a suffix on several rows, it belongs once, as a `Message` above them. Repeating it per row
  is visual clutter that the reader learns to skip.
- **Never compress a long explanation into a label.** If it does not fit in three words, it is not a
  label. Give it a help affordance with a `Popover`, or a `Message` above the section.
- **Optionality is not a parenthetical.** Required fields carry the required indicator. If a field's
  optionality must be said, the description says it: `Optional.` Never `Version (optional)`.

## 4. Terminology: one word per concept

The same concept uses the same word on every surface it appears on: nav item, page title, breadcrumb,
section heading, table header, dialog title, button, toast, empty state.

**Verbs.**

| Use                 | Not                                      | Note                                                          |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| `Select`            | `Pick`, `Choose`                         | For choosing among existing options                           |
| `Create`            | `New`, `Add new`, `Set up`               | The object the page lists. See the create button rule below   |
| `Include`           | `Add additional`, `Attach extra`         | See `Include dependencies` below                              |
| `Deploy`            | `Publish`, `Activate`, `Ship`, `Go live` | One verb for putting a package into traffic                   |
| `Review and deploy` | `Build and activate`                     | Names the two steps the reader actually performs              |
| `Remove`            | `Delete`                                 | Detaches a reference; the object survives                     |
| `Delete`            | `Remove`, `Destroy`, `Erase`             | Permanent. Always behind a confirmation that repeats the verb |
| `Save`              | `Apply`, `Confirm`, `Submit`, `OK`       | Persists edits to an existing object                          |
| `Cancel`            | `Back`, `Discard`, `Nevermind`           | Always exactly `Cancel`                                       |
| `Retry`             | `Try again`, `Reload`                    | After a failed request                                        |

**Nouns.** `deployment`, `release`, `version`, `workload`, `application`, `firewall`, `connector`,
`network list`, `custom page`, `function`, `dependency`, `variable`. A collection is plural
(`Workloads`), a single object is singular (`Workload`), and the page, breadcrumb, and dialog for the
same object all pick the same one.

**Settled renames.** These were decided for the deployment flow and hold product wide:

| Current                   | Corrected              | Why                                                                                                                   |
| ------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Additional dependencies` | `Include dependencies` | `Additional` reads as optional. A dynamically referenced connector or network list is required for the deploy to work |
| `Composition`             | `Deployment topology`  | Names what the screen does: how the resources connect into the package that receives traffic                          |
| `Build and activate`      | `Review and deploy`    | The reader reviews a package, then deploys it. Nothing is built at that step                                          |
| `Pick a workload`         | `Select a workload`    | One verb for selection                                                                                                |
| `Edge Application`        | `Application`          | The product dropped the prefix. `Edge` named a network the reader never configures, on an object they do              |

### The `edge` prefix

`Edge` is not part of any object's name, and it is not a fact about an object worth telling the
reader. It survives in exactly two places, and nowhere else.

**Never as a prefix on a product or entity name.** The object is an `Application`, a `Function`, a
`Firewall`, a `Connector`. The prefix is the older name for the same thing, so a screen carrying it
gives one object two names, which is the bug section 4 opens with.

```
❌ Edge Application     ❌ Edge Function     ❌ your edge applications
✅ Application          ✅ Function          ✅ your applications
```

**Never as a location in a description.** `served at the edge`, `runs on the edge`,
`stops serving traffic at the edge`: in every one of these the phrase can be deleted and the sentence
says the same thing, because the reader has no other place to serve from. Say what the object does,
not where the network does it.

```
❌ An application is the code and configuration served at the edge.
✅ An application is the code Azion runs, and the configuration it runs with.

❌ When disabled, the application is created but stops serving traffic at the edge.
✅ When disabled, the application is created but does not serve traffic.

❌ Build ultra-low latency functions that run on the edge.
✅ Build ultra-low latency functions that run on Azion.
```

**The two places it stays.** Both are cases where deleting the word loses information:

| Keep                                                                         | Because                                                                                            |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| A product whose registered name has it (`Edge DNS`)                          | It is the name, capitalized per section 2. It changes here only when the product itself is renamed |
| A layer the reader is choosing between (`Edge cache` beside `Browser cache`) | The word is the distinction. Two caches with one name is worse than the prefix                     |

Everywhere else, deleting `edge` shortens the sentence and costs the reader nothing.

**Never invent a synonym for an existing concept.** Before naming anything, search the product for
the concept and reuse the word already in use. A second word for one concept is a bug, and it costs
every future screen.

## 5. Actions

- **A button names its action, verb first**, in the reader's terms: `Deploy`, `Create workload`,
  `Include dependencies`. Never `OK`, `Submit`, `Yes`, `Continue` when a real verb exists.
- **At most three words.** A button is never a sentence.
- **A destructive confirmation repeats the verb and names the object.** The title asks, the body
  states the consequence in one sentence, the confirm button says `Delete workload`, not `Confirm`.
  The reader must be able to act on the button alone.
- **Two different actions never share a label on one screen**, and one action never changes label
  between its trigger and its confirmation.
- **An in-progress action switches to the progressive form** and keeps the same verb: `Deploy` becomes
  `Deploying…`, never `Please wait` or a bare spinner with no words.

### The create button

Every list has one create action, and its label is decided by **where the list sits**, not by
whoever built the page. Three shapes were in use across the Console for the same act: `New Workload`,
`Create Bucket`, and a bare `Connector` with a plus icon. Only one is correct.

| The list is…                                                                | Label                  | Examples                                                                        |
| --------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| A **module the sidebar routes to** (Applications, Workloads, Functions, …)  | `Create <object>`      | `Create application`, `Create function`, `Create network list`, `Create bucket` |
| A **tab or section inside a resource** (an application's Cache Settings, …) | `Add <Product Module>` | `Add Cache Settings`, `Add Device Group`, `Add Functions Instance`, `Add Rule`  |

- **`Create` at module level, `Add` inside a resource.** At module level the reader brings an object
  into existence in the collection they navigated to. Inside a resource they attach a configuration
  to the resource already open, and `Add` is what the Console says for that. This is the one place
  `Add` covers something that is created rather than attached.
- **Never a bare noun.** `Connector` under a plus icon is not a label. The icon is not the verb.
- **Never `New`.** `New Workload` and `New release` use the banned verb from section 4.
- **Capitalization follows section 2.** At module level the object is an instance, so it is
  lowercase: `Create workload`, never `Create Workload`. Inside a resource the object is the product
  module the tab is named for, so it keeps that name's exact capitalization: `Add Cache Settings`,
  `Add Functions Instance`. Acronyms stay uppercase either way: `Create WAF rule set`.
- **The label does not change on the way in.** The create page's title and breadcrumb, the drawer's
  title, and the confirm button repeat the trigger's string exactly. A button reading
  `Create variable` that opens a drawer titled `Add environment variable` is two names for one act.
- **The empty state's action is that same button.** A module's first use call to action carries the
  identical label as the heading's create button, because it starts the identical flow.

## 6. Feedback

- **An error states what happened and what to do next**, in that order, in the reader's terms. No
  blame, no apology, no raw error code without a sentence around it. A code the reader may need for
  support goes at the end, or in a copyable block.
- **Where it goes follows `/webkit-ui-states`:** a rejected value is inline at its field, a failed
  request is a toast. The words here, the routing there.
- **A success toast names the object and the outcome in the past tense.** `Deployment created.`, not
  `Success!`.
- **An empty state says what the surface is for and offers one action.** Never a bare `No data`.
- **Nothing silent.** Every action the reader takes produces a visible sentence about its outcome.

## 7. Navigation, IA, and progressive disclosure

- **One name per destination**, identical in the nav item, page title, breadcrumb, and document
  title. A rename changes all of them in the same commit.
- **Nav items are nouns**, plural for collections. Actions never appear as nav items.
- **Two or three words maximum**, and never an abbreviation that appears nowhere else in the product.
- **A section heading names the domain, not the widget:** `Deployment settings`, never
  `Settings section` or `Configuration area`.
- **A collapsed accordion's title has to be enough to decide whether to open it.** When settings are
  collapsed by default with a common option pre-selected, the closed row states the choice in effect,
  so a reader who never opens it still knows what will happen. A title that hides the current value
  makes collapsing a trap instead of a simplification.
- **Tabs are nouns and never verbs**, and a tab label matches the heading of the panel it reveals.

## 8. Copy that survives every width

Copy is responsive, or the layout is not. Write for the narrowest width the surface supports, then
let it breathe wider. Never write long and rely on truncation.

- **Labels at three words or fewer** so a two column form collapsing to one column does not wrap
  every field name.
- **Table headers at one or two words.** At narrow widths a table shows fewer columns, so the primary
  column's header must make sense with no neighbours.
- **Truncation is for data, never for interface copy.** When a value must truncate, keep the
  identifying part at the start and expose the full value through a tooltip or a copy action.
- **A button keeps its words at every width.** When a surface shows an icon only variant, the
  `ariaLabel` carries exactly the same words as the visible label it replaces.
- **An overlay's title is the same string in every presentation** it takes across breakpoints
  (dialog, drawer, bottom sheet), because it is the same task.
- **No copy that depends on position, order, or input device.** No `on the right`, no `below`, no
  `click` when the surface is also touch operated. Name the thing, and use `select` for the action.

## Review checklist

- [ ] No em dash, en dash, or ampersand anywhere in the interface strings.
- [ ] No parentheses, colon, or feedback text in any label; asides moved to description, `Message`, or
      `Popover`.
- [ ] No bold inside running text.
- [ ] Sentence case throughout, with `Azion`, product and entity names, and acronyms correct.
- [ ] Every explanation appears before the input it governs, not inside it.
- [ ] A repeated per row caveat was consolidated into one `Message`.
- [ ] One word per concept, checked against the verb and noun tables, including the settled renames.
- [ ] Every button names a real action, verb first, three words or fewer; `Cancel` is `Cancel`.
- [ ] The create button is `Create <object>` at module level, `Add <Product Module>` inside a
      resource, and the same string appears on the page or drawer it opens.
- [ ] Every error says what happened and what to do next; every success names the object.
- [ ] Nav item, page title, breadcrumb, and document title use one identical name.
- [ ] Every collapsed section's closed title states the choice in effect.
- [ ] Labels and headers survive the narrowest supported width without wrapping or truncating.
- [ ] No copy naming a position, an order, or a pointer device.

## Definition of Done

- [ ] Every string on the screen was read against sections 1 to 4, not skimmed.
- [ ] Nothing that explains, warns, or reports sits inside a label.
- [ ] No concept on the screen has two names anywhere in the product.
- [ ] The screen was read at the narrowest and widest supported width, in both themes, with real
      content and with empty content (`/webkit-ui-verify`).
