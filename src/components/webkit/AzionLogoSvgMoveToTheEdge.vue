<template>
	<a
		:href="href"
		:title="hrefTitle"
		:target="target"
		aria-label="Azion Logo"
		class="flex gap-[5px]"
	>
		<div class="flex flex-col gap-[2.68px]">
			<svg
				width="90"
				height="19"
				fill="currentColor"
				viewBox="0 0 90 19"
			>
				<g clip-path="url(#a)">
					<path
						fill="#F3652B"
						d="m86.446.818-1.49 7.711 2.711 3.343L89.801.818h-3.355Zm-14.096 0L68.994 18.2h3.357l2.3-11.917L84.347 18.2h2.099l.414-2.128L74.448.818H72.35Zm-20.808 0L48.186 18.2h17.452L68.994.818H51.542Zm2.726 3.284h10.727l-2.088 10.814H52.181l2.087-10.814ZM44.9.818 41.616 18.2H44.9L48.186.818H44.9Zm-20.737 0-.634 3.284h11.59l-13.815 11.54-.497 2.559H38.26l.634-3.285h-11.59L41.121 3.374l.494-2.556H24.163Zm-5.917 0L.49 15.648 0 18.201h2.558L16.313 6.719 14.096 18.2h3.355L20.808.818h-2.562Z"
					/>
				</g>
				<defs>
					<clipPath id="a">
						<path
							fill="#fff"
							d="M0 .818h89.801v17.818H0z"
						/>
					</clipPath>
				</defs>
			</svg>
		</div>
		<div
			class="h-[17.82px] flex items-center tracking-[0.4px] text-default text-[11.4px] roboto-condensed italic font-normal"
		>
			move to the edge
		</div>
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
