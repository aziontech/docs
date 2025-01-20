import { getLangFromSlug, removeLeadingSlash, removeTrailingSlash } from '~/util'
import { getCollection } from 'astro:content';

interface LanguageSelector {
	slug: string;
	lang: string;
}

export const getTranslatedPagesByNamespace = async (namespace: string): Promise<LanguageSelector[] | undefined> => {
	const translatePageData = await getCollection('docs', ({ data }) => data.namespace == namespace)

	const mappedPageData =  translatePageData
		.filter(page => page.data.permalink)
		.map(page => ({ slug: removeTrailingSlash(removeLeadingSlash(page.data.permalink)), lang: getLangFromSlug(page.slug) }));

	return mappedPageData.length > 0 ? mappedPageData : undefined
}


export const groupPagesByLang = (pages: any[]) =>
  pages.reduce((pages, page) => {
    if(page) {
      const lang = page.id.split('/')[0];

      if (!pages[lang]) {
        pages[lang] = [];
      }

      pages[lang].push(page);
    }

    return pages;
  },
	{}
);
