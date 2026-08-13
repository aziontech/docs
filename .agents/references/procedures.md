# Procedures

How to write steps. Every numbered procedure in Azion documentation follows these rules, whatever kind of page it sits on. Voice and UI verbs come from `style-guide.md`; sentence budgets from `simplified-technical-english.md`.

## The first step

Consolidate access and navigation into one step. Do not make "Log in" its own step when the next step is going somewhere.

**Console procedures start with the canonical string:**

```
1. Access [Azion Console](https://console.azion.com/) > **<Product>**.
```

Fill in the product: `> **Object Storage**`, `> **Firewall**`. Deeper navigation extends the chain: `> **Applications** > **your application**`.

**A single-command procedure is not a numbered list.** One lead-in sentence ending in a colon, then the command:

```
To create the bucket with the Azion CLI:

<Code lang="bash" code={`azion create bucket --name <your-bucket-name>`} />
```

Numbering starts when the procedure has two or more actions. An API procedure's lead-in names the method and endpoint: "Send a `POST` request to the buckets endpoint:" then the `curl` block.

## One action per step

A step holding two actions is a step where the second one gets skipped.

- Not: `Select **Save**, then purge the cache and confirm the TTL changed.`
- Instead: three numbered steps.

Small movements that form one gesture may share a step: "Enter a name and select **Read-only**."

## Order within a step

**Location before action.** The reader orients, then acts.

- `In the **Rules Engine** tab, select **Add Rule**.`
- Not: `Select **Add Rule** in the Rules Engine tab.`

**Purpose before action.** When a step exists for a reason the reader cannot see, lead with it.

- `To delete the rule, select **Delete**.`

**Condition before action.** `If the list is empty, select **Add**.`

## Step grammar

- **Imperative, active, present.** "Select **Save**." Never "You should select" or "The Save button should be selected."
- **Optional steps start with the literal word `(Optional)`.** `3. (Optional) Enter a description for the rule.`
- **Sub-steps are lowercase letters** (`a.`, `b.`), sub-sub-steps lowercase Roman numerals. If a step needs sub-sub-steps, the procedure wants splitting.
- **Bold the UI label, italicize the UI value.** `Set **Edge Access** to _Read-only_.`
- **UI verbs only**: select, go to, turn on, turn off, enter. Not click, hit, tap, enable, disable. The table is in `style-guide.md`.
- **Use the interface's own words.** If the button says **Save**, the step says select **Save** — not "confirm" or "apply". Do not improve on the interface's vocabulary in prose that describes it.
- **No directional language.** Name the element, not where it sits on the screen.
- **20 words per sentence, one instruction per step.** The procedural budget from `simplified-technical-english.md`.

## The lead-in

Directly before the numbered list, one sentence states the goal and ends in a colon:

```
To deploy the ruleset for your application:
```

Use a colon when the sentence immediately precedes the steps. Use a period when material sits between them, such as an admonition. Never a partial sentence that the steps complete.

## After the procedure

**One outcome sentence, always.** State what the reader now has or sees, so they can tell they succeeded without asking.

- `The bucket appears in the list with the _Read-only_ permission.`
- `The response returns `201 Created` with the bucket name.`

When the source shows no interface output, state the entailed state change instead — `The bucket has the new access level.` Never invent interface output, response codes, headers, or messages the source does not show; that distinction is what separates an outcome sentence from an invented fact.

**Warn about timing.** If a result takes time to propagate, say so and say what to do: "New rules can take a few minutes to propagate. On an unexpected response, wait and retry before diagnosing."

Follow-on tasks go in the page's `## Next steps` section, never in a "post-requisites" section.

## Multiple interfaces

When a task has a Console, CLI, and API path, the paths go in a `<Tabs>` block — one procedure per panel, Console first. Each panel opens with its own lead-in naming the interface — "To create the bucket with the Azion CLI:" — and the steps or command follow directly; do not restate the lead-in as a step. Mechanics in `components.md`; when to reach for tabs in the contributing skill's `choosing-components.md`. Never interleave two interfaces in one numbered list.

A panel whose procedure the source cannot complete keeps the facts it has and a gap marker for the rest. Do not omit a documented interface silently, and do not fill its steps from memory.
