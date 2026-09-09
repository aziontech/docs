<template>
	<!-- Ported from webkit's `DocCta` (the docs rail's call to action), which the published 4.4.0
	     does not ship yet: a framed card with the brand mark, a short pitch and up to two actions.
	     Replace with `@aziontech/webkit/doc-cta` once webkit is bumped. -->
	<FrameBox
		data-testid="doc-cta"
		role="complementary"
		:aria-labelledby="id"
		class="w-full"
	>
		<div class="flex flex-col bg-(--bg-surface) px-6 py-5">
			<Brand
				kind="default"
				size="small"
				aria-hidden="true"
				class="mb-(--spacing-md) [&>svg]:h-3.5!"
			/>
			<p
				:id="id"
				class="m-0 text-heading-xxs text-(--text-default)"
			>
				{{ title }}
			</p>
			<p
				v-if="label"
				class="m-0 mt-(--spacing-xxs) text-body-xs text-(--text-muted)"
			>
				{{ label }}
			</p>
			<div class="mt-(--spacing-md) flex flex-col gap-(--spacing-xs)">
				<Button
					:label="primaryLabel"
					:href="primaryHref"
					size="medium"
					class="w-full"
				/>
				<Button
					v-if="secondaryLabel"
					:label="secondaryLabel"
					:href="secondaryHref"
					kind="outlined"
					size="medium"
					class="w-full"
				/>
			</div>
		</div>
	</FrameBox>
</template>

<script setup>
	import { useId } from 'vue';

	import Brand from '@aziontech/webkit/brand';
	import Button from '@aziontech/webkit/button';
	import FrameBox from '@aziontech/webkit/frame-box';

	defineProps({
		title: { type: String, default: 'Ready to build?' },
		label: { type: String, default: '' },
		primaryLabel: { type: String, default: 'Start for free' },
		primaryHref: { type: String, default: '' },
		secondaryLabel: { type: String, default: '' },
		secondaryHref: { type: String, default: '' }
	});

	const id = useId();
</script>

<style>
	/* The reference draws the mark at 14px (`[&>svg]:h-3.5!`); Brand's own svg height rule ties
	   with that utility once main.css imports Tailwind with `important`, so the earlier layer
	   settles it. Drop when webkit is bumped. */
	@layer components {
		[data-testid='doc-cta'] svg {
			height: 0.875rem !important;
		}
	}
</style>
