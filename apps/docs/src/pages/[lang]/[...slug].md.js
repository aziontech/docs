import { allPages } from '~/content';
import { getLangFromSlug, stripLangFromSlug, getSlugFromPermalink } from '~/util';
import { docsHomeEntries } from '~/data/docs-home';
import { ARCHITECTURES_HOME_NAMESPACE, architecturesHomeMarkdown } from '~/data/architectures-home';
import { DEVTOOLS_HOME_NAMESPACE, devtoolsHomeMarkdown } from '~/data/devtools-home';
import { getHubDirectory } from '~/nav/index';
import { pricingRows } from '~/data/pricing';
import { useTranslationsForLang } from '~/i18n/util';
import { guidesCatalog } from '~/util/guidesCatalog';
import { mdxToMarkdown } from '~/util/markdownTwin';

const includes = import.meta.glob('/src/includes/**/*.{md,mdx}', {
	query: '?raw',
	import: 'default',
	eager: true,
});

/** The route params of a page's twin, shared by getStaticPaths and the links between twins. */
function twinParams(page) {
	const permalink = getSlugFromPermalink(page);
	const lang = getLangFromSlug(page.id);
	const slug = typeof permalink === 'string' ? permalink : stripLangFromSlug(page.id);
	return { lang, slug };
}

const twinPaths = new Set(
	[...allPages, ...docsHomeEntries].map((page) => {
		const { lang, slug } = twinParams(page);
		return `/${lang}/${slug}`;
	})
);

const KIND_LABEL_KEYS = {
	tutorial: 'guides.kind.tutorial',
	'how-to-guide': 'guides.kind.howToGuide',
	'multi-product-guide': 'guides.kind.multiProductGuide',
	'use-case': 'guides.kind.useCase',
	architecture: 'guides.kind.architecture',
};

/** The guides catalog grouped by content type, in the order the guides hub filters it. */
async function guidesGroups(lang) {
	const t = useTranslationsForLang(lang);
	const { rows, kinds } = await guidesCatalog(lang);
	return kinds
		.map((kind) => ({
			heading: KIND_LABEL_KEYS[kind] ? t(KIND_LABEL_KEYS[kind]) : kind,
			items: rows.filter((row) => row.kind === kind),
		}))
		.filter((group) => group.items.length > 0);
}

function removeFrontMatter(body) {
	return body.replace(/^---[\s\S]*?---\n?/, '');
}

function getMarkdownContent(title, body) {
	return `# ${title}\n\n${removeFrontMatter(body)}`;
}

/** The page's MDX as plain Markdown; a page that fails to convert keeps its raw body. */
async function getPageMarkdown(page, lang) {
	try {
		const markdown = await mdxToMarkdown(page.body, {
			lang,
			readInclude: (key) => includes[key],
			hasTwin: (path) => twinPaths.has(path),
			data: { guides: guidesGroups, pricing: pricingRows },
			onUnknown: (name) => console.warn(`[markdown twin] ${page.id}: no rule for ${name}`),
		});
		return `# ${page.data.title}\n\n${markdown}`;
	} catch (error) {
		console.warn(`[markdown twin] ${page.id}: ${error.message}; serving the raw MDX body`);
		return getMarkdownContent(page.data.title, page.body);
	}
}

function getMarkdownBasedOnCards(title, description, productCards) {
	if (!productCards || !Array.isArray(productCards)) {
		return '';
	}

	let content = '';

	// Adicionar título principal e descrição
	if (title) {
		content += `# ${title}\n\n`;
	}

	if (description) {
		content += `${description}\n\n`;
	}

	const productCardsSections = productCards
		.map((productCard) => {
			if (!productCard.title || !productCard.cards || !Array.isArray(productCard.cards)) {
				return '';
			}

			let section = `## ${productCard.title}\n\n`;

			const cardsSections = productCard.cards
				.map((card) => {
					if (!card.title) {
						return '';
					}

					let cardSection = `### ${card.title}\n\n`;

					if (card.description) {
						cardSection += `${card.description}\n\n`;
					}

					if (card.link) {
						// Remove trailing slash and add .md extension
						const convertedLink = card.link.replace(/\/$/, '') + '.md';
						cardSection += `[${card.title}](${convertedLink})\n\n`;
					}

					return cardSection;
				})
				.join('');

			section += cardsSections;
			return section;
		})
		.join('\n');

	return content + productCardsSections;
}

export async function getStaticPaths() {
	return [...allPages, ...docsHomeEntries].map((page) => ({
		params: twinParams(page),
		props: { page },
	}));
}

export async function GET({ props }) {
	const { page } = props;
	const { body, data } = page;
	const { title, description, product_cards } = data;

	let content = '';

	if (data.namespace === DEVTOOLS_HOME_NAMESPACE) {
		// Its MDX holds only frontmatter; the body is built from the same data the page renders.
		const lang = getLangFromSlug(page.id);
		content = getMarkdownContent(
			title,
			devtoolsHomeMarkdown(lang, await getHubDirectory('devtools', lang))
		);
	} else if (data.namespace === ARCHITECTURES_HOME_NAMESPACE) {
		const lang = getLangFromSlug(page.id);
		content = getMarkdownContent(
			title,
			architecturesHomeMarkdown(lang, await getHubDirectory('architectures', lang))
		);
	} else if (product_cards && Array.isArray(product_cards)) {
		content = getMarkdownBasedOnCards(title, description, product_cards);
	} else if (body) {
		content = await getPageMarkdown(page, getLangFromSlug(page.id));
	}

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
		},
	});
}
