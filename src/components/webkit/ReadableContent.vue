<template>
	<DocProse>
		<slot />
	</DocProse>
</template>

<script setup lang="ts">
	import { onMounted, onScopeDispose } from 'vue';

	import DocProse from '@aziontech/webkit/doc-prose';

	defineSlots<{
		/** The rendered page body. */
		default(): unknown;
	}>();

	/** The heading anchor jumps natively; only the glyph also copies its URL. */
	const onClick = (event: MouseEvent) => {
		const glyph = (event.target as HTMLElement | null)?.closest('a[data-doc-anchor] > i');
		if (!glyph) return;

		const anchor = glyph.parentElement as HTMLAnchorElement;
		navigator.clipboard?.writeText(anchor.href);
	};

	onMounted(() => {
		document.addEventListener('click', onClick);
	});

	onScopeDispose(() => {
		document.removeEventListener('click', onClick);
	});
</script>
