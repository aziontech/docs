<template>
	<div class="px-3 p-2 rounded-md border surface-border max-w-3xl">
		<p class="text-center">
			<span class="wk-tag mr-1.5">News</span>
			<span class="text-sm text-color-secondary text-center *:">
				{{ description }}
			</span>
			<a
				:title="cta"
				:href="link"
				class="text-sm font-medium ml-1"
				style="color: var(--text-color-link); display: inline"
			>
				{{ cta }}
			</a>
		</p>
	</div>
</template>

<script setup>
	defineProps({
		description: {
			type: String
		},
		cta: {
			type: String
		},
		link: {
			type: String
		}
	});
</script>

<style scoped>
	/*
		Visual port of PrimeVue Tag (azion-theme): small bold badge on the
		primary (orange) background, replacing `import Tag from 'primevue/tag'`.
	*/
	.wk-tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f3652b;
		color: var(--primary-text-color, #ffffff);
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.25rem 0.4rem;
		border-radius: 6px;
		line-height: 1;
	}
</style>
