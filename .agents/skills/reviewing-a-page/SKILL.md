---
name: reviewing-a-page
description: Use when auditing an existing Azion documentation page for problems — checking frontmatter and permalinks against the build gates, finding pages that mix content types or use the wrong components, catching legacy product names, or reviewing a docs pull request. Reports problems ranked by severity; it does not rewrite.
---

# Reviewing a page

Audits a page and reports what is wrong, ranked. It does not fix anything. To act on the findings, load the `contributing` skill.

Paths are relative to this skill directory unless they start with `.agents/`, which means repo root.

## Input

A file path, a directory, or a diff. If given a directory, review each page and report per page.

## Process

**1. Read the page in full.** Including frontmatter. Do not review from a diff alone if the file is available; a diff hides the frontmatter that most P0 findings depend on.

**2. Find its translation** by matching `namespace` across the other language tree. Several checks compare the pair.

**3. Decide which content type the page is.** Several checks depend on it. Tutorials and how-tos are procedural and take the 20-word sentence cap; reference and explanation are descriptive and take 25. A step holding two instructions is a P1 finding on a procedural page and not a finding at all on a descriptive one.

**4. Run the three check sets in order.** Stop reporting a category once you have found it three times on one page; say "and N more" instead of listing every instance.

| Check set | Read |
| --- | --- |
| P0, breaks the build or ships broken | `references/mechanical-checks.md` |
| P1, wrong shape or wrong words | `references/structural-checks.md` |
| P2, voice and formatting | `references/editorial-checks.md` |

**5. Report.** Format below.

## Output format

```
## <file path>

**Verdict:** <one sentence: is this page sound, fixable, or does it need restructuring>

### P0 — blocks merge
- **<what>** (line N). <why it breaks>. Fix: <specific change>.

### P1 — fix before publishing
- **<what>** (line N). <why it is wrong>. Fix: <specific change>.

### P2 — worth fixing
- **<what>** (line N). Fix: <specific change>.

### Checked and clean
<one line naming what you verified and found correct>
```

Omit any tier with no findings. Never pad a tier to make the review look thorough.

## Rules

**Every finding names a line and a fix.** "The structure is unclear" is not a finding. "Lines 40 to 91 are a Console walkthrough inside a page under `reference/`; move them to a how-to and link it" is.

**Do not report what CI already catches**, unless the page is not yet building. The frontmatter validator will name a missing `namespace` more reliably than you will.

**Severity is about consequence, not effort.** A one-character permalink typo is P0 because the page 404s. A whole page in the wrong content type is P1 because it still works, just badly.

**Uncertainty is a finding, not a silence.** If you cannot tell whether a limit is current, say so and name what would settle it. Do not guess and do not omit.

**Do not flag prose you would merely have written differently.** Voice is not a defect. `editorial-checks.md` lists what actually counts.

## Self-reference escape hatch

These reference files quote bad examples on purpose. When reviewing a file inside `.agents/`, do not flag:

- Legacy product names appearing in a "use this, not that" table
- Forbidden expressions listed as forbidden
- `:::warning` shown as an example of what not to write
- Dead component names in a do-not-use list

The rule is about what a page *asserts*, not what strings it contains.
