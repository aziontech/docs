/**
 * Builds a schema.org `VideoObject` JSON-LD node for a video embedded on a
 * documentation page.
 *
 * Single source of truth: the same props that render the embed also feed this
 * builder (see `~/components/Video.astro`), so the embed and its structured
 * data can never diverge.
 *
 * Mirrors the decisions made in the `azion/site` repository:
 * - uses `embedUrl` (never `contentUrl`);
 * - derives `thumbnailUrl` from the YouTube video ID
 *   (`https://i.ytimg.com/vi/{ID}/hqdefault.jpg`) when not provided;
 * - emits a stable `@id` derived from the page URL;
 * - `duration` is optional and omitted when absent.
 *
 * See: https://developers.google.com/search/docs/appearance/structured-data/video
 */

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

export function getVideoObjectSchema(input: VideoObjectInput) {
	const { src, title, description, uploadDate, duration, id } = input;

	const youtubeId = getYouTubeId(src);
	const thumbnailUrl =
		input.thumbnailUrl ??
		(youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);

	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
	};

	if (id) schema['@id'] = id;
	schema.name = title;
	if (description) schema.description = description;
	if (thumbnailUrl) schema.thumbnailUrl = thumbnailUrl;
	if (uploadDate) schema.uploadDate = uploadDate;
	schema.embedUrl = src;
	if (duration) schema.duration = duration;

	return schema;
}
