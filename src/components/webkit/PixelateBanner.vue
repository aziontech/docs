<template>
	<!-- Ported from the webkit docs sample app (`PixelateBanner`), which is not part of the published
	     webkit package. Pure CSS: a grid of 5px squares on a 15px pitch, cut as an alpha mask out of
	     two primary-tinted radial pools plus two drifting diagonal bands. Only the alpha of the tile is
	     read, so the colour comes from the gradients underneath. The host positions and masks it. -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
	>
		<div
			class="field"
			:style="{ '--pixelate-tile': TILE }"
		>
			<div class="wave wave-a" />
			<div class="wave wave-b" />
		</div>
	</div>
</template>

<script setup>
	/** One cell of the grid: a 5px square on a 15px pitch. `#` is escaped for the data URI. */
	const TILE =
		"url(\"data:image/svg+xml,<svg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='5' height='5' fill='%23000'/></svg>\")";
</script>

<style scoped>
	.field {
		position: absolute;
		inset: 0;
		overflow: hidden;
		mask-image: var(--pixelate-tile);
		mask-size: var(--pixelate-pitch, 15px) var(--pixelate-pitch, 15px);
		mask-repeat: repeat;
		mask-mode: alpha;
		-webkit-mask-image: var(--pixelate-tile);
		-webkit-mask-size: var(--pixelate-pitch, 15px) var(--pixelate-pitch, 15px);
		-webkit-mask-repeat: repeat;
		background-color: color-mix(in srgb, var(--primary) 11%, transparent);
		background-image:
			radial-gradient(
				circle at var(--pixelate-pool-x, 86%) 94%,
				color-mix(in srgb, var(--primary) 74%, transparent) 0%,
				color-mix(in srgb, var(--primary) 44%, transparent) 24%,
				color-mix(in srgb, var(--primary) 18%, transparent) 52%,
				transparent 88%
			),
			radial-gradient(
				circle at var(--pixelate-pool-x, 98%) 8%,
				color-mix(in srgb, var(--primary) 50%, transparent) 0%,
				color-mix(in srgb, var(--primary) 20%, transparent) 28%,
				transparent 62%
			);
	}

	.wave {
		position: absolute;
		inset-block: 0;
		will-change: transform;
	}

	.wave-a {
		--band: 380px;
		--shift: 385.86px;
		left: 0;
		right: calc(-1 * var(--shift));
		background-image: repeating-linear-gradient(
			100deg,
			transparent 0,
			color-mix(in srgb, var(--primary) 18%, transparent) calc(var(--band) * 0.28),
			color-mix(in srgb, var(--primary) 50%, transparent) calc(var(--band) * 0.5),
			color-mix(in srgb, var(--primary) 18%, transparent) calc(var(--band) * 0.72),
			transparent var(--band)
		);
		animation: pixelate-wave-a 13s linear infinite;
	}

	.wave-b {
		--band: 260px;
		--shift: 264.01px;
		left: calc(-1 * var(--shift));
		right: 0;
		background-image: repeating-linear-gradient(
			80deg,
			transparent 0,
			color-mix(in srgb, var(--primary) 14%, transparent) calc(var(--band) * 0.3),
			color-mix(in srgb, var(--primary) 38%, transparent) calc(var(--band) * 0.5),
			color-mix(in srgb, var(--primary) 14%, transparent) calc(var(--band) * 0.7),
			transparent var(--band)
		);
		animation: pixelate-wave-b 19s linear infinite;
	}

	@keyframes pixelate-wave-a {
		to {
			transform: translate3d(calc(-1 * var(--shift)), 0, 0);
		}
	}

	@keyframes pixelate-wave-b {
		to {
			transform: translate3d(var(--shift), 0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wave {
			animation: none;
		}
	}
</style>
