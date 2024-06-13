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
			repository: 'docs',
			title: page.data.title || '',
			namespace: page.data.namespace || '',
			description: page.data.description || '',
			og_image: page.data.og_image || '',
			noindex: false,
			url: `https://www.azion.com/${lang}/${removeTrailingSlash(removeLeadingSlash(page.data.permalink))}/`
		}
	})
})

export function getStaticPaths() {
	return [
		{ params: { lang: "en" } },
		{ params: { lang: "pt-br" } }
	]
}

export async function GET({ params }) {
	const lang = params.lang;
	const jsonStr = JSON.stringify(data[lang]);
	
	return new Response(jsonStr)
}


