<template>
	<!-- eslint-disable webkit/no-style-override -- page chrome, not restyling: the
	     shell decides that its header sticks to the top and owns a stacking context,
	     and that the left cluster packs from the start. Wrapping the header in a
	     sticky box instead would change the layout every page is built on. -->
	<GlobalHeader aria-label="Azion documentation" class="@container sticky top-0 z-50">
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

			<div class="hidden sm:contents">
				<!-- eslint-disable webkit/no-style-override -- flex sizing in the
				     header row; the button's own appearance is untouched. -->
				<IconButton
					icon="pi pi-github"
					kind="outlined"
					size="medium"
					aria-label="Azion on GitHub"
					href="https://github.com/aziontech"
					target="_blank"
					class="shrink-0"
				/>
			</div>

			<!-- eslint-disable-next-line webkit/no-style-override -- flex sizing in the
			     header row; the button's own appearance is untouched. -->
			<Button
				label="Console"
				kind="secondary"
				size="medium"
				href="https://console.azion.com"
				target="_blank"
				class="shrink-0"
			/>
				<!-- eslint-enable webkit/no-style-override -->
		</GlobalHeader.Right>
	</GlobalHeader>
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
