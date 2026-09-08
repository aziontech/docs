<template>
	<HeroTitle
		data-doc-chrome
		:title="title"
		:description="description"
		class="mt-(--spacing-xl)"
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
