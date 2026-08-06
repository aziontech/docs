# Writing quality

Patterns that make a draft read as machine-generated, calibrated for technical documentation. Used by both the `contributing` and `reviewing-a-page` skills, so there is one source of truth.

Adapted from Wikipedia's "Signs of AI writing" and Azion's `ai-writing-detector`. Neither is used unmodified: both are tuned for prose, and documentation has different tolerances.

## Calibration first

**Documentation legitimately does things a blog post should not.** Applying a general prose linter here produces mostly noise and buries the findings that matter.

| Pattern | Blog | Docs | Why |
| --- | --- | --- | --- |
| Em dashes | strict | **relaxed** | Punctuation, not a tell, in reference prose |
| Heavy bullet use | strict | **relaxed** | Lists are the medium |
| Frequent bold | strict | **relaxed** | Marks UI labels and product names |
| Hedging | strict | **relaxed** | Accuracy sometimes requires it |
| Repeated sentence structure | strict | **relaxed** | Consistency helps scanning |
| Rule of three | strict | **relaxed** | Three settings are three settings |
| Promotional language | strict | **strict** | Docs never sell |
| Rhetorical questions | strict | **strict** | Headings name things |
| Title case in headings | strict | **strict** | Sentence case is house style |
| Invented specifics | strict | **critical** | The worst failure mode here |

## The one that matters most

**Invented specifics.** A limit, a default, a field name, a flag, or an error string that came from pattern-matching a similar product rather than from this one.

This is worse in documentation than anywhere else, because it is indistinguishable from correct documentation until a reader tries it and it fails. Everything else on this page is cosmetic by comparison.

Every number, field name, and command in a draft must trace to a source you can name. If you cannot name it, remove it or mark it as needing verification. A page with a gap is recoverable; a page with a confident wrong value is not, because nobody knows to check it.

## Vocabulary

Words that appear far more often in generated text than in human writing. In documentation, replace them when they are decoration; keep them when they carry technical meaning.

| Avoid | Use |
| --- | --- |
| delve into | cover, explain |
| leverage (as a verb, meaning use) | use |
| utilize | use |
| facilitate | let, allow |
| in order to | to |
| due to the fact that | because |
| has the ability to | can |
| at this point in time | now |
| it is important to note that | (delete, keep the sentence) |
| a wide range of | (name the range) |
| various | (name them, or say how many) |
| seamlessly | (delete, or say what does not break) |
| robust | (say what it withstands) |
| powerful | (say what it does) |
| comprehensive | complete, or say what it covers |
| cutting-edge, state-of-the-art | (delete) |
| a testament to | (delete) |
| plays a crucial role in | (say what it does) |
| in today's landscape | (delete the sentence) |

**Legitimate in technical context, do not flag:** `robust` describing a retry policy or an error path, `leverage` describing actual platform APIs, `ecosystem` describing a package ecosystem, `comprehensive` describing coverage that genuinely is, `streamline`, `facilitate`, `underpin`, `seamless` describing an actual technical seam.

The test is whether the word makes a claim about *quality* or about *behaviour*. "Robust security" is a claim about quality. "A robust retry with exponential backoff" describes behaviour.

## Structural patterns

**Promotional framing.** Adjectives selling an Azion product. Documentation describes behaviour and limits; the reader already chose the product.

- Not: "Applications offers powerful, flexible caching capabilities."
- Yes: "Applications caches content at the edge. Default TTL is 60 seconds."

**Significance inflation.** Sentences about how important something is, in place of what it does. "Caching plays a crucial role in modern web performance" tells the reader nothing they can act on.

**Rhetorical questions**, especially as headings. `What is caching?` becomes `Caching`. `Why use Tiered Cache?` becomes `When to use Tiered Cache`.

**Participle padding.** Trailing `-ing` clauses that add words and no information: "…reducing latency and improving performance, ensuring a better experience." Cut to the claim that is actually measurable.

**Generic conclusions.** A closing paragraph that restates the page without adding anything. End on the last concrete fact, or on a link worth following.

**Negative parallelism.** "It's not just X, it's Y." Say Y.

**False ranges.** "From configuration to deployment to monitoring" where the items are not on a scale. List them, or name the actual set.

**Undefined "you can".** "You can configure various options" is a sentence with no content. Either name the options or link to where they are named.

## Sentence-level

**Passive voice where the actor matters.** "A bucket is created" hides who creates it. "You create a bucket" does not. Passive is fine when the actor is genuinely the system or genuinely irrelevant.

**Copula avoidance.** "X serves as the mechanism for Y" is "X does Y". "Applications provides the ability to cache" is "Applications caches".

**Uniform sentence length.** A paragraph where every sentence is the same mid-length reads as generated. Vary it, and prefer short.

## Do not flag

- Prose you would have written differently. Voice is not a defect.
- Repetition across sibling reference pages. They repeat on purpose so each stands alone.
- Sentence fragments in table cells.
- Contractions.
- Short paragraphs, or long ones, absent another problem.
- Lists that are genuinely long because the thing being listed is long.

## Self-reference escape hatch

Files that quote bad examples in order to ban them are not violating their own rules. When checking anything under `.agents/`, judge what the page *asserts*, not what strings it contains.

## Before handing over a draft

- [ ] Every number, field name, and command traces to a source you can name
- [ ] No adjective makes a quality claim about an Azion product
- [ ] Headings name things and are in sentence case
- [ ] No sentence would survive being deleted without loss
- [ ] Read one paragraph aloud; if you run out of breath, split it
