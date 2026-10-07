import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';

/** Gets the URL to edit the page on GitHub */

export function getGithubEditUrl(Astro: Readonly<AstroGlobal>) {
	const { content = {} } = Astro.props;
	const isFallback = !!Astro.params.fallback;
	const currentPage = Astro.url.pathname;
	const currentFileId = Astro.props.id;
	const lang = getLanguageFromURL(currentPage);
	// Pages that live in `src/pages` rather than the collection pass their own
	// path, since their id no longer names a file under `src/content/docs`.
	const editFilePath = Astro.props.editFilePath as string | undefined;
	const filePath = editFilePath ?? `src/content/docs/${currentFileId.replace(/\/$/, '')}`;
	const currentFile = isFallback ? filePath.replace(`/${lang}/`, '/en/') : filePath;
	const githubEditUrl =
		content.githubURL && (lang === 'en' || isFallback)
			? `${content.githubURL}${content.hasREADME ? 'README.md' : ''}`
			: `https://github.com/aziontech/docs/blob/main/${currentFile}`;

	return githubEditUrl;
}
