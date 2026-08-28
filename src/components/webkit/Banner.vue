<template>
	<div class="px-3 p-2 rounded-md border border-default max-w-3xl">
		<p class="text-center">
			<!--
				Was a hand-rolled `.wk-tag` in a now-deleted `<style scoped>`
				block: a visual port of PrimeVue's Tag that hardcoded
				`background: #f3652b` and `color: var(--primary-text-color,
				#ffffff)` -- a variable @aziontech/theme 4.x does not define,
				so the label was always the #ffffff fallback.
				That hex IS `var(--primary)`, so the chip was pinned to the
				light-theme brand orange and could never follow the theme.

				Consuming @aziontech/webkit/tag directly rather than the sibling
				Tag.vue: that component is a compatibility shim whose whole
				reason to exist is the ~391 frozen `severity="info"` /`value`
				call sites in src/content, and its severity list does not even
				include the value needed here. Routing a first-party component
				through the legacy adapter would couple Banner to a shim we want
				free to delete, and would make the chip's appearance depend on
				the shim's *default* severity rather than on a stated one.

				Badge, not Tag: the two look alike but paint `primary`
				differently, and only one of them reproduces this chip. Tag's
				`primary` is `--primary-mask` (#FE601F33, a 20% orange wash)
				with orange text -- a tinted chip. Badge's `primary` is
				`bg-[var(--primary)]` with `text-[var(--primary-contrast)]`,
				i.e. the solid brand fill with its readable counterpart, which
				is exactly what the old `.wk-tag` drew. So the migration keeps
				the original appearance instead of trading it for a wash, and
				gains the theme-awareness the hardcoded hex never had.

				One real change comes with that: `--primary-contrast` is
				#FFFFFF on light and #000000 on dark, where the old chip was
				always white. The dark theme therefore gets a black label on
				orange -- the contrast pair the theme prescribes, rather than
				the light-theme value leaking into both.

				`size="small"` matches the old chip's 20px height exactly
				(12px * 1.0 line-height + 2 * 4px padding); horizontal padding
				goes 6.4px -> 4px, and font weight 700 -> the token's 600.
				`mr-1.5` is kept on the component itself: webkit's badge emits
				no margin utility, so there is nothing for Tailwind's important
				mode to fight over.
			-->
			<Badge
				label="News"
				severity="primary"
				size="small"
				class="mr-1.5"
			/>
			<span class="text-sm text-muted text-center *:">
				{{ description }}
			</span>
			<a
				:title="cta"
				:href="link"
				class="text-sm font-medium ml-1"
				style="color: var(--text-link); display: inline"
			>
				{{ cta }}
			</a>
		</p>
	</div>
</template>

<script setup>
	import Badge from '@aziontech/webkit/badge';

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
