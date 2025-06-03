import { theme } from './syntax-highlighting-theme';
import { astroExpressiveCode, defineEcConfig } from 'astro-expressive-code';

/** @type {import('astro-expressive-code').ExpressiveCodeCoreOptions} */
const expressiveCodeOptions = defineEcConfig({
  themes: [theme],
  styleOverrides: {
    codeBackground: '#151515',
    borderColor: 'var(--color-gray-90)',
    scrollbarThumbColor: 'hsl(269deg 20% 90% / 0.25)',
    scrollbarThumbHoverColor: 'hsl(269deg 20% 90% / 0.5)',
    codeFontFamily: 'var(--font-mono)'
  }
});

const AzionExpressiveCode = () => astroExpressiveCode(expressiveCodeOptions);

export default AzionExpressiveCode;