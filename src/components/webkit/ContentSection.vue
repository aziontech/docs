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
						<!--
							A section that has a headline is exactly what webkit's
							SectionTitle is: eyebrow, headline, supporting sentence and the
							actions row, framed as one header. It owns the heading level
							(always `h2`), so `titleTag` has no effect on this branch --
							the design system decides the level, not the call site.

							`data-doc-chrome` because this renders inside the article body
							on every page that uses it: DocProse would otherwise repaint
							the header's own `h2` and `p` as prose.
						-->
						<SectionTitle
							v-if="title"
							data-doc-chrome
							class="w-full"
							:title="title"
							:eyebrow="overline"
							:description="hasRawDescription ? '' : description"
							:kind="isContentCentralized ? 'centered' : 'left'"
						>
							<span
								v-if="hasRawDescription"
								v-html="descriptionRawHtml"
							></span>
							<template
								v-if="$slots.actions"
								#actions
							>
								<slot name="actions" />
							</template>
						</SectionTitle>

						<!--
							With no headline there is no section header to speak of --
							SectionTitle would render an empty `h2` -- so the loose copy and
							actions stay a local composition. Every call site in src/content
							is this shape.
						-->
						<template v-else>
							<Overline v-if="overline && overline.length">{{ overline }}</Overline>

							<div
								v-if="$slots.title"
								class="text-heading-2 font-medium text-balance"
								style="line-height: 125% !important"
							>
								<slot name="title" />
							</div>

							<div
								v-if="hasRawDescription"
								v-html="descriptionRawHtml"
								class="text-muted text-base leading-relaxed text-balance prose max-w-none"
								:class="[{ 'text-center': isContentCentralized }]"
							></div>
							<p
								v-else-if="description && description.trim().length"
								class="text-muted text-base leading-relaxed text-balance"
								:class="[{ 'text-center': isContentCentralized }]"
							>
								{{ description }}
							</p>

							<div
								v-if="$slots.actions"
								class="flex flex-row gap-3"
								:class="{ 'justify-center items-center': isContentCentralized }"
							>
								<slot name="actions" />
							</div>
						</template>
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
	import Overline from '@aziontech/webkit/overline';
	import SectionTitle from '@aziontech/webkit/section-title';

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

	/*
		The raw-HTML description wins over the plain one wherever both are set,
		and both branches of the template have to agree on which is in play --
		hence one predicate instead of the same condition written out twice.
	*/
	const hasRawDescription = computed(
		() => !!props.descriptionRawHtml && props.descriptionRawHtml.trim().length > 0
	);

	const containerClasses = computed(() => {
		const baseClasses = 'text-white relative max-w-5xl 2xl:max-w-6xl mx-auto md:mt-10';
		const paddingClasses = props.hasContainer ? 'p-6 md:p-0' : 'px-0';
		const flexClasses = 'w-full flex flex-col gap-10 md:gap-20';

		return `${baseClasses} ${paddingClasses} ${flexClasses} ${props.bottomSpacing}`;
	});
</script>
