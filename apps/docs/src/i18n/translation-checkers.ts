import type enUI from './en/ui';
import type languages from './languages';

export type UIDictionaryKeys = keyof typeof enUI;
export type UIDict = Partial<typeof enUI>;
export type UILanguageKeys = keyof typeof languages;

/** Helper to type check a dictionary of UI string translations. */
export const UIDictionary = (dict: Partial<typeof enUI>) => dict;

export interface FooterTranslations {
	data: Array<{
		title: string;
		links: Array<{
			text: string;
			type?: string;
			flag?: string;
			route: string;
		}>;
	}>;
}

export const footerDict = (dict: FooterTranslations) => dict;

export interface SearchMenuTranslation {
	button: string;
	placeholder: string;
	shortcutLabel: string;
}

export const searchMenuDict = (dict: SearchMenuTranslation) => dict;
