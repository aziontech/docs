# Simplified Technical English

Sentence construction for every Azion documentation page, adapted from **ASD-STE100 Issue 9**. The standard was written so that a reader who works in a second language, cannot ask the author a question, and pays for a misreading cannot misread an instruction. Every one of those describes a reader of this documentation — including the machines that parse it.

`style-guide.md` decides voice, word choice, and formatting. This file decides sentence construction, and it is the narrower rule where they touch.

## The split that organizes everything

STE writes different rules for **procedures** than for **descriptions**. The base form of the page kind decides which register applies. Kinds and base forms are in the contributing skill's `content-types.md`.

| Base form | Kinds | Register | Sentence cap | Voice |
| --- | --- | --- | --- | --- |
| Tutorial | Get started, Tutorial | procedural | 20 words | Imperative, active |
| How-to | How-to, Multi-product guide, Troubleshooting, Use case | procedural | 20 words | Imperative, active |
| Reference | Overview, Reference | descriptive | 25 words | Active; passive only when the actor is unknown |
| Explanation | Concept, Architecture | descriptive | 25 words | Active; passive only when the actor is unknown |
| Record | Changelog | descriptive | 25 words | Active, past or present |

Steps take the tighter budget because a reader executes them one at a time, and a step they misread is a step they get wrong. A navigation hub carries almost no prose and follows the descriptive budget.

## The rules

- **One instruction per sentence.** A numbered step with two actions is a step where the second gets skipped. The rule that matters most in procedures.
- **Sentence length.** 20 words procedural, 25 descriptive. Prose only; table cells, code, and command output are exempt.
- **Simple tenses only.** Infinitive, imperative, simple present, simple past, simple future, past participle as an adjective. No auxiliary-built compounds: not "the bucket has been created" but "the bucket exists". Prefer simple present for product behavior: "Applications caches content at the edge."
- **Active voice.** Required in procedures. In description, passive only when the actor is genuinely unknown or is the platform itself.
- **`-ing` only as a noun.** Not a verb form, not a trailing participle clause. "The connector routes traffic, reducing latency" is both padding and an ambiguity: "the valve controlling the flow" reads as an action or a name, and the reader cannot tell which.
- **Noun clusters cap at three words.** "Rules Engine request phase behavior configuration" becomes "the behavior configuration for the Rules Engine request phase". A product name counts as one unit: `Azion Web Platform` is a name, not a three-word cluster.
- **Do not drop words to shorten a sentence.** Keep the subject, the verb, and the articles. "Objects not cached will be purged" leaves the reader guessing which objects. Split the sentence instead.
- **One topic per paragraph, six sentences at most.** A paragraph covering two topics splits badly wherever a retrieval chunker cuts it.
- **Vertical lists for sequences.** Three or more steps, conditions, or alternatives become a numbered or bulleted list. Do not bury a sequence in one prose sentence.
- **Same word, same meaning, every time.** One verb per action, across the page and its neighbors. Rotating "check", "verify", and "confirm" for one action reads as three actions. When the action maps to a Console control, use that control's own word.

Heading grammar — sentence case, imperative for tasks, never a leading gerund — is in `style-guide.md`.

## Vocabulary: what replaces ASD's dictionary

This documentation does not apply ASD's ~900-word approved dictionary. It is a general-English core built for aerospace maintenance, so it carries no software vocabulary, and it is ASD's document rather than Azion's.

STE rules **1.5** and **1.12** let a project approve its own Technical Names and Technical Verbs. That allowance is what applies here:

| STE concept | Ours |
| --- | --- |
| Approved dictionary | `terminology.md`, plus the product names the input supplies |
| Technical Names (rule 1.5) | Azion product and feature names, API field names, CLI flags |
| Technical Verbs (rule 1.12) | `deploy`, `purge`, `cache`, `provision`, and the verbs the Console uses |
| Non-approved words | The substitution tables in `style-guide.md` and `terminology.md` |

The principle, not the list: **pick the plainest word available and use it the same way every time.** Define a domain term once, where the reader first meets it, then link to it.

## Where this documentation deliberately diverges

- **The caps are targets, not build gates.** Nothing in CI counts words. A clear 26-word descriptive sentence is not a finding.
- **Portuguese pages follow the structural rules, not the vocabulary ones.** Length, one instruction per sentence, tenses, voice, and noun clusters all transfer. `terminology.md` carries the vocabulary side.
- **Marketing copy is out of scope.** STE is deliberately flat, which is right for documentation and wrong for a launch post.

## Why this helps beyond clarity

- **Translation.** STE-shaped English translates with less drift, so every rule here reduces the number of decisions the Portuguese page has to make.
- **Retrieval.** Short single-topic sentences survive chunking. A 45-word sentence split across a chunk boundary produces two fragments that each say something false.
- **Agents.** The markdown twin of a procedural page is parsed by a machine with no author to ask. That is the original STE reader with a different job.

## Before you hand over a draft

- [ ] No sentence in a procedure runs past 20 words; none in description past 25
- [ ] Every numbered step contains exactly one instruction
- [ ] No compound tenses; simple present for product behavior
- [ ] No passive voice in steps; in description, only where the actor is unknown
- [ ] No `-ing` word used as a verb or a trailing participle clause
- [ ] No noun cluster over three words, counting a product name as one
- [ ] No dropped articles, subjects, or verbs
- [ ] No paragraph over six sentences, and each covers one topic
- [ ] One verb per action, used consistently across the page
