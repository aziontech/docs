import { allPages } from "~/content";
import { removeTrailingSlash, removeLeadingSlash } from "~/util";
import { groupPagesByLang } from "~/util/groupPagesByLang";

const pagesData = groupPagesByLang(allPages)

const data = {
	en: pagesData['en'].map(page => {
		return {
			repository: 'docs',
			title: page.data.title,
			namespace: page.data.namespace,
			description: page.data.description,
			og_image: page.data.og_image,
			noindex: false,
			url: `https://www.azion.com/en/${removeTrailingSlash(removeLeadingSlash(page.data.permalink))}/`
		}
	}),
	"pt-br": pagesData["pt-br"].map(page => {
		return {
			repository: 'docs',
			title: page.data.title,
			namespace: page.data.namespace,
			description: page.data.description,
			og_image: page.data.og_image,
			noindex: false,
			url: `https://www.azion.com/pt-br/${removeTrailingSlash(removeLeadingSlash(page.data.permalink))}/`
		}
	})
}

export async function get({ params }) {
	const lang = params.lang;
	return {
		body: JSON.stringify(data[lang]),
	};
}

export function getStaticPaths() {
	return [
		{ params: { lang: "en" } },
		{ params: { lang: "pt-br" } }
	]
}
