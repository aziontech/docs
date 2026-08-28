<template>
	<article
		class="prose prose-headings:text-[var(--text-default)] prose-lg max-w-full prose-headings:font-medium"
		:class="proseStyles"
	>
		<slot />
	</article>
</template>

<script setup>
	import { onMounted } from 'vue';

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
		prose-a:text-[var(--text-link)]
		hover:prose-a:text-[var(--text-link-hover)]
		prose-p:text-[var(--text-muted)]
		prose-li:text-[var(--text-muted)]
		prose-table:text-[var(--text-muted)]
		prose-table:rounded
		prose-table:border
		prose-table:border-[var(--border-default)]
		prose-table:overflow-x-scroll
		lg:prose-table:overflow-x-auto
		prose-table:block
		prose-table:w-full
		md:prose-table:w-fit
		prose-td:whitespace-nowrap
		md:prose-td:whitespace-normal
		prose-thead:bg-[var(--bg-surface-raised)]
		prose-tr:bg-[var(--bg-surface-raised)]
		prose-th:bg-[var(--bg-surface-raised)]
		prose-tr:border-[var(--border-default)]
		prose-thead:border-separate
		prose-th:text-sm
		prose-th:text-[var(--text-muted)]
		prose-th:p-4
		prose-th:font-medium
		prose-th:text-left
		prose-th:border-t-1
		prose-th:border-[var(--border-default)]
		prose-th:text-wrap
		prose-td:text-sm
		prose-td:text-[var(--text-muted)]
		prose-td:p-4
		prose-td:border-t-1
		prose-td:border-[var(--border-default)]
		prose-hr:border-[var(--border-default)]
		prose-strong:text-[var(--text-default)]
		prose-code:text-[var(--text-default)]
		prose-li:marker:text-[var(--text-muted)]
	`;

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
		background: color-mix(in srgb, var(--primary) 10%, transparent) !important;
		border-radius: 0.325rem !important;
		border-left: var(--primary) 5px solid !important;
		margin: 2rem 0 !important;
	}

	.prose :is(aside.content.note) {
		background: var(--bg-surface-raised) !important;
		border-left: var(--border-strong) 5px solid !important;
	}

	.prose :is(aside.content > p) {
		display: flex;
		gap: 0.375rem;
		fill: var(--primary) !important;
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
		background: var(--bg-surface-raised) !important;
	}

	.prose *:is(a button) {
		margin-top: 0.25rem !important;
	}

	.prose *:is(small) {
		color: var(--text-muted);
	}

	.astro-code {
		background-color: var(--bg-surface-raised) !important;
	}

	// Override prose-lg h1 size to 36px
	.prose-lg :where(h1):not(:where([class~='not-prose'], [class~='not-prose'] *)) {
		font-size: 2.25rem !important;
		margin-bottom: 2rem !important;
	}
</style>
