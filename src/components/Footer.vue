<template>
	<div class="docs-footer @container w-full border-t border-(--border-default)">
		<!-- `content`: the bands run full bleed and the footer draws no frame. `site` is for a
		     marketing page whose hero and sections resolve to one measure — this reading zone
		     is not a framed column. The `border-t` above is not frame apparatus. -->
		<Footer kind="content" aria-label="Footer">
			<Footer.Column v-for="column in listData" :key="column.title" :title="column.title">
				<Footer.Link v-for="item in column.list" :key="item.title" :href="item.link">
					{{ item.title }}
				</Footer.Link>
			</Footer.Column>

			<!-- The brand leads this row and there is no signature band. It steps out below a
			     footer width of 800: from `md` the band is half the footer less `--spacing-lg`
			     either side, and a mark plus six 40px buttons need 352 — under that the row is
			     the six glyphs alone rather than a mark with two orphaned on a second line.
			     Gated on the FOOTER, not the viewport: this one sits between two rails. -->
			<template #social>
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					:class="BRAND_LINK_CLASS"
					class="mr-(--spacing-xs) hidden @min-[800px]:inline-flex"
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
	'w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)';
</script>

<style>
/* Docs puts a third control (the theme switcher) in a band the DS built for two, and at
   375px the `flex-row-reverse` overflow falls off the LEFT edge — clipped, unreachable. */
.docs-footer [data-testid='layout-footer__status'] {
	flex-wrap: wrap;
}
</style>
