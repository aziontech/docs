<template>
	<div
		class="flex"
		:class="{ 'justify-center': isCentralized }"
	>
		<div
			class="flex flex-col"
			:class="[
				{ 'max-w-lg gap-5': !isCentralized },
				{ 'max-w-sm md:max-w-xl lg:max-w-4xl gap-10': isCentralized }
			]"
		>
			<template v-if="title">
				<template v-if="!isCentralized">
					<p
						v-if="title"
						class="text-muted text-xs"
						:class="{ 'text-center': isCentralized }"
					>
						{{ title }}
					</p>
				</template>
				<template v-else-if="isCentralized">
					<Overline
						class="text-center"
						:label="title"
					/>
				</template>
			</template>
			<div
				class="flex items-center flex-wrap m-0 text-muted"
				:class="[
					{ 'justify-center gap-8 lg:gap-0 gap-y-8 md:gap-y-16 ': isCentralized },
					{ 'gap-5': !isCentralized }
				]"
			>
				<div
					:class="[{ 'w-28': !isCentralized }, { 'w-36 lg:w-56': isCentralized }]"
					:key="logo.imageSrc"
					v-for="logo in logos"
				>
					<a
						:href="logo.href"
						:title="logo.title"
						class="*:h-10 max-h-10 flex justify-center"
						:class="[
							{ '*:max-w-28': !isCentralized },
							{ '*:max-w-36 *:lg:max-w-56 logo-container': isCentralized }
						]"
						v-html="logo.imageSrc"
						v-if="logo.href"
					></a>
					<span
						class="*:h-10 max-h-10 flex justify-center"
						:class="[
							{ '*:max-w-28': !isCentralized },
							{ '*:max-w-36 *:lg:max-w-56 logo-container': isCentralized }
						]"
						v-else
						v-html="logo.imageSrc"
					></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import Overline from './Overline.vue';

	defineProps({
		isCentralized: {
			type: Boolean,
			required: false,
			default: false
		},
		title: {
			type: String,
			required: false
		},
		logos: {
			type: Array,
			required: true
		}
	});
</script>

<style>
	.logo-container svg {
		transform: scale(1.4);
	}
</style>
