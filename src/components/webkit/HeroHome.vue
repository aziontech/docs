<template>
	<!--
		webkit's HeroTitle owns the `h1`, the description and the actions row,
		so HeroBase, HeroButton, ContentLogo and Banner are gone rather than
		adapted. `data-doc-chrome` sits on the root because these homes render
		inside ReadableContent and DocProse would otherwise repaint the hero's
		typography as article prose.

		Known loss: both homes accent the *end* of the headline ("Welcome to
		<span>Azion Docs</span>"), while HeroTitle's `highlight` only paints
		the opening phrase and there is no title slot. The headline goes
		through unaccented; filed against the design system.
	-->
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

	/*
		Content still authors buttons in the old `outlined` / `severity` shape.
		Precedence matches the deleted HeroButton: explicit variant, then
		`severity`, then `outlined`.
	*/
	function buttonKind(button) {
		if (button.kind) return button.kind;
		if (button.type) return button.type === 'tertiary' ? 'text' : button.type;
		if (button.severity === 'secondary') return 'secondary';
		if (button.outlined) return 'outlined';

		return 'primary';
	}

	// Hero actions are the page's main CTA: `large` unless asked otherwise.
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
