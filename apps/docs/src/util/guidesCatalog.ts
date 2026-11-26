import { getGuidesHome, type CatalogEntry, type Lang } from '~/nav/index';
import { DOCS_BASE } from '~/nav/resolve';
import { CURRENT_VERSION, PLATFORM_VERSIONS } from '~/nav/versions';

/** What the guides hub needs per page to filter and draw a card; the rest of `CatalogEntry` stays on the server. */
export type GuidesCatalogRow = Pick<
	CatalogEntry,
	| 'label'
	| 'href'
	| 'description'
	| 'kind'
	| 'products'
	| 'topic'
	| 'external'
	| 'format'
	| 'versions'
> & {
	/** The card's version tag (`v3.x`), as the menu shows it: only for a guide the current version does not cover. */
	versionTag?: string;
};

function versionTag(versions: CatalogEntry['versions']): string | undefined {
	if (!versions || versions.includes(CURRENT_VERSION)) return undefined;
	return versions
		.map((id) => PLATFORM_VERSIONS.find((entry) => entry.id === id)?.short ?? id)
		.join(' ');
}

export const guidesCatalogHref = (lang: Lang) => `/${lang}/${DOCS_BASE[lang]}/guides-catalog.json`;

export async function guidesCatalog(lang: Lang) {
	const { entries, kinds, products } = await getGuidesHome('guides', lang);
	const rows: GuidesCatalogRow[] = entries.map(
		({ label, href, description, kind, products, topic, external, format, versions }) => ({
			label,
			href,
			description,
			kind,
			products,
			topic,
			external,
			format,
			...(versions && { versions, versionTag: versionTag(versions) }),
		})
	);
	return { rows, kinds, products };
}
