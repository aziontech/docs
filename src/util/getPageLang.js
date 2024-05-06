export function getLanguageFromURL(pathname) {
	const langCodeMatch = pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
	return langCodeMatch ? langCodeMatch[1] : 'en';
}

export function getLangFromSlug(slug) {
	return slug.split('/')[0]
}
