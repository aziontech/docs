<template>
	<div class="docs-footer w-full border-t border-(--border-default)">
		<!-- `content`: the bands run full bleed and the footer draws no frame. `site` is for a
		     marketing page whose hero and sections resolve to one measure — this reading zone
		     is not a framed column. The `border-t` above is not frame apparatus. -->
		<Footer kind="content" aria-label="Footer">
			<Footer.Column v-for="column in listData" :key="column.title" :title="column.title">
				<Footer.Link v-for="item in column.list" :key="item.title" :href="item.link">
					{{ item.title }}
				</Footer.Link>
			</Footer.Column>

			<!-- Icons alone. The marketing footer leads this row with the mark, but its row spans
			     the viewport; this one is half a column between two rails — 322px of content at
			     1440 against the 344px a mark plus six 40px buttons need — so the mark orphaned
			     a glyph on a second line. It keeps the signature band at every width instead. -->
			<template #social>
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

			<!-- `mx-auto` centres the mark on both axes of a band that is `flex-col items-start`
			     below `md` and `flex-row justify-between` from it: an auto inline margin absorbs
			     the free space in both, where `self-center` would only cover the stack. -->
			<template #brand>
				<a :href="`/${lang}/`" aria-label="Azion home" :class="BRAND_LINK_CLASS">
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

// The treatment every other brand redirect in the app carries: hover opacity, focus ring.
const BRAND_LINK_CLASS =
	'mx-auto inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)';
</script>

<style>
/* Docs puts a third control (the theme switcher) in a band the DS built for two, and at
   375px the `flex-row-reverse` overflow falls off the LEFT edge — clipped, unreachable. */
.docs-footer [data-testid='layout-footer__status'] {
	flex-wrap: wrap;
}
</style>
