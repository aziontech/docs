import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';
import type {
	NavDict,
	UIDict,
	UIDictionaryKeys,
	UILanguageKeys,
	HeaderMenuTranslation,
	FooterTranslations,
	SearchMenuTranslation
} from './translation-checkers';

/**
 * Convert the map of modules returned by `import.meta.globEager` to an object
 * mapping the language code from each module’s filepath to the module’s default export.
 */
function mapDefaultExports<T>(modules: Record<string, { default: T }>) {
	const exportMap: Record<string, T> = {};
	for (const [path, module] of Object.entries(modules)) {
		const [_dot, lang] = path.split('/');
		exportMap[lang] = module.default;
	}

	return exportMap;
}

function mapDefaultNavExports<T>(modules: Record<string, { default: T }>, lang: string) {
	const exportMap: Record<string, T> = {};
	for (const [, module] of Object.entries(modules)) {
		exportMap[lang] = module.default;
	}

	return exportMap;
}

export async function mapNavigationMenuByName(menuName: string, lang: string) {
	const translations = await import(`../i18n/${lang}/${menuName}.ts`)
		.catch(async () => await import(`../i18n/en/${menuName}.ts`))

	return mapDefaultNavExports<NavDict>([translations], lang)
}

export const translations = mapDefaultExports<UIDict>(import.meta.glob('./*/ui.ts', { eager: true }));

export const navTranslations = mapDefaultExports<NavDict>(
	import.meta.glob('./*/nav.ts', { eager: true })
);
export const headerMenuTranslations = mapDefaultExports<HeaderMenuTranslation>(
	import.meta.glob('./*/headerMenu.ts', { eager: true })
);

export const footerTranslations = mapDefaultExports<FooterTranslations>(
	import.meta.glob('./*/footer.ts', { eager: true })
);

export const searchTranslations = mapDefaultExports<SearchMenuTranslation>(
	import.meta.glob('./*/search.ts', { eager: true })
);

export const fallbackLang = 'en';

export function getHeaderMenuStrings(Astro: AstroGlobal): HeaderMenuTranslation {
	const lang = getLanguageFromURL(Astro.url.pathname) || fallbackLang;
	return { ...headerMenuTranslations[fallbackLang], ...headerMenuTranslations[lang] };
}

export function getFooterTranslations(Astro: AstroGlobal): FooterTranslations {
	const lang = getLanguageFromURL(Astro.url.pathname) || fallbackLang;
	return { ...footerTranslations[fallbackLang], ...footerTranslations[lang] };
}

export function getSearchTranslations(Astro: AstroGlobal): SearchMenuTranslation {
	const lang = getLanguageFromURL(Astro.url.pathname) || fallbackLang;
	return { ...searchTranslations[fallbackLang], ...searchTranslations[lang] };
}

/**
 * Create a helper function for getting translated strings.
 *
 * Within an Astro component, prefer the `UIString` component,
 * which only needs the key as it has access to the global Astro object.
 *
 * However, you can’t pass an Astro component as a prop to a framework component,
 * so this function creates a look-up method to get the string instead:
 *
 * @example
 * ---
 * import { useTranslations } from '~/i18n/util';
 * const t = useTranslations(Astro);
 * ---
 * <FrameworkComponent label={t('articleNav.nextPage')} />
 */
export function useTranslations(Astro: Readonly<AstroGlobal>): (key: UIDictionaryKeys) => string {
	const lang = getLanguageFromURL(Astro.url.pathname) || 'en';
	return useTranslationsForLang(lang as UILanguageKeys);
}

export function useTranslationsForLang(lang: UILanguageKeys): (key: UIDictionaryKeys) => string {
	return function getTranslation(key: UIDictionaryKeys) {
		const str = translations[lang]?.[key] || translations[fallbackLang][key];
		if (str === undefined) throw new Error(`Missing translation for “${key}” in “${lang}”.`);
		return str;
	};
}
