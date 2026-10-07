import type { MarkdownHeading } from 'astro';

const FENCE = /^(\s*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1\2[^\n]*$/gm;
const ENTRY = /<DocUpdate\s([^>]*)>/g;

const attribute = (attrs: string, name: string) =>
	attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

/** The rail headings of a changelog: one per date, linked to the first entry with that date. */
// A DocUpdate renders its date as a heading of its own, outside the markdown, so the page's
// markdown headings never list the entries. The rail links each date's label heading
// (`<anchor>-label`): the outline observes what it links, and an entry is too tall to
// count as fully in view. Samples inside code fences are documentation, not entries.
export function docUpdateHeadings(body: string): MarkdownHeading[] {
	const seen = new Set<string>();
	const headings: MarkdownHeading[] = [];
	for (const [, attrs] of body.replace(FENCE, '').matchAll(ENTRY)) {
		const label = attribute(attrs, 'label');
		const anchor = attribute(attrs, 'anchor');
		if (!label || !anchor || seen.has(label)) continue;
		seen.add(label);
		headings.push({ depth: 2, slug: `${anchor}-label`, text: label });
	}
	return headings;
}
