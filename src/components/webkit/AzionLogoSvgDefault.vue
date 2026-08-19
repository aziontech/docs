<template>
	<a
		:href="href"
		:title="hrefTitle"
		:target="target"
		aria-label="Azion Logo"
	>
		<svg
			width="90"
			height="18"
			viewBox="0 0 90 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clip-path="url(#clip0_4263_8239)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z"
					fill="#F3652B"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z"
					fill="#F3652B"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z"
					fill="#F3652B"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z"
					fill="#F3652B"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z"
					fill="#F3652B"
				/>
			</g>
			<defs>
				<clipPath id="clip0_4263_8239">
					<rect
						width="90"
						height="18"
						fill="white"
					/>
				</clipPath>
			</defs>
		</svg>
	</a>
</template>

<script setup>
	defineProps({
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
		version: {
			type: String,
			default: () => 'default'
		}
	});
</script>
