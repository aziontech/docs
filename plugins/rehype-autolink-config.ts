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
	content: AnchorLinkIcon,
};
