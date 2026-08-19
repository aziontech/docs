<template>
	<a
		:href="link"
		:title="label"
		:target="target"
		rel="noopener noreferrer"
		class="wk-button w-fit no-underline justify-center gap-2 px-4"
		:class="[
			{ 'wk-button-outlined hover:surface-hover': outlined },
			{ 'wk-button-text hover:surface-hover': text },
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
		Visual port of azion-theme's PrimeVue `.p-button` (small size) styles,
		self-contained so this component no longer depends on PrimeVue classes.
		Values from azion-theme/src/azion/variables/_button.scss and
		extended-components/_button.scss (sm scale = 0.875).
	*/
	a.wk-button {
		display: inline-flex;
		cursor: pointer;
		user-select: none;
		align-items: center;
		vertical-align: bottom;
		text-align: center;
		overflow: hidden;
		position: relative;
		color: var(--primary-text-color);
		background: #f3652b;
		border: 1px solid #f3652b;
		padding: 0.301rem 0.65625rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 6px;
		transition:
			background-color 0.2s,
			color 0.2s,
			border-color 0.2s,
			box-shadow 0.2s;
	}
	a.wk-button:hover {
		background: #f5793f;
		color: var(--primary-text-color);
		border-color: #f5793f;
	}
	a.wk-button:active {
		background: #eb6f3f;
		color: var(--primary-text-color);
		border-color: #eb6f3f;
	}
	a.wk-button:focus {
		outline: 0 none;
		outline-offset: 0;
		box-shadow: 0 0 0 0.2rem #f3642b9f;
	}

	a.wk-button .wk-button-icon {
		font-size: 0.875rem;
	}

	/* outlined */
	a.wk-button.wk-button-outlined {
		background: transparent;
		color: var(--text-color);
		border: 1px solid var(--surface-border);
	}
	a.wk-button.wk-button-outlined:hover,
	a.wk-button.wk-button-outlined:active {
		background: var(--surface-hover);
		color: var(--text-color);
		border: 1px solid var(--surface-border);
	}

	/* text */
	a.wk-button.wk-button-text {
		background: transparent;
		color: var(--text-color);
		border-color: transparent;
	}
	a.wk-button.wk-button-text:hover,
	a.wk-button.wk-button-text:active {
		background: var(--surface-hover);
		color: var(--text-color);
		border-color: transparent;
	}

	/* secondary severity */
	a.wk-button.wk-button-secondary {
		color: var(--secondary-button-text-color);
		background: var(--secondary-button-bg);
		border: 1px solid var(--secondary-button-bg);
	}
	a.wk-button.wk-button-secondary:hover {
		background: var(--secondary-button-hover-bg);
		color: var(--secondary-button-text-hover-color);
		border-color: var(--secondary-button-hover-border-color);
	}
	a.wk-button.wk-button-secondary:active {
		background: var(--secondary-button-active-bg);
		color: var(--secondary-button-text-active-color);
		border-color: var(--secondary-button-active-border-color);
	}
	a.wk-button.wk-button-secondary.wk-button-outlined,
	a.wk-button.wk-button-secondary.wk-button-text {
		background: transparent;
		color: var(--secondary-button-bg);
	}
	a.wk-button.wk-button-secondary.wk-button-outlined:hover,
	a.wk-button.wk-button-secondary.wk-button-text:hover {
		background: color-mix(in srgb, var(--secondary-button-bg) 4%, transparent);
		color: var(--secondary-button-bg);
	}
	a.wk-button.wk-button-secondary.wk-button-outlined:active,
	a.wk-button.wk-button-secondary.wk-button-text:active {
		background: color-mix(in srgb, var(--secondary-button-bg) 16%, transparent);
		color: var(--secondary-button-bg);
	}

	/* info severity */
	a.wk-button.wk-button-info {
		color: #ffffff;
		background: #0b61c4;
		border: 1px solid #0b61c4;
	}
	a.wk-button.wk-button-info:hover,
	a.wk-button.wk-button-info:active {
		background: #0953a6;
		color: #ffffff;
		border-color: #0953a6;
	}
	a.wk-button.wk-button-info.wk-button-outlined,
	a.wk-button.wk-button-info.wk-button-text {
		background: transparent;
		color: #0b61c4;
	}
	a.wk-button.wk-button-info.wk-button-outlined:hover,
	a.wk-button.wk-button-info.wk-button-text:hover {
		background: rgba(11, 97, 196, 0.04);
		color: #0b61c4;
	}
	a.wk-button.wk-button-info.wk-button-outlined:active,
	a.wk-button.wk-button-info.wk-button-text:active {
		background: rgba(11, 97, 196, 0.16);
		color: #0b61c4;
	}

	/* icon only (iconPos="center") */
	a.wk-button.wk-button-icon-only {
		justify-content: center;
		width: 2rem;
		height: 2rem;
	}
	a.wk-button.wk-button-icon-only .wk-button-icon {
		margin: 0;
	}

	/* text link (textLink) */
	a.wk-button.wk-button-link {
		color: var(--text-color-link);
		background: transparent;
		border-color: transparent;
	}
	a.wk-button.wk-button-link:hover {
		background: transparent;
		color: var(--text-color-link-hover);
		border-color: transparent;
	}
	a.wk-button.wk-button-link:focus {
		background: transparent;
		border-color: transparent;
		box-shadow: none;
	}
	a.wk-button.wk-button-link:focus-visible {
		box-shadow: 0 0 0 0.2rem #f3642b9f;
	}
	a.wk-button.wk-button-link:active {
		background: transparent;
		color: var(--text-color-link);
		border-color: transparent;
	}
</style>
