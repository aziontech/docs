<template>
	<article
		class="prose prose-headings:text-white prose-lg max-w-full prose-headings:font-medium"
		:class="proseStyles"
		:style="cssVariables"
	>
		<slot />
	</article>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { primitiveColors } from 'azion-theme/src/tokens/colors-primitive';

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

	const proseStyles = `
		prose-a:text-white
		hover:prose-a:text-orange-500
		prose-p:text-neutral-400
		prose-li:text-neutral-400
		prose-table:text-neutral-400
		prose-table:rounded
		prose-table:border
		prose-table:border-neutral-800
		prose-table:overflow-x-scroll
		lg:prose-table:overflow-x-auto
		prose-table:block
		prose-table:w-full
		md:prose-table:w-fit
		prose-td:whitespace-nowrap
		md:prose-td:whitespace-normal
		prose-thead:bg-neutral-900
		prose-tr:bg-neutral-900
		prose-th:bg-neutral-900
		prose-tr:border-neutral-800
		prose-thead:border-separate
		prose-th:text-sm
		prose-th:text-neutral-400
		prose-th:p-4
		prose-th:font-medium
		prose-th:text-left
		prose-th:border-t-1
		prose-th:border-neutral-900
		prose-th:text-wrap
		prose-td:text-sm
		prose-td:text-neutral-400
		prose-td:p-4
		prose-td:border-t-1
		prose-td:border-neutral-900
		prose-hr:border-neutral-900
		prose-strong:text-white
		prose-code:text-white
		prose-li:marker:text-neutral-400
	`;

	const cssVariables = {
		'--prose-neutral-400': primitiveColors.neutral[400],
		'--prose-neutral-800': primitiveColors.neutral[800],
		'--prose-neutral-600': primitiveColors.neutral[600],
		'--prose-orange-500': primitiveColors.orange[500]
	};
</script>

<style scoped lang="scss">
	.heading-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;

		.anchor-link {
			top: 0.75rem;
			position: relative;
		}
	}

	.prose :is(aside.content) {
		background: color-mix(in srgb, var(--prose-orange-500) 10%, transparent) !important;
		border-radius: 0.325rem !important;
		border-left: var(--prose-orange-500) 5px solid !important;
		margin: 2rem 0 !important;
	}

	.prose :is(aside.content.note) {
		background: var(--prose-neutral-800) !important;
		border-left: var(--prose-neutral-600) 5px solid !important;
	}

	.prose :is(aside.content > p) {
		display: flex;
		gap: 0.375rem;
		fill: var(--prose-orange-500) !important;
		margin: 0 !important;
		padding-left: 0.375rem;
	}

	.prose :is(aside.content > section > p) {
		margin: 0.5rem 0.5rem 0 0 !important;
		font-size: 1rem;
		padding-left: 0.375rem;
	}

	.prose *:is(.expressive-code) {
		margin-bottom: 1.8rem !important;
	}
	.prose *:is(.expressive-code code) {
		background: var(--prose-neutral-800) !important;
	}

	.prose *:is(a button) {
		margin-top: 0.25rem !important;
	}

	.prose *:is(small) {
		color: var(--prose-neutral-400);
	}

	.astro-code {
		background-color: var(--prose-neutral-800) !important;
	}

	// Override prose-lg h1 size to 36px
	.prose-lg :where(h1):not(:where([class~='not-prose'], [class~='not-prose'] *)) {
		font-size: 2.25rem !important;
		margin-bottom: 2rem !important;
	}
</style>
