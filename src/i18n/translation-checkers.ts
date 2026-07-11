import enNav from './en/nav';
import type enUI from './en/ui';
import type languages from './languages';

export type UIDictionaryKeys = keyof typeof enUI;
export type UIDict = Partial<typeof enUI>;
export type UILanguageKeys = keyof typeof languages;

/** Helper to type check a dictionary of UI string translations. */
export const UIDictionary = (dict: Partial<typeof enUI>) => dict;

export type NavDict = Array<
	{
		text: string;
		header?: boolean;
		onlyMobile?: boolean;
		anchor?: boolean;
		type?: string;
		slug?: string;
		key: string;
		isFallback?: boolean;
		items?: NavDict;
		addBorder?: boolean;
		hasLabel?: UIDictionaryKeys;
		isProduct?: boolean
	}
>;

/**
 * Helper to type check and process a dictionary of navigation menu translations.
 * Converts it to an array matching the English menu’s sorting with English items used as fallback entries.
 */

type navMatching = Array<{
	key: string;
	text: string
	slug?: string;
}>

export const NavDictionary = (dict: navMatching) => {
	const parsingNavMenu = (enMenu: any, dict: navMatching) => {
		const orderedDictionary: NavDict = [];
		for (const entry of enMenu) {
			const matchedObject = dict.find((value) => value.key === entry.key);
			let items = undefined;

			if (entry.items) {
				items = parsingNavMenu(entry.items, dict);
				if (items.length === 0) {
					items = undefined;
				}
			}

			if (matchedObject) {
				const text = matchedObject.text;
				const slug = matchedObject.slug || entry.slug;

				if (slug) {
					orderedDictionary.push({ ...entry, text, slug, ...(items && { items }) });
				} else if (items) {
					orderedDictionary.push({ ...entry, text, items });
				} else {
					orderedDictionary.push({ ...entry, text });
				}
			} else {
				if (items) {
					orderedDictionary.push({ ...entry, items, isFallback: true });
				} else {
					orderedDictionary.push({ ...entry, isFallback: true });
				}
			}
		}

		return orderedDictionary;
	};

	const orderedDictionary = parsingNavMenu(enNav, dict);
	return orderedDictionary;
};

export interface HeaderMenuTranslation {
	nav: Array<{
		title: string;
		href: string;
		dropdown?: Array<{
			title: string;
			href: string;
			target?: string;
		}>
		target?: string;
	}>
}

export const headerMenuDict = (dict: HeaderMenuTranslation) => dict

export interface FooterTranslations {
	data: Array<{
		title: string;
		links: Array<{
			text: string;
			type?: string;
			flag?: string;
			route: string;
		}>;
	}>
}

export const footerDict = (dict: FooterTranslations) => dict


export interface SearchMenuTranslation {
	button: string,
	placeholder: string,
	shortcutLabel: string,
}

export const searchMenuDict = (dict: SearchMenuTranslation) => dict

