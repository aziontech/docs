# Writing a page

The authoring workflow, start to finish. Follow it in order.

## 1. Find the source of truth

A spec, a PR, an engineer, an existing page, a product brief. If you cannot name it, stop and ask. Documentation assembled from plausible-sounding guesses is worse than no page, because a reader cannot tell which parts are made up.

## 2. Check whether it already exists

Search the corpus before adding to it. Extending a page is almost always better than creating a neighbour that competes with it in search.

```bash
grep -rl "<the feature>" src/content/docs/en --include='*.mdx'
```

## 3. Pick the content type

Read `choosing-a-content-type.md`. Pick one. A page that is two types is the most common structural defect here, and it is why so much of this corpus needs restructuring.

## 4. Find where it belongs

Look at the neighbours. The directory decides nothing about the URL, but it decides who finds the file later.

| Content | Lives in |
| --- | --- |
| Product reference | `src/content/docs/en/pages/main-menu/reference/<journey>/<product>/` |
| How-to guide | `src/content/docs/en/pages/guides/<product>/` |
| Journey task | `src/content/docs/en/pages/<journey>-journey/<product>/` |
| Architecture, explanation | `src/content/docs/en/pages/architectures/<product>/` |
| CLI, SDK, API tooling | `src/content/docs/en/pages/devtools/` |

## 5. Write the frontmatter first

Read `frontmatter-and-permalinks.md` and fill in all five required fields before writing a word of body. Deciding the permalink first forces you to decide what the page is.

## 6. Draft against the shape

Open the reference for your content type and follow its skeleton. Then check yourself against `.agents/references/house-style.md`, `.agents/references/terminology.md`, and `.agents/references/writing-quality.md`.

Body starts at `##`. The `title` field renders the H1.

## 7. Use the components that exist

Read `.agents/references/components.md`. Most of `src/components/` is dead fork legacy with zero usages in content, and emitting one of those produces a page that looks fine in review and breaks on build.

## 7b. If it is a how-to or tutorial, write the agent twin

Read `agent-twin.md`. The `.md` version of the page is what agents fetch, and it should be executable rather than descriptive.

## 8. Add the Portuguese version

Read `bilingual.md`. English is the source of truth, but a page that ships English-only leaves half the audience behind, and the follow-up issue is the thing that never gets done.

## 9. Register it in a sidebar

Read `sidebar-registration.md`. This is a separate manual edit in two files, and skipping it ships a page nothing links to.

## 10. Build

```bash
pnpm build:local
```

Both the build and the frontmatter validator must pass. Then look at the rendered page, not just the build output.

## Before you hand it over

- [ ] One content type, not two
- [ ] Every claim traceable to the source from step 1
- [ ] Checked against `.agents/references/writing-quality.md`: no invented limits, no promotional adjectives
- [ ] Within the caps in `.agents/references/page-size.md`: sections under 2,000 characters, page under 8,000
- [ ] Every `##` section makes sense read alone, with no back-references
- [ ] Frontmatter complete, permalink has no language prefix
- [ ] Portuguese version present, sharing the same `namespace`
- [ ] Sidebar entries added in both languages
- [ ] Only live components used
- [ ] `pnpm build:local` passes
- [ ] Every code sample was actually run
