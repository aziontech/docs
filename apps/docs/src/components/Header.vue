<template>
	<!-- The shell owns page chrome: this box decides that the header sticks to the
	     top, holds the stacking context, and anchors the container queries the
	     header's children respond to. The GlobalHeader itself is untouched. -->
	<div class="@container sticky top-0 z-50">
		<GlobalHeader aria-label="Azion documentation">
			<!-- eslint-disable webkit/no-style-override -- design-system gap: the Left
			     cluster centers its content and exposes no alignment prop; needs an
			     `align="start"` seam on GlobalHeader.Left. Remove when it ships. -->
			<GlobalHeader.Left class="justify-start!">
				<!-- eslint-enable webkit/no-style-override -->
				<slot name="mobile-nav" />

				<GlobalHeader.Brand>
					<a
						:href="homeHref"
						aria-label="Azion Docs — home"
						class="inline-flex shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface)"
					>
						<Brand kind="default" size="small" aria-hidden="true" />
						<span
							class="hidden rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) py-px text-overline-sm uppercase tracking-widest text-(--text-muted) sm:inline-block"
						>
							Docs
						</span>
					</a>
				</GlobalHeader.Brand>

				<slot name="nav" />
			</GlobalHeader.Left>

			<GlobalHeader.Nav />

			<GlobalHeader.Right>
				<slot name="dialog" />

				<div class="flex shrink-0 items-center">
					<IconButton
						icon="pi pi-github"
						kind="outlined"
						size="medium"
						aria-label="Azion on GitHub"
						href="https://github.com/aziontech"
						target="_blank"
					/>
				</div>

				<div class="flex shrink-0 items-center">
					<Button
						label="Console"
						kind="secondary"
						size="medium"
						href="https://console.azion.com"
						target="_blank"
					/>
				</div>
			</GlobalHeader.Right>
		</GlobalHeader>
	</div>
</template>

<script setup lang="ts">
import Brand from '@aziontech/webkit/brand';
import Button from '@aziontech/webkit/button';
import GlobalHeader from '@aziontech/webkit/global-header';
import IconButton from '@aziontech/webkit/icon-button';

interface Props {
	/** Destination of the brand mark. */
	homeHref?: string;
	/** Kept for callers; the header's call to action now points at the Console. */
	signInLabel?: string;
}

withDefaults(defineProps<Props>(), {
	homeHref: '/',
	signInLabel: 'Sign in',
});

defineSlots<{
	/** The mobile navigation drawer's trigger. */
	'mobile-nav'(): unknown;
	/** The primary navigation. */
	nav(): unknown;
	/** The search dialog. */
	dialog(): unknown;
}>();
</script>
