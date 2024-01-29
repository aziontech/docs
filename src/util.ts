import type { CollectionEntry } from 'astro:content';

export function getLanguageFromURL(pathname: string) {
	const langCodeMatch = pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
	return langCodeMatch ? langCodeMatch[1] : 'en';
}

/** Remove \ and / from beginning of string */
export function removeLeadingSlash(path: string | undefined) {
	if (typeof path === 'string') return path.replace(/^[/\\]+/, '');
	return `${path}`
}

/** Remove \ and / from end of string */
export function removeTrailingSlash(path: string | undefined) {
	if (typeof path === 'string') return path.replace(/[/\\]+$/, '');
	return `${path}`
}

/** Get a page’s slug, without the language prefix (e.g. `'en/migrate'` => `'migrate'`). */
export const stripLangFromSlug = (slug: CollectionEntry<'docs'>['slug']) => slug.split('/').slice(1).join('/');

/** Get a page’s lang tag from its slug (e.g. `'en/migrate'` => `'en'`). */
export const getLangFromSlug = (slug: CollectionEntry<'docs'>['slug']) => slug.split('/')[0];

export const getSlugFromPermalink = (collection: CollectionEntry<'docs'>) => {
	let permalink = collection.data.permalink

	if (permalink?.charAt(0) === '/') permalink = permalink.substring(1);
	if (permalink?.charAt(permalink.length - 1) === '/') permalink = permalink.substring(0, permalink.length - 1)

	return permalink
}

export const modelSlug = (slug: string | undefined, isFallback: boolean | undefined, lang: string): string => {
  if (typeof slug !== 'string') return 'Error while parsing slug'
  if (isURL(slug)) return slug
	return `/${isFallback ? 'en' : lang}/${removeTrailingSlash(removeLeadingSlash(slug))}/`;
};

export const isURL = (path: string | undefined): boolean | undefined => {
	const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/; // Check if string starts with ftp, http or https followed by ://

	if (typeof path == "string") {
		return urlRegex.test(path)
	} 
}
