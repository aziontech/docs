/** schema.org `VideoObject` JSON-LD for a video embedded on a documentation page. */
// Fed by the same props that render the embed (`~/components/Video.astro`), so the embed and
// its structured data cannot diverge. Mirrors azion/site: `embedUrl`, never `contentUrl`.
// Spec: https://developers.google.com/search/docs/appearance/structured-data/video

export interface VideoObjectInput {
	/** YouTube embed URL, e.g. `https://www.youtube.com/embed/KB4f4bSyHgI`. */
	src: string;
	/** Video title (`name`). */
	title: string;
	/** Optional video description. */
	description?: string;
	/** Overrides the derived YouTube thumbnail. */
	thumbnailUrl?: string;
	/** ISO 8601 date used as `uploadDate`. */
	uploadDate?: string;
	/** ISO 8601 duration, e.g. `PT1M30S`. Omitted when absent. */
	duration?: string;
	/** Stable, page-scoped `@id` for the node. */
	id?: string;
}

/** Extracts the YouTube video ID from a `/embed/{ID}` URL. */
export function getYouTubeId(embedUrl: string): string | null {
	const match = embedUrl.match(/\/embed\/([^?/&#]+)/);
	return match ? match[1] : null;
}

/** Normalizes `uploadDate` to a full ISO 8601 datetime with a timezone. */
// Google's VideoObject requires the offset; without it Search Console reports
// "missing a timezone" and "Invalid datetime value for 'uploadDate'".
export function normalizeUploadDate(value?: string): string | undefined {
	if (!value) return undefined;
	const trimmed = value.trim();
	if (!trimmed) return undefined;
	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed}T00:00:00+00:00`;
	if (/T\d{2}:\d{2}/.test(trimmed) && !/(Z|[+-]\d{2}:?\d{2})$/.test(trimmed)) return `${trimmed}Z`;
	return trimmed;
}

export function getVideoObjectSchema(input: VideoObjectInput) {
	const { src, title, description, duration, id } = input;

	const youtubeId = getYouTubeId(src);
	const thumbnailUrl =
		input.thumbnailUrl ??
		(youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);
	const uploadDate = normalizeUploadDate(input.uploadDate);

	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
	};

	if (id) schema['@id'] = id;
	schema.name = title;
	// Google requires a non-empty `description`; the title stands in when none is given.
	schema.description = description || title;
	if (thumbnailUrl) schema.thumbnailUrl = thumbnailUrl;
	if (uploadDate) schema.uploadDate = uploadDate;
	schema.embedUrl = src;
	if (duration) schema.duration = duration;

	return schema;
}
