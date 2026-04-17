import type { MarkdownHeading } from 'astro';

/**
 * Normalize a slug by removing numeric suffixes added by rehype-slug.
 * For example, "workloads-1" becomes "workloads".
 * This is needed because duplicate headings get numbered slugs.
 * 
 * @param slug - The slug to normalize
 * @returns The normalized slug without numeric suffix
 */
function normalizeSlug(slug: string): string {
	// Remove numeric suffixes like -1, -2, etc. added by rehype-slug
	return slug.replace(/-\d+$/, '');
}

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