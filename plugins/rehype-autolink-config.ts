import type { Element } from 'hast';
import { h } from 'hastscript';

/**
 * Configuration for the `rehype-autolink-headings` plugin.
 *
 * Mirrors webkit's `DocHeading`: the link wraps the heading text, the text underlines and the
 * link glyph fades in only while the heading is hovered or focused. `data-doc-anchor` keeps the
 * link out of DocProse's body-link styling; `data-icon` is what `ReadableContent` binds the
 * copy-and-scroll click handler to.
 */
export const autoLinks = {
	behavior: 'wrap',
	properties: {
		'data-doc-anchor': '',
		class:
			'group/anchor rounded-(--shape-flat) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)',
	},
	// A function replaces the heading's own children, so the text can be wrapped in the span
	// that carries the hover underline instead of sitting bare beside the glyph.
	content: (heading: Element) => [
		h(
			'span',
			{ class: 'decoration-(--border-strong) underline-offset-4 group-hover/anchor:underline' },
			heading.children,
		),
		h('i', {
			class:
				'pi pi-link ml-(--spacing-xs) align-middle text-label-md text-(--text-muted) opacity-0 transition-opacity duration-150 ease-out group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 motion-reduce:transition-none',
			'aria-hidden': 'true',
			'data-icon': '',
		}),
	],
};
