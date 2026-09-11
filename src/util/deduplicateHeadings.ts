import type { MarkdownHeading } from 'astro';

/** Keeps the first heading of each distinct text, dropping later repeats. */
// Keyed on text, not slug: rehype-slug renames a repeat ("workloads" -> "workloads-1"), so
// slugs never collide. Repeats come from tabbed content, e.g. per-currency pricing tables.
export function deduplicateHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
	const seen = new Set<string>();
	return headings.filter((heading) => {
		const key = heading.text.toLowerCase().trim();
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
}