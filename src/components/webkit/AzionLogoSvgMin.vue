<template>
	<a
		:href="href"
		:title="hrefTitle"
		:target="target"
		aria-label="Azion Logo"
	>
		<svg
			width="21"
			height="18"
			viewBox="0 0 21 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clip-path="url(#clip0_4263_24662)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z"
					fill="#F3652B"
				/>
			</g>
			<defs>
				<clipPath id="clip0_4263_24662">
					<rect
						width="21"
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
			default: () => 'default',
			validator: (value) =>
				['min', 'default', 'move to the edge', 'technologies', 'full'].includes(value)
		}
	});
</script>
