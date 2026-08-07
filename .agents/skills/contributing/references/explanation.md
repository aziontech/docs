# Explanation

Builds understanding. The reader is not doing a task right now; they are trying to make sense of something, usually before deciding whether to use it.

This is the type most often missing. When a how-to grows a long preamble or a reference page starts justifying a design, the missing explanation page is what they are reaching for.

## Shape

The architecture pages are the closest existing model:

```
[Lead paragraph: what problem this solves and for whom.]

## <Name> architecture diagram
[Diagram, then a paragraph reading it.]

### <Name> dataflow
[Numbered walkthrough of what moves where.]

## Components
[What each part does and why it is there.]

## Implementation
[Links to the how-tos. This section links; it does not instruct.]

## Related docs
```

For a non-architecture explanation, the shape is looser. What must be present: the problem, the approach, the tradeoff, and what to read next.

## Rules

**Explain the why, not the how.** The reader can find steps elsewhere. What they cannot find elsewhere is the reason the product works this way, what it was designed against, and when it is the wrong choice.

**Alternatives belong here and nowhere else.** "You could also use X, but that trades Y for Z" is the sentence explanation exists for. A how-to that says it has lost the plot.

**Name the tradeoff.** An explanation that presents only upsides is marketing. Every architectural choice costs something; say what.

**Discuss, do not enumerate.** If the page turns into a table of settings, it wants to be a reference page.

**Do not include steps.** Link to them. The moment a numbered click-through appears, you have two content types on one page. See `splitting-a-page.md`.

**No timeless claims about roadmap.** "Currently", "at the time of writing", and "will soon" all age badly and nobody comes back to fix them.

**Descriptive sentences cap at 25 words.** Explanation is the type most likely to breach it, because reasoning about tradeoffs invites subordinate clauses. Split them. See `.agents/references/simplified-technical-english.md`.

**Passive voice is allowed here, narrowly.** Only where the actor is genuinely unknown or is the platform itself. "A cache policy is applied to the request" hides who applies it; "Rules Engine applies a cache policy to the request" does not.

## Diagrams

Diagrams carry most of the load on these pages. If you cannot draw the thing, you probably do not understand it well enough to explain it yet.

Images are root-absolute with no language prefix, and the file lives under `public/`:

```mdx
![Dataflow for content delivery at the edge](/assets/docs/images/uploads/content-delivery-dataflow.png)
```

Alt text describes what the diagram shows, not that it is a diagram. Use raw `<img>` with `width` only when you genuinely need to constrain the size inside a component slot.
