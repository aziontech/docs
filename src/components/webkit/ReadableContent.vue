<template>
	<!--
		Adapter over @aziontech/webkit's DocProse — the design system's
		typography contract for documentation prose. Headings, paragraphs,
		lists, links, inline code chips, blockquotes and rules all take their
		size, spacing and color from the contract; nothing here restates it.

		What this wrapper adds is the docs site's own surface, the parts the
		contract deliberately does not cover:

		- data tables (the old prose-table treatment, restated as plain CSS
		  over the same tokens — DocProse ships no table rules);
		- the aside/callout chrome Aside.astro renders (marked
		  `data-doc-chrome` there, so the contract stops at its boundary);
		- the heading anchor behavior: clicking the appended anchor icon
		  copies the URL and smooth-scrolls under the fixed header.
	-->
	<DocProse class="readable-content">
		<slot />
	</DocProse>
</template>

<script setup>
	import { onMounted } from 'vue';

	import DocProse from '@aziontech/webkit/doc-prose';

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
	};

	const controlScroll = (e) => {
		const getOffsetTop = e.target.offsetTop - 96;

		window.scrollTo({
			top: getOffsetTop,
			behavior: 'smooth'
		});
	};

	const onClickEvent = (e, parentElement) => {
		e.preventDefault();
		window.history.pushState({}, '', parentElement.href);

		copyToClipboard();
		controlScroll(e);
	};

	onMounted(() => {
		const iconElements = document.querySelectorAll('i[data-icon]');
		iconElements.forEach((iconElement) => {
			const parentElement = iconElement.parentElement;
			if (parentElement.tagName.toLowerCase() === 'a') {
				parentElement.addEventListener('click', (e) => onClickEvent(e, parentElement));
			}
		});
	});
</script>

<style lang="scss">
	/*
		Global on purpose: the article body is slotted in by Astro, so scoped
		styles would never reach it. Everything below is docs-only surface —
		DocProse owns the flowing prose and these rules stay off it.
	*/

	/* Tables. The markdown pipeline wraps every table in a
	   div.overflow-x-auto (rehype-scrollable-tables); the block spacing goes
	   on that wrapper so the scroll area does not clip it. */
	.readable-content div:has(> table) {
		margin-top: var(--spacing-lg);
	}

	.readable-content table {
		width: 100%;
		border: 1px solid var(--border-default);
		border-radius: 0.25rem;
		border-collapse: separate;
		border-spacing: 0;
		color: var(--text-muted);
	}

	.readable-content thead,
	.readable-content tr,
	.readable-content th {
		background-color: var(--bg-surface-raised);
	}

	.readable-content th,
	.readable-content td {
		padding: 1rem;
		font-size: 0.875rem;
		color: var(--text-muted);
		border-top: 1px solid var(--border-default);
	}

	.readable-content th {
		font-weight: 500;
		text-align: left;
		text-wrap: wrap;
	}

	.readable-content td {
		white-space: nowrap;
	}

	@media (min-width: 768px) {
		.readable-content table {
			width: fit-content;
		}

		.readable-content td {
			white-space: normal;
		}
	}

	/* Asides (Aside.astro). Their body keeps DocProse's prose contract
	   (rhythm, muted ink, code chips); the paint below overrides only the
	   component's own theme-var chrome, hence the !important — same as the
	   old prose-era overrides. The title is a div, out of the contract's
	   paragraph rules by construction. */
	.readable-content aside.content {
		background: color-mix(in srgb, var(--primary) 10%, transparent) !important;
		border-radius: 0.325rem !important;
		border-left: var(--primary) 5px solid !important;
		margin: 2rem 0 !important;
	}

	.readable-content aside.content.note {
		background: var(--bg-surface-raised) !important;
		border-left: var(--border-strong) 5px solid !important;
	}

	.readable-content aside.content > .title {
		display: flex;
		gap: 0.375rem;
		fill: var(--primary) !important;
		margin: 0 !important;
		padding-left: 0.375rem;
	}

	.readable-content aside.content > section > p {
		padding-left: 0.375rem;
	}

	.readable-content a button {
		margin-top: 0.25rem !important;
	}

	.readable-content small {
		color: var(--text-muted);
	}
</style>
