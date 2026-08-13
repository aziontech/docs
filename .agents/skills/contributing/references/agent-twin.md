# The agent twin

Every page on this site is also served as markdown at the same URL with `.md` appended:

```
/en/documentation/get-started/first-deploy/      the page a person reads
/en/documentation/get-started/first-deploy.md    what an agent fetches
```

For **procedural kinds** — get started, tutorial, how-to, multi-product guide, use case — that markdown twin should be written so an agent can load it and act on it directly. In other words, it should look like a skill.

Descriptive kinds do not need this. Nothing there is executable.

## Why it is worth the extra work

An agent fetching a normal documentation page gets prose written for a human: background, alternatives, screenshots it cannot see, and steps interleaved with explanation. It has to infer what to run.

An agent fetching a skill-shaped twin gets a goal, a requirements list, ordered commands, and a verification step. It can execute rather than interpret. The twin is the difference between documentation an agent reads about and documentation an agent uses.

## The twin is authored, not generated

It is not a mechanical transform of the page. The published example differs from its page in title, section names, ordering, and voice, because the two serve different readers.

Write the page first, for people. Then write the twin, for an agent, from the same source of truth.

How a twin gets served is a repository concern, and it has a caveat — check `information-architecture.md` before authoring a set of them.

## Shape

```markdown
---
name: azion-first-deploy
description: >-
  Deploy a project to the Azion Web Platform and verify it answers HTTP 200 on
  its own Azion domain. Use when the user wants to put their first project
  live on Azion, via the Azion CLI from the terminal, or guided through the
  Console.
---

# Deploy your first project to Azion

Goal: put the user's project live on the Azion Web Platform, answering HTTP 200
on its own Azion domain. Prefer the CLI path, it runs entirely from the terminal.

## Requirements

- An Azion account. Free signup, no credit card: https://console.azion.com/signup/
- A local project using a supported framework, with dependencies installed.

## <The primary path>

1. Install the CLI:

​```bash
curl -fsSL https://cli.azion.app/install.sh | bash
​```

2. Authenticate. This is interactive, ask the user to complete the login when prompted:

​```bash
azion login
​```

## Verify

​```bash
curl -I https://<your-azion-domain>
# expect HTTP/2 200
​```

## Alternatives via Azion Console (human-in-the-loop)

These paths need the user driving a browser:

- **Deploy a template**: in https://console.azion.com, click **+ Create** > **Templates**, ...
```

## Rules

**Frontmatter is `name` plus `description`, nothing else.** `name` is kebab-case and prefixed `azion-`. `description` states what the twin achieves and ends with a "Use when" clause naming the trigger. This is the same contract as a `SKILL.md`, which is the point.

**State the goal as a measurable end state.** "Answering HTTP 200 on its own Azion domain" is checkable. "Successfully deployed" is not.

**Name the preferred path when there is more than one.** An agent given three equal options will pick badly. Say which one to prefer and why: "Prefer the CLI path, it runs entirely from the terminal."

**Flag every step the agent cannot complete alone.** Interactive prompts, browser work, anything needing a human decision. Say so inline, at the step: "This is interactive, ask the user to complete the login when prompted." Group browser-only paths under a heading that says so.

**Always include a Verify section** with a command and its expected output. An agent that cannot tell whether it succeeded will report success regardless.

**Warn about timing.** If a result takes time to propagate, say so and say what to do: "New URLs can take a few minutes to propagate. On an error right after deploying, wait a moment and retry before diagnosing." Without this an agent starts debugging a working deployment.

**Plain markdown only.** No MDX components, no `:::note`, no `<Tabs>`, no `<LinkButton>`. Bare URLs rather than markdown links, because the agent needs the URL, not the label.

**Strict Simplified Technical English.** The twin is the one artifact here read entirely by machines, with no author to ask and no page around it for context. That is the reader ASD-STE100 was written for. Apply `.agents/references/simplified-technical-english.md` without the relaxations the human page gets:

- One instruction per step, no exceptions. An agent given `Open the file and change the TTL` may do one and report both.
- 20 words per sentence, imperative, active voice.
- No pronoun whose referent is in another section. The twin gets read in fragments.
- Same verb for the same action throughout. An agent has no way to infer that "verify" and "confirm" meant one check.

**Commands must be copy-runnable.** Placeholders are obvious: `<your-azion-domain>`, `[TOKEN VALUE]`. Never a plausible fake value.

## Checklist

- [ ] `name` is kebab-case, prefixed `azion-`, unique
- [ ] `description` ends with a "Use when" trigger clause
- [ ] Goal line states a measurable end state
- [ ] Preferred path named when there is more than one
- [ ] Every interactive or browser-only step flagged as such
- [ ] `## Verify` present, with expected output
- [ ] Propagation or timing caveats stated
- [ ] Plain markdown, no MDX components
- [ ] Every command runnable as written
- [ ] One instruction per step, 20 words per sentence, one verb per action
