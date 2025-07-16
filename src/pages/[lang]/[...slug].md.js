import { allPages } from '~/content';
import { getLangFromSlug, stripLangFromSlug, getSlugFromPermalink } from '~/util';

function removeFrontMatter(body) {
	return body.replace(/^---[\s\S]*?---\n?/, '');
}

function getMarkdownContent(title, body) {
	return `# ${title}\n\n${removeFrontMatter(body)}`;
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
	return allPages.map((page) => {
		const permalink = getSlugFromPermalink(page);
		const lang = getLangFromSlug(page.slug);
		const slug = typeof permalink === 'string' ? permalink : stripLangFromSlug(page.slug);

		return {
			params: { lang, slug: slug },
			props: { page },
		};
	});
}

export async function GET({ props }) {
	const { page } = props;
	const { body, data } = page;
	const { title, description, product_cards } = data;

	let content = '';

	if (product_cards && Array.isArray(product_cards)) {
		content = getMarkdownBasedOnCards(title, description, product_cards);
	} else if (body) {
		content = getMarkdownContent(title, body);
	}

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
		},
	});
}
