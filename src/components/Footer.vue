<template>
	<!--
		The docs footer, transcribed from the design system's own site footer
		(webkit repo, demo/vue-sample: apps/webkit-sample/src/shared/ui/
		SiteFooter.vue) — the DS `Footer` (@aziontech/webkit/footer) in the
		anatomy its Storybook "Default" story documents: the link columns, then
		a row carrying the social icon buttons at the left and the status +
		language controls at the right, then the signature band with the brand
		mark beside its tagline, and finally the component's own closing band.

		The component owns all of that — the canvas shell, the framed measure,
		the 2→4 column grid at `md`, the hatched gutters from `xl`, and the
		closing band that finishes the frame at the bottom of the page. This
		file supplies only content.

		Two adaptations to this site's rendering model:

		· The interactive controls stay in their hydrated islands and reach the
		  bands through the same slots BaseLayout.astro always supplied:
		  `system-status` fills the status band, and `action` (the language
		  select) plus `theme-switch` share the control cluster the sample
		  seats its language select in.
		· The full-bleed rule above the footer is kept from the sample: the DS
		  Footer draws no top rule of its own, so the page above it decides
		  where its frame closes.
	-->
	<div class="w-full border-t border-(--border-default)">
		<Footer aria-label="Footer">
			<Footer.Column
				v-for="column in listData"
				:key="column.title"
				:title="column.title"
			>
				<Footer.Link
					v-for="item in column.list"
					:key="item.title"
					:href="item.link"
				>
					{{ item.title }}
				</Footer.Link>
			</Footer.Column>

			<template #social>
				<IconButton
					v-for="({ icon, link, title, target }, index) in socialButtons"
					:key="index"
					kind="transparent"
					:icon="icon"
					:ariaLabel="title"
					:href="link"
					:target="target || '_blank'"
				/>
			</template>

			<template #status>
				<slot name="system-status" />
			</template>

			<template #language>
				<slot name="action" />
				<slot name="theme-switch" />
			</template>

			<template #brand>
				<!--
					The same treatment every other brand redirect on the site
					carries (the docs bar, the sample's nav and footer): one
					opacity transition on hover, and a focus ring. Brand
					hardcodes `role="img" aria-label="Azion"` on its span, so
					`aria-hidden` keeps the accessible name on the anchor.
				-->
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
				>
					<Brand
						size="large"
						aria-hidden="true"
					/>
				</a>
			</template>

			<template #tagline>{{ tagline }}</template>
		</Footer>
	</div>
</template>

<script setup>
	import Brand from '@aziontech/webkit/brand'
	import Footer from '@aziontech/webkit/footer'
	import IconButton from '@aziontech/webkit/icon-button'

	defineProps({
		lang: {
			type: String,
			required: true
		},
		listData: {
			type: Array,
			required: true
		},
		tagline: {
			type: String,
			required: true
		},
		socialButtons: {
			type: Array,
			required: false
		}
	})
</script>
