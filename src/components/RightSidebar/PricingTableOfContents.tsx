import type { MarkdownHeading } from 'astro';
import type { ComponentChildren, JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { tabStore } from '../tabs/store';
import { deduplicateHeadings } from '~/util/deduplicateHeadings';
import generateToc from '~/util/generateToc';
import type { TocItem } from '~/util/generateToc';
import { unescape } from '~/util/html-entities';

interface Props {
	headings: MarkdownHeading[];
	labels: {
		initialHeadingTitle: string;
		title: string;
	};
	sharedStore?: string;
}

/**
 * PricingTableOfContents - A dynamic TOC for pricing pages with tabs.
 * 
 * This component syncs with the tab state to show the correct headings
 * for the currently active tab. It uses the shared tabStore to detect
 * tab changes and updates the TOC links accordingly.
 */
const PricingTableOfContents = ({ headings, labels, sharedStore = 'pricing-tabs' }: Props) => {
	const $tabStore = useStore(tabStore);
	
	// Get the current tab from the shared store
	const currentTab = $tabStore[sharedStore]?.curr ?? 'dolar';
	
	// Deduplicate headings based on text content
	const uniqueHeadings = deduplicateHeadings(headings);
	
	// Generate TOC from deduplicated headings
	const toc = generateToc(uniqueHeadings, labels.initialHeadingTitle);
	
	// State for tracking the currently visible heading
	const [currentHeading, setCurrentHeading] = useState({
		slug: toc[0]?.slug ?? 'overview',
		text: toc[0]?.text ?? ''
	});

	// Update heading links based on current tab
	// When tab is "real", we need to link to the "-1" suffixed slugs
	// When tab is "dolar", we use the original slugs
	const getHeadingSlug = (slug: string): string => {
		// For the "real" (BRL) tab, headings have "-1" suffix
		if (currentTab === 'real') {
			// Check if there's a "-1" version of this slug
			const headingWithSuffix = headings.find(h => h.slug === `${slug}-1`);
			if (headingWithSuffix) {
				return `${slug}-1`;
			}
		}
		return slug;
	};

	useEffect(() => {
		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const { id } = entry.target;
					
					if (id === 'on-this-page-heading') continue;
					
					setCurrentHeading({
						slug: entry.target.id,
						text: entry.target.textContent || '',
					});
					
					break;
				}
			}
		};

		const observerOptions: IntersectionObserverInit = {
			rootMargin: '-40px 0% -86%',
			threshold: 1,
		};

		const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);

		// Observe all visible headings in the main page content
		// We need to filter out hidden headings (from inactive tabs)
		document.querySelectorAll('article :is(h1,h2,h3):not([hidden] *)').forEach((h) => {
			const parent = h.closest('[hidden]');
			if (!parent) {
				headingsObserver.observe(h);
			}
		});

		return () => headingsObserver.disconnect();
	}, [currentTab]); // Re-run when tab changes

	const onLinkClick = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		const targetHref = e.currentTarget.getAttribute('href');
		if (!targetHref) return;
		
		const selectorTitle = document.querySelector(targetHref) as HTMLElement | null;
		if (!selectorTitle) return;
		
		const getOffsetTop = selectorTitle.offsetTop - 96;

		window.scrollTo({
			top: getOffsetTop,
			behavior: 'smooth',
		});
	};

	const TableOfContentsItem = ({ heading }: { heading: TocItem }) => {
		const { depth, slug, text, children } = heading;
		const actualSlug = getHeadingSlug(slug);
		const isActive = currentHeading.slug === actualSlug;
		
		return (
			<li class="flex flex-col gap-1 -ml-2 overflow-hidden">
				<a
					class={`rounded hover:underline text-sm max-w-full px-2 py-1 ${
						isActive ? 'surface-200 text-color-secondary' : 'text-color-secondary'
					}`}
					href={`#${actualSlug}`}
					onClick={onLinkClick}
				>
					{unescape(text)}
				</a>
				{children.length > 0 ? (
					<ul class="flex flex-col gap-1 ml-4">
						{children.map((child) => (
							<TableOfContentsItem key={child.slug} heading={child} />
						))}
					</ul>
				) : null}
			</li>
		);
	};

	return (
		<div class="flex flex-col gap-2">
			<p class="font-medium text-base">{labels.title}</p>
			<ul class="flex flex-col gap-1">
				{toc.map((heading) => (
					<TableOfContentsItem key={heading.slug} heading={heading} />
				))}
			</ul>
		</div>
	);
};

export default PricingTableOfContents;
