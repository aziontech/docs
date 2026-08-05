# Jira enrichment

When raw input references a Jira issue (e.g. `[ENG-46685]`, `ENG-37379`), look it up before writing the note whenever the commit-message text alone isn't enough to describe the customer-visible impact clearly. Terse engineering shorthand ("send active federated IdP id on Azion SSO rollback") almost never is — enrich it.

## Detecting issue keys

Match `[A-Z][A-Z0-9]{1,9}-\d+` in the raw input. This naturally excludes placeholders like `[NO-ISSUE]` (no trailing digits). Strip the brackets to get the key, e.g. `[ENG-46685]` → `ENG-46685`.

## Looking up the issue

Use the Jira MCP tools (load schemas first with `ToolSearch("select:mcp__jira__getJiraIssue")` or search by key with `mcp__jira__searchJiraIssuesUsingJql`). Fetch the issue's summary and description to understand:

- What the actual user-facing symptom was (not just the internal fix description)
- Whether it's customer-facing at all — some tickets that look like bugs from the commit message turn out to be pure internal/infra work once you read the full description, and vice versa
- Any acceptance criteria or repro steps that clarify the real-world scenario a customer hit

If the lookup fails (no access, issue not found, or the MCP tools aren't available in this session), fall back to the commit message alone, and if it's still too ambiguous to state a clear customer impact, treat the item as **Ask** per `customer-facing-filter.md` rather than inventing detail.

## What to carry over from the ticket — and what never to carry over

Carry over: the plain-language description of the customer-visible symptom and the fix, translated into the same past-tense bullet style as the rest of the release notes (see `formatting-rules.md` §7).

Never carry over, even though it's sitting right there in the ticket:
- The issue key itself (`ENG-46685`) — never appears in the published note (`customer-facing-filter.md` step 2)
- Reporter, assignee, or any commenter names
- Internal component/service names that don't grep-match in `src/content/docs/en` (same check as `customer-facing-filter.md`)
- Internal-only fields: sprint name, story points, internal Slack thread links, linked internal tickets
- Root-cause engineering detail that isn't needed to understand the customer impact (stack traces, internal variable names, internal architecture rationale)

## Example

Ticket `ENG-37379`, summary/description (hypothetical shape of what you'd read back): "During SSO rollback, the app sent the previously active federated IdP's ID instead of the newly selected one, causing some users to be authenticated against the wrong identity provider after an admin reverted an SSO configuration change."

Customer-facing rewrite: `- **SSO Rollback**: Fixed an issue where rolling back an SSO configuration change could authenticate users against the wrong identity provider.`

No ticket ID, no internal field/variable names, no reporter — just the customer-visible symptom and that it's fixed.
