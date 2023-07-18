import { pluginFramesTexts, } from 'astro-expressive-code';
import { translations } from '../src/i18n/util';

Object.entries(translations).forEach(([locale, texts]) => {
	pluginFramesTexts.overrideTexts(locale, {
		terminalWindowFallbackTitle: texts['expressiveCode.terminalWindowFallbackTitle'],
		copyButtonTooltip: texts['expressiveCode.copyButtonTooltip'],
		copyButtonCopied: texts['expressiveCode.copyButtonCopied'],
	});
});

export const theme = {
	theme: 'slack-dark',
	styleOverrides: {
		codeFontFamily: 'var(--font-mono)'
	},
	frames: {
		styleOverrides: {
			editorTabBarBackground: 'var(--color-gray-80)',
		}
	}
};
