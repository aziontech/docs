/** The hreflang default for a page: English, else Portuguese, else Spanish. */
// Takes the page's translation list, each entry `{ langPrefix, lang, slug }`.

	export function getHreflangDefault (pageLangs) {
		return pageLangs?.find((item) => item.langPrefix === 'en') ||
			pageLangs?.find((item) => item.langPrefix === 'pt-br') ||
			pageLangs?.find((item) => item.langPrefix === 'es')
	}
	