<template>
	<div class="docs-footer w-full border-t border-(--border-default)">
		<Footer aria-label="Footer">
			<Footer.Column v-for="column in listData" :key="column.title" :title="column.title">
				<Footer.Link v-for="item in column.list" :key="item.title" :href="item.link">
					{{ item.title }}
				</Footer.Link>
			</Footer.Column>

			<template #social>
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					:class="BRAND_LINK_CLASS"
					class="mr-(--spacing-xs) hidden lg:inline-flex"
				>
					<Brand size="small" aria-hidden="true" />
				</a>

				<IconButton
					v-for="({ icon, link, title, target }, index) in socialButtons"
					:key="index"
					kind="transparent"
					:icon="icon"
					:aria-label="title"
					:href="link"
					:target="target || '_blank'"
				/>
			</template>

			<template #status>
				<slot name="system-status" />
			</template>

			<template #language>
				<slot name="action" />
				<slot name="theme-switch" />
			</template>
			<template #brand>
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					:class="BRAND_LINK_CLASS"
					class="mx-auto inline-flex"
				>
					<Brand size="small" aria-hidden="true" />
				</a>
			</template>
		</Footer>
	</div>
</template>

<script setup lang="ts">
import Brand from '@aziontech/webkit/brand';
import Footer from '@aziontech/webkit/footer';
import IconButton from '@aziontech/webkit/icon-button';

/** One link inside a footer column. */
interface FooterLink {
	title: string;
	link: string;
}

/** One column of the footer's link grid. */
interface FooterColumn {
	title: string;
	list: FooterLink[];
}

/** One glyph in the footer's social row. */
interface SocialButton {
	icon: string;
	link: string;
	title?: string;
	target?: string;
}

interface Props {
	/** Language the footer is rendered for; also the brand link's destination. */
	lang: string;
	/** The footer's link columns. */
	listData: FooterColumn[];
	/** Social glyphs shown at the left of the status row. */
	socialButtons?: SocialButton[];
}

withDefaults(defineProps<Props>(), { socialButtons: () => [] });

defineSlots<{
	/** The system-status indicator. */
	'system-status'(): unknown;
	/** The language switcher. */
	action(): unknown;
	/** The light/dark control. */
	'theme-switch'(): unknown;
}>();

// The mark's treatment, shared by both placements. Display stays out: the social row's
// anchor is `hidden` below `lg`, and two display utilities on one element resolve by the
// order Tailwind emitted them, not the order written.
const BRAND_LINK_CLASS =
	'w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)';
</script>

<style>
/* From `lg` the `#social` slot leads with the mark, so the DS Footer's own signature is
   hidden. A stylesheet rule, not a utility: the element belongs to the DS Footer, so only
   its `data-testid` reaches it from here. Below `lg` the row is too narrow for both. */
@media (min-width: 1024px) {
	.docs-footer [data-testid='layout-footer__signature'] {
		display: none;
	}
}

/* The status band wraps here, unlike in the DS: docs puts a third control (the theme
   switcher) in a band built for two, and at 375px the `flex-row-reverse` overflow falls
   off the LEFT edge, leaving that control clipped and unreachable on a phone. */
.docs-footer [data-testid='layout-footer__status'] {
	flex-wrap: wrap;
}
</style>
