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
		icon?: string;
		key: string;
		isFallback?: boolean;
		items?: NavDict;
		addBorder?: boolean;
		hasLabel?: UIDictionaryKeys;
		labelIcon?: string;
		isProduct?: boolean
	}
>;

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

