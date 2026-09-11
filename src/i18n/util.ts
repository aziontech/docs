import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';
import type {
	UIDict,
	UIDictionaryKeys,
	UILanguageKeys,
	FooterTranslations,
	SearchMenuTranslation,
} from './translation-checkers';

/** Maps `import.meta.glob` modules to the language code in each filepath. */
function mapDefaultExports<T>(modules: Record<string, { default: T }>) {
	const exportMap: Record<string, T> = {};
	for (const [path, module] of Object.entries(modules)) {
		const [_dot, lang] = path.split('/');
		exportMap[lang] = module.default;
	}

	return exportMap;
}

export const translations = mapDefaultExports<UIDict>(
	import.meta.glob('./*/ui.ts', { eager: true })
);

export const footerTranslations = mapDefaultExports<FooterTranslations>(
	import.meta.glob('./*/footer.ts', { eager: true })
);

export const searchTranslations = mapDefaultExports<SearchMenuTranslation>(
	import.meta.glob('./*/search.ts', { eager: true })
);

export const fallbackLang = 'en';

export function getFooterTranslations(Astro: AstroGlobal): FooterTranslations {
	const lang = getLanguageFromURL(Astro.url.pathname) || fallbackLang;
	return { ...footerTranslations[fallbackLang], ...footerTranslations[lang] };
}

export function getSearchTranslations(Astro: AstroGlobal): SearchMenuTranslation {
	const lang = getLanguageFromURL(Astro.url.pathname) || fallbackLang;
	return { ...searchTranslations[fallbackLang], ...searchTranslations[lang] };
}

/** Look-up helper for translated strings, keyed by dictionary key. */
// Inside an Astro component prefer `UIString`. This exists because an Astro component
// cannot be passed as a prop to a framework component: call `useTranslations(Astro)` and
// pass the result, e.g. `label={t('articleNav.nextPage')}`.
export function useTranslations(Astro: Readonly<AstroGlobal>): (key: UIDictionaryKeys) => string {
	const lang = getLanguageFromURL(Astro.url.pathname) || 'en';
	return useTranslationsForLang(lang as UILanguageKeys);
}

export function useTranslationsForLang(lang: UILanguageKeys): (key: UIDictionaryKeys) => string {
	return function getTranslation(key: UIDictionaryKeys) {
		let str = translations[lang]?.[key] || translations[fallbackLang][key];
		if (str === undefined) {
			const jsonKeys = Object.keys(translations[lang]) as UIDictionaryKeys[];

			jsonKeys.map((jsonKey) => {
				if (translations[lang][jsonKey] === key) {
					str = key;
				}
			});

			if (str === undefined) {
				throw new Error(`Missing translation for “${key}” in “${lang}”.`);
			}
		}
		return str;
	};
}
