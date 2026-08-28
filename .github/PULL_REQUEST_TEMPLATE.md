## What & why

**Related issue:** <!-- EDU-1234 / #123 / none — the ticket lives here and in the branch name, never in the title -->
**Pages affected:** <!-- permalinks or file paths -->

## Type of change

- [ ] 🆕 New content (`feat`)
- [ ] 🩹 Fix (`fix`) — typo, broken link, wrong information
- [ ] ♻️ Content update (`docs`) — rewrite, expansion, upkeep
- [ ] 🌐 Translation sync (`i18n`)
- [ ] 🏗️ Platform / structure (`refactor` / `chore`) — reviewed by UXE, no content mixed in

## Author checklist

- [ ] PR title follows `type(scope): summary` (see [GOVERNANCE.md §4](GOVERNANCE.md))
- [ ] Frontmatter complete: `title`, `description`, `meta_tags`, `namespace`, `permalink`, `last_reviewed`
- [ ] No legacy "edge-" product names in the copy
- [ ] How-to/tutorial content includes at least one runnable, copy-paste-tested code block
- [ ] Screenshots (if any) have alt text and follow image standards
- [ ] Internal links are relative and resolve locally
- [ ] **If any permalink changed or page moved: redirect added in this PR**
- [ ] **i18n:** `pt-br` updated in this PR **or** follow-up `i18n` issue created: <!-- link -->
- [ ] I ran `pnpm build:local` (build + frontmatter check) without errors