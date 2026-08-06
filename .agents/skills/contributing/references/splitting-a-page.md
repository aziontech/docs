# Splitting a page

Breaking one page into several. Needed when a page has grown past what a reader can navigate, or when it is carrying two content types at once.

## When to split

**Two content types on one page.** The strongest signal. A reference page with a walkthrough in the middle is two pages that happen to share a file.

**The reader cannot find their answer.** If someone has to scroll past four sections they do not care about, the page is doing navigation work that a hub plus children should do.

**Length alone is weak evidence, but it is evidence.** A reference table with 200 rows is long and correct. A 400-line how-to covering six unrelated tasks is short by comparison and wrong. Split on structure first.

That said, a page over the hard cap in `.agents/references/page-size.md` (16,000 characters) is almost always doing too much, and it retrieves badly however well it is organized. Use the cap to find candidates, then find the seam by structure.

## Find the seams

Read the headings alone, ignoring the body. The seams are usually visible in the outline.

Good seams: a distinct task the reader would search for on its own; a shift in content type; a section that repeats a pattern the others do not share.

Bad seams: arbitrary midpoints; "part 1 / part 2"; anything that leaves a child unable to stand alone. Every child must make sense to someone who arrives directly from search, because they will.

## The shape of the result

**The parent keeps its permalink and becomes a hub.** This is what protects inbound links. It holds a short orientation paragraph and links to the children, and it does not keep a copy of the content.

**Each child gets a new permalink and a new namespace**, both following `frontmatter-and-permalinks.md`, both unique within the language.

**Both languages split identically.** Same set of children, same `namespace` on each corresponding pair. Splitting English only leaves the Portuguese tree with one page whose namespace now matches a hub with different content.

## Redirects

Splitting moves content to new URLs. Anything that was reachable and no longer is needs a redirect.

Redirect pairs live in `cicd/massive-redirect/en.json` and `cicd/massive-redirect/pt-br.json`, as full URLs:

```json
{
  "from": "https://www.azion.com/en/documentation/products/old-path/",
  "moved": "https://www.azion.com/en/documentation/products/new-path/"
}
```

> **Verify before relying on this.** These files are not referenced by the build, by CI, or by any source in this repository. The layer that applies them is external. Confirm with whoever owns the edge configuration that adding entries here is sufficient, rather than assuming it.

If the parent keeps its permalink, it needs no redirect. Only genuinely removed URLs do, plus any anchor that people linked to directly and that no longer exists on the parent.

## Sidebars

Every child needs its own sidebar entry in both language menu files. See `sidebar-registration.md`. A split that adds six pages and no menu entries has hidden six pages.

## Do it in two passes

Splitting a large page in one change produces a diff nobody can review. Governance caps a PR at roughly 400 changed lines of prose.

Pass one: propose the split. The outline, the permalink and namespace for each child, the redirect list, and one sentence per child saying why it stands alone. Get that agreed before writing.

Pass two: execute, one child per commit if the page is large.

## Checklist

- [ ] Seams follow content type or reader task, not length
- [ ] Every child stands alone for a reader arriving from search
- [ ] Parent keeps its original permalink and becomes a hub
- [ ] Every child has a unique, valid permalink and namespace
- [ ] Both languages split identically, with matching namespaces per pair
- [ ] Redirects listed for every URL that no longer resolves
- [ ] Sidebar entries added for every child, in both languages
- [ ] No content was lost, only relocated
- [ ] `pnpm build:local` passes
