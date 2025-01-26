export const wwwazioncom = () => 'https://www.azion.com';
export const removeLangFromUrl = (url) => url.replace('/pt-br', '').replace('/en', '');
export const removeHostFromUrl = (url) => url.replace(wwwazioncom(), '');
export const removeHostAndLangFromUrl = (url) => removeLangFromUrl(removeHostFromUrl(url));
export const isFromRoot = (url) => url === wwwazioncom();
