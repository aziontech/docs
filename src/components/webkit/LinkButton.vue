<template>
	<a
		:href="link"
		:title="label"
		:target="target"
		rel="noopener noreferrer"
		class="wk-button not-prose w-fit no-underline justify-center gap-2 px-4"
		:class="[
			{ 'wk-button-outlined hover:bg-hover': outlined },
			{ 'wk-button-text hover:bg-hover': text },
			{ 'wk-button-secondary': severity === 'secondary' },
			{ 'wk-button-info': severity === 'info' },
			{ 'flex flex-row-reverse': iconPos === 'left' },
			{ 'wk-button-icon-only': iconPos === 'center' },
			{ 'md:justify-start': iconPos !== 'center' },
			{ 'wk-button-link pl-0 pr-0 hover:underline': textLink }
		]"
	>
		<template v-if="label">
			{{ capitalizeLetter(String(label).trim()) }}
		</template>

		<span
			v-if="iconPos"
			:style="customIconStyle"
			:class="`pi wk-button-icon ${icon}`"
			data-pc-section="icon"
		/>
	</a>
</template>

<script setup>
	defineProps({
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
	});

	function capitalizeLetter(word) {
		return word.replace(word[0], word.charAt(0).toUpperCase());
	}
</script>

<style scoped>
	/*
		Self-contained button visuals for this <a>-based component (it no longer
		depends on PrimeVue's `.p-button`). The box model is still the old
		`.p-button` small-size port, but every color, radius and spacing value
		now comes from @aziontech/theme@4 semantic tokens -- and those tokens
		already resolve per theme, so nothing below is light/dark specific.

		The `not-prose` class on the root element is load-bearing. Every
		LinkButton used inside article content sits under ReadableContent's
		`.prose` wrapper, whose `prose-a:*` utilities compile to
		`.prose :where(a):not(:where([class~="not-prose"], ...)) { color: ... }`
		aimed at *every* link in the content. `not-prose` is the typography
		plugin's own opt-out and the only reliable way out: this repo imports
		Tailwind in important mode (`@import 'tailwindcss' important;` in
		src/styles/main.css), so those utilities carry `!important` *inside
		`@layer utilities`* -- and for `!important` declarations the cascade
		inverts layer order, which means a layered `!important` beats an
		unlayered one (this scoped block) no matter how specific the selector
		is. The `a[href]` selector and the `!important` colors below are kept as
		belt-and-braces for any non-prose context, but they are NOT what wins
		inside `.prose`.
		(@aziontech/theme@4 itself ships no `.prose` rule -- the old azion-theme
		markdown stylesheet that forced `.prose a:not(.p-button)` is gone; the
		pressure now comes purely from the typography-plugin utilities.)

		Interactive states: the theme has no *opaque* "primary hover" token
		(`--primary-mask` / `--primary-selected` are 20%-alpha orange tints made
		for selection backgrounds -- using them as a fill would make the button
		translucent). Solid variants therefore derive hover/active from their
		base token with color-mix(): hover lightens the fill by 12%
		(`--primary` -> ~#F47844, a near-exact match for the old hardcoded
		#f5793f) and active steps back to 8% for a subtler press. Neutral
		variants (outlined / text) use the theme's own overlay tokens
		`--bg-hover` and `--bg-selected` instead.
	*/
	a[href].wk-button {
		display: inline-flex;
		cursor: pointer;
		user-select: none;
		align-items: center;
		vertical-align: bottom;
		text-align: center;
		overflow: hidden;
		position: relative;
		color: var(--primary-contrast) !important;
		background: var(--primary);
		border: 1px solid var(--primary);
		padding: var(--spacing-xxs) var(--spacing-xs);
		font-size: var(--text-button-lg-font-size);
		font-weight: 500;
		border-radius: var(--shape-button);
		transition:
			background-color 0.2s,
			color 0.2s,
			border-color 0.2s,
			box-shadow 0.2s;
	}
	a[href].wk-button:hover {
		background: color-mix(in srgb, var(--primary) 88%, white);
		color: var(--primary-contrast) !important;
		border-color: color-mix(in srgb, var(--primary) 88%, white);
	}
	a[href].wk-button:active {
		background: color-mix(in srgb, var(--primary) 92%, white);
		color: var(--primary-contrast) !important;
		border-color: color-mix(in srgb, var(--primary) 92%, white);
	}
	/* Focus ring follows the theme convention (see its own `text-link`
	   utility): a `--ring-color` outline on :focus-visible only, instead of the
	   old always-on orange box-shadow. */
	a[href].wk-button:focus {
		outline: 0 none;
		outline-offset: 0;
	}
	a[href].wk-button:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: 2px;
	}

	a[href].wk-button .wk-button-icon {
		font-size: var(--text-button-lg-font-size);
	}

	/* outlined */
	a[href].wk-button.wk-button-outlined {
		background: transparent;
		color: var(--text-default) !important;
		border: 1px solid var(--border-default);
	}
	a[href].wk-button.wk-button-outlined:hover,
	a[href].wk-button.wk-button-outlined:active {
		background: var(--bg-hover);
		color: var(--text-default) !important;
		border: 1px solid var(--border-default);
	}

	/* text */
	a[href].wk-button.wk-button-text {
		background: transparent;
		color: var(--text-default) !important;
		border-color: transparent;
	}
	a[href].wk-button.wk-button-text:hover,
	a[href].wk-button.wk-button-text:active {
		background: var(--bg-hover);
		color: var(--text-default) !important;
		border-color: transparent;
	}

	/* secondary severity -- `--secondary` is the inverted surface (near-black
	   on light, white on dark), so its hover/active shift *towards*
	   `--secondary-contrast`: lighter on light theme, darker on dark theme. */
	a[href].wk-button.wk-button-secondary {
		color: var(--secondary-contrast) !important;
		background: var(--secondary);
		border: 1px solid var(--secondary);
	}
	a[href].wk-button.wk-button-secondary:hover {
		background: color-mix(in srgb, var(--secondary) 88%, var(--secondary-contrast));
		color: var(--secondary-contrast) !important;
		border-color: color-mix(in srgb, var(--secondary) 88%, var(--secondary-contrast));
	}
	a[href].wk-button.wk-button-secondary:active {
		background: color-mix(in srgb, var(--secondary) 78%, var(--secondary-contrast));
		color: var(--secondary-contrast) !important;
		border-color: color-mix(in srgb, var(--secondary) 78%, var(--secondary-contrast));
	}
	a[href].wk-button.wk-button-secondary.wk-button-outlined,
	a[href].wk-button.wk-button-secondary.wk-button-text {
		background: transparent;
		color: var(--secondary) !important;
	}
	a[href].wk-button.wk-button-secondary.wk-button-outlined:hover,
	a[href].wk-button.wk-button-secondary.wk-button-text:hover {
		background: var(--bg-hover);
		color: var(--secondary) !important;
	}
	a[href].wk-button.wk-button-secondary.wk-button-outlined:active,
	a[href].wk-button.wk-button-secondary.wk-button-text:active {
		background: var(--bg-selected);
		color: var(--secondary) !important;
	}

	/* info severity -- in @aziontech/theme@4 `--info` is a *soft tinted
	   surface* (pale blue on light, deep navy on dark) paired with
	   `--info-contrast` for the label and `--info-border` for the edge, so this
	   variant now reads as a tinted informational button rather than the old
	   solid #0b61c4 blue. */
	a[href].wk-button.wk-button-info {
		color: var(--info-contrast) !important;
		background: var(--info);
		border: 1px solid var(--info-border);
	}
	a[href].wk-button.wk-button-info:hover {
		background: color-mix(in srgb, var(--info) 92%, var(--info-contrast));
		color: var(--info-contrast) !important;
		border-color: var(--info-border);
	}
	a[href].wk-button.wk-button-info:active {
		background: color-mix(in srgb, var(--info) 85%, var(--info-contrast));
		color: var(--info-contrast) !important;
		border-color: var(--info-border);
	}
	a[href].wk-button.wk-button-info.wk-button-outlined,
	a[href].wk-button.wk-button-info.wk-button-text {
		background: transparent;
		color: var(--info-contrast) !important;
	}
	a[href].wk-button.wk-button-info.wk-button-outlined:hover,
	a[href].wk-button.wk-button-info.wk-button-text:hover {
		background: color-mix(in srgb, var(--info) 40%, transparent);
		color: var(--info-contrast) !important;
	}
	a[href].wk-button.wk-button-info.wk-button-outlined:active,
	a[href].wk-button.wk-button-info.wk-button-text:active {
		background: var(--info);
		color: var(--info-contrast) !important;
	}

	/* icon only (iconPos="center") */
	a[href].wk-button.wk-button-icon-only {
		justify-content: center;
		width: 2rem;
		height: 2rem;
	}
	a[href].wk-button.wk-button-icon-only .wk-button-icon {
		margin: 0;
	}

	/* text link (textLink) */
	a[href].wk-button.wk-button-link {
		color: var(--text-link) !important;
		background: transparent;
		border-color: transparent;
	}
	a[href].wk-button.wk-button-link:hover {
		background: transparent;
		color: var(--text-link-hover) !important;
		border-color: transparent;
	}
	a[href].wk-button.wk-button-link:active {
		background: transparent;
		color: var(--text-link) !important;
		border-color: transparent;
	}
</style>
