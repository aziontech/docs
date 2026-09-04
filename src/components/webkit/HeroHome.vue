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
		centered
		:title="title"
		:description="description"
		class="mt-(--spacing-xl) mb-(--spacing-xxl)"
	>
		<template
			v-if="buttons.length"
			#actions
		>
			<Button
				v-for="button in buttons"
				:key="button.label || button.link"
				:label="button.label"
				:icon="button.icon"
				:kind="buttonKind(button)"
				:size="buttonSize(button)"
				:href="button.link"
			/>
		</template>
	</HeroTitle>
</template>

<script setup>
	import Button from '@aziontech/webkit/button';
	import HeroTitle from '@aziontech/webkit/hero-title';

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
		}
	});
</script>
