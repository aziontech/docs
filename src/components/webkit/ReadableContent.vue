<template>
	<DocProse>
		<slot />
	</DocProse>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue';

	import DocProse from '@aziontech/webkit/doc-prose';

	defineSlots<{
		/** The rendered page body. */
		default(): unknown;
	}>();

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
	};

	const controlScroll = (e: Event) => {
		const getOffsetTop = (e.target as HTMLElement).offsetTop - 96;

		window.scrollTo({
			top: getOffsetTop,
			behavior: 'smooth'
		});
	};

	const onClickEvent = (e: Event, parentElement: HTMLAnchorElement) => {
		e.preventDefault();
		window.history.pushState({}, '', parentElement.href);

		copyToClipboard();
		controlScroll(e);
	};

	onMounted(() => {
		const iconElements = document.querySelectorAll('i[data-icon]');
		iconElements.forEach((iconElement) => {
			const parentElement = iconElement.parentElement;
			if (parentElement instanceof HTMLAnchorElement) {
				parentElement.addEventListener('click', (e) => onClickEvent(e, parentElement));
			}
		});
	});
</script>

<style>
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

	.readable-content small {
		color: var(--text-muted);
	}
</style>
