# Customer-facing filter and redaction rules

These rules apply to raw input that looks like an internal engineering digest (Slack deploy summary, PR/commit list, sprint changelog) — the kind of input that mixes customer-visible changes with pure internal engineering work, ticket IDs, and Slack noise. They are mandatory, not optional style advice.

## Step 0 — strip formatting noise

Before classifying anything, discard: Slack emoji shortcodes (`:sparkles:`, `:bug:`, `:hmm:`, `:tada:`, etc.), section labels that are just process categories (`Feat:`, `Fix:`, `Refactor:`, `Chore:`), and any `[TICKET-ID]` or `[NO-ISSUE]` prefix. None of this is customer-facing content — it's raw material to classify, not text to reuse.

## Step 1 — classify every remaining item: Include / Exclude / Ask

| Classify as | When |
|---|---|
| **Include** | The item describes a behavior, UI, API, or capability change an Azion customer can observe or is directly affected by — a new feature, a visible bug fix, a documented API/CLI change. |
| **Exclude by default** | The item is a pure internal refactor, code migration, internal service rename, test hardening, or internal tooling change with no stated customer-visible effect. Commit labeled `Refactor:` / `Chore:` is a strong signal, but not automatic — read the description for a customer-visible side effect before excluding. |
| **Ask the user** | Anything you cannot confidently place in the two rows above: cosmetic/low-severity fixes where "is this release-note worthy" is a product-owner call, infra/routing changes where customer impact is unclear, or a `Refactor:`-labeled item that also mentions a UI/behavior change. **Do not guess — surface these to the user as a short list and let them decide include/exclude**, per the skill's rule 1. |

Never silently include something you're unsure about, and never silently pad the notes with internal work to look more comprehensive — a shorter, accurate list is correct behavior, not an incomplete one.

## Step 2 — redact/never expose

Strip these from the final release note text even when they appear in the raw input or in a linked Jira ticket:

- **Ticket/issue IDs** — `ENG-46685`, `NO-ISSUE`, Jira keys of any project prefix. Look up the ticket for context (see `jira-enrichment.md`), but the key itself never appears in the published note.
- **Person names** — commit authors, Jira reporters/assignees, reviewer names, Slack handles/@mentions. Customer-facing notes describe what changed, never who changed it.
- **Internal-only component/service/variable names** — internal microservice names, internal library/vendor integrations, internal feature-flag names, internal file/variable identifiers (e.g. "DeviceAtlas variable", "feedback service v2", internal queue/table names). If the raw text names something like this, either omit the detail entirely or restate the change in terms of customer-visible effect only.
- **Internal implementation reasoning** that isn't needed to understand the fix, e.g. "single source of truth for account identity" — keep the customer-visible symptom and resolution, drop the internal design rationale.

### How to tell "public Azion term" from "internal-only name" — grep, don't guess

Before using any product/feature/component name in a release note, confirm it's real Azion public vocabulary by grepping the docs tree itself:

```bash
grep -rl "<term>" src/content/docs/en
```

- If it shows up in public docs (e.g. `WAF Tuning`, `Real-Time Events`, `Single Sign-On`) — safe to use verbatim.
- If it returns nothing (e.g. `DeviceAtlas`, `feedback service`) — treat it as internal. Either drop that detail or, only if truly needed to explain customer impact, describe it generically without the internal name (e.g. instead of "removed DeviceAtlas variable from rules engine form fields," you'd need a customer-visible reason to write anything at all — if there isn't one, this item is **Exclude**, not a rewording exercise).

This grep is the fixed, repeatable check — don't rely on judgment alone for whether a name is "public enough."

## Worked triage — the Console deploy digest example

Given a raw digest like:

```
Azion Console - DEPLOY :hmm:
:sparkles: Feat:
Feat: Real Time Events Improvements
:bug: Fix:
[ENG-46685] Fix: switch account keeps stale account (single source of truth for account identity)
[ENG-46609] Fix: prevent long email overflow in profile menu
[ENG-46594] Fix: resolve search returning error
[NO-ISSUE] Fix: exclude /sse from index.html redirect rule
[ENG-37279] Fix: render external sidebar links as anchors to avoid 404 on current tab
[ENG-37439] Fix: Domain not showing in WAF Tuning listing due to pagination
[ENG-46386] Fix: unsaved changes prompt shown on domain edit without modifications
[ENG-37379] fix: send active federated IdP id on Azion SSO rollback
:sparkles: Refactor:
[ENG-46254] Refactor: migrate feedback service to v2 and improve feedback dialog
[ENG-46653] Refactor: remove DeviceAtlas variable from rules engine form fields
[ENG-46968] Refactor: harden real-time-events filters and WAF domain pagination
```

Triage:

| Item | Classification | Why |
|---|---|---|
| Real Time Events Improvements | Include (enrich if a ticket existed — here there isn't one, so ask the user for specifics if too vague to write a concrete bullet) | Matches existing public "Real-Time Events" area, customer-visible |
| switch account keeps stale account | Include | Customer sees wrong account data after switching — clear customer impact. Drop "(single source of truth for account identity)" — internal rationale |
| prevent long email overflow in profile menu | **Ask** | Cosmetic/low-severity UI fix — relevance is a judgment call, ask before including |
| resolve search returning error | Include | Broken customer-facing search feature |
| exclude /sse from index.html redirect rule | **Ask** | Infra/routing-level change, unclear if customers ever hit this — surface it rather than guessing |
| render external sidebar links as anchors to avoid 404 | Include | Customer-visible broken link/404 fixed |
| Domain not showing in WAF Tuning listing due to pagination | Include | `WAF Tuning` is public vocabulary (confirmed via grep); pagination bug hid real customer data |
| unsaved changes prompt shown without modifications | Include | Annoying but real, observable UX bug |
| send active federated IdP id on Azion SSO rollback | Include, but look up the Jira ticket first | Commit message is too technical to write a customer-facing sentence from directly — needs enrichment (see `jira-enrichment.md`) to state the actual customer-visible SSO symptom |
| migrate feedback service to v2 and improve feedback dialog | **Ask** (lean Exclude for the migration half) | "feedback service" is internal (not in public docs); "improve feedback dialog" might be customer-visible — ask the user whether the dialog change is worth a note |
| remove DeviceAtlas variable from rules engine form fields | Exclude | `DeviceAtlas` is internal (not in public docs), no stated customer-visible effect |
| harden real-time-events filters and WAF domain pagination | **Ask** | Could overlap with the pagination bug already fixed above, or be internal-only hardening — ask rather than risk a duplicate or an internal-only entry |

Note how many items end up **Ask** or **Exclude** here — that's expected for a raw engineering digest. A high inclusion rate is a signal you didn't filter carefully enough.
