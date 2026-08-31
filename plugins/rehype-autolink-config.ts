import { h } from 'hastscript';

const AnchorLinkIcon = h('i', {
	class: 'ml-2 pi pi-link',
	"data-icon": ""
});

/**
 * Configuration for the `rehype-autolink-headings` plugin.
 * This set-up was informed by
 */
export const autoLinks = {
	behavior: 'append',
	// `data-doc-anchor` is DocProse's own escape hatch: it keeps the heading
	// anchor out of the prose link paint (color, underline) that the article
	// typography contract applies to every authored `a`.
	properties: { 'data-doc-anchor': '' },
	content: AnchorLinkIcon,
};
