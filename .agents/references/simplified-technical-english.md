# Simplified Technical English

Sentence-level rules for every page in this repository, adapted from **ASD-STE100 Issue 9** (15 January 2025). Used by both the `contributing` and `reviewing-a-page` skills, so authors and reviewers work from one list.

House style in `house-style.md` decides voice and formatting. This file decides sentence construction. They do not overlap, and where they touch, this file is the narrower rule.

## What ASD-STE100 is, and why it applies here

A controlled language written by the aerospace and defense industry so that a maintenance technician could not misread an instruction. The reader it was designed for has three properties: English is often not their first language, they cannot ask the author a question, and a misreading is expensive.

Every one of those describes a reader of this site. Add a fourth: these pages are served as markdown twins and indexed for retrieval, so a machine parses them with no author to ask either.

The standard is **53 writing rules in 9 sections**, plus a dictionary of roughly 900 approved words. Each word in that dictionary carries one meaning and one part of speech. Issue 9 added no new rules. It reworded 31 of the 53 and updated 555 dictionary entries.

## The split that organizes everything

STE writes different rules for **procedures** than for **descriptions**. That split maps exactly onto Diátaxis, which is how it enters this repository.

| Diátaxis type | STE mode | Sentence cap | Voice |
| --- | --- | --- | --- |
| Tutorial | procedural | 20 words | Imperative, active |
| How-to | procedural | 20 words | Imperative, active |
| Reference | descriptive | 25 words | Active; passive only when the actor is unknown |
| Explanation | descriptive | 25 words | Active; passive only when the actor is unknown |

Steps get the tighter budget because a reader executes them one at a time, under load. A step they misread is a step they get wrong.

## The rules

**One instruction per sentence.** In procedures this is the rule that matters most. A numbered step containing two actions is a step where the second action gets skipped.

- No: `Open the file and change the TTL to 3600, then save and purge the cache.`
- Yes: `Open the file.` / `Change the TTL to 3600.` / `Save the file.` / `Purge the cache.`

**Sentence length.** 20 words in a procedure, 25 in description. Count prose sentences only. Table cells, code, and command output are exempt.

**Simple tenses only.** Permitted: infinitive, imperative, simple present, simple past, simple future, and past participle used as an adjective. No compound constructions built with auxiliaries.

- No: `The bucket has been created.` / `You will have configured the origin.`
- Yes: `The bucket exists.` / `You configured the origin.`

Narrower than STE here: prefer simple present for product behaviour. `Applications caches content at the edge`, not `Applications will cache content at the edge`.

**Active voice.** Required in procedures. In descriptive text, passive is allowed only when the actor is genuinely unknown or is the platform itself.

- No: `A cache policy is applied to the request.`
- Yes: `Rules Engine applies a cache policy to the request.`

**`-ing` forms only as nouns.** Inside a sentence, an `-ing` word must be a noun or part of one. Not a verb form, not a trailing participle clause.

- No: `The connector routes traffic, reducing latency and improving performance.`
- Yes: `The connector routes traffic. Median latency drops by 40 ms.`

This is the same defect `writing-quality.md` calls participle padding. STE bans it for a different reason: `the valve controlling the flow` can be read as an action or as a name, and the reader cannot tell which.

**Headings lead with an imperative verb, not a gerund.** A section that names a task starts with the bare verb.

- No: `Creating a bucket` / `Configuring cache policies` / `Deploying the application`
- Yes: `Create a bucket` / `Configure cache policies` / `Deploy the application`

Three reasons, and only the first is ours:

- Google's style guide bans it because **gerunds translate inconsistently as the first word of a title**, which is the same reason STE exists. It also costs characters in constrained space.
- Cloudflare's style guide requires a "short verb phrase in second-person imperative" and says plainly: "Do not use gerund phrases."
- The heading then matches the steps under it. A reader scanning `Create a bucket` above `1. Click **+ Bucket**` sees one register, not two.

Two things stay legitimate. An `-ing` word that names a thing rather than a task is a noun: `Getting started`, `Billing`, `Monitoring` as a feature name. And an `-ing` word later in a heading is fine: `Introduction to request logging`.

**Noun clusters cap at three words.** A stack of four or more nouns has no grammar telling the reader which word modifies which.

- No: `Rules Engine request phase behavior configuration`
- Yes: `the behavior configuration for the Rules Engine request phase`

A product name counts as one unit. `Azion Web Platform` is a name, not a three-word cluster, and `Real-Time Metrics` does not spend two of the three slots.

**Do not drop words to shorten a sentence.** Keep the subject, the verb, and the article even when the sentence reads longer. This one cuts against the instinct to compress, and STE is explicit that ellipsis creates ambiguity rather than removing it.

- No: `Objects not cached will be purged.` — which objects?
- Yes: `Azion purges the objects that are not cached.`

**One topic per paragraph, six sentences at most.** Aligns with the chunking rules in `page-size.md`. A paragraph covering two topics splits badly no matter where the chunker cuts it.

**Vertical lists for sequences.** Three or more steps, conditions, or alternatives become a numbered or bulleted list. Do not bury a sequence in one prose sentence.

**Same word, same meaning, every time.** Pick one verb for one action and reuse it across the page and its neighbours. Rotating `check`, `verify`, and `confirm` for the same action tells the reader they are three different actions.

When the action maps to a control in the Console, use that control's own word. Do not improve on the interface's vocabulary in prose that describes the interface.

## The caps are not arbitrary here

Measured on this corpus, prose only, excluding code, tables, and headings. 60 pages from `guides/` against the procedural cap, 60 from `main-menu/reference/` against the descriptive one.

| Sample | Cap | Median | 90th percentile | Over cap |
| --- | --- | --- | --- | --- |
| `guides/`, procedural | 20 words | 8 words | 19 words | 8% |
| `reference/`, descriptive | 25 words | 13 words | 25 words | 9% |

The 90th percentile lands on the cap in both samples. So these numbers describe what good pages here already do. The 8% that breach are a genuine tail, not the norm. The size targets in `page-size.md` have the same property.

The worst offenders are real defects, not measurement artifacts: a 63-word step in `run-dig-command.mdx`, a 51-word sentence in `edge-firewall.mdx`. Both are lists that were written as prose.

Sentence splitting was heuristic, so treat the percentages as approximate. The conclusion does not depend on the precision.

Two numbers that shape how these rules get enforced:

- **972 of the 5,866 headings in the English tree lead with a gerund**, across 310 of 742 pages. 932 of those are task labels — `Setting`, `Deploying`, `Adding`, `Managing`, `Configuring`, `Creating` — and become imperatives. Only the 40 `Getting started` headings are already correct. This is a backlog, not an exemption.
- **57% of pages in `guides/` breach the sentence cap five or more times.** So these findings are cheap to generate and easy to over-report. `editorial-checks.md` caps how many a review may list.

Prevalence is not evidence that a pattern is correct. Sampled against Cloudflare's published docs, gerund headings are close to absent: across four pages and roughly 30 headings, one — `Getting started`. The 972 here are 972 headings to fix as pages get touched, the same way the 60 pages over the size cap in `page-size.md` are a split backlog. Do not rewrite 310 pages to close it. Fix the headings on any page you are already editing.

## Vocabulary: what we use instead of ASD's dictionary

We do not apply the ~900-word approved dictionary. Two reasons, and both matter.

It is a general-English core built for aerospace maintenance, so it does not carry software domain vocabulary: `cache`, `bucket`, `endpoint`, `token`, `namespace`. That is not a gap in the standard. It is why STE ships an allowance for project-specific terms in the first place.

It is also ASD's own standard. Free to download, but not ours to vendor.

STE anticipates exactly this. Rules **1.5** and **1.12** let a project approve its own Technical Names and Technical Verbs beyond the base dictionary, for vocabulary the base cannot cover. That allowance is what this repository uses:

| STE concept | Ours |
| --- | --- |
| Approved dictionary | `terminology.md`, plus the live product names |
| Technical Names (rule 1.5) | Azion product and feature names, API field names, CLI flags |
| Technical Verbs (rule 1.12) | `deploy`, `purge`, `cache`, `provision`, and the verbs the Console uses |
| Non-approved words | The substitution tables in `writing-quality.md` and `terminology.md` |

So we apply the principle rather than the list: **pick the plainest word available, and use it the same way every time.** The word tables already live in `writing-quality.md`. This file adds the consistency requirement, not a second table.

Define a domain term once, on the page where the reader first meets it, and link to it afterwards.

## Where we deliberately diverge

Named here so nobody reconciles them the wrong way later.

**Sentence caps are targets, not build gates.** Nothing in CI counts words. A 26-word descriptive sentence that is clear is not a defect worth a finding.

**Portuguese pages follow the structural rules, not the vocabulary ones.** The dictionary is English. Sentence length, one instruction per sentence, simple tenses, active voice, and noun clusters all transfer, and the substitution table in `terminology.md` carries the vocabulary side.

**Marketing copy is out of scope.** STE is deliberately flat. It is right for documentation and wrong for a launch post.

## Why this helps beyond clarity

**Translation.** STE was built for readers who work in a second language, and STE-shaped English translates with far less drift. Every rule here reduces the number of decisions the Portuguese page has to make.

**Retrieval.** Short single-topic sentences survive chunking. A 45-word sentence split across a chunk boundary produces two fragments that each say something false.

**Agent twins.** The `.md` twin of a how-to is parsed by a machine with no back-channel. That is the original STE reader with a different job. `agent-twin.md` is where these rules pay off most.

## Before you hand over a draft

- [ ] No sentence in a procedure runs past 20 words; none in description past 25
- [ ] Every numbered step contains exactly one instruction
- [ ] No compound tenses; simple present for product behaviour
- [ ] No passive voice in steps; in description, only where the actor is unknown
- [ ] No `-ing` word used as a verb or a trailing participle clause
- [ ] No noun cluster over three words, counting a product name as one
- [ ] No dropped articles, subjects, or verbs
- [ ] No paragraph over six sentences, and each covers one topic
- [ ] One verb per action, used consistently across the page

## Sources

- [ASD-STE100 official site](https://www.asd-ste100.org/) — the standard, free to download
- [About STE](https://www.asd-ste100.org/about_STE.html) — 53 rules in 9 sections; Issue 9 dated 15 January 2025
- [ASD Europe — Issue 9 release](https://www.asd-europe.org/news-media/news-events/news/simplified-technical-english-asd-ste100-issue-9/) — no new rules, 31 reworded, 555 dictionary entries updated
- [Simplified Technical English — Wikipedia](https://en.wikipedia.org/wiki/Simplified_Technical_English) — numeric limits and the rule 1.5 / 1.12 allowance
- [Google developer documentation style guide — Headings and titles](https://developers.google.com/style/headings) — "avoid using -ing verb forms as the first word in any heading or title"; gerunds "are inconsistently translated"
- [Cloudflare Style Guide — Implementation guide](https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/implementation-guide/) — "Short verb phrase in second-person imperative. Do not use gerund phrases."

Rule numbers and limits above come from these public summaries, not from a copy of the standard. When an exact rule number matters, check the official download.
