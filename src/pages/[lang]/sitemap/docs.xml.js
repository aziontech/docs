import { allPages } from "~/content";
import { removeTrailingSlash, removeLeadingSlash } from "~/util";
import { groupPagesByLang } from "~/util/groupPagesByLang";

const langs = ['en', 'pt-br']
const data = {}
const pagesData = groupPagesByLang(allPages)

langs.forEach((lang) => {
	if (!pagesData[lang]) return
	data[lang] = pagesData[lang].map(page => {
		return {
			noindex: false,
			url: `https://www.azion.com/${lang}/${removeTrailingSlash(removeLeadingSlash(page.data.permalink))}/`
		}
	})
})

function createXml(data) {
	let xml = '';
	const headerXML =
		'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/1999/xhtml http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
	let contentXML = '';
	const footerXML = '</urlset> ';

	data.forEach((page) => {
		if (page.noindex !== true) {
			contentXML += `
							 <url>
									 \t\t<loc>${page.url}</loc>\n
							 </url>`;
		}
	});

	xml += headerXML;
	xml += contentXML;
	xml += footerXML;


	let response = new Response(xml.trim());
	response.headers.set('Content-Type', 'application/xml; charset=utf-8');

	return response
}

export async function get({ params }) {
	const lang = params.lang ? params.lang : 'en'
	const response = createXml(data[lang])
	return response
}

export function getStaticPaths() {
	return [
		{ params: { lang: "en" } },
		{ params: { lang: "pt-br" } }
	]
}
