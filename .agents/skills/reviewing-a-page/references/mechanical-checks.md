# P0 — mechanical checks

Breaks the build, or ships broken and silent. Every finding here blocks merge.

## Frontmatter

| Check | How it fails |
| --- | --- |
| `namespace` missing | `test-frontmatter.js` exits 1. Build fails. |
| `permalink` missing | Exits 1. Build fails. |
| `permalink` outside `/^[a-z0-9\-\/]+$/` | Exits 1. Uppercase, underscores, dots, spaces, and accented characters all fail. |
| `permalink` duplicated within the same language | Exits 1. |
| `namespace` duplicated within the same language | Exits 1. |
| `title` missing | Astro schema error. |

Verify against the corpus, not by eye:

```bash
# permalink collisions in English
grep -rh '^permalink:' src/content/docs/en --include='*.mdx' | sort | uniq -d

# namespace collisions in English
grep -rh '^namespace:' src/content/docs/en --include='*.mdx' | sort | uniq -d
```

## Permalink carries a language prefix

```yaml
permalink: /en/documentation/products/...     # WRONG, renders at /en/en/...
permalink: /documentation/products/...        # correct
```

The language comes from the directory tree. Portuguese pages use `/documentacao/...` with no `/pt-br` prefix.

This exists in the corpus today, so it is worth checking rather than assuming:

```bash
grep -rn '^permalink: */\(en\|pt-br\)/' src/content/docs --include='*.mdx'
```

## Namespace does not match the translation

**The highest-value check on this page, because nothing else catches it.** The build passes. CI passes. The language switcher silently stops working.

```bash
# does this page's namespace appear in the other language tree?
grep -rl "^namespace: docs_store_journey_storage_create_bucket$" src/content/docs
```

Two hits, one per language, is correct. One hit means the pair is broken.

Report as P0 even though nothing fails, because it ships a defect no test will ever find.

## MDX that fails to parse

| Check | Note |
| --- | --- |
| Bare `<br>` | Must be `<br />` or `<br></br>`. Bare form breaks the build. |
| Unclosed tag | Every tag closed or self-closing. |
| Bare `<` or `{` in prose | Parsed as JSX. Escape or wrap in backticks. |
| Unescaped backtick or `${` inside `<Code code={\`...\`} />` | The value is a JS template literal. |

## Components that render but do not work

| Check | Consequence |
| --- | --- |
| `<Tabs>` without `client:visible` | Tabs render, do not switch. |
| `<Tag>` without `client:only="vue"` | Does not hydrate. |
| `tab.x` with no matching `panel.x` | Empty panel. |
| No blank lines around markdown inside `<Fragment>` | Markdown renders as one literal paragraph. |
| `:::warning` | Not a valid aside type. Valid: `note`, `tip`, `caution`, `danger`. |
| Any component from the do-not-use list in `.agents/references/components.md` | Not available; build fails on the import. |

## Body H1

The `title` field renders the H1. A `#` heading in the body produces two H1s.

```bash
grep -n '^# ' <file>
```

Ignore matches inside fenced code blocks and inside `<Code code={...}>`, where `#` is a shell comment.

## Structural separator misplaced

`---` between major sections is house style. A `---` immediately after the closing frontmatter delimiter is read as an empty frontmatter block and breaks parsing.
