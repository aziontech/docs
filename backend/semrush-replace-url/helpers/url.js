const wwwazioncom = () => 'https://www.azion.com'
const removeLangFromUrl = (url) => url.replace('/pt-br', '').replace('/en', '')
const removeHostFromUrl = (url) => url.replace(wwwazioncom(), '')
const removeHostAndLangFromUrl = (url) => removeLangFromUrl(removeHostFromUrl(url))
const isFromRoot = (url) => url === wwwazioncom()

module.exports = {
	removeLangFromUrl,
	removeHostFromUrl,
	removeHostAndLangFromUrl,
	isFromRoot
}
