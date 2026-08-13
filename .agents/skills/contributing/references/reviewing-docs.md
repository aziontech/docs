# Reviewing docs

Audit a page, a set of pages, or a docs PR, and report what is wrong, ranked. A review does not rewrite; it names the defect, the line, and the fix.

## Process

1. **Read the page in full, including frontmatter.** Do not review from a diff alone when the file is available; a diff hides the frontmatter that most severe findings depend on.
2. **Find its translation** by matching `namespace` across the other language tree. Several checks compare the pair.
3. **Decide the page's kind first**, from `content-types.md`. The kind file names the required opening move, section order, and closing — those are checks. The kind's base form sets the sentence budget: 20 words procedural, 25 descriptive. A step holding two instructions is P1 on a procedural page and no finding on a descriptive one.
4. **Run the three tiers below in order.** Stop reporting a category after three instances on one page; say "and N more" instead.
5. **Report** in the output format at the end.

## P0 — breaks the build, or ships broken and silent

**Frontmatter gates.** Missing `title`, `namespace`, or `permalink`; a permalink outside `/^[a-z0-9\-\/]+$/` (uppercase, underscores, dots, spaces, accents all fail); a permalink or namespace duplicated within its language.

**Permalink carries a language prefix.** `/en/documentation/...` renders at `/en/en/...`. The language comes from the directory tree; Portuguese permalinks use `/documentacao/...` with no `/pt-br` prefix.

**Namespace does not match the translation.** The highest-value check, because nothing else catches it: the build passes, CI passes, and the language switcher silently stops working. Report it P0 even though nothing fails. Inside the repository, the verification commands are in `information-architecture.md`.

**MDX that fails to parse.** Bare `<br>` (must be `<br />` or `<br></br>`); an unclosed tag; bare `<` or `{` in prose; an unescaped backtick or `${` inside `<Code code={...}>`.

**Components that render and do not work.** `<Tabs>` without `client:visible`; `<Tag>` without `client:only="vue"`; a `tab.x` with no `panel.x`; markdown inside a `<Fragment>` without blank lines around it; `:::warning`, which is not a valid aside; any component from the do-not-use list in `.agents/references/components.md`.

**A body H1.** The `title` field renders the H1; a `#` in the body produces two. Ignore `#` inside code, where it is a comment.

**`---` immediately after the frontmatter.** Parsed as an empty frontmatter block.

**A specific you can show is wrong.** A limit, default, field name, or error string that contradicts the source of truth. If you cannot verify it either way, it is P1 — never silence.

## P1 — wrong shape or wrong words

**Mixed kinds.** The most common structural defect. Signals:

| Signal | Diagnosis |
| --- | --- |
| Numbered click-steps on a reference page | How-to filed as reference |
| Three paragraphs of background before the first step | Concept trapped inside a how-to |
| A settings table inside a concept page | Reference trapped inside a concept |
| Steps that branch on "depending on" | A tutorial that is really a how-to |
| Headings in no discernible order | No kind was ever chosen |

Report which kind the page mostly is, which content does not belong, and where it should go. Large splits point at the split procedure in `information-architecture.md`.

**The kind's skeleton is broken.** The opening move is missing or off-formula — a tutorial that does not open "In this tutorial, you will..."; an overview with no capability definition; a changelog entry that does not lead with the product. Required sections missing or out of order: no `## Prerequisites` on a tutorial, prerequisites in an aside instead of the H2, a reference page with no `## Limits` when the product has them. The closing missing or wrong: a how-to without `## Next steps`, a concept without `## Related resources`.

**A step holds more than one instruction** on a procedural page. The reader executes steps one at a time, and the second action gets skipped. Flag: `Select **Save**, then purge the cache and confirm the TTL changed.` Fix: three steps.

**A procedure with no outcome sentence.** The reader cannot tell they succeeded. Every procedure ends by stating what the reader now has or sees.

**Legacy product names.**

| Flag | Replace with |
| --- | --- |
| Edge Application, Edge Applications | Applications |
| Edge Functions | Functions |
| Edge Firewall | Firewall |
| Azion Edge Platform | Azion Web Platform |
| Marketplace da Azion | Azion Marketplace |

**Historical documents are exempt**: changelogs, release notes, and dated agreements keep the names they were written with. So are directory names and URLs — paths are not prose. Most legacy hits in the corpus sit inside the exemptions, and a checker without them produces mostly noise.

**Plain markdown where a component is the convention.** A `> ` blockquote used as a callout (should be an aside); three sequential sections for Console, CLI, and API (should be one `<Tabs>` block); a bare link styled as a call to action (should be `<LinkButton>`).

**Over the size caps.** From `.agents/references/page-size.md`: a `##` section over 4,000 characters or a page over 16,000 is P1; over the 2,000/8,000 targets is P2. Exempt: complete reference tables, `<Tabs>` sections, changelogs, legal agreements. Also flag, regardless of size, any section that cannot be read alone: an opening pronoun with no referent in the section, "as mentioned above", a heading too generic to match a search.

**Links.** Relative instead of absolute; missing the language prefix; missing the trailing slash; a Portuguese page linking to English when a Portuguese page exists; an asset path carrying a language prefix.

**Translation drift.** Untranslated aside labels on a Portuguese page (`:::note[nota]`, `:::tip[dica]`, `:::caution[Atenção]`); a `menu_namespace` differing from the English page; accented characters in a permalink; a term from the substitution table in `.agents/references/terminology.md` (`borda`, `aplicativo`, `desempenho`).

**Code samples.** A plausible-looking fake value a reader might paste as-is — placeholders must be obvious (`[TOKEN VALUE]`, `<your-bucket-name>`, `example.com`, the reserved IP ranges). Any credential, real or fake. A language tag outside the set in `.agents/references/components.md` — Terraform is `hcl`.

**Forbidden expressions**, any language: `digital landscape` · `digital transformation` · `empower` · `plethora` · `shed light` · `realm` · `beacon`.

## P2 — voice and formatting

Calibrate first. Documentation legitimately uses bullets, tables, dense bold on UI labels, hedging for accuracy, em dashes, and repeated parallel structure across siblings. Flagging those buries the findings that matter. What follows is what actually counts.

**Contractions.** Any contraction in documentation prose is a finding. "Do not", never "don't".

**"We".** The actor is "Azion" or "you".

**Promotional language.** An adjective selling an Azion product: "powerful caching", "seamless integration", "robust security". The same words describing behavior are fine — "a robust retry policy". Also the substitution set: "Perfect for" → "Use for", "Best for" → "Use when", "enables you to" → the action.

**Non-standard link phrasing.** "Learn more about...", "click here", "read more", a bare URL in prose. The formulas are in `.agents/references/style-guide.md`.

**UI verbs.** "Click", "hit", "tap"; "enable"/"disable" for a toggle. The verbs are select, go to, turn on, turn off, enter.

**A non-canonical Console first step.** Console procedures open with `Access [Azion Console](https://console.azion.com/) > **<Product>**.` — not "log in", not "in the side menu". The spec is `.agents/references/procedures.md`.

**The description contract.** A frontmatter description under 50 or over 160 characters, restating the title, or opening with "This page describes...", "Learn how to...", "Learn more about...".

**Rhetorical questions**, especially as headings. `What is caching?` is `Caching`.

**Title-case headings.** Sentence case always — but check capitalized words against the product names in `.agents/references/terminology.md` first. `## Cache Settings` naming the product is correct; `## Main Settings` is not. A checker that skips this step floods the report.

**Gerund headings.** A task heading starts with the bare imperative: `Creating a bucket` becomes `Create a bucket`. Not a finding when the `-ing` word names a thing (`Getting started`, `Monitoring`) or appears later in the heading. Report once per page as a pattern with a count, never one finding per heading.

**A "How to" title.** Titles are bare imperative verb phrases: `Create a bucket`, not `How to create a bucket`. Flag on new and rewritten pages.

**Condescension and padding.** "Simply", "just", "easy", "obvious"; "please"; "note that", "it is important to note"; "in order to"; "e.g."/"i.e."/"etc.". The full tables are in `.agents/references/style-guide.md`.

**Time-sensitive phrasing.** "Currently", "at the time of writing", "will soon", "now available", "new" as a modifier. Dates outside a changelog.

**Passive voice where the actor matters.** "A bucket is created" hides who creates it. Passive is fine when the actor is genuinely the system or irrelevant.

**Sentence-construction breaches**, from `.agents/references/simplified-technical-english.md`: sentences over the cap (20 procedural, 25 descriptive — prose only); compound tenses; `-ing` as a verb or trailing participle; noun clusters over three words (a product name counts as one); dropped articles or subjects; paragraphs over six sentences; rotating synonyms for one action. **Cap these at three findings per page**: report the two or three worst, give the total, and call it an editorial pass. Forty findings is not a review.

## Severity is consequence, not effort

A one-character permalink typo is P0 because the page 404s. A whole page in the wrong kind is P1 because it still works, badly. A hundred gerund headings are one P2 pattern. When you cannot tell whether a value is current, that uncertainty is itself a P1 finding naming what would settle it — never a guess, never a silence.

## Fix or suggest

When reviewing someone else's PR, default to suggesting: name the change precisely enough to apply. Apply fixes yourself only when you were asked to fix, or the defect is yours. Never rewrite surrounding content the finding does not touch.

## Output format

```
## <file path>

**Verdict:** <one sentence: sound, fixable, or needs restructuring — and the kind you judged it as>

### P0 — blocks merge
- **<what>** (line N). <why it breaks>. Fix: <specific change>.

### P1 — fix before publishing
- **<what>** (line N). <why it is wrong>. Fix: <specific change>.

### P2 — worth fixing
- **<what>** (line N). Fix: <specific change>.

### Checked and clean
<one line naming what you verified and found correct>
```

Rules for the report itself:

- Omit any tier with no findings. Never pad a tier to look thorough.
- Do not list things that passed review. A review that finds two issues mentions two issues.
- Start with the verdict. No praise, no "well-written overall".
- Do not narrate your process. State the conclusion, not the method.
- Do not re-explain the page's content back to its author.
- Three good findings beat fifteen. If a page has more than about five P2 findings, say the page needs an editorial pass, name the two or three patterns driving it, and move on.

## Self-reference escape hatch

Reference files quote bad examples on purpose. When reviewing anything under `.agents/`, judge what a page *asserts*, not what strings it contains: a legacy name in a "use this, not that" table, a banned phrase listed as banned, or `:::warning` shown as invalid are not findings.
