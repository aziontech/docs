import enNav from './en/nav';
import type enUI from './en/ui';
import type languages from './languages';

export type UIDictionaryKeys = keyof typeof enUI;
export type UIDict = Partial<typeof enUI>;
export type UILanguageKeys = keyof typeof languages;

/** Helper to type check a dictionary of UI string translations. */
export const UIDictionary = (dict: Partial<typeof enUI>) => dict;

type NavDictionaryKeys = typeof enNav[number]['key'];

export type NavDict = Array<
	{
		text: string;
		key: NavDictionaryKeys;
		isFallback?: boolean;
	} & ({ slug: string } | { header: true; type: 'learn' })
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
	const orderedDictionary: NavDict = [];
	const isFallback = true
	for (const entry of enNav) {
		const matchedObject = dict.find(value => value.key === entry.key)
		if (matchedObject) {
			const text = matchedObject.text

			if (matchedObject.slug) {
				const slug = matchedObject.slug
				orderedDictionary.push({ ...entry, text, slug });
			} else {
				orderedDictionary.push({ ...entry, text, isFallback });
			}
		} else {
			orderedDictionary.push({ ...entry, isFallback })
		}
	}

	// console.log(orderedDictionary)
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

export interface SearchMenuTranslation {
	button: string,
	placeholder: string,
	shortcutLabel: string,
}

export const searchMenuDict = (dict: SearchMenuTranslation) => dict

