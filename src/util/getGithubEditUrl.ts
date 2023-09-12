import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';

/** Gets the URL to edit the page on GitHub */

export function getGithubEditUrl(Astro: Readonly<AstroGlobal>) {
	const { content = {} } = Astro.props;
	const isFallback = !!Astro.params.fallback;
	const currentPage = Astro.url.pathname;
	const currentFileId = Astro.props.id;
	const lang = getLanguageFromURL(currentPage);
	const filePath = `src/content/docs/${currentFileId.replace(/\/$/, '')}`;
	const currentFile = isFallback ? filePath.replace(`/${lang}/`, '/en/') : filePath;
	const githubEditUrl =
		content.githubURL && (lang === 'en' || isFallback)
			? `${content.githubURL}${content.hasREADME ? 'README.md' : ''}`
			: `https://github.com/aziontech/docs/blob/main/${currentFile}`;

	return githubEditUrl;
}
