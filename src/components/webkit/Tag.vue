<template>
	<!--
		`whitespace-nowrap` is the one local utility that has to survive the
		move. The old markup was `inline-block whitespace-nowrap`; webkit's tag
		is `inline-flex` with a fixed height and `overflow-hidden`, so a label
		that wraps gets *clipped* rather than merely overflowing its line box.
		Plenty of content tags carry a whole product name ("Web Application
		Firewall", "Standard HTTP/HTTPS POST endpoint"), which is exactly what
		wraps first on a narrow viewport.

		Putting it on the webkit component instead of on a wrapper is safe here:
		webkit's tag emits no `whitespace-*` / `text-*wrap` utility, so there is
		no same-group collision for Tailwind's important mode to resolve. (The
		wrapper dance is only needed when both sides fight over one property.)

		`size="medium"` is the closest box to the old chip. The old markup asked
		for `text-tag-sm`, which would suggest webkit's `small`, but in
		@aziontech/theme 4.x `--text-tag-sm-*` and `--text-tag-md-*` are
		byte-identical (0.75rem / 600 / 1.25) -- the tag scale simply does not
		branch by size today -- so `medium` costs nothing typographically while
		matching the geometry that `small` would lose: `px-[var(--spacing-xs)]`
		is exactly the old 8px horizontal padding, and `h-6` (24px) is 1px off
		the old 23px box. `small` would have been `px-xxs` (4px) at 20px tall,
		i.e. every one of the ~391 tags 8px narrower and 3px shorter than today.

		If a future theme release does split the two tag tokens, revisit this:
		the intent was `text-tag-sm`, and at that point `small` becomes the
		faithful choice again (at the cost of the padding).
	-->
	<WebkitTag
		:label="label"
		:severity="webkitSeverity"
		size="medium"
		class="whitespace-nowrap"
	>
		<!--
			When the call site passed `value` instead of children, the slot must
			be *absent*, not empty: webkit's tag branches on
			`$slots['default']` and renders `label` only in the `v-else-if`. A
			bare `<slot />` here would always create that slot function and
			blank out the 7 `value="..."` call sites, so the slot is omitted via
			`v-if` on the `<template #default>`.
		-->
		<template
			v-if="$slots['default']"
			#default
		>
			<slot />
		</template>
	</WebkitTag>
</template>

<script setup>
	import { computed } from 'vue';

	// Aliased on import: webkit's component declares `name: 'Tag'`, which is
	// also this file's own filename-derived name. The import wins in
	// `<script setup>`, but there is no reason to leave a reader (or a future
	// refactor) resolving that ambiguity.
	import WebkitTag from '@aziontech/webkit/tag';

	/*
		Adapter over @aziontech/webkit's Tag. The visuals (box model, radius,
		severity surfaces, focus ring, tag typography) now come from the design
		system instead of the hand-written utility soup this file used to carry,
		which was a re-implementation of a component the webkit already ships.

		The prop surface is deliberately unchanged: `<Tag>` is instantiated 391
		times across 239 files in src/content plus 19 .vue/.astro files, each
		importing this path directly (there is no auto-import indirection to
		hide behind), and none of those call sites change.

		Attribute pass-through survives too: webkit's tag sets
		`inheritAttrs: false` but re-applies `v-bind="$attrs"` on its root span,
		so extra attributes still reach the DOM exactly as they did when this
		component *was* the span.
	*/
	const props = defineProps({
		value: {
			type: [String, Number],
			required: false
		},
		severity: {
			type: String,
			required: false,
			validator: (value) => ['success', 'info', 'warning', 'danger'].includes(value)
		}
	});

	// webkit's `label` is typed as a plain string, so a numeric `value` would
	// trip its runtime prop check. Normalize instead of widening the contract;
	// `undefined`/`null` collapse to '' so webkit falls through to its own
	// empty-label default rather than rendering the string "undefined".
	const label = computed(() =>
		props.value === undefined || props.value === null ? '' : String(props.value)
	);

	/*
		Severity mapping. The axis names look identical on both sides but `info`
		does NOT mean the same thing, and that is the whole point of this map:

		- `info` -> `secondary`. This component's `info` was never the
		  informational-alert blue; it rendered a NEUTRAL chip (surface fill +
		  a 1px default border) because it is the severity used by the ~389
		  content badges ("Preview", "Compute", "Static"), which read as
		  labels. webkit's `info` is the tinted status blue
		  (`--info` #CCE4FF / #001833), so mapping it straight through would
		  repaint nearly every tag in the documentation as an alert.
		  `secondary` (`--border-default` + `--bg-canvas` + `--text-default`)
		  is the design system's neutral chip and the honest equivalent.
		- `success` / `warning` / `danger` map through unchanged: those three
		  were already the theme's status pairs, e.g. `bg-warning
		  text-warning-contrast`, which is verbatim what webkit paints.
		- no severity -> `primary`. The old default was
		  `bg-primary-mask text-primary`, and webkit's `primary` is exactly
		  `bg-[var(--primary-mask)] text-[var(--primary)]`. Identical output.
	*/
	const webkitSeverity = computed(
		() =>
			({
				info: 'secondary',
				success: 'success',
				warning: 'warning',
				danger: 'danger'
			})[props.severity] ?? 'primary'
	);
</script>
