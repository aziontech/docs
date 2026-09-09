import { getGuidesHome, type CatalogEntry, type Lang } from '~/nav/index';

/** What the guides hub needs per page to filter and draw a card; the rest of `CatalogEntry` stays on the server. */
export type GuidesCatalogRow = Pick<CatalogEntry, 'label' | 'href' | 'description' | 'kind' | 'products' | 'topic' | 'external'>;

export const guidesCatalogHref = (lang: Lang) => `/${lang}/guides-catalog.json`;

export async function guidesCatalog(lang: Lang) {
	const { entries, kinds, products } = await getGuidesHome('guides', lang);
	const rows: GuidesCatalogRow[] = entries.map(({ label, href, description, kind, products, topic, external }) => ({
		label,
		href,
		description,
		kind,
		products,
		topic,
		external,
	}));
	return { rows, kinds, products };
}
