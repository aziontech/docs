<template>
	<HeroBase
		isDisplay
		:isCentralized="true"
		:description="description"
		:descriptionRawHtml="descriptionRawHtml"
		:bannerNews="bannerNews"
		:id="id"
		:margin="margin"
		:bottomSpacing="bottomSpacing"
	>
		<template #title>
			<h1
				class="font-medium text-heading-5 text-balance"
				v-html="title"
			/>
		</template>
		<template #actions>
			<div class="flex gap-4 flex-col md:flex-row justify-center items-center">
				<!--
					The `buttons` array authored in src/content uses LinkButton's prop
					shape (`outlined` / `severity`), not HeroButton's `type`, so both
					entries used to fall through to HeroButton's default variant and
					render identically -- the "create an account" CTA lost its
					emphasis. `buttonType` translates between the two shapes so the
					pair reads as a primary + secondary action, and an explicit
					`button.type` still wins for any call site that speaks
					HeroButton's own language.
				-->
				<HeroButton
					v-for="button in buttons"
					:key="button.label || button.link"
					:label="button.label"
					:href="button.link"
					:icon="button.icon"
					:size="buttonSize(button)"
					:type="buttonType(button)"
					:theme="button.theme"
				/>
			</div>
		</template>
		<template #content>
			<div class="flex flex-col gap-4 md:gap-8 items-center text-center">
				<ContentLogo
					size="small"
					:isCentralized="true"
					:title="logosTitle"
					:logos="logos"
				/>
			</div>
		</template>
	</HeroBase>
</template>

<script setup>
	import HeroBase from './HeroBase.vue';
	import HeroButton from './HeroButton.vue';
	import ContentLogo from './ContentLogo.vue';

	/*
		Maps a content-authored button object onto HeroButton's `type`. Same
		precedence LinkButton uses for the equivalent props: an explicit variant
		wins, then `severity`, then `outlined`.
	*/
	function buttonType(button) {
		if (button.type) return button.type
		if (button.severity === 'secondary') return 'secondary'
		if (button.outlined) return 'outlined'

		return 'primary'
	}

	/*
		Hero actions are the page's largest call to action, so `large` is the
		default and `small` has to be asked for. The previous ternary inverted
		that -- it only produced `large` when a button declared
		`size: 'medium'`, and nothing in src/content does, so every hero CTA
		rendered at the smallest size. That went unnoticed while HeroButton drew
		its own box from `customClass` ('px-3 py-3') regardless of `size`;
		webkit's Button honours the size token, so the plumbing bug became
		visible as a 28px-tall hero button.
	*/
	function buttonSize(button) {
		return button.size === 'small' ? 'small' : 'large'
	}

	defineProps({
		id: {
			type: String,
			default: () => ''
		},
		bannerNews: {
			type: Object,
			default: () => {}
		},
		overline: {
			type: String,
			default: () => ''
		},
		titleTag: {
			type: String,
			default: () => 'h1',
			validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
		},
		title: {
			type: String,
			default: () => ''
		},
		description: {
			type: String,
			default: () => ''
		},
		descriptionRawHtml: {
			type: String,
			default: () => ''
		},
		logosTitle: {
			type: String,
			default: () => ''
		},
		logos: {
			type: Array,
			required: true,
			default: () => []
		},
		buttons: {
			type: Array,
			default: () => []
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
