<template>
	<div class="docs-footer w-full border-t border-(--border-default)">
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
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					class="mr-(--spacing-xs) hidden w-fit items-center rounded-(--shape-elements) transition-opacity hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) lg:inline-flex"
				>
					<Brand
						size="small"
						aria-hidden="true"
					/>
				</a>
				<IconButton
					v-for="({ icon, link, title, target }, index) in socialButtons"
					:key="index"
					kind="transparent"
					:icon="icon"
					:aria-label="title"
					:href="link"
					:target="target || '_blank'"
				/>
			</template>

			<template #status>
				<slot name="system-status" />
			</template>

			<template #language>
				<slot name="action" />
			</template>

			<template #brand>
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					class="mx-auto inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
				>
					<Brand
						size="small"
						aria-hidden="true"
					/>
				</a>
			</template>
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
		socialButtons: {
			type: Array,
			required: false
		}
	})
</script>

<style>
	/* The reference docs footer is webkit's Footer in its `content` kind: no framed gutters, no
	   bordered site-width column, no closing band — the link columns fill the content column and
	   the status and social bands close it. webkit 4.4.0 knows only the marketing frame, so this
	   flattens it. Same layer trick as the sidebar overrides (main.css imports Tailwind with
	   `important`). Drop when webkit is bumped. */
	@layer components {
		.docs-footer [data-testid='layout-footer__gutter'],
		.docs-footer [data-testid='layout-footer__closing'] {
			display: none !important;
		}

		.docs-footer div:has(> [data-testid='layout-footer__columns']) {
			max-width: none !important;
			border-left-width: 0 !important;
			border-right-width: 0 !important;
		}

		/* The brand sits in the social band from `lg` (see the template); below it the signature
		   band carries it centred, as the reference does with a media query. */
		@media (min-width: 1024px) {
			.docs-footer [data-testid='layout-footer__signature'] {
				display: none !important;
			}
		}
	}
</style>
