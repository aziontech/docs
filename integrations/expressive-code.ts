import { pluginFramesTexts } from 'astro-expressive-code';
import { translations } from '../src/i18n/util';

Object.entries(translations).forEach(([locale, texts]) => {
	pluginFramesTexts.overrideTexts(locale, {
		terminalWindowFallbackTitle: texts['expressiveCode.terminalWindowFallbackTitle'],
		copyButtonTooltip: texts['expressiveCode.copyButtonTooltip'],
		copyButtonCopied: texts['expressiveCode.copyButtonCopied'],
	});
});


/**
 * dark-plus, dracula-soft, dracula, github-dark-dimmed, github-dark,
 * github-light, hc_light, light-plus, material-theme-darker,
 * material-theme-lighter, material-theme-ocean, material-theme-palenight,
 * material-theme, min-dark, min-light, monokai, nord, one-dark-pro,
 * poimandres, rose-pine-dawn, rose-pine-moon, rose-pine, slack-dark,
 * slack-ochin, solarized-dark, solarized-light, vitesse-dark, vitesse-light
 */
export const theme = {
	theme: 'vitesse-dark',
	styleOverrides: {
		codeFontFamily: 'var(--font-mono)',
		
	},
	frames: {
		styleOverrides: {
			editorTabBarBackground: 'var(--color-gray-80)',
			editorActiveTabBorderTop: '#F3652B',
			editorTabBorderRadius: '6px'
		}
	}
};
