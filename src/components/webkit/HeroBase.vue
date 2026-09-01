<template>
	<section
		:class="`relative max-w-5xl 2xl:max-w-6xl mx-auto mt-16 p-6 md:p-0 ${bottomSpacing}`"
		:id="id"
	>
		<div
			class="flex flex-col w-full"
			:class="[
				{ 'gap-10': !isCentralized },
				{ 'lg:flex-row': !isCentralized && position !== 'right' },
				{ 'flex-col-reverse lg:flex-row-reverse': !isCentralized && position === 'right' },
				{ 'items-center justify-center gap-12 md:gap-24': isCentralized },
				{ 'flex-col-reverse': isReverse }
			]"
		>
			<div
				class="w-full flex flex-col"
				:class="[
					{ 'lg:max-w-3xl 2xl:max-w-4xl gap-10': !isCentralized },
					{ 'items-center gap-12 md:gap-24': isCentralized },
					{ 'items-center text-center lg:text-left': align === 'center' },
					{ 'justify-center': justify === 'center' }
				]"
			>
				<div
					class="flex flex-col gap-5 md:gap-8"
					:class="[{ 'text-center': isCentralized }]"
				>
					<template v-if="bannerNews?.description">
						<div
							class="flex"
							:class="[{ 'justify-center': isCentralized }]"
						>
							<Banner
								:description="bannerNews.description"
								:cta="bannerNews.cta.label"
								:link="bannerNews.cta.link"
							/>
						</div>
					</template>

					<!--
						The webkit Overline is a `w-fit` row, so in the centered hero it
						has to center itself; the surrounding `text-center` only moves
						inline text.
					-->
					<Overline
						v-if="overline && overline.length"
						:class="{ 'self-center': isCentralized }"
						>{{ overline }}</Overline
					>
					<template v-if="title">
						<h1
							v-if="titleTag === 'h1'"
							class="leading-loose font-medium text-heading-3 text-balance"
							style="line-height: 125% !important"
							:class="[{ 'text-heading-5': isDisplay }]"
						>
							{{ title }}
						</h1>
						<h2
							v-if="titleTag === 'h2'"
							class="text-heading-3 leading-relaxed font-medium text-balance"
						>
							{{ title }}
						</h2>
						<h3
							v-if="titleTag === 'h3'"
							class="text-heading-3 leading-relaxed font-medium text-balance"
						>
							{{ title }}
						</h3>
						<h4
							v-if="titleTag === 'h4'"
							class="text-heading-3 leading-relaxed font-medium text-balance"
						>
							{{ title }}
						</h4>
						<h5
							v-if="titleTag === 'h5'"
							class="text-heading-3 leading-relaxed font-medium text-balance"
						>
							{{ title }}
						</h5>
						<h6
							v-if="titleTag === 'h6'"
							class="text-heading-3 leading-relaxed font-medium text-balance"
						>
							{{ title }}
						</h6>
					</template>
					<template v-else>
						<slot name="title" />
					</template>

					<template v-if="descriptionRawHtml && descriptionRawHtml.trim().length">
						<div
							v-html="descriptionRawHtml"
							:class="[{ 'text-center': isCentralized }]"
							class="text-muted text-base leading-relaxed text-balance prose max-w-none"
						></div>
					</template>
					<template v-else-if="description && description.trim().length">
						<p
							class="text-muted text-body-3 leading-relaxed text-balance"
							:class="[{ 'text-center': isCentralized }]"
						>
							{{ description }}
						</p>
					</template>

					<template v-if="$slots.actions">
						<div
							class="flex flex-row gap-3"
							:class="{ 'justify-center items-center': isCentralized }"
						>
							<slot name="actions" />
						</div>
					</template>
				</div>

				<template v-if="$slots.content">
					<slot name="content" />
				</template>
			</div>

			<template v-if="$slots.main">
				<div class="w-full">
					<slot name="main" />
				</div>
			</template>
		</div>
		<template v-if="$slots.principal">
			<div class="py-10 w-full">
				<slot name="principal" />
			</div>
		</template>
	</section>
</template>

<script setup>
	import Overline from '@aziontech/webkit/overline';
	import Banner from './Banner.vue';

	defineProps({
		id: {
			type: String,
			default: () => ''
		},
		bannerNews: {
			type: Object
		},
		overline: {
			type: String,
			default: () => ''
		},
		isReverse: {
			type: Boolean,
			default: () => false
		},
		titleTag: {
			type: String,
			default: () => 'h1',
			validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
		},
		title: {
			type: String
		},
		description: {
			type: String,
			default: () => ''
		},
		descriptionRawHtml: {
			type: String,
			default: () => ''
		},
		justify: {
			type: String,
			options: ['center']
		},
		align: {
			type: String,
			options: ['center']
		},
		isCentralized: {
			type: Boolean,
			default: () => false
		},
		isDisplay: {
			type: Boolean,
			default: () => false
		},
		position: {
			type: String,
			options: ['right'],
			default: () => 'left'
		},
		margin: {
			type: String,
			options: ['none', 'small', 'default', 'large'],
			default: () => 'none'
		},
		bottomSpacing: {
			type: String,
			default: () => 'mb-24'
		}
	});
</script>
