import {
	getLangFromSlug,
	normalizePathSlashes,
	removeLeadingSlash,
	removeTrailingSlash,
} from '~/util';
import { getCollection } from 'astro:content';
import { docsHomeEntries } from '~/data/docs-home';

interface LanguageSelector {
	slug: string;
	lang: string;
}

export const getTranslatedPagesByNamespace = async (
	namespace: string
): Promise<LanguageSelector[]> => {
	const collectionPages = await getCollection('docs', ({ data }) => data.namespace == namespace);
	// The docs home lives in `src/pages`, so its namespace has to be matched here
	// as well or the language switcher loses one side of the pair.
	const translatePageData = [
		...collectionPages,
		...docsHomeEntries.filter((entry) => entry.data.namespace === namespace),
	];

	const mappedPageData = translatePageData
		.filter((page) => page.data.permalink)
		.map((page) => ({
			slug: removeTrailingSlash(removeLeadingSlash(normalizePathSlashes(page.data.permalink))),
			lang: getLangFromSlug(page.id),
		}));

	return mappedPageData;
};
