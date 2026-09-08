<template>
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
				<slot name="theme-switch" />
			</template>

			<template #brand>
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
