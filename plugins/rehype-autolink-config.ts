import type { Element, ElementContent, Properties } from 'hast';
import { h } from 'hastscript';

/** `data-doc-anchor` keeps DocProse's prose-link styling off the anchor. */
export const anchorClass = [
	'group/anchor rounded-(--shape-flat) text-inherit no-underline',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)'
].join(' ');

export const textClass = 'decoration-(--border-strong) underline-offset-4 group-hover/anchor:underline';

export const iconClass = [
	'pi pi-link ml-(--spacing-xs) align-middle text-label-md text-(--text-muted)',
	'opacity-0 transition-opacity duration-150 ease-out',
	'group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100',
	'motion-reduce:transition-none'
].join(' ');

/** Clears the 56px sticky header (`h-14`) plus a spacing step. */
export const headingClass = 'scroll-mt-20';

/** Configuration for the `rehype-autolink-headings` plugin. */
export const autoLinks = {
	behavior: 'wrap' as const,
	headingProperties: (heading: Element): Properties => ({
		'data-doc-heading': heading.tagName.slice(1),
		className: [
			...(Array.isArray(heading.properties?.className) ? heading.properties.className : []),
			headingClass
		]
	}),
	properties: { 'data-doc-anchor': '', className: anchorClass },
	content: (heading: Element): ElementContent[] => [
		h('span', { class: textClass }, heading.children),
		h('i', { class: iconClass, 'aria-hidden': 'true' })
	]
};
