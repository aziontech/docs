import type { GetStaticPathsOptions, GetStaticPathsResult } from 'astro';
import { getStaticPaths } from '../pages/docs-open-graph/[...path]';
import { allPages } from '~/content';

const routes = (await getStaticPaths({} as GetStaticPathsOptions)) as GetStaticPathsResult;

/**  All the OpenGraph image paths as generated by our `getStaticPaths`. */
const paths = new Set(routes.map(({ params }) => params.path));
/**
 * Get the path to the OpenGraph image for a page
 * @param path Pathname of the page URL.
 * @param isFallback Whether or not this page is displaying fallback content.
 * @returns Path to the OpenGraph image if found. Otherwise, `undefined`.
 */
export function getOgImageUrl(path: string, isFallback: boolean): string | undefined {
	const pageData = allPages.find((page) => page.data.title == path)
	if (!pageData) return 

	let imagePath = pageData.slug.replace(/^\//, '').replace(/\/$/, '') + '.png';
	if (isFallback) {
		// Replace the language segment with 'en' for fallback pages.
		imagePath = 'en' + imagePath.slice(imagePath.indexOf('/'));
	}
	if (paths.has(imagePath)) return 'docs-open-graph/' + imagePath;
}
