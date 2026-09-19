/** Lowercases the language, uppercases the region: `pt-br` → `pt-BR`. */
// Preferred over `bcp-47-normalize` here: that strips the region from `pt-BR` and `zh-CN`.

export function normalizeLangTag(tag: string) {
	if (!tag.includes('-')) return tag.toLowerCase();
	const [lang, region] = tag.split('-');
	return lang.toLowerCase() + '-' + region.toUpperCase();
}
