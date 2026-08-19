<template>
	<section
		:class="containerClasses"
		:id="id"
	>
		<div
			class="flex-col flex w-full gap-10 md:gap-20"
			:class="[
				{ 'md:flex-row': position === 'left' },
				{ 'md:flex-row-reverse': position == 'right' },
				{ 'flex-col-reverse	': reverse },
				pt?.content || ''
			]"
		>
			<div class="w-full">
				<div
					class="w-full flex gap-8"
					:class="[
						{ 'flex-col': !reverse },
						{ 'md:flex-row': position == 'full' },
						{ 'items-center': isContentCentralized },
						{ 'flex-col-reverse	': reverse },
						{ 'md:top-20 md:sticky': isSticky }
					]"
				>
					<div
						v-if="overline || title || $slots.title || $slots.actions"
						class="w-full flex flex-col gap-8 z-0"
						:class="[{ 'items-center': isContentCentralized }]"
					>
						<template v-if="overline && overline.length">
							<Overline :label="overline" />
						</template>

						<template v-if="title">
							<TitleSection
								:isContentCentralized="isContentCentralized"
								:tag="titleTag"
								:title="title"
							/>
						</template>
						<template v-else-if="$slots.title">
							<div
								class="text-heading-2 font-medium text-balance"
								style="line-height: 125% !important"
							>
								<slot name="title" />
							</div>
						</template>

						<template v-if="descriptionRawHtml && descriptionRawHtml.trim().length">
							<div
								v-html="descriptionRawHtml"
								class="text-color-secondary text-base leading-relaxed text-balance prose max-w-none"
								:class="[{ 'text-center': isContentCentralized }]"
							></div>
						</template>
						<template v-else-if="description && description.trim().length">
							<p
								class="text-color-secondary text-base leading-relaxed text-balance"
								:class="[{ 'text-center': isContentCentralized }]"
							>
								{{ description }}
							</p>
						</template>

						<div
							v-if="$slots.actions"
							class="flex flex-row gap-3"
							:class="{ 'justify-center items-center': isContentCentralized }"
						>
							<slot name="actions" />
						</div>
					</div>

					<template v-if="$slots.content">
						<slot name="content" />
					</template>
				</div>
			</div>

			<template v-if="$slots.main">
				<slot name="main" />
			</template>
		</div>
		<template v-if="$slots.principal">
			<div>
				<slot name="principal" />
			</div>
		</template>
	</section>
</template>

<script setup>
	import { computed } from 'vue';
	import TitleSection from './TitleSection.vue';
	import Overline from './Overline.vue';

	const props = defineProps({
		id: {
			type: String,
			default: () => ''
		},
		overline: {
			type: String,
			default: () => ''
		},
		title: {
			type: String,
			default: () => ''
		},
		titleTag: {
			type: String,
			default: () => 'h2',
			validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
		},
		description: {
			type: String,
			default: () => ''
		},
		descriptionRawHtml: {
			type: String,
			default: () => ''
		},
		position: {
			type: String,
			options: ['left', 'right', 'center', 'full'],
			default: () => 'left'
		},
		isContentCentralized: {
			type: Boolean,
			default: () => false
		},
		textCenter: {
			type: Boolean,
			default: () => false
		},
		reverse: {
			type: Boolean,
			default: () => false
		},
		isSticky: {
			type: Boolean,
			default: () => false
		},
		pt: {
			type: Object,
			default: () => {}
		},
		bottomSpacing: {
			type: String,
			default: () => 'mb-24'
		},
		hasContainer: {
			type: Boolean,
			default: () => true
		}
	});

	const containerClasses = computed(() => {
		const baseClasses = 'text-white relative max-w-xl xxxl:max-w-xxl mx-auto md:mt-10';
		const paddingClasses = props.hasContainer ? 'p-6 md:p-0' : 'px-0';
		const flexClasses = 'w-full flex flex-col gap-10 md:gap-20';

		return `${baseClasses} ${paddingClasses} ${flexClasses} ${props.bottomSpacing}`;
	});
</script>
