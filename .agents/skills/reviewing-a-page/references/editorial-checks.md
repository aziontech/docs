# P2 — editorial checks

Voice and formatting. Worth fixing, never blocking.

## Read the catalogue first

**`.agents/references/writing-quality.md` holds the patterns and the docs calibration.** It is shared with the `contributing` skill so authors and reviewers work from one list. Read it, then use this file for what is specific to reviewing: what to flag, what to leave, and how much to report.

The calibration matters more than the catalogue. Documentation legitimately uses bullets, tables, dense emphasis, and repeated parallel structure. A reviewer who flags bullet density in a reference page produces noise that buries the real findings.

## Flag

**Invented specifics.** Not strictly editorial, but check for it here if nothing else has: a limit, default, field name, or error string that reads as though it came from a similar product rather than this one. Escalate to P0 if you can show it is wrong, P1 if you cannot verify it either way. Never leave it silent.

**Promotional language.** Adjectives selling an Azion product rather than describing a technical property. "Powerful caching", "seamless integration", "robust security" when the subject is an Azion product.

The same words are fine describing behaviour: "a robust retry policy", "leverage the API", "the Node.js ecosystem". The test is whether the word claims quality or describes behaviour.

**Rhetorical questions**, especially as headings. `What is caching?` is a blog heading. Here it is `Caching`.

**Title-case headings.** Sentence case, always. `Configuring cache policies`, not `Configuring Cache Policies`.

**Proper nouns are not title case.** This is where a naive check goes wrong. Product names keep their capitals, so these headings are all correct:

```
## Cache Settings          <- the product
## Rules Engine            <- the product
## Real-Time Purge         <- the product
## Device Groups           <- the product
## Tiered Cache            <- the module
```

And these are wrong, because the capitalized words are ordinary ones:

```
## Main Settings                              -> ## Main settings
## Applications Modules                       -> ## Applications modules
## Configuring Your Backend (Origin) Connection -> ## Configuring your backend (origin) connection
```

Before flagging, check each capitalized word against the product list in `.agents/references/terminology.md`. A page with five product-name headings and three genuine violations will produce eight findings from a checker that skips this step, and the reader stops trusting the review.

**Padding.**

| Cut | Keep |
| --- | --- |
| in order to | to |
| due to the fact that | because |
| has the ability to | can |
| at this point in time | now |
| it is important to note that | (delete, keep the sentence) |
| note that | (delete, keep the sentence) |

**Condescension.** "Simply", "just", "easy", "obvious", "of course". A reader who is stuck reads these as being told they should not be.

**"Please".** Documentation instructs.

**Time-sensitive phrasing.** "Currently", "at the time of writing", "will soon", "in the near future". Nobody comes back to update these.

**Latin abbreviations.** "for example" and "that is", not "e.g." and "i.e."

**Passive voice where the actor matters.** "A bucket is created" hides who creates it. "You create a bucket" does not. Passive is fine when the actor is genuinely irrelevant or is the system.

**Link text that describes nothing.** "click here", "this page", "read more", a bare URL.

**Non-parallel list items.** All items start with a verb, or all with a noun. Mixing makes a list harder to scan than prose.

## Do not flag

- Prose you would have written differently. Voice is not a defect.
- Short paragraphs, or long ones, absent another problem.
- Repetition across sibling pages. Reference material repeats on purpose so each page stands alone.
- Sentence fragments in table cells. That is what table cells are.
- British or American spelling, as long as one page is internally consistent.
- Contractions. Fine in this voice.

## Report sparingly

Editorial findings are the easiest to generate and the least valuable. Three good ones beat fifteen.

If a page has more than about five P2 findings, do not list them all. Say the page needs an editorial pass, name the two or three patterns driving it, and move on.
