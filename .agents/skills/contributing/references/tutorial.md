# Tutorial

Teaches the product by having the reader build something that works. The reader is new and does not yet know what they want.

> **There is no exemplar in this repository.** Nothing in 742 pages is a true tutorial. The closest neighbours, `first-steps.mdx` pages and the template showcases, are how-tos wearing a tutorial's clothes. Do not copy them. Follow the shape below.

## The contract with the reader

You promise: if they follow every step in order, it works. That promise is the whole value. It means:

- **You choose the goal.** Not "build an application", but "deploy a static site and see it live on your own URL".
- **You choose every option.** No "depending on your needs". No "you may prefer". Decisions are yours; the reader is here to learn, not to choose.
- **Every step produces a visible result.** The reader must be able to tell they are on track without asking anyone.
- **It actually runs.** Every command and every snippet is tested before the page ships. A tutorial that fails at step 7 is worse than no tutorial, because it teaches the reader the product is broken.

## Shape

```
[One paragraph: what they will have built, and roughly how long it takes]

## Before you start
[Only what is genuinely required. Each item is a link or a one-line command.]

## Step 1: <verb phrase>
[What to do. Then what they should see.]

## Step 2: <verb phrase>
...

## What you built
[Restate the result. One paragraph.]

## Next steps
[Two or three links, each with a reason to click it.]
```

## Rules

**No branching.** One path. If a step could go two ways, pick one and say nothing about the other. Alternatives belong in a how-to.

**No explaining.** The reader will not retain it and it interrupts the momentum. If a concept is genuinely required, give it one sentence and link to the explanation page.

**Show the result of every step.** Command output, a screenshot, a URL to open, a value that changed. Steps whose effect is invisible make the reader lose confidence.

**One instruction per step, 20 words per sentence.** Tutorials are procedural, so they take the tighter budget in `.agents/references/simplified-technical-english.md`. The reader here is new and has no way to recover from a step they misread, which is the exact reader ASD-STE100 was written for.

**Prerequisites are a barrier.** Every item in "Before you start" is a reason someone abandons the page. Cut anything you can supply yourself, and link the rest.

**One tutorial per product area.** Tutorials are expensive to keep working. A product with five tutorials has five things to break on the next release.

## Components

Use `<Code>` rather than fenced blocks for anything the reader will copy, so they get the copy button:

```mdx
import Code from '~/components/Code/Code.astro'

<Code lang="bash" code={`azion deploy --local`} />
```

Do **not** use `<Tabs>` in a tutorial. Tabs are a branch, and tutorials do not branch. If the task genuinely needs three interfaces, it is a how-to.

## The agent twin

Tutorials are also served as markdown at `<permalink>.md`. That version is written for an agent executing the steps rather than a person learning from them, and it should read as a skill. See `agent-twin.md`.

Keep asides rare. A tutorial full of `:::note` blocks is a tutorial that is trying to be reference material.
