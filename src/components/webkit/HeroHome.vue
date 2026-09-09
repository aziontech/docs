<template>
	<HeroTitle
		data-doc-chrome
		:title="title"
		:description="description"
		class="hero-home mb-12 sm:mb-16"
	>
		<template
			v-if="buttons.length || note || prompt"
			#actions
		>
			<div class="flex flex-col gap-(--spacing-lg)">
				<div class="flex flex-wrap items-center gap-(--spacing-sm)">
					<Button
						v-for="button in buttons"
						:key="button.label || button.link"
						:label="button.label"
						:icon="button.icon"
						:kind="buttonKind(button)"
						:size="buttonSize(button)"
						:href="button.link"
					/>
					<CopyPromptButton
						v-if="prompt"
						:prompt="prompt"
						:label="promptLabel"
						:copied-label="promptCopiedLabel"
						:tooltip="promptTooltip"
					/>
				</div>
				<p
					v-if="note"
					class="m-0 max-w-(--container-2xl) text-body-sm text-(--text-muted)"
				>
					{{ note }}
				</p>
			</div>
		</template>
	</HeroTitle>
</template>

<script setup>
	import Button from '@aziontech/webkit/button';
	import HeroTitle from '@aziontech/webkit/hero-title';

	import CopyPromptButton from './CopyPromptButton.vue';

	function buttonKind(button) {
		if (button.kind) return button.kind;
		if (button.type) return button.type === 'tertiary' ? 'text' : button.type;
		if (button.severity === 'secondary') return 'secondary';
		if (button.outlined) return 'outlined';

		return 'primary';
	}

	function buttonSize(button) {
		return button.size === 'small' ? 'small' : 'large';
	}

	defineProps({
		title: {
			type: String,
			default: () => ''
		},
		description: {
			type: String,
			default: () => ''
		},
		buttons: {
			type: Array,
			default: () => []
		},
		note: {
			type: String,
			default: () => ''
		},
		prompt: {
			type: String,
			default: () => ''
		},
		promptLabel: {
			type: String,
			default: () => 'Copy prompt'
		},
		promptCopiedLabel: {
			type: String,
			default: () => 'Prompt copied!'
		},
		promptTooltip: {
			type: String,
			default: () => 'Copies a setup prompt for your AI coding tool'
		}
	});
</script>

<style>
	/* The reference hero (a newer webkit HeroTitle) spaces its rows by margin — description
	   `mt-(--spacing-lg)`, actions `mt-(--spacing-xl)`, relaxed description leading — where 4.4.0
	   uses a fixed 16px gap plus 8px. Same layer trick as the sidebar overrides: main.css imports
	   Tailwind with `important`, so this sits in `components` with `!important`. Drop on bump. */
	@layer components {
		.hero-home {
			gap: 0 !important;
		}

		.hero-home > h1 {
			max-width: var(--container-2xl) !important;
		}

		.hero-home > p {
			margin-top: var(--spacing-lg) !important;
			line-height: 1.625 !important;
			max-width: var(--container-xl) !important;
		}

		.hero-home > div:last-child {
			margin-top: var(--spacing-xl) !important;
		}
	}
</style>
