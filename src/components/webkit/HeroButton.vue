<template>
	<template v-if="href || type === 'link' || type === 'linkExternal' || type === 'linkSecondary'">
		<a
			:href="href"
			class="flex gap-3 w-fit cursor-pointer group"
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
						d="M7.32201 8.20812L7.31425 4.45914C7.31425 4.39704 7.29873 4.35047 7.26768 4.31943C7.22111 4.27285 7.15642 4.29096 7.07363 4.37376L3.40226 8.04512C3.20046 8.24693 2.96243 8.35043 2.68817 8.3556C2.41392 8.35043 2.17071 8.24176 1.95856 8.0296C1.76192 7.83297 1.6636 7.59494 1.6636 7.31551C1.6636 7.03608 1.76192 6.79805 1.95856 6.60142L5.58335 2.97662C5.66614 2.89383 5.68684 2.83173 5.64545 2.79034C5.6144 2.75929 5.56783 2.74376 5.50573 2.74376L1.78003 2.74376C1.51095 2.74376 1.2781 2.64545 1.08146 2.44881C0.88483 2.25218 0.7891 2.00639 0.794275 1.71144C0.804624 1.41131 0.910703 1.16034 1.11251 0.958533C1.30397 0.767074 1.53941 0.671344 1.81884 0.671344L8.16806 0.671344C8.49923 0.619598 8.79677 0.725677 9.06067 0.989581C9.27283 1.20174 9.37891 1.44753 9.37891 1.72696L9.38667 8.20812C9.38667 8.4772 9.278 8.72041 9.06067 8.93774C8.84851 9.1499 8.6079 9.25598 8.33882 9.25598C8.06974 9.24563 7.82912 9.13437 7.61696 8.92222C7.42033 8.72558 7.32201 8.48755 7.32201 8.20812Z"
						fill="#FE601F"
					/>
				</svg>
			</span>
		</a>
	</template>
	<template v-else>
		<button
			type="button"
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
		</button>
	</template>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		label: String,
		size: {
			type: String,
			options: ['small', 'large'],
			default: 'large'
		},
		type: {
			type: String,
			options: ['primary', 'secondary', 'link', 'linkExternal', 'tertiary', 'linkSecondary'],
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

	const underlineHover = computed(() => {
		const underlineBase =
			"relative after:duration-150 hover:after:w-full group-hover:after:w-full after:left-0 after:w-0 after:h-[1px] after:transition-all after:content-[''] after:absolute after:-bottom-[.1rem]";

		return {
			link: {
				dark: `${underlineBase} after:bg-violet-300`,
				light: `${underlineBase} after:bg-violet-600`
			},
			linkSecondary: {
				dark: `${underlineBase} after:bg-neutral-200`,
				light: `${underlineBase} after:bg-neutral-200`
			},
			linkExternal: {
				dark: `${underlineBase} after:bg-violet-300`,
				light: `${underlineBase} after:bg-violet-600`
			}
		};
	});

	const buttonClasses = computed(() => {
		const focusOverride =
			'focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none';

		return {
			primary: {
				dark: `h-fit group border-1 border-neutral-900 bg-neutral-900 text-neutral-100 duration-300 transition rounded-md hover:bg-orange-500 hover:border-orange-500 hover:text-neutral-900 ${focusOverride}`,
				light: `h-fit group border-1 border-neutral-100 bg-neutral-100 text-neutral-900 duration-300 transition rounded-md hover:bg-orange-500 hover:border-orange-500 hover:text-neutral-900 ${focusOverride}`
			},
			secondary: {
				dark: `h-fit group bg-neutral-900 text-neutral-100 duration-300 transition rounded-md active:bg-neutral-900 border-1 border-neutral-800 hover:bg-neutral-950 hover:text-orange-500 ${focusOverride}`,
				light: `h-fit group bg-neutral-200 text-neutral-900 duration-300 transition rounded-md active:bg-neutral-700 border-1 border-neutral-400 hover:bg-neutral-100 hover:text-orange-500 hover:border-neutral-300 ${focusOverride}`
			},
			tertiary: {
				dark: `h-fit group font-proto-mono bg-orange-900/10 text-orange-500 duration-300 transition rounded-none border-none bg-orange-900/20 ${focusOverride}`,
				light: `h-fit group font-proto-mono bg-orange-900/10 text-orange-500 duration-300 transition rounded-none border-none bg-orange-900/20 ${focusOverride}`
			},
			link: {
				dark: `w-fit !leading-[.75rem] bg-transparent border-none text-violet-300 px-0 py-0 ${focusOverride}`,
				light: `w-fit !leading-[.75rem] bg-transparent border-none text-violet-600 px-0 py-0 ${focusOverride}`
			},
			linkSecondary: {
				dark: `w-fit !leading-[.75rem] bg-transparent border-none text-neutral-100 px-0 py-0 ${focusOverride}`,
				light: `w-fit !leading-[.75rem] bg-transparent border-none text-neutral-950 px-0 py-0 ${focusOverride}`
			},
			linkExternal: {
				dark: `w-fit !leading-[.75rem] bg-transparent border-none text-violet-300 px-0 py-0 ${focusOverride}`,
				light: `w-fit !leading-[.75rem] bg-transparent border-none text-violet-300 px-0 py-0 ${focusOverride}`
			}
		}[props.type];
	});

	const themedIconClasses = computed(() => {
		const baseClasses = '!text-[.75rem] duration-300 transition flex items-center mr-2';

		const classes = {
			primary: {
				dark: `h-fit ${baseClasses} text-neutral-100 group-hover:text-white`,
				light: `h-fit ${baseClasses} text-neutral-900 group-hover:text-white`
			},
			secondary: {
				dark: `h-fit ${baseClasses} text-neutral-100 group-hover:text-neutral-100`,
				light: `h-fit ${baseClasses} text-neutral-900 group-hover:text-neutral-100`
			},
			tertiary: {
				dark: `h-min ${baseClasses} dark:text-neutral-100 group-hover:text-neutral-100 dark:group-hover:text-neutral-100`,
				light: `h-min ${baseClasses} text-neutral-900 group-hover:text-neutral-900`
			},
			link: `${baseClasses} text-orange-600 hover:text-orange-600 leading-1`,
			linkSecondary: `${baseClasses} text-orange-600 hover:text-orange-600 leading-1`,
			linkExternal: `${baseClasses} text-orange-600 hover:text-orange-600 leading-1`
		}[props.type];

		return typeof classes === 'string' ? classes : classes[props.theme];
	});

	const labelClasses = computed(() => {
		const leading = props.size === 'large' ? 'text-sm leading-[1.5rem]' : 'leading-[1rem]';

		const fontSize = props.size === 'small' ? 'text-xs' : '';

		return {
			primary: `font-proto-mono ${leading} whitespace-nowrap`,
			secondary: `font-proto-mono ${leading} whitespace-nowrap`,
			tertiary: `font-proto-mono ${leading} whitespace-nowrap`,
			link: `font-proto-mono ${leading} ${fontSize} after:bg-violet-600 whitespace-nowrap`,
			linkSecondary: `font-proto-mono ${leading} ${fontSize} after:bg-neutral-900 whitespace-nowrap`,
			linkExternal: `font-proto-mono ${leading} ${fontSize} after:bg-violet-300 whitespace-nowrap`
		}[props.type];
	});
</script>

<style scoped>
	/*
		Minimal visual port of PrimeVue's `.p-button` base box model, so the
		Tailwind classes computed above land on the same foundation as the
		original azion-webkit Button (which wrapped `primevue/button`).
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
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 6px;
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
