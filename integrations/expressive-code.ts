import { astroExpressiveCode, ExpressiveCodeTheme, pluginFramesTexts } from 'astro-expressive-code';
import path from 'path';
// import { translations } from '../src/i18n/util';
import { theme } from './syntax-highlighting-theme.js';

// Allow creation of a pre-configured Expressive Code integration that matches the Astro Docs theme
export const astroDocsExpressiveCode = () =>
	astroExpressiveCode({
		theme: new ExpressiveCodeTheme(theme),
		styleOverrides: {
			codeBackground: '#151515',
			borderColor: 'var(--color-gray-90)',
			scrollbarThumbColor: 'hsl(269deg 20% 90% / 0.25)',
			scrollbarThumbHoverColor: 'hsl(269deg 20% 90% / 0.5)',
			codeFontFamily: 'var(--font-mono)'
		},
		// frames: {
		// 	styleOverrides: {
		// 		editorTabBarBackground: 'var(--color-gray-90)',
		// 		editorActiveTabBackground: '#151515',
		// 		editorActiveTabBorderBottom: '#F3652B',
		// 		editorTabBarBorderBottom: 'transparent',

		// 		terminalTitlebarBackground: 'var(--color-gray-90)',
		// 		terminalTitlebarBorderBottom: 'transparent',
		// 		terminalBackground: '#151515',
		// 	},
		// },
		// textMarkers: {
		// 	styleOverrides: {
		// 		defaultChroma: '55',
		// 	},
		// },
		getBlockLocale: ({ file }) => {
			// Path format: `src/content/docs/en/getting-started.mdx`
			// Part indices:  0     1      2   3         4
			const pathParts = path.relative(file.cwd, file.path).split(/[\\/]/);
			return pathParts[3];
		},
	});
