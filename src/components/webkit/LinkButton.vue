<template>
	<!--
		Icon-only (iconPos="center") is IconButton's job -- webkit's Button
		requires a visible `label` and documents IconButton as the icon-only
		control.
	-->
	<!--
		No `w-fit` on this branch, unlike the labelled one below. IconButton
		sizes itself with `size-10` / `size-8` (a square: one utility setting
		both width and height), and `w-fit` outranks its width half, collapsing
		the button to the glyph's intrinsic ~18px while keeping the full height.
		The labelled Button has no such square to protect -- its width is
		content-driven with a `min-w-*` floor -- so `w-fit` stays there.
	-->
	<IconButton
		v-if="isIconOnly"
		:icon="icon"
		:aria-label="String(label ?? '')"
		:kind="iconButtonKind"
		:size="webkitSize"
		:href="link"
		:target="target"
		class="not-prose no-underline"
	/>

	<Button
		v-else
		:label="displayLabel"
		:kind="kind"
		:size="webkitSize"
		:icon="icon"
		:href="link"
		:target="target"
		class="not-prose w-fit no-underline"
	/>
</template>

<script setup>
	import { computed } from 'vue'

	import Button from '@aziontech/webkit/button'
	import IconButton from '@aziontech/webkit/icon-button'

	/*
		Adapter over @aziontech/webkit's Button. The visuals (fill, radius,
		hover/active layers, focus ring, sizing) now come from the design system
		instead of the hand-written `.wk-button` CSS this file used to carry --
		that block was a port of PrimeVue's `.p-button` box model repainted with
		theme tokens, i.e. a second implementation of a component the webkit
		already ships.

		The prop surface is deliberately unchanged: LinkButton is instantiated
		~1.5k times across src/content, plus Footer.vue and both
		SectionBasicContent.vue copies, and none of those call sites need to
		change.

		Two things the old markup carried do NOT survive the move, because
		webkit's Button declares `inheritAttrs: false` and forwards only `class`
		and `data-testid`: the `title` tooltip that mirrored the label, and
		`customIconStyle` (no icon-style hook on the design-system component).
		`customIconStyle` is kept in the prop list only so Vue does not leak it
		to the DOM as an attribute; no call site in this repo passes it.

		`not-prose` on the root stays load-bearing. Every LinkButton inside
		article content sits under ReadableContent's `.prose` wrapper, whose
		`prose-a:*` utilities target every link in the content; `not-prose` is
		the typography plugin's own opt-out and keeps those rules from
		repainting the button's label. It matters more now, not less: webkit
		paints the label with a Tailwind utility, so both sides would otherwise
		be `!important` utilities competing on specificity (this repo imports
		Tailwind in important mode).
	*/
	const props = defineProps({
		icon: {
			type: String,
			required: false
		},
		customIconStyle: {
			type: String,
			required: false
		},
		iconPos: {
			type: String,
			required: false,
			options: ['left', 'right', 'center']
		},
		label: {
			type: String,
			required: false
		},
		link: {
			type: String,
			required: true
		},
		outlined: {
			type: Boolean,
			required: false,
			default: false
		},
		text: {
			type: Boolean,
			required: false,
			default: false
		},
		severity: {
			type: String,
			required: false,
			options: ['secondary', 'info']
		},
		target: {
			type: String,
			options: ['_blank', '_self'],
			default: '_self',
			required: false
		},
		size: {
			type: String,
			required: false,
			default: 'medium',
			options: ['small', 'medium']
		},
		textLink: {
			type: Boolean,
			required: false
		}
	})

	const isIconOnly = computed(() => props.iconPos === 'center' && Boolean(props.icon))

	function capitalizeLetter(word) {
		return word.replace(word[0], word.charAt(0).toUpperCase())
	}

	const displayLabel = computed(() =>
		props.label ? capitalizeLetter(String(props.label).trim()) : ''
	)

	/*
		Variant mapping. webkit's kinds are primary | secondary | outlined |
		text | danger, so the old two-axis API (severity x outlined/text)
		collapses onto one axis:

		- `outlined` / `text` win over `severity`, because webkit's outlined and
		  text kinds are already the neutral, low-emphasis variants the old
		  `.wk-button-secondary.wk-button-outlined` pair produced.
		- `severity="info"` has no counterpart in the design system (theme@4's
		  `--info` is a tinted *surface*, not a button kind). It falls back to
		  `outlined` so it still reads as low-emphasis. No call site in this
		  repo uses it.
		- `textLink` also has no counterpart and maps to `text`; likewise unused
		  in the repo today.
	*/
	const kind = computed(() => {
		if (props.textLink || props.text) return 'text'
		if (props.outlined) return 'outlined'
		if (props.severity === 'secondary') return 'secondary'
		if (props.severity === 'info') return 'outlined'
		return 'primary'
	})

	// IconButton's kinds differ from Button's: no `text`, but a `transparent`
	// that fills the same low-emphasis role.
	const iconButtonKind = computed(() => (kind.value === 'text' ? 'transparent' : kind.value))

	/*
		The old CSS drew a compact box (spacing-xxs/xs padding) with the *large*
		type token (--text-button-lg-font-size). webkit ties the two together:
		`large` keeps that typography (h-10), `medium` would shrink the label to
		text-button-md. Preserving the type scale is what keeps these buttons
		legible in body copy, so legacy `medium` maps to webkit `large` and only
		`small` stays small.
	*/
	const webkitSize = computed(() => (props.size === 'small' ? 'small' : 'large'))
</script>
