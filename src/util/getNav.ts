import type { AstroGlobal } from 'astro';
import type { NavDict } from '../i18n/translation-checkers';
import { fallbackLang, mapNavigationMenuByName } from '../i18n/util';
import { getLanguageFromURL } from '../util';
import { availableMenus } from '~/data/availableMenu';

/** Map of language tags to a `Set` of slugs that exist for that language. */

export async function getNavigationMenu(Astro: AstroGlobal, menuName: string): Promise<NavDict> {
	let lang = getLanguageFromURL(Astro.url.pathname)
	const isValidMenuName = availableMenus.find(menu => menu.name === menuName)
	const getMenuProps = isValidMenuName ? isValidMenuName : availableMenus.find(menu => menu.name === 'nav')

	if (getMenuProps) {
		lang = getMenuProps.langs.includes(lang) ? lang : fallbackLang;
		menuName = getMenuProps.name
	}

	const menu = await mapNavigationMenuByName(menuName, lang)

	return menu[lang]
}
