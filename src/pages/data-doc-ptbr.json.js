import { allPages } from "~/content";
import { removeTrailingSlash, removeLeadingSlash } from "~/util";
import { groupPagesByLang } from "~/util/groupPagesByLang";

const pagesData = groupPagesByLang(allPages)

const data = pagesData["pt-br"].map(page => {
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

export async function get() {
	return {
		body: JSON.stringify(data),
	};
}
