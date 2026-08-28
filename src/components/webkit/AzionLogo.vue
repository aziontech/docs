<template>
	<!--
		The anchor lives here now. webkit's Brand renders a bare
		`<span role="img">` with no link affordance, so the `href` / `hrefTitle` /
		`target` half of this component's contract -- previously satisfied by the
		five AzionLogoSvg*.vue files, each carrying its own copy of the same
		`<a>` -- has to come from this wrapper instead.

		Keeping the anchor as the single root also keeps automatic attribute
		fallthrough working: Footer.vue passes `class="mb-4 block"`, and those
		utilities land on the anchor rather than on Brand's span. That matters
		because Tailwind runs in important mode here, so a display utility sitting
		*next to* Brand's own `inline-flex` would lose the cascade; on a different
		element there is nothing to compete with.
	-->
	<a
		:href="href"
		:title="hrefTitle"
		:target="target"
		aria-label="Azion Logo"
	>
		<!--
			`aria-hidden` is load-bearing. Brand hardcodes `role="img"
			aria-label="Azion"` on its span, so without it this link would expose two
			competing accessible names: "Azion Logo" from the anchor and "Azion" from
			the graphic nested inside it. The name belongs on the interactive element,
			so the anchor keeps the label and the decorative mark leaves the
			accessibility tree. Brand declares `inheritAttrs: false` and re-binds
			`$attrs` on that span, so the attribute does reach the DOM.

			The anchor's `aria-label` stays a *static* attribute precisely so a
			fallthrough `aria-label` from a call site still overrides it -- Footer.vue
			relies on that to say "Azion logo", exactly as it did before.
		-->
		<Brand
			:kind="kind"
			size="small"
			aria-hidden="true"
		/>
	</a>
</template>

<script setup>
	import { computed } from 'vue';

	import Brand from '@aziontech/webkit/brand';

	/*
		Adapter over @aziontech/webkit's Brand. Brand is the same
		version-selector this file used to be, over the same assets: the path data
		in AzionLogoSvgDefault.vue and AzionLogoSvgMin.vue was byte-identical to
		webkit's own src/svg/azion/{default,min}, down to the Figma-generated
		clipPath ids. Keeping local copies meant maintaining a fork of the brand
		mark, so the five AzionLogoSvg*.vue files are gone.

		The public prop surface (`href`, `hrefTitle`, `target`, `version`) is
		unchanged apart from the two `version` values noted below, so neither
		BaseLayout.astro nor Footer.vue -- the only two call sites -- needs to
		change.
	*/
	const props = defineProps({
		href: {
			type: String
		},
		hrefTitle: {
			type: String
		},
		target: {
			type: String,
			default: '_self'
		},
		/*
			`full` and `move to the edge` are deliberately no longer accepted.
			Neither has a Brand `kind`, and neither could be mapped without silently
			swapping the artwork: the old local versions composed their taglines as
			HTML text at hardcoded sizes (12.88px / 8.4px / 15.96px) in
			titillium-web and roboto-condensed, tinted with `text-default`, while
			webkit ships them as separate vector exports
			(`@aziontech/webkit/svg/azion/{full,move-to-the-edge}`) with different
			aspect ratios (250x46 and 207x19 vs the old 126x26 and 90x19) and, for
			move-to-the-edge, a hardcoded `#B5B5B5` tagline fill that would not
			follow the light/dark theme.

			Nothing in the repo instantiates either value, so rather than wire up two
			unexercised branches with known theming bugs, the validator now rejects
			them -- a dev-time Vue warning is a much better failure mode than
			quietly rendering the wrong lockup. Re-adding them later means importing
			the corresponding webkit svg export and fixing its fill.
		*/
		version: {
			type: String,
			default: 'default',
			validator: (value) => ['min', 'default', 'technologies'].includes(value)
		}
	});

	// The three surviving versions map 1:1 onto Brand's kinds.
	const KIND_BY_VERSION = {
		min: 'reduced',
		default: 'default',
		technologies: 'extended'
	};

	const kind = computed(() => KIND_BY_VERSION[props.version] ?? 'default');

	/*
		`size` is fixed at `small` rather than exposed as a prop, because the goal
		here is to keep the current rendering. Brand drives the lockup height from
		the size token (small/medium/large = 16/24/32px, width auto), and the old
		SVGs rendered at their intrinsic 18px. `small` lands 2px under that;
		`medium` would be a 33% jump, which the 32px-tall header row
		(Header.vue's `h-8`) cannot absorb gracefully.

		Overriding the height with a utility is not an option: Brand sets it via
		`[&[data-size=small]>svg]:h-4`, whose attribute selector outranks any plain
		`[&>svg]:h-[18px]` we could add, and in important mode both sides would be
		`!important` anyway.
	*/
</script>
