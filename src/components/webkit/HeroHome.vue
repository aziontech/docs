<template>
	<!-- The top margin is this page's spacing, not the component's, so it rides on
	     our own wrapper rather than overriding `HeroTitle`. -->
	<div class="mt-(--spacing-xl)">
		<HeroTitle
			data-doc-chrome
			:title="title"
			:description="description"
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
	</div>
</template>

<script setup lang="ts">
	import Button from '@aziontech/webkit/button';
	import HeroTitle from '@aziontech/webkit/hero-title';

	import CopyPromptButton from './CopyPromptButton.vue';

	interface HeroButton {
		label?: string;
		link?: string;
		icon?: string;
		kind?: string;
		type?: string;
		severity?: string;
		outlined?: boolean;
		size?: string;
	}

	function buttonKind(button: HeroButton) {
		if (button.kind) return button.kind;
		if (button.type) return button.type === 'tertiary' ? 'text' : button.type;
		if (button.severity === 'secondary') return 'secondary';
		if (button.outlined) return 'outlined';

		return 'primary';
	}

	function buttonSize(button: HeroButton) {
		return button.size === 'small' ? 'small' : 'large';
	}

	withDefaults(
		defineProps<{
			title?: string;
			description?: string;
			buttons?: HeroButton[];
			note?: string;
			prompt?: string;
			promptLabel?: string;
			promptCopiedLabel?: string;
			promptTooltip?: string;
		}>(),
		{
			title: '',
			description: '',
			buttons: () => [],
			note: '',
			prompt: '',
			promptLabel: 'Copy prompt',
			promptCopiedLabel: 'Prompt copied!',
			promptTooltip: 'Copies a setup prompt for your AI coding tool',
		},
	);
</script>
