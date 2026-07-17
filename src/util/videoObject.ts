/**
 * Builds a schema.org `VideoObject` JSON-LD node for a documentation page that
 * embeds a YouTube video.
 *
 * Mirrors the decisions made in the `azion/site` repository:
 * - uses `embedUrl` (never `contentUrl`);
 * - derives `thumbnailUrl` from the YouTube video ID
 *   (`https://i.ytimg.com/vi/{ID}/hqdefault.jpg`);
 * - uses the page date as `uploadDate`;
 * - omits `duration`.
 *
 * See: https://developers.google.com/search/docs/appearance/structured-data/video
 */

export interface VideoFrontmatter {
	/** YouTube embed URL, e.g. `https://www.youtube.com/embed/KB4f4bSyHgI`. */
	embedUrl: string;
	/** Overrides the video `name`. Falls back to the page title. */
	title?: string;
	/** Overrides the video `description`. Falls back to the page description. */
	description?: string;
	/** ISO 8601 date used as `uploadDate` (typically the page date). */
	uploadDate?: string;
	/** Overrides the derived YouTube thumbnail. */
	thumbnailUrl?: string;
}

interface PageContent {
	title?: string;
	description?: string;
}

/** Extracts the YouTube video ID from a `/embed/{ID}` URL. */
function getYouTubeId(embedUrl: string): string | null {
	const match = embedUrl.match(/\/embed\/([^?/&#]+)/);
	return match ? match[1] : null;
}

export function getVideoObjectSchema(video: VideoFrontmatter, content: PageContent) {
	const id = getYouTubeId(video.embedUrl);
	const thumbnailUrl =
		video.thumbnailUrl ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined);

	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
		name: video.title ?? content.title,
		description: video.description ?? content.description ?? content.title,
		embedUrl: video.embedUrl,
	};

	if (thumbnailUrl) schema.thumbnailUrl = thumbnailUrl;
	if (video.uploadDate) schema.uploadDate = video.uploadDate;

	return schema;
}
