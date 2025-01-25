import { getLanguageFromURL } from '~/util/getPageLang';
const fallbackLang = 'en';

export function mapDefaultExports(modules) {
	const exportMap = {};

	for (const [path, module] of Object.entries(modules)) {
		const [_dot, lang] = path.split('/');
		exportMap[lang] = module.default;
	}

	return exportMap;
}

const headerMenuTranslations = mapDefaultExports(import.meta.glob('../i18n/*/header.ts', { eager: true }));
const footerMenuTranslations = mapDefaultExports(import.meta.glob('../i18n/*/footer.ts', { eager: true }));
const uiTranslations = mapDefaultExports(import.meta.glob('../i18n/*/ui.ts', { eager: true }));

export function getFooterMenuStrings(pathname) {
	const lang = getLanguageFromURL(pathname) || fallbackLang;

	return {
		...footerMenuTranslations[fallbackLang],
		...footerMenuTranslations[lang]
	};
};

export function getHeaderMenuStrings(pathname) {
	const lang = getLanguageFromURL(pathname) || fallbackLang;

	return {
		...headerMenuTranslations[fallbackLang],
		...headerMenuTranslations[lang]
	};
};

export function getLanguageName(lang) {
  return uiTranslations[lang].lang ? uiTranslations[lang].lang : lang;
}
