import type { MarkdownHeading } from 'astro';

/**
 * Deduplicate headings by their text content, keeping only the first occurrence.
 * This is useful when the same content appears multiple times 
 * (e.g., in tabs for different currencies on pricing pages).
 * 
 * The deduplication is based on the heading text (case-insensitive) rather than slug,
 * because rehype-slug generates different slugs for duplicate headings (e.g., 
 * "workloads" and "workloads-1").
 * 
 * @param headings - Array of MarkdownHeading objects
 * @returns Array of MarkdownHeading objects with duplicates removed
 */
export function deduplicateHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
	const seen = new Set<string>();
	return headings.filter((heading) => {
		// Use the heading text (lowercase) as the key for deduplication
		const key = heading.text.toLowerCase().trim();
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
}