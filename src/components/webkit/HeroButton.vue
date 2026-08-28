<template>
	<!--
		Link variants stay as they are: `link`, `linkExternal` and
		`linkSecondary` are text links with an animated underline and a trailing
		arrow, not buttons -- webkit's Button has no such variant and would drop
		the affordance.
	-->
	<template v-if="isLinkVariant">
		<a
			:href="href"
			class="not-prose flex gap-3 w-fit cursor-pointer group"
			:class="type.includes('link') ? underlineHover[type][theme] : 'no-underline'"
			:target="target"
		>
			<span
				class="wk-hero-button"
				:class="[customClass, buttonClasses[theme]]"
			>
				<span
					v-if="icon"
					class="wk-hero-button-icon pi"
					:class="[icon, themedIconClasses]"
				/>
				<span
					v-if="label"
					class="wk-hero-button-label"
					:class="labelClasses"
				>
					{{ label }}
				</span>
			</span>

			<span v-if="type === 'linkExternal' || type === 'linkSecondary' || type === 'link'">
				<svg
					width="10"
					height="10"
					:class="[
						'group-hover:translate-x-[.1rem] -translate-x-[.1rem]  transition-transform relative ',
						type === 'linkExternal' || target === '_blank'
							? 'translate-y-0 group-hover:translate-y-[-50%] top-[20%]'
							: 'rotate-45 -translate-y-1/2 top-1/2'
					]"
					viewBox="0 0 10 10"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						class="fill-[var(--primary)]"
						d="M7.32201 8.20812L7.31425 4.45914C7.31425 4.39704 7.29873 4.35047 7.26768 4.31943C7.22111 4.27285 7.15642 4.29096 7.07363 4.37376L3.40226 8.04512C3.20046 8.24693 2.96243 8.35043 2.68817 8.3556C2.41392 8.35043 2.17071 8.24176 1.95856 8.0296C1.76192 7.83297 1.6636 7.59494 1.6636 7.31551C1.6636 7.03608 1.76192 6.79805 1.95856 6.60142L5.58335 2.97662C5.66614 2.89383 5.68684 2.83173 5.64545 2.79034C5.6144 2.75929 5.56783 2.74376 5.50573 2.74376L1.78003 2.74376C1.51095 2.74376 1.2781 2.64545 1.08146 2.44881C0.88483 2.25218 0.7891 2.00639 0.794275 1.71144C0.804624 1.41131 0.910703 1.16034 1.11251 0.958533C1.30397 0.767074 1.53941 0.671344 1.81884 0.671344L8.16806 0.671344C8.49923 0.619598 8.79677 0.725677 9.06067 0.989581C9.27283 1.20174 9.37891 1.44753 9.37891 1.72696L9.38667 8.20812C9.38667 8.4772 9.278 8.72041 9.06067 8.93774C8.84851 9.1499 8.6079 9.25598 8.33882 9.25598C8.06974 9.24563 7.82912 9.13437 7.61696 8.92222C7.42033 8.72558 7.32201 8.48755 7.32201 8.20812Z"
					/>
				</svg>
			</span>
		</a>
	</template>
	<!--
		Chip variants (primary / secondary / tertiary) are buttons, so they come
		from @aziontech/webkit now. Button renders an <a> when `href` is set and
		a <button> otherwise, which is exactly the split this component used to
		hand-code.
	-->
	<template v-else>
		<Button
			:label="label"
			:icon="icon"
			:kind="kind"
			:size="webkitSize"
			:href="href"
			:target="target"
			class="not-prose no-underline"
		/>
	</template>
</template>

<script setup>
	import { computed } from 'vue';

	import Button from '@aziontech/webkit/button';

	/*
		Colors below are @aziontech/theme@4 semantic tokens instead of the raw
		Tailwind palette this component used to hardcode (neutral-900,
		orange-500, violet-300/600, ...). The tokens already flip with the
		active theme, so most `dark` / `light` pairs collapsed to a single class
		string; the pairs are kept in the shape of the API (`buttonClasses[theme]`,
		`underlineHover[type][theme]`, `themedIconClasses`) so nothing about how
		callers pass `theme` changes.
	*/

	const props = defineProps({
		label: String,
		size: {
			type: String,
			options: ['small', 'large'],
			default: 'large'
		},
		type: {
			type: String,
			options: [
				'primary',
				'secondary',
				'outlined',
				'link',
				'linkExternal',
				'tertiary',
				'linkSecondary'
			],
			default: 'secondary'
		},
		href: String,
		icon: String,
		theme: {
			type: String,
			default: 'dark'
		},
		customClass: {
			type: String,
			default: 'px-3 py-3'
		},
		target: {
			type: String,
			default: '_self',
			options: ['_blank', '_self']
		}
	});

	const LINK_VARIANTS = ['link', 'linkExternal', 'linkSecondary'];

	const isLinkVariant = computed(() => LINK_VARIANTS.includes(props.type));

	/*
		Chip variants onto webkit's kinds, deliberately using the design
		system's own names one-to-one instead of re-interpreting them:

		- `primary`   -> `primary`    (solid brand fill: the page's main CTA)
		- `secondary` -> `secondary`  (the inverted-surface chip)
		- `outlined`  -> `outlined`   (bordered, low-emphasis)
		- `tertiary`  -> `text`       (no box at rest)

		`secondary` mapping straight through is the point. A button authored in
		src/content as `severity: 'secondary'` reaches LinkButton as webkit's
		`secondary`, so sending the same authored value to webkit's `outlined`
		here made one prop render as two different buttons depending on whether
		it sat in a hero or in body copy. The hero now matches the ~1.5k content
		CTAs.

		What does not carry over from the old bespoke chips: the hover inversion
		(`primary` used to sit on a raised surface and flip to the brand fill),
		the `font-proto-mono` label, and the `customClass` padding override --
		all of those are webkit's Button's business now. `theme` still drives
		the link variants below.
	*/
	const kind = computed(
		() =>
			({
				primary: 'primary',
				secondary: 'secondary',
				outlined: 'outlined',
				tertiary: 'text'
			})[props.type] ?? 'secondary'
	);

	// This component's sizes are ['small', 'large']; webkit's are
	// small | medium | large, so they line up directly.
	const webkitSize = computed(() => (props.size === 'small' ? 'small' : 'large'));

	const underlineHover = computed(() => {
		const underlineBase =
			"relative after:duration-150 hover:after:w-full group-hover:after:w-full after:left-0 after:w-0 after:h-[1px] after:transition-all after:content-[''] after:absolute after:-bottom-[.1rem]";

		// The underline now simply matches the label colour of each variant, so
		// both themes share one string. (`linkSecondary` used to draw a
		// neutral-200 underline in *both* themes, i.e. an almost invisible line
		// on the light theme -- `--text-default` fixes that.)
		const linkUnderline = `${underlineBase} after:bg-[var(--text-link)]`;
		const secondaryUnderline = `${underlineBase} after:bg-[var(--text-default)]`;

		return {
			link: {
				dark: linkUnderline,
				light: linkUnderline
			},
			linkSecondary: {
				dark: secondaryUnderline,
				light: secondaryUnderline
			},
			linkExternal: {
				dark: linkUnderline,
				light: linkUnderline
			}
		};
	});

	const buttonClasses = computed(() => {
		const focusOverride =
			'focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none';

		const linkBase = `w-fit !leading-[.75rem] bg-transparent border-none px-0 py-0 ${focusOverride}`;
		const link = `${linkBase} text-[var(--text-link)]`;
		const linkSecondary = `${linkBase} text-[var(--text-default)]`;

		return {
			link: {
				dark: link,
				light: link
			},
			linkSecondary: {
				dark: linkSecondary,
				light: linkSecondary
			},
			linkExternal: {
				dark: link,
				light: link
			}
		}[props.type];
	});

	const themedIconClasses = computed(() => {
		const baseClasses = '!text-[.75rem] duration-300 transition flex items-center mr-2';

		const onLink = `${baseClasses} text-[var(--primary)] hover:text-[var(--primary)] leading-1`;

		const classes = {
			link: onLink,
			linkSecondary: onLink,
			linkExternal: onLink
		}[props.type];

		return typeof classes === 'string' ? classes : classes[props.theme];
	});

	const labelClasses = computed(() => {
		const leading = props.size === 'large' ? 'text-sm leading-[1.5rem]' : 'leading-[1rem]';

		const fontSize = props.size === 'small' ? 'text-xs' : '';

		return {
			link: `font-proto-mono ${leading} ${fontSize} after:bg-[var(--text-link)] whitespace-nowrap`,
			linkSecondary: `font-proto-mono ${leading} ${fontSize} after:bg-[var(--text-default)] whitespace-nowrap`,
			linkExternal: `font-proto-mono ${leading} ${fontSize} after:bg-[var(--text-link)] whitespace-nowrap`
		}[props.type];
	});
</script>

<style scoped>
	/*
		Minimal visual port of PrimeVue's `.p-button` base box model, so the
		Tailwind classes computed above land on the same foundation as the
		original azion-webkit Button (which wrapped `primevue/button`).
		Radius and type size come from @aziontech/theme tokens.
	*/
	.wk-hero-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		vertical-align: bottom;
		cursor: pointer;
		user-select: none;
		position: relative;
		overflow: hidden;
		margin: 0;
		font-family: inherit;
		font-size: var(--text-button-lg-font-size);
		font-weight: 500;
		border-radius: var(--shape-button);
		transition:
			background-color 0.2s,
			color 0.2s,
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.wk-hero-button-label {
		flex: 1 1 auto;
		font-weight: 500;
	}
	.wk-hero-button-icon {
		display: inline-flex;
	}
</style>
