import type { AstroGlobal } from 'astro';
import { getCollection } from 'astro:content';
import { removeLeadingSlash, removeTrailingSlash } from '~/util';

interface Breadcrumbs {
	link: string;
	title: string;
}

const getLastSegment = (url: string): string => {
	const urlLastSegment = url.replace(/\/+$/, '').split('/').pop();

	return urlLastSegment == 'cli' ? 'CLI' :`${urlLastSegment?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`;
}

export async function getPageBreadcrumb(Astro: Readonly<AstroGlobal>, lang: string): Promise<Breadcrumbs[]> {
	const urlSegments = removeTrailingSlash(removeLeadingSlash(Astro.url.pathname)).split('/').splice(1);

	const matchedPages = await getCollection('docs', ({ data, slug }) => {
		if (slug.startsWith(lang)) {
			let prevSegment: string;
			return urlSegments.find(segment => {
				prevSegment = prevSegment ? `${prevSegment}${segment}/` : `${segment}/`;
				return data.permalink?.endsWith(`${prevSegment}`);
			});
		}
	});
	
	const breadcrumbs: Breadcrumbs[] = [];

	urlSegments.map((segment) => {
		const matchedPage = matchedPages.find(({ data }) => data.permalink?.endsWith(`/${segment}/`));

		if (matchedPage && typeof matchedPage.data?.permalink === 'string') {
			const title = getLastSegment(matchedPage.data.permalink);
			breadcrumbs.push({ link: matchedPage.data.permalink, title });
		}
	});

	return breadcrumbs;
}
